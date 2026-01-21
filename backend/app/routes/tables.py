import random
import string
from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import table_collection
from app.middleware.auth import verify_token
from app.models.table import TableCreate, TableResponse, TableStatusUpdate, TableUpdate
from app.services.esp_service import esp_service
from app.services.websocket_service import ws_service


async def generate_unique_table_id():
    chars = string.ascii_uppercase + string.digits  # A-Z + 0-9

    while True:
        random_id = "".join(random.sample(chars, 6))

        # Ensure it contains exactly 3 letters and 3 digits
        letters = sum(c.isalpha() for c in random_id)
        digits = sum(c.isdigit() for c in random_id)

        if letters == 3 and digits == 3:
            exists = await table_collection.find_one({"_id": random_id})
            if not exists:
                return random_id


router = APIRouter(prefix="/tables", tags=["Tables"])


def table_helper(table) -> dict:
    return {
        "id": str(table["_id"]),
        "tableName": table["tableName"],
        "status": table["status"],
        "isActive": table["isActive"],
        "createdAt": table.get("createdAt"),
        "updatedAt": table.get("updatedAt"),
    }


@router.get("", response_model=List[TableResponse])
async def get_all_tables(username: str = Depends(verify_token)):
    tables = []
    async for table in table_collection.find():
        tables.append(table_helper(table))
    return tables


@router.get("/{table_id}", response_model=TableResponse)
async def get_table(table_id: str, username: str = Depends(verify_token)):
    # Try to find by string ID first, then by ObjectId
    table = await table_collection.find_one({"_id": table_id})
    if not table and ObjectId.is_valid(table_id):
        table = await table_collection.find_one({"_id": ObjectId(table_id)})

    if not table:
        raise HTTPException(status_code=404, detail="Table not found")

    return table_helper(table)


@router.post("", response_model=TableResponse, status_code=status.HTTP_201_CREATED)
async def create_table(table: TableCreate, username: str = Depends(verify_token)):
    existing = await table_collection.find_one({"tableName": table.tableName})
    if existing:
        raise HTTPException(status_code=400, detail="Table name already exists")

    custom_id = await generate_unique_table_id()

    table_dict = {
        "_id": custom_id,
        "tableName": table.tableName,
        "status": "idle",
        "isActive": True,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }

    await table_collection.insert_one(table_dict)
    new_table = await table_collection.find_one({"_id": custom_id})

    # Emit to WebSocket clients
    await ws_service.emit_table_added(table_helper(new_table))

    return table_helper(new_table)


@router.put("/{table_id}", response_model=TableResponse)
async def update_table(
    table_id: str, table: TableUpdate, username: str = Depends(verify_token)
):
    update_data = {
        k: v for k, v in table.dict(exclude_unset=True).items() if v is not None
    }

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    update_data["updatedAt"] = datetime.utcnow()

    # Try to update by string ID first, then by ObjectId
    result = await table_collection.update_one({"_id": table_id}, {"$set": update_data})

    if result.matched_count == 0 and ObjectId.is_valid(table_id):
        result = await table_collection.update_one(
            {"_id": ObjectId(table_id)}, {"$set": update_data}
        )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Table not found")

    # Find the updated table
    updated_table = await table_collection.find_one({"_id": table_id})
    if not updated_table and ObjectId.is_valid(table_id):
        updated_table = await table_collection.find_one({"_id": ObjectId(table_id)})

    # Emit to WebSocket clients
    await ws_service.emit_status_update(table_helper(updated_table))

    return table_helper(updated_table)


@router.patch("/{table_id}/status", response_model=TableResponse)
async def update_table_status(
    table_id: str,
    status_update: TableStatusUpdate,
    username: str = Depends(verify_token),
):
    update_data = {"status": status_update.status, "updatedAt": datetime.utcnow()}

    # Try to update by string ID first, then by ObjectId
    result = await table_collection.update_one({"_id": table_id}, {"$set": update_data})

    if result.matched_count == 0 and ObjectId.is_valid(table_id):
        result = await table_collection.update_one(
            {"_id": ObjectId(table_id)}, {"$set": update_data}
        )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Table not found")

    # Find the updated table
    updated_table = await table_collection.find_one({"_id": table_id})
    if not updated_table and ObjectId.is_valid(table_id):
        updated_table = await table_collection.find_one({"_id": ObjectId(table_id)})

    table_data = table_helper(updated_table)

    # Send update to ESP8266
    esp_service.send_status_update(status_update.status)

    # Emit to WebSocket clients
    await ws_service.emit_status_update(table_data)

    return table_data


@router.delete("/{table_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_table(table_id: str, username: str = Depends(verify_token)):
    # Try to delete by string ID first, then by ObjectId
    result = await table_collection.delete_one({"_id": table_id})

    if result.deleted_count == 0 and ObjectId.is_valid(table_id):
        result = await table_collection.delete_one({"_id": ObjectId(table_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Table not found")

    return None

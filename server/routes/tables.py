from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from database import tables_collection
from models import TableModel, TableCreate, TableUpdate, User
from auth import get_current_user
from bson import ObjectId
from datetime import datetime
import random
import string

router = APIRouter(
    prefix="/api/tables",
    tags=["tables"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[TableModel])
async def get_tables(current_user: User = Depends(get_current_user)):
    tables = []
    async for table in tables_collection.find():
        tables.append(table)
    return tables

@router.post("/", response_model=TableModel)
async def create_table(table: TableCreate, current_user: User = Depends(get_current_user)):
    # Check if table name already exists
    if await tables_collection.find_one({"tableName": table.tableName}):
        raise HTTPException(status_code=400, detail="Table name already exists")
        
    # Generate random ID: 3 letters, 3 numbers, shuffled
    while True:
        letters = ''.join(random.choices(string.ascii_uppercase, k=3))
        numbers = ''.join(random.choices(string.digits, k=3))
        combined = list(letters + numbers)
        random.shuffle(combined)
        table_id = "".join(combined)
        
        # Check uniqueness
        if not await tables_collection.find_one({"tableId": table_id}):
            break

    new_table_dict = table.dict()
    new_table_dict["tableId"] = table_id
    new_table_dict["createdAt"] = datetime.now()
    new_table_dict["updatedAt"] = datetime.now()

    # Create TableModel instance to validate (including default fields like _id)
    # Actually simpler to just insert dict if we handle _id manually or let mongo do it.
    # But TableModel has default factory for _id (PyObjectId).
    
    # Let's align with Pydantic model
    validated_table = TableModel(**new_table_dict)
    
    # Exclude _id so Mongo generates it as ObjectId, avoiding string/ObjectId mismatch if Pydantic serialized it
    insert_data = validated_table.dict(by_alias=True, exclude={"id"})
    
    new_table = await tables_collection.insert_one(insert_data)
    created_table = await tables_collection.find_one({"_id": new_table.inserted_id})
    return created_table

@router.put("/{id}", response_model=TableModel)
async def update_table(id: str, table_update: TableUpdate, current_user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format") # Should catch early but good for safety
        
    update_data = {k: v for k, v in table_update.dict(exclude_unset=True).items()}
    
    if len(update_data) >= 1:
        update_result = await tables_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": update_data}
        )
        if update_result.modified_count == 0:
             # Check if it exists but wasn't modified (rare but possible if same data sent)
             # or if it doesn't exist.
             existing = await tables_collection.find_one({"_id": ObjectId(id)})
             if not existing:
                 raise HTTPException(status_code=404, detail="Table not found")

    if (updated_table := await tables_collection.find_one({"_id": ObjectId(id)})) is not None:
        return updated_table

    raise HTTPException(status_code=404, detail="Table not found")

@router.delete("/{id}")
async def delete_table(id: str, current_user: User = Depends(get_current_user)):
    delete_result = await tables_collection.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Table deleted successfully"}
    raise HTTPException(status_code=404, detail="Table not found")

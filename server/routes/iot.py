from fastapi import APIRouter, HTTPException
from database import tables_collection
from models import IOTRequest

router = APIRouter(
    prefix="/api/iot",
    tags=["iot"],
)

@router.post("/table-status")
async def get_table_status(request: IOTRequest):
    table = await tables_collection.find_one({"tableId": request.tableId})
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    
    return {"status": table["status"]}

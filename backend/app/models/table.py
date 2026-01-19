from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class OrderStatus(str, Enum):
    IDLE = "idle"
    PLACED = "placed"
    PROCESSING = "processing"
    DELIVERED = "delivered"

class TableBase(BaseModel):
    tableName: str
    status: OrderStatus = OrderStatus.IDLE
    isActive: bool = True

class TableCreate(BaseModel):
    tableName: str

class TableUpdate(BaseModel):
    tableName: Optional[str] = None
    status: Optional[OrderStatus] = None
    isActive: Optional[bool] = None

class TableStatusUpdate(BaseModel):
    status: OrderStatus

class TableInDB(TableBase):
    id: str = Field(alias="_id")
    createdAt: datetime
    updatedAt: datetime

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}

class TableResponse(BaseModel):
    _id: str
    tableName: str
    status: str
    isActive: bool
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}
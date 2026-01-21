from pydantic import BaseModel, Field, ConfigDict, GetCoreSchemaHandler, GetJsonSchemaHandler
from typing import Optional, Any, List
from datetime import datetime
from bson import ObjectId
from pydantic_core import CoreSchema, core_schema

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetCoreSchemaHandler
    ) -> CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ]),
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, value: Any) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)

    @classmethod
    def __get_pydantic_json_schema__(
        cls, _core_schema: CoreSchema, handler: GetJsonSchemaHandler
    ) -> Any:
        return handler(core_schema.str_schema())

class User(BaseModel):
    username: str
    password: str

class UserInDB(User):
    hashed_password: str

class TableModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    tableId: str
    tableName: str
    status: str = "idle"  # idle, placed, processing, delivered
    isActive: bool = True
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class TableCreate(BaseModel):
    tableName: str
    status: str = "idle"
    isActive: bool = True

class TableUpdate(BaseModel):
    tableName: Optional[str] = None
    status: Optional[str] = None
    isActive: Optional[bool] = None
    updatedAt: datetime = Field(default_factory=datetime.now)

class IOTRequest(BaseModel):
    tableId: str

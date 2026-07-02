from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RequestBase(BaseModel):
    title: str
    description: Optional[str] = None


class RequestCreate(RequestBase):
    pass


class RequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class RequestOut(RequestBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

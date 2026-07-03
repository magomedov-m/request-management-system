from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class RequestOut(BaseModel):
    id: int
    title: str
    description: str | None
    status: Literal["new", "in_progress", "done"]
    priority: Literal["low", "normal", "high"]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

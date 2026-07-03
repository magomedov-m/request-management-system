from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Literal, Optional

VALID_STATUSES = ("new", "in_progress", "done")
VALID_PRIORITIES = ("low", "normal", "high")


class RequestBase(BaseModel):
    title: str
    description: Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title must not be empty or whitespace")
        return v


class RequestCreate(RequestBase):
    status: Literal["new"] = "new"
    priority: Literal["low", "normal", "high"] = "normal"

    @field_validator("title")
    @classmethod
    def title_length(cls, v: str) -> str:
        if len(v) < 3:
            raise ValueError("title must be at least 3 characters")
        if len(v) > 120:
            raise ValueError("title must be at most 120 characters")
        return v

    @field_validator("description")
    @classmethod
    def description_length(cls, v: str | None) -> str | None:
        if v is not None and len(v) > 1000:
            raise ValueError("description must be at most 1000 characters")
        return v


class RequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal["new", "in_progress", "done"]] = None
    priority: Optional[Literal["low", "normal", "high"]] = None

    @field_validator("title")
    @classmethod
    def title_length(cls, v: str | None) -> str | None:
        if v is not None:
            if len(v) < 3:
                raise ValueError("title must be at least 3 characters")
            if len(v) > 120:
                raise ValueError("title must be at most 120 characters")
        return v

    @field_validator("description")
    @classmethod
    def description_length(cls, v: str | None) -> str | None:
        if v is not None and len(v) > 1000:
            raise ValueError("description must be at most 1000 characters")
        return v


class RequestOut(RequestBase):
    id: int
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    items: list[RequestOut]
    page: int
    limit: int
    total: int

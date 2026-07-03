from pydantic import BaseModel, field_validator
from typing import Optional


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
    status: str = "new"
    priority: str = "normal"

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

from pydantic import BaseModel, field_validator
from typing import Optional, Literal


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

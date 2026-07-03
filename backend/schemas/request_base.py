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

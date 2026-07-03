from pydantic import BaseModel
from schemas.request_out import RequestOut


class PaginatedResponse(BaseModel):
    items: list[RequestOut]
    page: int
    limit: int
    total: int

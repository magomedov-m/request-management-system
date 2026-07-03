from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import Optional, Literal, Tuple

from models.request import Request
from schemas.request import RequestCreate, RequestUpdate


def create_request(db: Session, data: RequestCreate) -> Request:
    db_request = Request(**data.model_dump())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


def _build_query(
    db: Session,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
) -> Session:
    query = db.query(Request)
    if status:
        query = query.filter(Request.status == status)
    if priority:
        query = query.filter(Request.priority == priority)
    if search:
        like_pattern = f"%{search}%"
        query = query.filter(
            Request.title.ilike(like_pattern)
            | Request.description.ilike(like_pattern)
        )
    return query


def get_all_requests(
    db: Session,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Literal["created_at", "priority"] = "created_at",
    order: Literal["asc", "desc"] = "desc",
    page: int = 1,
    limit: int = 10,
) -> Tuple[list[Request], int]:
    base_query = _build_query(db, status, priority, search)

    # Total count
    total = db.query(func.count()).select_from(base_query.subquery()).scalar()

    # Sorting
    sort_column = getattr(Request, sort_by)
    if order == "asc":
        base_query = base_query.order_by(sort_column.asc())
    else:
        base_query = base_query.order_by(sort_column.desc())

    # Pagination
    offset = (page - 1) * limit
    items = base_query.offset(offset).limit(limit).all()

    return items, total


def get_request_by_id(db: Session, request_id: int) -> Request | None:
    return db.query(Request).filter(Request.id == request_id).first()


def update_request(db: Session, request_id: int, data: RequestUpdate) -> Request:
    db_request = get_request_by_id(db, request_id)
    if db_request.status == "done":
        raise ValueError("Нельзя изменить завершённую заявку")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_request, key, value)
    db.commit()
    db.refresh(db_request)
    return db_request


def delete_request(db: Session, request_id: int) -> None:
    db_request = get_request_by_id(db, request_id)
    db.delete(db_request)
    db.commit()

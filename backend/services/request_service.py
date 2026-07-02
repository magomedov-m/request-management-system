from sqlalchemy.orm import Session

from models.request import Request
from schemas.request import RequestCreate, RequestUpdate


def create_request(db: Session, data: RequestCreate) -> Request:
    db_request = Request(**data.model_dump())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


def get_all_requests(db: Session) -> list[Request]:
    return db.query(Request).order_by(Request.created_at.desc()).all()


def get_request_by_id(db: Session, request_id: int) -> Request | None:
    return db.query(Request).filter(Request.id == request_id).first()


def update_request(db: Session, request_id: int, data: RequestUpdate) -> Request:
    db_request = get_request_by_id(db, request_id)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_request, key, value)
    db.commit()
    db.refresh(db_request)
    return db_request


def delete_request(db: Session, request_id: int) -> None:
    db_request = get_request_by_id(db, request_id)
    db.delete(db_request)
    db.commit()

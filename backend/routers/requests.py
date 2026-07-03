from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional, Literal

from database.connection import get_db
from models.request import Request
from schemas.request import RequestCreate, RequestUpdate, RequestOut, PaginatedResponse
from services.request_service import (
    create_request,
    get_all_requests,
    get_request_by_id,
    update_request,
    delete_request,
)
from routers.auth import get_current_admin

router = APIRouter(prefix="/api/requests", tags=["requests"])


@router.post("/", response_model=RequestOut, status_code=201)
def create_new_request(data: RequestCreate, db: Session = Depends(get_db)):
    try:
        return create_request(db, data)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Ошибка при сохранении заявки")


@router.get("/", response_model=PaginatedResponse)
def list_requests(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: Literal["created_at", "priority"] = Query("created_at"),
    order: Literal["asc", "desc"] = Query("desc"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    items, total = get_all_requests(
        db, status=status, priority=priority, search=search,
        sort_by=sort_by, order=order, page=page, limit=limit,
    )
    return PaginatedResponse(
        items=items, page=page, limit=limit, total=total,
    )


@router.get("/{request_id}", response_model=RequestOut)
def read_request(request_id: int, db: Session = Depends(get_db)):
    req = get_request_by_id(db, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    return req


@router.put("/{request_id}", response_model=RequestOut)
def edit_request(request_id: int, data: RequestUpdate, db: Session = Depends(get_db)):
    req = get_request_by_id(db, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    try:
        return update_request(db, request_id, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{request_id}", status_code=204)
def remove_request(
    request_id: int,
    admin: str = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    req = get_request_by_id(db, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    if req.status == "done":
        raise HTTPException(
            status_code=400,
            detail="Нельзя удалить завершённую заявку"
        )
    delete_request(db, request_id)


@router.patch("/{request_id}/status", response_model=RequestOut)
def update_status(
    request_id: int,
    status: Literal["new", "in_progress", "done"],
    db: Session = Depends(get_db),
):
    req = get_request_by_id(db, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    if req.status == "done":
        raise HTTPException(
            status_code=400,
            detail="Нельзя изменить статус завершённой заявки"
        )
    req.status = status
    db.commit()
    db.refresh(req)
    return req

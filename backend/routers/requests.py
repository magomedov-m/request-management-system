from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.connection import get_db
from models.request import Request
from schemas.request import RequestCreate, RequestUpdate, RequestOut
from services.request_service import (
    create_request,
    get_all_requests,
    get_request_by_id,
    update_request,
    delete_request,
)

router = APIRouter(prefix="/api/requests", tags=["requests"])


@router.post("/", response_model=RequestOut, status_code=201)
def create_new_request(data: RequestCreate, db: Session = Depends(get_db)):
    return create_request(db, data)


@router.get("/", response_model=List[RequestOut])
def list_requests(db: Session = Depends(get_db)):
    return get_all_requests(db)


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
    return update_request(db, request_id, data)


@router.delete("/{request_id}", status_code=204)
def remove_request(request_id: int, db: Session = Depends(get_db)):
    req = get_request_by_id(db, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    delete_request(db, request_id)

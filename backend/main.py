from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.connection import engine, Base
from routers import requests as requests_router
from routers import auth as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Request Management System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(requests_router.router)
app.include_router(auth_router.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}

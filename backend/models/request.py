from sqlalchemy import Column, Integer, String, Text, DateTime, func
from database.connection import Base


class Request(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), default="new")
    priority = Column(String(10), default="normal")
    created_at = Column(DateTime, server_default=func.datetime('now', 'utc'))
    updated_at = Column(DateTime, server_default=func.datetime('now', 'utc'), onupdate=func.datetime('now', 'utc'))

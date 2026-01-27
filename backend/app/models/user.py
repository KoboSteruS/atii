"""
Модель пользователя
"""
from sqlalchemy import Column, String, Boolean
from loguru import logger

from app.core.base import BaseModel


class User(BaseModel):
    """
    Модель пользователя для авторизации
    """
    __tablename__ = "users"
    
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    
    def __repr__(self):
        return f"<User(username={self.username}, email={self.email})>"

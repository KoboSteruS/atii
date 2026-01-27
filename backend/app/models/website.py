"""
Модель веб-сайта (портфолио)
"""
from sqlalchemy import Column, String, Boolean, JSON
from loguru import logger

from app.core.base import BaseModel


class Website(BaseModel):
    """
    Модель веб-сайта для портфолио
    """
    __tablename__ = "websites"
    
    name = Column(String, nullable=False, index=True)
    client = Column(String, nullable=True)
    description = Column(String, nullable=True)
    url = Column(String, nullable=True)
    screenshot = Column(String, nullable=True)
    technologies = Column(JSON, default=list)  # Список технологий
    category = Column(String, nullable=True, index=True)
    date = Column(String, nullable=True)  # Формат: "YYYY-MM"
    featured = Column(Boolean, default=False, index=True)
    
    def __repr__(self):
        return f"<Website(name={self.name}, client={self.client})>"

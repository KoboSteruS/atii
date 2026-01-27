"""
Модель страницы контента
"""
from sqlalchemy import Column, String, Integer, JSON
from loguru import logger

from app.core.base import BaseModel


class PageContent(BaseModel):
    """
    Модель страницы с контентом
    """
    __tablename__ = "pages"
    
    page_id = Column(String, unique=True, index=True, nullable=False)  # home, about, custom, etc.
    name = Column(String, nullable=False)
    sections = Column(Integer, default=0)
    updated = Column(String, nullable=True)  # "2 часа назад", "только что", etc.
    content = Column(JSON, default=dict)  # Весь контент страницы в JSON
    
    def __repr__(self):
        return f"<PageContent(page_id={self.page_id}, name={self.name})>"

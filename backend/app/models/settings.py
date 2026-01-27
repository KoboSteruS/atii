"""
Модель настроек сайта
"""
from sqlalchemy import Column, String
from loguru import logger

from app.core.base import BaseModel


class Settings(BaseModel):
    """
    Модель настроек сайта (singleton - должна быть только одна запись)
    """
    __tablename__ = "settings"
    
    site_name = Column(String, nullable=False, default="АТИИ - IT решения")
    domain = Column(String, nullable=True)
    description = Column(String, nullable=True)
    primary_color = Column(String, nullable=False, default="#EF4444")
    accent_color = Column(String, nullable=False, default="#9333EA")
    background_color = Column(String, nullable=False, default="#000000")
    meta_title = Column(String, nullable=True)
    meta_description = Column(String, nullable=True)
    keywords = Column(String, nullable=True)
    
    def __repr__(self):
        return f"<Settings(site_name={self.site_name})>"

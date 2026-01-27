"""
Модель workflow схемы (для визуального редактора)
"""
from sqlalchemy import Column, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from loguru import logger

from app.core.base import BaseModel


class WorkflowSchema(BaseModel):
    """
    Модель workflow схемы для визуального редактора
    Связана с шаблоном через template_id
    """
    __tablename__ = "workflow_schemas"
    
    template_id = Column(String, ForeignKey("templates.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    nodes = Column(JSON, default=list)  # Массив узлов для визуального редактора
    
    def __repr__(self):
        return f"<WorkflowSchema(template_id={self.template_id})>"

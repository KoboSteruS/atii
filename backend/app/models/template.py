"""
Модели шаблонов и workflow шагов
"""
from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from loguru import logger

from app.core.base import BaseModel


class Template(BaseModel):
    """
    Модель шаблона готового решения
    """
    __tablename__ = "templates"
    
    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    customizable = Column(JSON, default=list)  # Список настраиваемых параметров
    status = Column(String, default="active", index=True)  # active | inactive
    
    # Связь с workflow шагами
    workflow_steps = relationship(
        "WorkflowStep",
        back_populates="template",
        cascade="all, delete-orphan",
        order_by="WorkflowStep.position"
    )
    
    def __repr__(self):
        return f"<Template(title={self.title}, status={self.status})>"


class WorkflowStep(BaseModel):
    """
    Модель шага workflow для шаблона
    """
    __tablename__ = "workflow_steps"
    
    template_id = Column(String, ForeignKey("templates.id", ondelete="CASCADE"), nullable=False, index=True)
    label = Column(String, nullable=False)
    type = Column(String, nullable=False)  # trigger | process | api | notification | complete
    description = Column(String, nullable=True)
    position = Column(String, nullable=False)  # Позиция: "1", "2", "2.1", "2.2", "3", "4.1" и т.д.
    
    # Связь с шаблоном
    template = relationship("Template", back_populates="workflow_steps")
    
    def __repr__(self):
        return f"<WorkflowStep(label={self.label}, type={self.type}, position={self.position})>"

"""
Схемы для workflow схем (визуальный редактор)
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class WorkflowSchemaCreate(BaseModel):
    """Схема создания workflow схемы"""
    template_id: str = Field(..., description="ID шаблона", min_length=1)
    nodes: List[Dict[str, Any]] = Field(default_factory=list, description="Массив узлов для визуального редактора")


class WorkflowSchemaUpdate(BaseModel):
    """Схема обновления workflow схемы"""
    template_id: Optional[str] = Field(None, description="ID шаблона")
    nodes: Optional[List[Dict[str, Any]]] = Field(None, description="Массив узлов для визуального редактора")


class WorkflowSchemaResponse(BaseModel):
    """Схема ответа с данными workflow схемы"""
    id: str
    template_id: str
    nodes: List[Dict[str, Any]]
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True

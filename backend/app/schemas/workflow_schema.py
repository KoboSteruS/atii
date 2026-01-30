"""
Схемы для workflow схем (визуальный редактор)
"""
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


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
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

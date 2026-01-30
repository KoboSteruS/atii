"""
Схемы для шаблонов и workflow шагов
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class WorkflowStepCreate(BaseModel):
    """Схема создания workflow шага"""
    label: str = Field(..., description="Название шага", min_length=1)
    type: str = Field(..., description="Тип шага: trigger, process, api, notification, complete")
    description: Optional[str] = Field(None, description="Описание шага")
    position: str = Field(..., description="Позиция шага: 1, 2, 2.1, 2.2, etc.")


class WorkflowStepResponse(BaseModel):
    """Схема ответа с данными workflow шага"""
    id: str
    template_id: str
    label: str
    type: str
    description: Optional[str]
    position: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TemplateCreate(BaseModel):
    """Схема создания шаблона"""
    title: str = Field(..., description="Название шаблона", min_length=1)
    description: Optional[str] = Field(None, description="Описание шаблона")
    customizable: List[str] = Field(default_factory=list, description="Список настраиваемых параметров")
    status: str = Field(default="active", description="Статус: active или inactive")
    workflow: Optional[List[WorkflowStepCreate]] = Field(None, description="Список workflow шагов")


class TemplateUpdate(BaseModel):
    """Схема обновления шаблона"""
    title: Optional[str] = Field(None, description="Название шаблона")
    description: Optional[str] = Field(None, description="Описание шаблона")
    customizable: Optional[List[str]] = Field(None, description="Список настраиваемых параметров")
    status: Optional[str] = Field(None, description="Статус: active или inactive")
    workflow: Optional[List[WorkflowStepCreate]] = Field(None, description="Список workflow шагов")


class TemplateResponse(BaseModel):
    """Схема ответа с данными шаблона"""
    id: str
    title: str
    description: Optional[str]
    customizable: List[str]
    status: str
    workflow_steps: List[WorkflowStepResponse]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

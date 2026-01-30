"""
Схемы для веб-сайтов (портфолио)
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, HttpUrl


class WebsiteCreate(BaseModel):
    """Схема создания веб-сайта"""
    name: str = Field(..., description="Название проекта", min_length=1)
    client: Optional[str] = Field(None, description="Клиент")
    description: Optional[str] = Field(None, description="Описание проекта")
    url: Optional[str] = Field(None, description="URL проекта")
    screenshot: Optional[str] = Field(None, description="URL скриншота")
    technologies: List[str] = Field(default_factory=list, description="Список технологий")
    category: Optional[str] = Field(None, description="Категория")
    date: Optional[str] = Field(None, description="Дата в формате YYYY-MM")
    featured: bool = Field(default=False, description="Избранный проект")


class WebsiteUpdate(BaseModel):
    """Схема обновления веб-сайта"""
    name: Optional[str] = Field(None, description="Название проекта")
    client: Optional[str] = Field(None, description="Клиент")
    description: Optional[str] = Field(None, description="Описание проекта")
    url: Optional[str] = Field(None, description="URL проекта")
    screenshot: Optional[str] = Field(None, description="URL скриншота")
    technologies: Optional[List[str]] = Field(None, description="Список технологий")
    category: Optional[str] = Field(None, description="Категория")
    date: Optional[str] = Field(None, description="Дата в формате YYYY-MM")
    featured: Optional[bool] = Field(None, description="Избранный проект")


class WebsiteResponse(BaseModel):
    """Схема ответа с данными веб-сайта"""
    id: str
    name: str
    client: Optional[str]
    description: Optional[str]
    url: Optional[str]
    screenshot: Optional[str]
    technologies: List[str]
    category: Optional[str]
    date: Optional[str]
    featured: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

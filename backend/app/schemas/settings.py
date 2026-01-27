"""
Схемы для настроек сайта
"""
from pydantic import BaseModel, Field
from typing import Optional


class SettingsCreate(BaseModel):
    """Схема создания настроек"""
    site_name: str = Field(default="АТИИ - IT решения", description="Название сайта")
    domain: Optional[str] = Field(None, description="Домен сайта")
    description: Optional[str] = Field(None, description="Описание сайта")
    primary_color: str = Field(default="#EF4444", description="Основной цвет")
    accent_color: str = Field(default="#9333EA", description="Акцентный цвет")
    background_color: str = Field(default="#000000", description="Цвет фона")
    meta_title: Optional[str] = Field(None, description="Meta title")
    meta_description: Optional[str] = Field(None, description="Meta description")
    keywords: Optional[str] = Field(None, description="Ключевые слова")


class SettingsUpdate(BaseModel):
    """Схема обновления настроек"""
    site_name: Optional[str] = Field(None, description="Название сайта")
    domain: Optional[str] = Field(None, description="Домен сайта")
    description: Optional[str] = Field(None, description="Описание сайта")
    primary_color: Optional[str] = Field(None, description="Основной цвет")
    accent_color: Optional[str] = Field(None, description="Акцентный цвет")
    background_color: Optional[str] = Field(None, description="Цвет фона")
    meta_title: Optional[str] = Field(None, description="Meta title")
    meta_description: Optional[str] = Field(None, description="Meta description")
    keywords: Optional[str] = Field(None, description="Ключевые слова")


class SettingsResponse(BaseModel):
    """Схема ответа с данными настроек"""
    id: str
    site_name: str
    domain: Optional[str]
    description: Optional[str]
    primary_color: str
    accent_color: str
    background_color: str
    meta_title: Optional[str]
    meta_description: Optional[str]
    keywords: Optional[str]
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True

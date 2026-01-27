"""
Схемы для страниц контента
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class PageContentCreate(BaseModel):
    """Схема создания страницы"""
    page_id: str = Field(..., description="ID страницы: home, about, custom, etc.", min_length=1)
    name: str = Field(..., description="Название страницы", min_length=1)
    sections: int = Field(default=0, description="Количество секций")
    updated: Optional[str] = Field(None, description="Время последнего обновления")
    content: Dict[str, Any] = Field(default_factory=dict, description="Контент страницы в JSON")


class PageContentUpdate(BaseModel):
    """Схема обновления страницы"""
    page_id: Optional[str] = Field(None, description="ID страницы")
    name: Optional[str] = Field(None, description="Название страницы")
    sections: Optional[int] = Field(None, description="Количество секций")
    updated: Optional[str] = Field(None, description="Время последнего обновления")
    content: Optional[Dict[str, Any]] = Field(None, description="Контент страницы в JSON")


class PageContentResponse(BaseModel):
    """Схема ответа с данными страницы"""
    id: str
    page_id: str
    name: str
    sections: int
    updated: Optional[str]
    content: Dict[str, Any]
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True

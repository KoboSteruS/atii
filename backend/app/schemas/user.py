"""
Схемы для пользователей
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    """Схема создания пользователя"""
    username: str = Field(..., description="Имя пользователя", min_length=3, max_length=50)
    email: EmailStr = Field(..., description="Email адрес")
    password: str = Field(..., description="Пароль", min_length=6)
    is_admin: bool = Field(default=False, description="Администратор")


class UserResponse(BaseModel):
    """Схема ответа с данными пользователя"""
    id: str
    username: str
    email: str
    is_active: bool
    is_admin: bool
    
    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    """Схема запроса на вход"""
    username: str = Field(..., description="Имя пользователя или email")
    password: str = Field(..., description="Пароль")


class Token(BaseModel):
    """Схема JWT токена"""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Тип токена")

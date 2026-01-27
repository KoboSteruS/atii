"""
Endpoints для настроек сайта
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from loguru import logger

from app.core.database import get_db
from app.api.dependencies import get_current_admin_user
from app.models.user import User
from app.models.settings import Settings
from app.schemas.settings import SettingsCreate, SettingsUpdate, SettingsResponse

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=SettingsResponse)
def get_settings(
    db: Session = Depends(get_db)
):
    """
    Получить настройки сайта (singleton - всегда одна запись)
    """
    settings = db.query(Settings).first()
    if not settings:
        # Создаем настройки по умолчанию, если их нет
        default_settings = Settings()
        db.add(default_settings)
        db.commit()
        db.refresh(default_settings)
        return default_settings
    return settings


@router.put("", response_model=SettingsResponse)
def update_settings(
    settings_data: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Обновить настройки сайта (только для админов)
    """
    settings = db.query(Settings).first()
    if not settings:
        # Создаем настройки, если их нет
        create_data = SettingsCreate()
        settings = Settings(**create_data.model_dump())
        db.add(settings)
        db.flush()
    
    # Обновляем только переданные поля
    update_data = settings_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    db.commit()
    db.refresh(settings)
    
    logger.info(f"Обновлены настройки сайта (пользователь: {current_user.username})")
    return settings

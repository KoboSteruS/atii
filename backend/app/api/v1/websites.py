"""
Endpoints для веб-сайтов (портфолио)
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from loguru import logger

from app.core.database import get_db
from app.api.dependencies import get_current_admin_user
from app.models.user import User
from app.models.website import Website
from app.schemas.website import WebsiteCreate, WebsiteUpdate, WebsiteResponse

router = APIRouter(prefix="/websites", tags=["websites"])


@router.get("", response_model=List[WebsiteResponse])
def get_websites(
    skip: int = 0,
    limit: int = 100,
    featured: bool = None,
    db: Session = Depends(get_db)
):
    """
    Получить список всех веб-сайтов
    """
    query = db.query(Website)
    
    if featured is not None:
        query = query.filter(Website.featured == featured)
    
    websites = query.offset(skip).limit(limit).all()
    return websites


@router.get("/{website_id}", response_model=WebsiteResponse)
def get_website(
    website_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить веб-сайт по ID
    """
    website = db.query(Website).filter(Website.id == website_id).first()
    if not website:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Веб-сайт не найден"
        )
    return website


@router.post("", response_model=WebsiteResponse, status_code=status.HTTP_201_CREATED)
def create_website(
    website_data: WebsiteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Создать новый веб-сайт (только для админов)
    """
    new_website = Website(**website_data.model_dump())
    db.add(new_website)
    db.commit()
    db.refresh(new_website)
    
    logger.info(f"Создан новый веб-сайт: {new_website.name} (пользователь: {current_user.username})")
    return new_website


@router.put("/{website_id}", response_model=WebsiteResponse)
def update_website(
    website_id: str,
    website_data: WebsiteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Обновить веб-сайт (только для админов)
    """
    website = db.query(Website).filter(Website.id == website_id).first()
    if not website:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Веб-сайт не найден"
        )
    
    # Обновляем только переданные поля
    update_data = website_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(website, field, value)
    
    db.commit()
    db.refresh(website)
    
    logger.info(f"Обновлен веб-сайт: {website.name} (пользователь: {current_user.username})")
    return website


@router.delete("/{website_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_website(
    website_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Удалить веб-сайт (только для админов)
    """
    website = db.query(Website).filter(Website.id == website_id).first()
    if not website:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Веб-сайт не найден"
        )
    
    db.delete(website)
    db.commit()
    
    logger.info(f"Удален веб-сайт: {website.name} (пользователь: {current_user.username})")
    return None

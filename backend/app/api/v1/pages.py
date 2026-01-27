"""
Endpoints для страниц контента
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from loguru import logger

from app.core.database import get_db
from app.api.dependencies import get_current_admin_user
from app.models.user import User
from app.models.page import PageContent
from app.schemas.page import PageContentCreate, PageContentUpdate, PageContentResponse

router = APIRouter(prefix="/pages", tags=["pages"])


@router.get("", response_model=List[PageContentResponse])
def get_pages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Получить список всех страниц
    """
    pages = db.query(PageContent).offset(skip).limit(limit).all()
    return pages


@router.get("/{page_id}", response_model=PageContentResponse)
def get_page(
    page_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить страницу по page_id (home, about, custom, etc.)
    """
    page = db.query(PageContent).filter(PageContent.page_id == page_id).first()
    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Страница не найдена"
        )
    return page


@router.post("", response_model=PageContentResponse, status_code=status.HTTP_201_CREATED)
def create_page(
    page_data: PageContentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Создать новую страницу (только для админов)
    """
    # Проверяем, не существует ли уже страница с таким page_id
    existing = db.query(PageContent).filter(PageContent.page_id == page_data.page_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Страница с page_id '{page_data.page_id}' уже существует"
        )
    
    new_page = PageContent(**page_data.model_dump())
    db.add(new_page)
    db.commit()
    db.refresh(new_page)
    
    logger.info(f"Создана новая страница: {new_page.name} (пользователь: {current_user.username})")
    return new_page


@router.put("/{page_id}", response_model=PageContentResponse)
def update_page(
    page_id: str,
    page_data: PageContentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Обновить страницу (только для админов)
    """
    page = db.query(PageContent).filter(PageContent.page_id == page_id).first()
    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Страница не найдена"
        )
    
    # Обновляем только переданные поля
    update_data = page_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(page, field, value)
    
    # Обновляем время обновления
    from datetime import datetime
    page.updated = "только что"
    
    db.commit()
    db.refresh(page)
    
    logger.info(f"Обновлена страница: {page.name} (пользователь: {current_user.username})")
    return page


@router.delete("/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_page(
    page_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Удалить страницу (только для админов)
    """
    page = db.query(PageContent).filter(PageContent.page_id == page_id).first()
    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Страница не найдена"
        )
    
    db.delete(page)
    db.commit()
    
    logger.info(f"Удалена страница: {page.name} (пользователь: {current_user.username})")
    return None

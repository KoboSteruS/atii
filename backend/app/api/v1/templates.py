"""
Endpoints для шаблонов
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from loguru import logger

from app.core.database import get_db
from app.api.dependencies import get_current_admin_user
from app.models.user import User
from app.models.template import Template, WorkflowStep
from app.schemas.template import TemplateCreate, TemplateUpdate, TemplateResponse, WorkflowStepCreate

router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("", response_model=List[TemplateResponse])
def get_templates(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    db: Session = Depends(get_db)
):
    """
    Получить список всех шаблонов
    """
    query = db.query(Template)
    
    if status_filter:
        query = query.filter(Template.status == status_filter)
    
    templates = query.offset(skip).limit(limit).all()
    return templates


@router.get("/{template_id}", response_model=TemplateResponse)
def get_template(
    template_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить шаблон по ID
    """
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Шаблон не найден"
        )
    return template


@router.post("", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
def create_template(
    template_data: TemplateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Создать новый шаблон (только для админов)
    """
    # Извлекаем workflow шаги
    workflow_steps_data = template_data.workflow or []
    template_dict = template_data.model_dump(exclude={"workflow"})
    
    # Создаем шаблон
    new_template = Template(**template_dict)
    db.add(new_template)
    db.flush()  # Получаем ID шаблона
    
    # Создаем workflow шаги
    for step_data in workflow_steps_data:
        step = WorkflowStep(
            template_id=new_template.id,
            **step_data.model_dump()
        )
        db.add(step)
    
    db.commit()
    db.refresh(new_template)
    
    logger.info(f"Создан новый шаблон: {new_template.title} (пользователь: {current_user.username})")
    return new_template


@router.put("/{template_id}", response_model=TemplateResponse)
def update_template(
    template_id: str,
    template_data: TemplateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Обновить шаблон (только для админов)
    """
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Шаблон не найден"
        )
    
    # Обновляем шаблон
    update_data = template_data.model_dump(exclude_unset=True, exclude={"workflow"})
    for field, value in update_data.items():
        setattr(template, field, value)
    
    # Обновляем workflow шаги, если они переданы
    if template_data.workflow is not None:
        # Удаляем старые шаги
        db.query(WorkflowStep).filter(WorkflowStep.template_id == template_id).delete()
        
        # Создаем новые шаги
        for step_data in template_data.workflow:
            step = WorkflowStep(
                template_id=template.id,
                **step_data.model_dump()
            )
            db.add(step)
    
    db.commit()
    db.refresh(template)
    
    logger.info(f"Обновлен шаблон: {template.title} (пользователь: {current_user.username})")
    return template


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_template(
    template_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Удалить шаблон (только для админов)
    """
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Шаблон не найден"
        )
    
    db.delete(template)
    db.commit()
    
    logger.info(f"Удален шаблон: {template.title} (пользователь: {current_user.username})")
    return None

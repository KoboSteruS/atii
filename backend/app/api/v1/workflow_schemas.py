"""
Endpoints для workflow схем (визуальный редактор)
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from loguru import logger

from app.core.database import get_db
from app.api.dependencies import get_current_admin_user
from app.models.user import User
from app.models.workflow_schema import WorkflowSchema
from app.schemas.workflow_schema import WorkflowSchemaCreate, WorkflowSchemaUpdate, WorkflowSchemaResponse

router = APIRouter(prefix="/workflow-schemas", tags=["workflow-schemas"])


@router.get("", response_model=List[WorkflowSchemaResponse])
def get_workflow_schemas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Получить список всех workflow схем
    """
    schemas = db.query(WorkflowSchema).offset(skip).limit(limit).all()
    return schemas


@router.get("/template/{template_id}", response_model=WorkflowSchemaResponse)
def get_workflow_schema_by_template(
    template_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить workflow схему по ID шаблона
    """
    schema = db.query(WorkflowSchema).filter(WorkflowSchema.template_id == template_id).first()
    if not schema:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow схема не найдена"
        )
    return schema


@router.post("", response_model=WorkflowSchemaResponse, status_code=status.HTTP_201_CREATED)
def create_workflow_schema(
    schema_data: WorkflowSchemaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Создать новую workflow схему (только для админов)
    """
    # Проверяем, не существует ли уже схема для этого шаблона
    existing = db.query(WorkflowSchema).filter(
        WorkflowSchema.template_id == schema_data.template_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Workflow схема для шаблона '{schema_data.template_id}' уже существует"
        )
    
    new_schema = WorkflowSchema(**schema_data.model_dump())
    db.add(new_schema)
    db.commit()
    db.refresh(new_schema)
    
    logger.info(f"Создана workflow схема для шаблона: {new_schema.template_id} (пользователь: {current_user.username})")
    return new_schema


@router.put("/template/{template_id}", response_model=WorkflowSchemaResponse)
def update_workflow_schema(
    template_id: str,
    schema_data: WorkflowSchemaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Обновить workflow схему (только для админов)
    """
    schema = db.query(WorkflowSchema).filter(WorkflowSchema.template_id == template_id).first()
    if not schema:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow схема не найдена"
        )
    
    # Обновляем только переданные поля
    update_data = schema_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(schema, field, value)
    
    db.commit()
    db.refresh(schema)
    
    logger.info(f"Обновлена workflow схема для шаблона: {schema.template_id} (пользователь: {current_user.username})")
    return schema


@router.delete("/template/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workflow_schema(
    template_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Удалить workflow схему (только для админов)
    """
    schema = db.query(WorkflowSchema).filter(WorkflowSchema.template_id == template_id).first()
    if not schema:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow схема не найдена"
        )
    
    db.delete(schema)
    db.commit()
    
    logger.info(f"Удалена workflow схема для шаблона: {template_id} (пользователь: {current_user.username})")
    return None

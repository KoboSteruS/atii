"""
Главный роутер API v1
"""
from fastapi import APIRouter

from app.api.v1 import auth, websites, templates, pages, settings, workflow_schemas

api_router = APIRouter()

# Подключаем все роутеры
api_router.include_router(auth.router)
api_router.include_router(websites.router)
api_router.include_router(templates.router)
api_router.include_router(pages.router)
api_router.include_router(settings.router)
api_router.include_router(workflow_schemas.router)

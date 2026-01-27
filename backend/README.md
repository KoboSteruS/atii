# ATII Backend API

FastAPI бэкенд для управления контентом админки ATII.

## Технологии

- **FastAPI** - современный веб-фреймворк для Python
- **SQLAlchemy** - ORM для работы с БД
- **SQLite** - база данных (можно заменить на PostgreSQL)
- **JWT** - авторизация через токены
- **Pydantic** - валидация данных
- **Loguru** - логирование

## Установка

1. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

2. Установите зависимости:
```bash
pip install -r requirements.txt
```

3. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

4. Отредактируйте `.env` файл, установив свой `SECRET_KEY` для JWT.

## Запуск

### Режим разработки:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

API будет доступен по адресу: `http://localhost:8000`

Документация API (Swagger): `http://localhost:8000/docs`
ReDoc: `http://localhost:8000/redoc`

## Структура проекта

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Главный файл приложения
│   ├── core/                # Основные модули
│   │   ├── config.py        # Конфигурация
│   │   ├── database.py      # Настройка БД
│   │   ├── base.py          # Базовая модель
│   │   └── security.py      # JWT, хеширование паролей
│   ├── models/              # Модели БД
│   │   ├── user.py
│   │   ├── website.py
│   │   ├── template.py
│   │   ├── page.py
│   │   ├── settings.py
│   │   └── workflow_schema.py
│   ├── schemas/             # Pydantic схемы
│   │   ├── user.py
│   │   ├── website.py
│   │   ├── template.py
│   │   ├── page.py
│   │   ├── settings.py
│   │   └── workflow_schema.py
│   └── api/
│       ├── dependencies.py   # Зависимости (авторизация)
│       └── v1/              # API v1 endpoints
│           ├── auth.py
│           ├── websites.py
│           ├── templates.py
│           ├── pages.py
│           ├── settings.py
│           ├── workflow_schemas.py
│           └── router.py
├── requirements.txt
├── .env.example
└── README.md
```

## API Endpoints

### Авторизация
- `POST /api/v1/auth/register` - Регистрация пользователя
- `POST /api/v1/auth/login` - Вход (получение JWT токена)
- `GET /api/v1/auth/me` - Информация о текущем пользователе

### Веб-сайты (портфолио)
- `GET /api/v1/websites` - Список всех веб-сайтов
- `GET /api/v1/websites/{id}` - Получить веб-сайт по ID
- `POST /api/v1/websites` - Создать веб-сайт (требуется авторизация)
- `PUT /api/v1/websites/{id}` - Обновить веб-сайт (требуется авторизация)
- `DELETE /api/v1/websites/{id}` - Удалить веб-сайт (требуется авторизация)

### Шаблоны
- `GET /api/v1/templates` - Список всех шаблонов
- `GET /api/v1/templates/{id}` - Получить шаблон по ID
- `POST /api/v1/templates` - Создать шаблон (требуется авторизация)
- `PUT /api/v1/templates/{id}` - Обновить шаблон (требуется авторизация)
- `DELETE /api/v1/templates/{id}` - Удалить шаблон (требуется авторизация)

### Страницы
- `GET /api/v1/pages` - Список всех страниц
- `GET /api/v1/pages/{page_id}` - Получить страницу по page_id
- `POST /api/v1/pages` - Создать страницу (требуется авторизация)
- `PUT /api/v1/pages/{page_id}` - Обновить страницу (требуется авторизация)
- `DELETE /api/v1/pages/{page_id}` - Удалить страницу (требуется авторизация)

### Настройки
- `GET /api/v1/settings` - Получить настройки сайта
- `PUT /api/v1/settings` - Обновить настройки (требуется авторизация)

### Workflow схемы
- `GET /api/v1/workflow-schemas` - Список всех схем
- `GET /api/v1/workflow-schemas/template/{template_id}` - Получить схему по ID шаблона
- `POST /api/v1/workflow-schemas` - Создать схему (требуется авторизация)
- `PUT /api/v1/workflow-schemas/template/{template_id}` - Обновить схему (требуется авторизация)
- `DELETE /api/v1/workflow-schemas/template/{template_id}` - Удалить схему (требуется авторизация)

## Использование JWT токена

После входа через `/api/v1/auth/login` вы получите JWT токен. Используйте его в заголовке запросов:

```
Authorization: Bearer <your-token>
```

## Создание первого администратора

После запуска приложения создайте первого администратора через API:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "secure_password",
    "is_admin": true
  }'
```

## Миграции БД

Для работы с миграциями используйте Alembic:

```bash
# Создать миграцию
alembic revision --autogenerate -m "Initial migration"

# Применить миграции
alembic upgrade head
```

## Production

Для production окружения:

1. Измените `SECRET_KEY` на случайную строку
2. Используйте PostgreSQL вместо SQLite
3. Настройте HTTPS
4. Используйте переменные окружения для всех секретов
5. Настройте логирование
6. Используйте reverse proxy (nginx) перед приложением

# Руководство по интеграции FastAPI бэкенда

## Обзор

Создан FastAPI бэкенд для хранения данных админки вместо LocalStorage. Теперь данные хранятся на сервере и доступны всем пользователям.

## Структура

```
backend/                    # FastAPI приложение
├── app/
│   ├── main.py            # Точка входа
│   ├── core/              # Конфигурация, БД, безопасность
│   ├── models/            # Модели SQLAlchemy
│   ├── schemas/           # Pydantic схемы
│   └── api/v1/           # API endpoints
src/
├── api/
│   └── client.ts          # API клиент для фронтенда
└── store/
    └── AppContextWithAPI.tsx  # AppContext с поддержкой API
```

## Установка и запуск бэкенда

1. Перейдите в папку `backend`:
```bash
cd backend
```

2. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Создайте файл `.env` (скопируйте `env.example`):
```bash
cp env.example .env
```

5. Отредактируйте `.env`, установив свой `SECRET_KEY`:
```
SECRET_KEY=ваш-случайный-секретный-ключ-минимум-32-символа
```

6. Запустите сервер:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Бэкенд будет доступен по адресу: `http://localhost:8000`
Документация API: `http://localhost:8000/docs`

## Создание первого администратора

После запуска бэкенда создайте первого администратора:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "secure_password_123",
    "is_admin": true
  }'
```

Или через Swagger UI: `http://localhost:8000/docs` → `/api/v1/auth/register`

## Интеграция на фронтенде

### Вариант 1: Использовать новый AppContext с API (рекомендуется)

1. В файле `src/main.tsx` замените:
```tsx
import { AppProvider } from './store/AppContext';
```
на:
```tsx
import { AppProviderWithAPI as AppProvider } from './store/AppContextWithAPI';
```

2. Добавьте переменную окружения в `.env` (в корне проекта):
```
VITE_API_URL=http://localhost:8000/api/v1
VITE_USE_API=true
```

3. Перезапустите dev сервер.

### Вариант 2: Постепенная миграция

Можно оставить старый `AppProvider` и переключаться через env переменную:

```tsx
// В src/main.tsx
const useAPI = import.meta.env.VITE_USE_API === 'true';
const AppProvider = useAPI ? AppProviderWithAPI : AppProviderOriginal;
```

## Авторизация

Для работы с API нужен JWT токен. Добавьте форму входа в админку:

```tsx
import { apiClient } from '../api/client';

// В компоненте входа
const handleLogin = async (username: string, password: string) => {
  try {
    await apiClient.login(username, password);
    // Токен автоматически сохраняется в localStorage
    // Теперь все запросы будут с авторизацией
  } catch (error) {
    console.error('Ошибка входа:', error);
  }
};
```

## Миграция данных из LocalStorage

Для переноса существующих данных из LocalStorage в БД:

1. Экспортируйте данные через админку (кнопка "Экспорт")
2. Используйте скрипт миграции (создайте `backend/migrate_data.py`):

```python
import json
from app.core.database import SessionLocal, init_db
from app.models.website import Website
from app.models.template import Template, WorkflowStep
from app.models.page import PageContent
from app.models.settings import Settings
from app.models.workflow_schema import WorkflowSchema

def migrate_from_json(json_file):
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    db = SessionLocal()
    try:
        # Мигрируем веб-сайты
        if 'websites' in data:
            for website in data['websites']:
                db_website = Website(**website)
                db.add(db_website)
        
        # Мигрируем шаблоны
        if 'templates' in data:
            for template in data['templates']:
                workflow = template.pop('workflow', [])
                db_template = Template(**template)
                db.add(db_template)
                db.flush()
                
                for step in workflow:
                    db_step = WorkflowStep(template_id=db_template.id, **step)
                    db.add(db_step)
        
        # Мигрируем страницы
        if 'pages' in data:
            for page in data['pages']:
                db_page = PageContent(**page)
                db.add(db_page)
        
        # Мигрируем настройки
        if 'settings' in data:
            settings = Settings(**data['settings'])
            db.add(settings)
        
        # Мигрируем workflow схемы
        if 'workflowSchemas' in data:
            for template_id, nodes in data['workflowSchemas'].items():
                schema = WorkflowSchema(template_id=template_id, nodes=nodes)
                db.add(schema)
        
        db.commit()
        print("Миграция завершена успешно!")
    except Exception as e:
        db.rollback()
        print(f"Ошибка миграции: {e}")
    finally:
        db.close()

if __name__ == '__main__':
    init_db()
    migrate_from_json('backup.json')
```

## API Endpoints

### Авторизация
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход (получить токен)
- `GET /api/v1/auth/me` - Информация о текущем пользователе

### Веб-сайты
- `GET /api/v1/websites` - Список
- `GET /api/v1/websites/{id}` - Получить один
- `POST /api/v1/websites` - Создать (требуется авторизация)
- `PUT /api/v1/websites/{id}` - Обновить (требуется авторизация)
- `DELETE /api/v1/websites/{id}` - Удалить (требуется авторизация)

### Шаблоны
- `GET /api/v1/templates` - Список
- `GET /api/v1/templates/{id}` - Получить один
- `POST /api/v1/templates` - Создать (требуется авторизация)
- `PUT /api/v1/templates/{id}` - Обновить (требуется авторизация)
- `DELETE /api/v1/templates/{id}` - Удалить (требуется авторизация)

### Страницы
- `GET /api/v1/pages` - Список
- `GET /api/v1/pages/{page_id}` - Получить одну
- `POST /api/v1/pages` - Создать (требуется авторизация)
- `PUT /api/v1/pages/{page_id}` - Обновить (требуется авторизация)
- `DELETE /api/v1/pages/{page_id}` - Удалить (требуется авторизация)

### Настройки
- `GET /api/v1/settings` - Получить настройки
- `PUT /api/v1/settings` - Обновить настройки (требуется авторизация)

### Workflow схемы
- `GET /api/v1/workflow-schemas` - Список
- `GET /api/v1/workflow-schemas/template/{template_id}` - Получить схему
- `POST /api/v1/workflow-schemas` - Создать (требуется авторизация)
- `PUT /api/v1/workflow-schemas/template/{template_id}` - Обновить (требуется авторизация)
- `DELETE /api/v1/workflow-schemas/template/{template_id}` - Удалить (требуется авторизация)

## Особенности

1. **Fallback на LocalStorage**: Если API недоступен, используется кеш из LocalStorage
2. **Автоматическое кеширование**: Все данные автоматически кешируются в LocalStorage
3. **Обработка ошибок**: При ошибках API происходит fallback на локальные данные
4. **JWT авторизация**: Токен хранится в localStorage и автоматически добавляется в заголовки

## Production

Для production:

1. Используйте PostgreSQL вместо SQLite
2. Установите сильный `SECRET_KEY`
3. Настройте HTTPS
4. Используйте переменные окружения для всех секретов
5. Настройте CORS для вашего домена
6. Используйте reverse proxy (nginx) перед приложением

## Troubleshooting

### Ошибка "Невалидный токен"
- Проверьте, что токен не истек (по умолчанию 30 минут)
- Перелогиньтесь через `/api/v1/auth/login`

### Ошибка "Пользователь не найден"
- Убедитесь, что пользователь создан и активен
- Проверьте, что используете правильный username/email

### Данные не загружаются
- Проверьте, что бэкенд запущен
- Проверьте URL в `VITE_API_URL`
- Проверьте CORS настройки на бэкенде
- Откройте консоль браузера для деталей ошибок

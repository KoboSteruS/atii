# Сервер синхронизации данных

Простой Node.js сервер для хранения данных в JSON файле.

## Установка

```bash
cd server
npm install
```

## Запуск

```bash
npm start
```

Сервер запустится на `http://localhost:3001`

## API

- `GET /api/data` - получить все данные
- `POST /api/data` - сохранить все данные
- `GET /api/data/:key` - получить конкретный ключ (websites, templates, pages, settings, workflowSchemas)
- `POST /api/data/:key` - сохранить конкретный ключ

## Файл данных

Данные хранятся в `server/data.json`

## Переменные окружения

- `PORT` - порт сервера (по умолчанию 3001)

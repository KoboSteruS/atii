# ✅ Финальное исправление: относительный путь для API

## Проблема

Ошибка `ERR_CERT_COMMON_NAME_INVALID` возникает, потому что:
- SSL сертификат выдан для домена `tech.at-ii.ru`
- Но запросы идут на IP `193.124.114.86`
- Браузер видит несоответствие и блокирует запрос

## Решение

Используем **относительный путь** для API запросов:
- Сайт: `https://tech.at-ii.ru`
- API: `https://tech.at-ii.ru/api/data` (тот же домен!)
- Nginx проксирует запросы к `localhost:3001`

---

## Что нужно сделать

### 1. Пересобрать проект

**На твоей машине:**
```bash
npm run build
scp -r build/ root@193.124.114.86:/tmp/
```

**На сервере:**
```bash
sudo cp -r /tmp/build /var/www/atii/
sudo chown -R www-data:www-data /var/www/atii/build
```

### 2. Настроить Nginx для домена (если ещё не настроен)

**На твоей машине:**
```bash
scp nginx-atii-domain.conf root@193.124.114.86:/tmp/
```

**На сервере:**
```bash
# Проверить текущую конфигурацию
sudo cat /etc/nginx/sites-enabled/tech.at-ii.ru
# или
sudo ls -la /etc/nginx/sites-enabled/

# Если конфигурации нет - создать
sudo cp /tmp/nginx-atii-domain.conf /etc/nginx/sites-available/atii-domain
sudo ln -sf /etc/nginx/sites-available/atii-domain /etc/nginx/sites-enabled/atii-domain

# Проверить
sudo nginx -t

# Перезагрузить
sudo systemctl reload nginx
```

### 3. Проверить конфигурацию Nginx

Nginx должен проксировать `/api/*` к `localhost:3001`:

```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 4. Очистить кэш браузера

- `Ctrl+Shift+R` (жесткая перезагрузка)
- Или DevTools (F12) → Network → "Disable cache"

---

## Проверка работы

### 1. Проверить API через домен:
```bash
curl https://tech.at-ii.ru/api/data
# Должен вернуть JSON
```

### 2. Проверить в браузере:
- Открой `https://tech.at-ii.ru`
- Открой DevTools (F12) → Network
- Попробуй обновить данные в админке
- Запрос должен идти на `https://tech.at-ii.ru/api/data` (не на IP!)
- Должен вернуться JSON, а не HTML

---

## Что изменилось в коде

Теперь в production используется **относительный путь**:

```typescript
if (import.meta.env.PROD) {
  return ''; // Пустая строка = относительный путь
}
```

Это значит:
- `fetch('')` → использует текущий origin
- `fetch('/api/data')` → `https://tech.at-ii.ru/api/data`
- Nginx проксирует к `localhost:3001`

---

## Если всё равно не работает

### Проверить логи Nginx:
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Проверить, что Node.js сервер работает:
```bash
sudo systemctl status atii-sync
curl http://localhost:3001/api/data
```

### Проверить конфигурацию Nginx:
```bash
sudo nginx -t
sudo cat /etc/nginx/sites-enabled/atii-domain
# или
sudo cat /etc/nginx/sites-enabled/tech.at-ii.ru
```

---

После пересборки и настройки Nginx всё должно работать! 🎉

# 🔧 Настройка Nginx для tech.at-ii.ru

## Быстрая настройка

### 1. Создать конфигурацию Nginx:

```bash
sudo nano /etc/nginx/sites-available/atii
```

Вставить следующее:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name tech.at-ii.ru;

    # API запросы проксируем на Node.js сервер
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Все остальные запросы (SPA) тоже проксируем на Node.js
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Активировать конфигурацию:

```bash
# Создать симлинк
sudo ln -s /etc/nginx/sites-available/atii /etc/nginx/sites-enabled/

# Удалить дефолтную конфигурацию (если мешает)
sudo rm /etc/nginx/sites-enabled/default

# Проверить конфигурацию
sudo nginx -t

# Перезагрузить Nginx
sudo systemctl reload nginx
```

### 3. Проверить работу:

```bash
# Проверить статус Nginx
sudo systemctl status nginx

# Проверить логи
sudo tail -f /var/log/nginx/error.log

# Проверить доступность
curl http://tech.at-ii.ru/api/data
```

---

## Альтернатива: Использовать IP напрямую

Если не хочешь настраивать Nginx, можно использовать IP сервера напрямую.

### На локальной машине перед сборкой:

Создай файл `.env.production`:
```env
VITE_API_URL=http://193.124.114.86:3001
```

Или для HTTPS (если настроен):
```env
VITE_API_URL=https://193.124.114.86:3001
```

Затем собери проект:
```bash
npm run build
```

И загрузи на сервер.

---

## Проверка после настройки

1. Открой `http://tech.at-ii.ru` в браузере
2. Открой консоль (F12) → Network
3. Проверь запросы к `/api/data` - должны идти на `tech.at-ii.ru/api/data` (без порта)
4. Если всё работает - готово! 🎉

---

## Если есть HTTPS

Если у тебя настроен SSL сертификат, добавь блок для HTTPS:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tech.at-ii.ru;

    ssl_certificate /etc/letsencrypt/live/tech.at-ii.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tech.at-ii.ru/privkey.pem;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

И добавь редирект с HTTP на HTTPS:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name tech.at-ii.ru;
    return 301 https://$server_name$request_uri;
}
```

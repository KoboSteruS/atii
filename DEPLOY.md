# 🚀 Деплой на сервер с systemd

Инструкция по развертыванию на Linux сервере с автозапуском через systemd.

---

## 📋 Предварительные требования

- Linux сервер (Ubuntu/Debian/CentOS)
- Node.js 18+ установлен
- Права sudo/root
- Домен или IP адрес сервера

---

## 📋 Шаг 1: Подготовка проекта

### На локальной машине:

```bash
# 1. Собрать production версию фронтенда
npm run build

# 2. Создать архив для загрузки на сервер
tar -czf atii-deploy.tar.gz \
  build/ \
  server/ \
  package.json \
  package-lock.json
```

---

## 📋 Шаг 2: Загрузка на сервер

```bash
# Загрузить архив на сервер
scp atii-deploy.tar.gz user@your-server.com:/tmp/

# Подключиться к серверу
ssh user@your-server.com
```

---

## 📋 Шаг 3: Установка на сервере

```bash
# 1. Создать директорию для проекта
sudo mkdir -p /var/www/atii
sudo chown $USER:$USER /var/www/atii

# 2. Распаковать архив
cd /var/www/atii
tar -xzf /tmp/atii-deploy.tar.gz

# 3. Установить зависимости сервера
cd server
npm install --production

# 4. Создать директорию для данных (если нужно)
mkdir -p /var/www/atii/server
chmod 755 /var/www/atii/server
```

---

## 📋 Шаг 4: Настройка systemd сервиса

```bash
# 1. Скопировать systemd unit файл
sudo cp /var/www/atii/server/atii-sync.service /etc/systemd/system/

# 2. Отредактировать пути (если нужно)
sudo nano /etc/systemd/system/atii-sync.service

# Проверьте пути:
# - WorkingDirectory=/var/www/atii/server
# - ExecStart=/usr/bin/node /var/www/atii/server/index.js
# - DATA_DIR=/var/www/atii/server
# - STATIC_DIR=/var/www/atii/build

# 3. Перезагрузить systemd
sudo systemctl daemon-reload

# 4. Включить автозапуск
sudo systemctl enable atii-sync.service

# 5. Запустить сервис
sudo systemctl start atii-sync.service

# 6. Проверить статус
sudo systemctl status atii-sync.service
```

---

## 📋 Шаг 5: Настройка Nginx (рекомендуется)

```bash
# 1. Установить Nginx (если не установлен)
sudo apt update
sudo apt install nginx

# 2. Создать конфигурацию
sudo nano /etc/nginx/sites-available/atii
```

Добавьте конфигурацию:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Редирект на HTTPS (опционально)
    # return 301 https://$server_name$request_uri;

    # Или для HTTP:
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 3. Активировать конфигурацию
sudo ln -s /etc/nginx/sites-available/atii /etc/nginx/sites-enabled/

# 4. Проверить конфигурацию
sudo nginx -t

# 5. Перезагрузить Nginx
sudo systemctl reload nginx
```

---

## 📋 Шаг 6: Настройка HTTPS (опционально, но рекомендуется)

```bash
# Установить Certbot
sudo apt install certbot python3-certbot-nginx

# Получить сертификат
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Автоматическое обновление
sudo certbot renew --dry-run
```

---

## 📋 Шаг 7: Проверка работы

```bash
# Проверить логи сервиса
sudo journalctl -u atii-sync.service -f

# Проверить, что сервер отвечает
curl http://localhost:3001/api/data

# Открыть в браузере
# http://your-domain.com или http://your-server-ip
```

---

## 🔧 Управление сервисом

```bash
# Запустить
sudo systemctl start atii-sync

# Остановить
sudo systemctl stop atii-sync

# Перезапустить
sudo systemctl restart atii-sync

# Статус
sudo systemctl status atii-sync

# Логи
sudo journalctl -u atii-sync.service -f
sudo journalctl -u atii-sync.service --since "1 hour ago"
```

---

## 🔄 Обновление проекта

```bash
# 1. На локальной машине собрать новую версию
npm run build

# 2. Загрузить на сервер
scp -r build/ user@your-server.com:/tmp/
scp server/index.js user@your-server.com:/tmp/

# 3. На сервере обновить файлы
ssh user@your-server.com
sudo cp -r /tmp/build /var/www/atii/
sudo cp /tmp/index.js /var/www/atii/server/

# 4. Перезапустить сервис
sudo systemctl restart atii-sync
```

---

## 🛠️ Troubleshooting

### Сервис не запускается

```bash
# Проверить логи
sudo journalctl -u atii-sync.service -n 50

# Проверить права доступа
ls -la /var/www/atii/server/
sudo chown -R www-data:www-data /var/www/atii/server

# Проверить Node.js
which node
node --version
```

### Порт занят

```bash
# Проверить, что занимает порт
sudo lsof -i :3001

# Изменить порт в systemd файле
sudo nano /etc/systemd/system/atii-sync.service
# Изменить Environment="PORT=3002"
sudo systemctl daemon-reload
sudo systemctl restart atii-sync
```

### Данные не сохраняются

```bash
# Проверить права на файл данных
ls -la /var/www/atii/server/data.json
sudo chmod 644 /var/www/atii/server/data.json
sudo chown www-data:www-data /var/www/atii/server/data.json
```

### Nginx не проксирует запросы

```bash
# Проверить конфигурацию
sudo nginx -t

# Проверить логи Nginx
sudo tail -f /var/log/nginx/error.log

# Проверить, что сервер слушает на 3001
curl http://localhost:3001/api/data
```

---

## 📝 Переменные окружения

Можно настроить через systemd файл:

```ini
Environment="PORT=3001"
Environment="DATA_DIR=/var/www/atii/server"
Environment="STATIC_DIR=/var/www/atii/build"
Environment="NODE_ENV=production"
```

---

## 🔒 Безопасность

1. **Firewall:**
```bash
# Разрешить только HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **Права доступа:**
```bash
# Только для чтения статические файлы
sudo chmod -R 755 /var/www/atii/build

# Права на данные
sudo chmod 644 /var/www/atii/server/data.json
sudo chown www-data:www-data /var/www/atii/server/data.json
```

3. **Резервное копирование:**
```bash
# Добавить в cron для ежедневного бэкапа
sudo crontab -e
# Добавить:
0 2 * * * cp /var/www/atii/server/data.json /var/backups/atii-data-$(date +\%Y\%m\%d).json
```

---

Готово! Сервер работает и автоматически запускается при перезагрузке! 🎉

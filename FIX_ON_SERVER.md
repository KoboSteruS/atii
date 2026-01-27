# 🔧 Быстрое исправление на сервере

## Проблема: EACCES permission denied

Исправлено! Теперь нужно:

```bash
# 1. Обновить systemd файл с правильным путем (build вместо dist)
sudo nano /etc/systemd/system/atii-sync.service

# Изменить строку:
# Environment="STATIC_DIR=/var/www/atii/build"

# 2. Перезагрузить systemd
sudo systemctl daemon-reload

# 3. Перезапустить сервис
sudo systemctl restart atii-sync

# 4. Проверить статус
sudo systemctl status atii-sync
```

## Если build папки нет на сервере

Сборку нужно делать **локально**, а не на сервере!

### На твоей машине:
```bash
npm run build
scp -r build/ root@your-server.com:/tmp/
```

### На сервере:
```bash
sudo cp -r /tmp/build /var/www/atii/
sudo chown -R www-data:www-data /var/www/atii/build
sudo chmod -R 755 /var/www/atii/build
sudo systemctl restart atii-sync
```

## Проверка работы

```bash
# Проверить логи
sudo journalctl -u atii-sync.service -f

# Проверить API
curl http://localhost:3001/api/data

# Проверить сайт
curl http://localhost:3001/
```

# 🔧 Быстрое исправление проблем на сервере

## Проблема 1: Сервис постоянно перезапускается

### Проверка логов:
```bash
sudo journalctl -u atii-sync.service -n 50 --no-pager
```

### Возможные причины и решения:

#### 1. Проблема с правами доступа
```bash
# Проверить права
ls -la /var/www/atii/server/

# Установить правильные права
sudo chown -R www-data:www-data /var/www/atii/server
sudo chown -R www-data:www-data /var/www/atii/dist
sudo chmod 755 /var/www/atii/server
sudo chmod 644 /var/www/atii/server/data.json
```

#### 2. Проблема с путями к Node.js
```bash
# Проверить, где находится node
which node

# Если node не в /usr/bin/node, изменить в systemd файле:
sudo nano /etc/systemd/system/atii-sync.service
# Заменить ExecStart на полный путь, например:
# ExecStart=/usr/local/bin/node /var/www/atii/server/index.js
```

#### 3. Порт занят
```bash
# Проверить, что занимает порт
sudo lsof -i :3001

# Если порт занят, убить процесс или изменить порт
```

---

## Проблема 2: vite: not found

**Решение:** Сборку нужно делать **локально**, а не на сервере!

### Правильный процесс:

#### На локальной машине:
```bash
# 1. Собрать проект
npm run build

# 2. Загрузить на сервер
scp -r build/ user@your-server.com:/tmp/
```

#### На сервере:
```bash
# 3. Скопировать build на место
sudo cp -r /tmp/build /var/www/atii/
sudo chown -R www-data:www-data /var/www/atii/build

# 4. Перезапустить сервис
sudo systemctl restart atii-sync
```

---

## Полная проверка и исправление

```bash
# 1. Остановить сервис
sudo systemctl stop atii-sync

# 2. Проверить права
sudo chown -R www-data:www-data /var/www/atii
sudo chmod 755 /var/www/atii/server
sudo chmod 644 /var/www/atii/server/data.json 2>/dev/null || true

# 3. Проверить Node.js
which node
node --version

# 4. Проверить пути в systemd
cat /etc/systemd/system/atii-sync.service

# 5. Запустить вручную для проверки
cd /var/www/atii/server
sudo -u www-data node index.js

# Если работает - остановить (Ctrl+C) и запустить через systemd:
sudo systemctl start atii-sync
sudo systemctl status atii-sync
```

---

## Если ничего не помогает

### Временное решение - запуск от root:
```bash
# Изменить User в systemd файле
sudo nano /etc/systemd/system/atii-sync.service
# Закомментировать или удалить строку: User=www-data

sudo systemctl daemon-reload
sudo systemctl restart atii-sync
```

⚠️ **Внимание:** Это небезопасно для production! Используйте только для тестирования.

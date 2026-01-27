# 🔧 Исправление: API запросы идут на домен вместо IP

## Проблема

Фронтенд обращается к `https://tech.at-ii.ru/api/data` и получает HTML вместо JSON.

## Решение

### 1. Пересобрать фронтенд с обновлениями

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

### 2. Настроить Nginx для домена tech.at-ii.ru

**На твоей машине:**
```bash
scp nginx-atii-domain.conf root@193.124.114.86:/tmp/
```

**На сервере:**
```bash
# Проверить текущую конфигурацию домена
sudo ls -la /etc/nginx/sites-available/ | grep atii
sudo ls -la /etc/nginx/sites-enabled/ | grep atii

# Если есть старая конфигурация - обновить её
# Или создать новую на основе nginx-atii-domain.conf
sudo cp /tmp/nginx-atii-domain.conf /etc/nginx/sites-available/atii-domain

# Активировать
sudo ln -sf /etc/nginx/sites-available/atii-domain /etc/nginx/sites-enabled/atii-domain

# Проверить конфигурацию
sudo nginx -t

# Перезагрузить
sudo systemctl reload nginx
```

### 3. Проверить работу

```bash
# Проверить API через домен
curl http://tech.at-ii.ru/api/data
# Должен вернуть JSON, а не HTML

# Проверить API через IP
curl http://193.124.114.86/api/data
# Тоже должен вернуть JSON
```

### 4. Очистить кэш браузера

В браузере:
- Нажми `Ctrl+Shift+R` (жесткая перезагрузка)
- Или `Ctrl+F5`
- Или открой DevTools (F12) → Network → поставь галочку "Disable cache"

---

## Что изменилось в коде

Теперь фронтенд в production **всегда** использует IP `193.124.114.86` для API запросов:

```typescript
// В production
const protocol = window.location.protocol;
return `${protocol}//193.124.114.86`;
```

Это значит:
- Если сайт открыт на `https://tech.at-ii.ru` → API запросы идут на `https://193.124.114.86/api/data`
- Если сайт открыт на `http://193.124.114.86` → API запросы идут на `http://193.124.114.86/api/data`

---

## Если всё равно не работает

### Проверить логи Nginx:
```bash
sudo tail -f /var/log/nginx/atii-domain-error.log
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
```

---

После пересборки и настройки Nginx всё должно работать! 🎉

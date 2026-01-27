// Простой сервер для синхронизации данных
// Запуск: node server/index.js

const express = require('express');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Путь к файлу данных (в production может быть в /var/www/atii/server/data.json)
const DATA_DIR = process.env.DATA_DIR || __dirname;
const DATA_FILE = path.join(DATA_DIR, 'data.json');

// Путь к статическим файлам (production build)
const STATIC_DIR = process.env.STATIC_DIR || path.join(__dirname, '..', 'dist');
const STATIC_EXISTS = fsSync.existsSync(STATIC_DIR);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Статические файлы (production build) - ДО API routes
if (STATIC_EXISTS) {
  app.use(express.static(STATIC_DIR));
}

// Создаем файл с дефолтными данными, если его нет
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    // Файл не существует, создаем пустой объект
    await fs.writeFile(DATA_FILE, JSON.stringify({
      websites: [],
      templates: [],
      pages: [],
      settings: {},
      workflowSchemas: {}
    }, null, 2));
    console.log('Создан файл data.json');
  }
}

// GET /api/data - получить все данные
app.get('/api/data', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Ошибка чтения данных:', error);
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// POST /api/data - сохранить все данные
app.post('/api/data', async (req, res) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2));
    console.log('Данные сохранены:', new Date().toISOString());
    res.json({ success: true, message: 'Данные сохранены' });
  } catch (error) {
    console.error('Ошибка сохранения данных:', error);
    res.status(500).json({ error: 'Ошибка сохранения данных' });
  }
});

// GET /api/data/:key - получить конкретный ключ
app.get('/api/data/:key', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const json = JSON.parse(data);
    const key = req.params.key;
    
    if (json[key] !== undefined) {
      res.json(json[key]);
    } else {
      res.status(404).json({ error: 'Ключ не найден' });
    }
  } catch (error) {
    console.error('Ошибка чтения данных:', error);
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// POST /api/data/:key - сохранить конкретный ключ
app.post('/api/data/:key', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const json = JSON.parse(data);
    const key = req.params.key;
    
    json[key] = req.body;
    
    await fs.writeFile(DATA_FILE, JSON.stringify(json, null, 2));
    console.log(`Данные ${key} сохранены:`, new Date().toISOString());
    res.json({ success: true, message: `Данные ${key} сохранены` });
  } catch (error) {
    console.error('Ошибка сохранения данных:', error);
    res.status(500).json({ error: 'Ошибка сохранения данных' });
  }
});

// SPA fallback - все остальные запросы на index.html
if (STATIC_EXISTS) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
  });
}

// Запуск сервера
async function start() {
  await ensureDataFile();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Сервер запущен на http://0.0.0.0:${PORT}`);
    console.log(`📁 Данные хранятся в: ${DATA_FILE}`);
    if (STATIC_EXISTS) {
      console.log(`📦 Статические файлы: ${STATIC_DIR}`);
    } else {
      console.log(`⚠️  Статические файлы не найдены: ${STATIC_DIR}`);
    }
    console.log(`\nAPI endpoints:`);
    console.log(`  GET  /api/data - получить все данные`);
    console.log(`  POST /api/data - сохранить все данные`);
    console.log(`  GET  /api/data/:key - получить конкретный ключ`);
    console.log(`  POST /api/data/:key - сохранить конкретный ключ`);
  });
}

start().catch(console.error);

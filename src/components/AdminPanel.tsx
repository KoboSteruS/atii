import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, GitBranch, FileText, Settings, Save, Plus, Trash2, 
  Edit, Eye, Code, Layers, Globe, Image, Type, Palette, Users, BarChart,
  ArrowLeft, ArrowRight, Check, X, Copy, Download, Upload, Zap, Database, Mail,
  MessageSquare, Webhook, Target, ChevronRight, GripVertical, Search,
  Briefcase, ExternalLink, Calendar, Tag, Sparkles, AlertCircle, Award, RefreshCw
} from 'lucide-react';
import { useApp, Website, Template, PageContent, WorkflowStep } from '../store/AppContext';
import { SchemaEditor } from './SchemaEditor';

type Section = 'dashboard' | 'schemas' | 'content' | 'templates' | 'portfolio' | 'settings';

export function AdminPanel() {
  const {
    websites,
    addWebsite,
    updateWebsite,
    deleteWebsite,
    duplicateWebsite,
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    workflowSchemas,
    saveWorkflowSchema,
    getWorkflowSchema,
    pages,
    updatePage,
    settings,
    updateSettings,
  } = useApp();

  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [portfolioFilter, setPortfolioFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Функция принудительного обновления данных с сервера
  const refreshDataFromServer = async () => {
    setIsRefreshing(true);
    
    try {
      // Автоматически определяем URL API
      const getApiUrl = () => {
        if (import.meta.env.VITE_API_URL) {
          return import.meta.env.VITE_API_URL;
        }
        if (import.meta.env.PROD) {
          const protocol = window.location.protocol;
          const hostname = window.location.hostname;
          const port = window.location.port;
          if (port && port !== '80' && port !== '443') {
            return `${protocol}//${hostname}:3001`;
          }
          return ''; // Относительный путь - Nginx проксирует
        }
        return 'http://localhost:3001';
      };
      
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/data`);
      
      if (response.ok) {
        const serverData = await response.json();
        
        // Обновляем localStorage данными с сервера
        if (serverData.websites) localStorage.setItem('atii_websites', JSON.stringify(serverData.websites));
        if (serverData.templates) localStorage.setItem('atii_templates', JSON.stringify(serverData.templates));
        if (serverData.pages) localStorage.setItem('atii_pages', JSON.stringify(serverData.pages));
        if (serverData.settings) localStorage.setItem('atii_settings', JSON.stringify(serverData.settings));
        if (serverData.workflowSchemas) localStorage.setItem('atii_workflow_schemas', JSON.stringify(serverData.workflowSchemas));
        
        alert('Данные успешно обновлены с сервера! Страница будет перезагружена.');
        window.location.reload();
      } else {
        throw new Error('Сервер недоступен');
      }
    } catch (error) {
      const apiUrl = getApiUrl();
      alert(`Сервер недоступен. Убедитесь, что сервер запущен на ${apiUrl}`);
      console.error('Ошибка обновления данных:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Export/Import functions
  const exportData = () => {
    const data = {
      websites,
      templates,
      pages,
      settings,
      workflowSchemas,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atii-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Данные успешно экспортированы!');
  };
  
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (confirm('Импортировать данные? Текущие данные будут заменены!')) {
          if (data.websites) localStorage.setItem('atii_websites', JSON.stringify(data.websites));
          if (data.templates) localStorage.setItem('atii_templates', JSON.stringify(data.templates));
          if (data.pages) localStorage.setItem('atii_pages', JSON.stringify(data.pages));
          if (data.settings) localStorage.setItem('atii_settings', JSON.stringify(data.settings));
          if (data.workflowSchemas) localStorage.setItem('atii_workflow_schemas', JSON.stringify(data.workflowSchemas));
          
          alert('Данные успешно импортированы! Страница будет перезагружена.');
          window.location.reload();
        }
      } catch (error) {
        alert('Ошибка импорта: неверный формат файла');
      }
    };
    reader.readAsText(file);
  };
  
  // Filtered data
  const filteredWebsites = websites.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         w.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = portfolioFilter === 'all' || 
                         (portfolioFilter === 'featured' && w.featured) ||
                         w.category === portfolioFilter;
    return matchesSearch && matchesFilter;
  });
  
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = templateFilter === 'all' || t.status === templateFilter;
    return matchesSearch && matchesFilter;
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  
  // Form states
  const [projectForm, setProjectForm] = useState<Partial<Website>>({});
  const [templateForm, setTemplateForm] = useState<Partial<Template>>({});
  const [settingsForm, setSettingsForm] = useState<Partial<typeof settings>>(settings);
  
  // Content editor state
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageContentForm, setPageContentForm] = useState<any>({});
  
  // Схемы теперь хранятся прямо в шаблонах - не нужен отдельный state! // УБРАЛ templates из зависимостей!

  // Убрал автосохранение с debounce - теперь сохраняем сразу в onChange
  
  // Load page content when editing - загружаем ВСЕ данные сразу
  useEffect(() => {
    if (editingPageId) {
      const page = pages.find(p => p.id === editingPageId);
      if (page) {
        // Глубокое копирование контента для редактирования
        let contentToEdit = page.content ? JSON.parse(JSON.stringify(page.content)) : {};
        
        // Если данных нет или они пустые, используем дефолтные значения из defaultPages
        if (!contentToEdit || Object.keys(contentToEdit).length === 0) {
          // Импортируем дефолтные значения из Context
          const defaultHomeContent = {
            hero: {
              badge: 'Информационные технологии будущего',
              title: 'Информационные решения\nдля вашего бизнеса',
              subtitle: 'для вашего бизнеса',
              description: 'IT-компания, которая помогает решать проблемы через современные технологии. Мы можем разработать почти всё что угодно.',
              ctaText: 'Начать проект',
              ctaLink: '/custom'
            },
            features: [
              { id: '1', title: 'Готовые решения', description: 'Библиотека проверенных шаблонов для быстрого старта вашего проекта', link: '/templates', icon: 'code' },
              { id: '2', title: 'Быстрое внедрение', description: 'От идеи до запуска за 2-4 недели благодаря автоматизации', link: '/templates', icon: 'zap' },
              { id: '3', title: 'Полная безопасность', description: 'Современные протоколы шифрования и защита данных на всех уровнях', link: '/about', icon: 'shield' }
            ],
            projects: [
              { id: '1', title: 'E-commerce платформа', category: 'Интернет-магазин', image: 'https://images.unsplash.com/photo-1592773307163-962d25055c3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzY4MzMwOTE3fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Полнофункциональная платформа с интеграцией платежей и аналитикой', tech: ['React', 'Node.js', 'PostgreSQL'] },
              { id: '2', title: 'Аналитическая dashboard', category: 'Бизнес-аналитика', image: 'https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBwbGF0Zm9ybXxlbnwxfHx8fDE3NjgzMDgwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Визуализация данных в реальном времени для принятия решений', tech: ['Python', 'Django', 'Redis'] },
              { id: '3', title: 'Мобильное приложение', category: 'Mobile Development', image: 'https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY4MzE1OTE2fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Кроссплатформенное приложение для iOS и Android', tech: ['React Native', 'TypeScript'] }
            ],
            solutions: [
              { id: '1', title: 'CRM интеграция', description: 'Автоматическая синхронизация обращений клиентов из мессенджеров', link: '/templates', icon: 'message-square' },
              { id: '2', title: 'Email-рассылки', description: 'Триггерные рассылки с персонализацией и аналитикой', link: '/templates', icon: 'mail' },
              { id: '3', title: 'Синхронизация данных', description: 'Двусторонняя синхронизация между системами в реальном времени', link: '/templates', icon: 'database' }
            ],
            capabilities: [
              { id: '1', title: 'Data Analytics', description: 'Визуализация и анализ', image: 'https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGdyYXBofGVufDF8fHx8MTc2ODQyNDQxNHww&ixlib=rb-4.1.0&q=80&w=1080', icon: 'boxes' },
              { id: '2', title: 'AI & ML', description: 'Машинное обучение', image: 'https://images.unsplash.com/photo-1675495277087-10598bf7bcd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwbWF0cml4JTIwZGlnaXRhbHxlbnwxfHx8fDE3Njg0MjQ0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080', icon: 'cpu' },
              { id: '3', title: 'Backend API', description: 'Серверные решения', image: 'https://images.unsplash.com/photo-1661669999755-1e5b36d9e9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdGVjaG5vbG9neSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzY4NDI0NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080', icon: 'code' },
              { id: '4', title: '3D визуализация', description: 'Интерактивные модели', image: 'https://images.unsplash.com/photo-1658806283210-6d7330062704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGFic3RyYWN0JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3Njg0MjQ0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080', icon: 'workflow' }
            ],
            stats: [
              { id: '1', value: '100+', label: 'Реализованных проектов' },
              { id: '2', value: '50+', label: 'Довольных клиентов' },
              { id: '3', value: '5+', label: 'Лет опыта' },
              { id: '4', value: '24/7', label: 'Техподдержка' }
            ]
          };
          
          if (editingPageId === 'home') {
            contentToEdit = { ...defaultHomeContent, ...contentToEdit };
          }
        }
        
        // Загружаем дефолтные данные для Custom
        if (editingPageId === 'custom') {
          if (!contentToEdit.hero) contentToEdit.hero = {};
          // Заполняем дефолтными значениями если пусто
          if (!contentToEdit.hero.badge) contentToEdit.hero.badge = 'Премиум услуга';
          if (!contentToEdit.hero.title) contentToEdit.hero.title = 'Решения под ключ';
          if (!contentToEdit.hero.subtitle) contentToEdit.hero.subtitle = 'под ключ';
          if (!contentToEdit.hero.description) contentToEdit.hero.description = 'Любая ваша идея — от концепции до полной реализации. Вы управляете процессом, мы воплощаем самые смелые задачи.';
          if (!contentToEdit.hero.ctaText) contentToEdit.hero.ctaText = 'Начать проект';
          if (!contentToEdit.hero.ctaLink) contentToEdit.hero.ctaLink = '/custom';
          if (!contentToEdit.workflowSteps || contentToEdit.workflowSteps.length === 0) {
            contentToEdit.workflowSteps = [
              { id: '1', title: 'Консультация', description: 'Детально обсуждаем вашу задачу и формируем техническое задание', duration: '1-3 дня', details: ['Анализ бизнес-процессов', 'Определение целей проекта', 'Оценка сроков и бюджета'], icon: 'users' },
              { id: '2', title: 'Проектирование', description: 'Разрабатываем архитектуру и план реализации вашего решения', duration: '5-10 дней', details: ['Техническая архитектура', 'Дизайн интерфейсов', 'План разработки'], icon: 'target' },
              { id: '3', title: 'Разработка', description: 'Создаем ваше решение с использованием современных технологий', duration: '2-8 недель', details: ['Backend разработка', 'Frontend разработка', 'Интеграции с сервисами'], icon: 'code' },
              { id: '4', title: 'Запуск', description: 'Тестирование, внедрение и передача проекта', duration: '3-7 дней', details: ['Тестирование системы', 'Развертывание', 'Обучение команды'], icon: 'rocket' }
            ];
          }
          if (!contentToEdit.advantages || contentToEdit.advantages.length === 0) {
            contentToEdit.advantages = [
              { id: '1', title: 'Гибкость', description: 'Полный контроль над процессом разработки', icon: 'layers' },
              { id: '2', title: 'Любые технологии', description: 'Используем оптимальный стек для вашего проекта', icon: 'zap' },
              { id: '3', title: 'Масштабируемость', description: 'Система растет вместе с вашим бизнесом', icon: 'linechart' },
              { id: '4', title: 'Безопасность', description: 'Современные протоколы защиты данных', icon: 'shield' },
              { id: '5', title: 'Полная интеграция', description: 'Подключение к любым внешним системам', icon: 'globe' },
              { id: '6', title: 'Поддержка 24/7', description: 'Техническое сопровождение после запуска', icon: 'users' }
            ];
          }
          if (!contentToEdit.caseStudies || contentToEdit.caseStudies.length === 0) {
            contentToEdit.caseStudies = [
              { id: '1', title: 'Платформа для финтех', description: 'Система для управления финансовыми операциями с интеграцией банковских API', tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe API'] },
              { id: '2', title: 'AI-аналитика для e-commerce', description: 'Платформа прогнозирования спроса с использованием машинного обучения', tech: ['Python', 'TensorFlow', 'FastAPI', 'Kubernetes'] }
            ];
          }
        }

        // Загружаем дефолтные данные для About
        if (editingPageId === 'about') {
          if (!contentToEdit) contentToEdit = {};
          if (!contentToEdit.hero) contentToEdit.hero = {};
          // Заполняем дефолтными значениями если пусто
          if (!contentToEdit.hero.badge) contentToEdit.hero.badge = 'О компании АТИИ';
          if (!contentToEdit.hero.title) contentToEdit.hero.title = 'Мы создаем\nбудущее';
          if (!contentToEdit.hero.subtitle) contentToEdit.hero.subtitle = 'будущее';
          if (!contentToEdit.hero.description) contentToEdit.hero.description = 'IT-компания, которая помогает решать проблемы через информационные решения. Мы можем разработать почти всё что угодно.';
          if (!contentToEdit.hero.ctaText) contentToEdit.hero.ctaText = 'Связаться с нами';
          if (!contentToEdit.hero.ctaLink) contentToEdit.hero.ctaLink = '/contact';
          if (!contentToEdit.stats || !Array.isArray(contentToEdit.stats) || contentToEdit.stats.length === 0) {
            contentToEdit.stats = [
              { id: '1', value: '100+', label: 'Проектов реализовано', icon: 'target' },
              { id: '2', value: '50+', label: 'Довольных клиентов', icon: 'users' },
              { id: '3', value: '24/7', label: 'Техническая поддержка', icon: 'zap' },
              { id: '4', value: '5+', label: 'Лет на рынке', icon: 'trendingup' }
            ];
          }
          if (!contentToEdit.values || !Array.isArray(contentToEdit.values) || contentToEdit.values.length === 0) {
            contentToEdit.values = [
              { id: '1', title: 'Технологическая экспертиза', description: 'Мы владеем современными технологиями и всегда следим за инновациями в IT-индустрии', icon: 'code2', color: 'from-red-600 to-pink-600' },
              { id: '2', title: 'Качество превыше всего', description: 'Каждый проект проходит строгий контроль качества и соответствует лучшим практикам', icon: 'award', color: 'from-purple-600 to-red-600' },
              { id: '3', title: 'Глобальный подход', description: 'Работаем с клиентами по всему миру, создавая решения мирового уровня', icon: 'globe', color: 'from-red-600 to-orange-600' },
              { id: '4', title: 'Инновации и творчество', description: 'Каждое решение - это уникальный продукт, созданный с творческим подходом', icon: 'sparkles', color: 'from-red-600 to-red-800' }
            ];
          }
          if (!contentToEdit.technologies || !Array.isArray(contentToEdit.technologies) || contentToEdit.technologies.length === 0) {
            contentToEdit.technologies = [
              'React', 'Node.js', 'Python', 'TypeScript', 'Docker', 'Kubernetes',
              'AWS', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
              'Microservices', 'CI/CD', 'Machine Learning', 'Blockchain'
            ];
          }
        }

        // Убеждаемся что все нужные поля существуют для главной страницы
        if (editingPageId === 'home') {
          if (!contentToEdit.hero) contentToEdit.hero = {};
          // Заполняем дефолтными значениями если пусто
          if (!contentToEdit.hero.badge) contentToEdit.hero.badge = 'Информационные технологии будущего';
          if (!contentToEdit.hero.title) contentToEdit.hero.title = 'Информационные решения\nдля вашего бизнеса';
          if (!contentToEdit.hero.subtitle) contentToEdit.hero.subtitle = 'для вашего бизнеса';
          if (!contentToEdit.hero.description) contentToEdit.hero.description = 'IT-компания, которая помогает решать проблемы через современные технологии. Мы можем разработать почти всё что угодно.';
          if (!contentToEdit.hero.ctaText) contentToEdit.hero.ctaText = 'Начать проект';
          if (!contentToEdit.hero.ctaLink) contentToEdit.hero.ctaLink = '/custom';
          if (!contentToEdit.features || contentToEdit.features.length === 0) {
            contentToEdit.features = [
              { id: '1', title: 'Готовые решения', description: 'Библиотека проверенных шаблонов для быстрого старта вашего проекта', link: '/templates', icon: 'code' },
              { id: '2', title: 'Быстрое внедрение', description: 'От идеи до запуска за 2-4 недели благодаря автоматизации', link: '/templates', icon: 'zap' },
              { id: '3', title: 'Полная безопасность', description: 'Современные протоколы шифрования и защита данных на всех уровнях', link: '/about', icon: 'shield' }
            ];
          }
          if (!contentToEdit.projects || contentToEdit.projects.length === 0) {
            contentToEdit.projects = [
              { id: '1', title: 'E-commerce платформа', category: 'Интернет-магазин', image: 'https://images.unsplash.com/photo-1592773307163-962d25055c3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzY4MzMwOTE3fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Полнофункциональная платформа с интеграцией платежей и аналитикой', tech: ['React', 'Node.js', 'PostgreSQL'] },
              { id: '2', title: 'Аналитическая dashboard', category: 'Бизнес-аналитика', image: 'https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBwbGF0Zm9ybXxlbnwxfHx8fDE3NjgzMDgwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Визуализация данных в реальном времени для принятия решений', tech: ['Python', 'Django', 'Redis'] },
              { id: '3', title: 'Мобильное приложение', category: 'Mobile Development', image: 'https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY4MzE1OTE2fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Кроссплатформенное приложение для iOS и Android', tech: ['React Native', 'TypeScript'] }
            ];
          }
          if (!contentToEdit.solutions || contentToEdit.solutions.length === 0) {
            contentToEdit.solutions = [
              { id: '1', title: 'CRM интеграция', description: 'Автоматическая синхронизация обращений клиентов из мессенджеров', link: '/templates', icon: 'message-square' },
              { id: '2', title: 'Email-рассылки', description: 'Триггерные рассылки с персонализацией и аналитикой', link: '/templates', icon: 'mail' },
              { id: '3', title: 'Синхронизация данных', description: 'Двусторонняя синхронизация между системами в реальном времени', link: '/templates', icon: 'database' }
            ];
          }
          if (!contentToEdit.capabilities || contentToEdit.capabilities.length === 0) {
            contentToEdit.capabilities = [
              { id: '1', title: 'Data Analytics', description: 'Визуализация и анализ', image: 'https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGdyYXBofGVufDF8fHx8MTc2ODQyNDQxNHww&ixlib=rb-4.1.0&q=80&w=1080', icon: 'boxes' },
              { id: '2', title: 'AI & ML', description: 'Машинное обучение', image: 'https://images.unsplash.com/photo-1675495277087-10598bf7bcd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwbWF0cml4JTIwZGlnaXRhbHxlbnwxfHx8fDE3Njg0MjQ0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080', icon: 'cpu' },
              { id: '3', title: 'Backend API', description: 'Серверные решения', image: 'https://images.unsplash.com/photo-1661669999755-1e5b36d9e9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdGVjaG5vbG9neSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzY4NDI0NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080', icon: 'code' },
              { id: '4', title: '3D визуализация', description: 'Интерактивные модели', image: 'https://images.unsplash.com/photo-1658806283210-6d7330062704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGFic3RyYWN0JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3Njg0MjQ0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080', icon: 'workflow' }
            ];
          }
          if (!contentToEdit.stats || contentToEdit.stats.length === 0) {
            contentToEdit.stats = [
              { id: '1', value: '100+', label: 'Реализованных проектов' },
              { id: '2', value: '50+', label: 'Довольных клиентов' },
              { id: '3', value: '5+', label: 'Лет опыта' },
              { id: '4', value: '24/7', label: 'Техподдержка' }
            ];
          }
        }
        
        setPageContentForm(contentToEdit);
      }
    } else {
      setPageContentForm({});
    }
  }, [editingPageId, pages]);
  
  // Старый useEffect удалён - схемы теперь хранятся прямо в шаблонах!

  // Update settings form when settings change
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Calculate stats from actual data
  const stats = [
    { 
      label: 'Активных шаблонов', 
      value: templates.filter(t => t.status === 'active').length.toString(), 
      icon: GitBranch, 
      color: 'red' 
    },
    { 
      label: 'Страниц контента', 
      value: pages.length.toString(), 
      icon: FileText, 
      color: 'blue' 
    },
    { 
      label: 'Проектов в портфолио', 
      value: websites.length.toString(), 
      icon: Briefcase, 
      color: 'purple' 
    },
    { 
      label: 'Избранных проектов', 
      value: websites.filter(w => w.featured).length.toString(), 
      icon: Sparkles, 
      color: 'green' 
    },
  ];

  const nodeTypes = [
    { type: 'trigger', label: 'Триггер', icon: Zap, color: 'from-yellow-600 to-orange-600' },
    { type: 'process', label: 'Процесс', icon: Settings, color: 'from-blue-600 to-cyan-600' },
    { type: 'api', label: 'API', icon: Database, color: 'from-purple-600 to-pink-600' },
    { type: 'notification', label: 'Уведомление', icon: Mail, color: 'from-green-600 to-emerald-600' },
    { type: 'complete', label: 'Завершение', icon: Check, color: 'from-red-600 to-pink-600' },
  ];

  // Portfolio handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем что это изображение
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения');
      return;
    }

    // Ограничение размера (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setProjectForm({ ...projectForm, screenshot: base64 });
    };
    reader.onerror = () => {
      alert('Ошибка при чтении файла');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProject = () => {
    if (editingProject) {
      updateWebsite(editingProject, projectForm);
    } else {
      const newProject: Omit<Website, 'id'> = {
        name: projectForm.name || '',
        client: projectForm.client || '',
        description: projectForm.description || '',
        url: projectForm.url || '',
        screenshot: projectForm.screenshot || '',
        technologies: projectForm.technologies || [],
        category: projectForm.category || 'E-commerce',
        date: projectForm.date || new Date().toISOString().slice(0, 7),
        featured: projectForm.featured || false,
      };
      addWebsite(newProject);
    }
    setShowProjectForm(false);
    setEditingProject(null);
    setProjectForm({});
  };

  const handleEditProject = (id: string) => {
    const project = websites.find(w => w.id === id);
    if (project) {
      setProjectForm(project);
      setEditingProject(id);
      setShowProjectForm(true);
    }
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот проект?')) {
      deleteWebsite(id);
    }
  };

  // Старая функция удалена - теперь сохранение автоматическое!

  // Старые функции drag&drop удалены - теперь всё в SchemaEditor!

  // Settings handler
  const handleSaveSettings = () => {
    updateSettings(settingsForm);
    alert('Настройки сохранены!');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-red-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`text-${stat.color}-500`} size={32} />
              <span className="text-3xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-zinc-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <Zap className="text-red-500" size={24} />
          Быстрые действия
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}
            className="p-4 bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-lg text-left hover:border-red-500 transition-all"
          >
            <Plus className="text-red-500 mb-2" size={24} />
            <p className="text-white mb-1">Новая схема</p>
            <p className="text-sm text-zinc-400">Создать workflow</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}
            className="p-4 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg text-left hover:border-blue-500 transition-all"
          >
            <FileText className="text-blue-500 mb-2" size={24} />
            <p className="text-white mb-1">Редактировать контент</p>
            <p className="text-sm text-zinc-400">Изменить страницы</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' }}
            className="p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg text-left hover:border-purple-500 transition-all"
          >
            <Upload className="text-purple-500 mb-2" size={24} />
            <p className="text-white mb-1">Загрузить медиа</p>
            <p className="text-sm text-zinc-400">Добавить изображения</p>
          </motion.button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <BarChart className="text-red-500" size={24} />
          Последние изменения
        </h3>
        <div className="space-y-3">
          {[
              { action: `Активных шаблонов: ${templates.filter(t => t.status === 'active').length}`, time: 'Обновлено', user: 'Система' },
              { action: `Проектов в портфолио: ${websites.length}`, time: 'Обновлено', user: 'Система' },
              { action: `Избранных проектов: ${websites.filter(w => w.featured).length}`, time: 'Обновлено', user: 'Система' },
              { action: `Страниц контента: ${pages.length}`, time: 'Обновлено', user: 'Система' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
              <div>
                <p className="text-white">{activity.action}</p>
                <p className="text-sm text-zinc-500">{activity.time}</p>
              </div>
              <span className="text-sm text-zinc-400">{activity.user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSchemas = () => {
    const currentTemplate = templates.find(t => t.id === selectedTemplate);
    
    const handleSchemaChange = (steps: WorkflowStep[]) => {
      if (!selectedTemplate) return;
      
      // Обновляем шаблон с новой workflow
      updateTemplate(selectedTemplate, { workflow: steps });
    };
    
    return (
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar with templates */}
        <div className="col-span-3 space-y-4">
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Layers className="text-red-500" size={20} />
              Шаблоны
            </h3>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    selectedTemplate === template.id
                      ? 'bg-red-600/20 border-red-500'
                      : 'bg-zinc-800/30 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <p className="text-white text-sm mb-1">{template.title}</p>
                  <p className="text-xs text-zinc-500">
                    {template.workflow?.length || 0} узлов
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="col-span-9">
          {!selectedTemplate ? (
            <div className="h-full flex items-center justify-center bg-zinc-900/30 border-2 border-zinc-800 rounded-xl">
                <div className="text-center">
                <GitBranch size={48} className="mx-auto mb-4 text-zinc-600" />
                <h3 className="text-xl mb-2">Выберите шаблон</h3>
                <p className="text-zinc-500">Выберите шаблон из списка слева для редактирования схемы</p>
                </div>
              </div>
          ) : (
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{currentTemplate?.title}</h2>
                <p className="text-zinc-400">{currentTemplate?.description}</p>
          </div>

              <SchemaEditor
                steps={currentTemplate?.workflow || []}
                onChange={handleSchemaChange}
                />
              </div>
          )}
      </div>
    </div>
  );
  };

  // Старый renderSchemasOld удалён - теперь используем renderSchemas() с SchemaEditor!

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Управление контентом</h2>
          <p className="text-zinc-400">Редактируйте текст, изображения и настройки страниц</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2">
          <Plus size={18} />
          Новая страница
        </button>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-2 gap-6">
        {pages.map((page) => (
          <motion.div
            key={page.id}
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}
            className={`p-6 bg-zinc-900/50 border rounded-xl transition-all ${
              editingPageId === page.id 
                ? 'border-red-500 shadow-lg shadow-red-500/20' 
                : 'border-zinc-800 hover:border-red-500/50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
                  <FileText size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-white mb-1">{page.name}</h3>
                  <p className="text-sm text-zinc-500">{page.sections} разделов</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
                Опубликовано
              </span>
            </div>

            <p className="text-sm text-zinc-400 mb-4">Обновлено: {page.updated}</p>

            <div className="flex gap-2">
              <button 
                onClick={() => setEditingPageId(editingPageId === page.id ? null : page.id)}
                className={`flex-1 px-4 py-2 border rounded-lg transition-all flex items-center justify-center gap-2 ${
                  editingPageId === page.id
                    ? 'bg-red-600/20 border-red-500 text-red-400'
                    : 'bg-zinc-800 border-zinc-700 hover:border-red-500'
                }`}
              >
                <Edit size={16} />
                {editingPageId === page.id ? 'Закрыть редактор' : 'Редактировать'}
              </button>
              <a
                href={`/${page.id === 'home' ? '' : page.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-all"
              >
                <Eye size={16} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Editor */}
      <AnimatePresence>
        {editingPageId && (() => {
          const editingPage = pages.find(p => p.id === editingPageId);
          if (!editingPage) return null;
          
          // Используем данные из pageContentForm, которые уже загружены с дефолтными значениями в useEffect
          const hero = pageContentForm.hero || {};
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl"
            >
        <h3 className="text-xl mb-6 flex items-center gap-2">
          <Code className="text-red-500" size={24} />
                Редактор контента: {editingPage.name}
        </h3>

              <div className="space-y-6">
                {/* Hero Section Editor */}
                <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                  <h4 className="text-lg mb-4 flex items-center gap-2">
                    <Sparkles className="text-red-500" size={20} />
                    Hero секция (главный блок страницы)
                  </h4>

        <div className="space-y-4">
                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                        <Tag size={16} />
                        Бейдж (маленький текст над заголовком)
                      </label>
                      <input
                        type="text"
                        placeholder="Например: Информационные технологии будущего"
                        value={hero.badge || ''}
                        onChange={(e) => setPageContentForm({
                          ...pageContentForm,
                          hero: { ...hero, badge: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                <Type size={16} />
                          Основной заголовок (первая строка)
              </label>
              <input
                type="text"
                          placeholder="Информационные решения"
                          value={hero.title?.split('\n')[0] || ''}
                          onChange={(e) => {
                            const secondLine = hero.title?.split('\n')[1] || '';
                            setPageContentForm({
                              ...pageContentForm,
                              hero: { 
                                ...hero, 
                                title: secondLine 
                                  ? `${e.target.value}\n${secondLine}`
                                  : e.target.value 
                              }
                            });
                          }}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                          <Type size={16} />
                          Подзаголовок (вторая строка, акцент)
              </label>
                        <input
                          type="text"
                          placeholder="для вашего бизнеса"
                          value={hero.title?.split('\n')[1] || hero.subtitle || ''}
                          onChange={(e) => {
                            const firstLine = hero.title?.split('\n')[0] || '';
                            setPageContentForm({
                              ...pageContentForm,
                              hero: { 
                                ...hero, 
                                title: firstLine 
                                  ? `${firstLine}\n${e.target.value}`
                                  : e.target.value,
                                subtitle: e.target.value
                              }
                            });
                          }}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                        />
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
              <FileText size={16} />
                        Описание под заголовком
            </label>
            <textarea
                        placeholder="IT-компания, которая помогает решать проблемы через современные технологии..."
                        rows={3}
                        value={hero.description || ''}
                        onChange={(e) => setPageContentForm({
                          ...pageContentForm,
                          hero: { ...hero, description: e.target.value }
                        })}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

                    <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                          <ArrowRight size={16} />
                          Текст кнопки CTA
            </label>
                        <input
                          type="text"
                          placeholder="Начать проект"
                          value={hero.ctaText || ''}
                          onChange={(e) => setPageContentForm({
                            ...pageContentForm,
                            hero: { ...hero, ctaText: e.target.value }
                          })}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                          <Globe size={16} />
                          Ссылка кнопки CTA
                        </label>
                        <input
                          type="text"
                          placeholder="/custom или /templates"
                          value={hero.ctaLink || ''}
                          onChange={(e) => setPageContentForm({
                            ...pageContentForm,
                            hero: { ...hero, ctaLink: e.target.value }
                          })}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>
            </div>
          </div>

                {/* Preview */}
                <div className="p-4 bg-zinc-800/30 border border-zinc-700 rounded-lg">
                  <h4 className="text-sm text-zinc-500 mb-3 flex items-center gap-2">
                    <Eye size={16} />
                    Предпросмотр Hero секции
                  </h4>
                  <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
                    {hero.badge && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-500/30 rounded-full mb-4">
                        <Sparkles size={14} className="text-red-500" />
                        <span className="text-red-400 text-sm">{hero.badge}</span>
                      </div>
                    )}
                    <h2 className="text-4xl mb-4 text-white">
                      {hero.title?.split('\n')[0] || 'Заголовок'}
                      {hero.subtitle || hero.title?.split('\n')[1] ? (
                        <><br /><span className="text-red-500">{hero.subtitle || hero.title?.split('\n')[1]}</span></>
                      ) : null}
                    </h2>
                    {hero.description && (
                      <p className="text-zinc-400 mb-6">{hero.description}</p>
                    )}
                    {hero.ctaText && (
                      <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all">
                        {hero.ctaText}
                      </button>
                    )}
                  </div>
                </div>

                {/* Features Editor - только для главной */}
                {editingPageId === 'home' && (
                  <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg flex items-center gap-2">
                        <Zap className="text-red-500" size={20} />
                        Особенности (Features)
                      </h4>
                      <button
                        onClick={() => {
                          const newFeatures = [...(pageContentForm.features || []), {
                            id: Date.now().toString(),
                            title: 'Новая особенность',
                            description: 'Описание',
                            link: '/templates',
                            icon: 'code'
                          }];
                          setPageContentForm({ ...pageContentForm, features: newFeatures });
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
                      >
                        <Plus size={14} />
                        Добавить
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(pageContentForm.features || []).map((feature: any, idx: number) => (
                        <div key={feature.id || idx} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                              type="text"
                              placeholder="Заголовок"
                              value={feature.title || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.features || [])];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setPageContentForm({ ...pageContentForm, features: updated });
                              }}
                              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Иконка (code, zap, shield...)"
                              value={feature.icon || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.features || [])];
                                updated[idx] = { ...updated[idx], icon: e.target.value };
                                setPageContentForm({ ...pageContentForm, features: updated });
                              }}
                              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <textarea
                            placeholder="Описание"
                            value={feature.description || ''}
                            onChange={(e) => {
                              const updated = [...(pageContentForm.features || [])];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setPageContentForm({ ...pageContentForm, features: updated });
                            }}
                            rows={2}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm mb-3 focus:border-red-500 focus:outline-none resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Ссылка (/templates)"
                              value={feature.link || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.features || [])];
                                updated[idx] = { ...updated[idx], link: e.target.value };
                                setPageContentForm({ ...pageContentForm, features: updated });
                              }}
                              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const updated = (pageContentForm.features || []).filter((_: any, i: number) => i !== idx);
                                setPageContentForm({ ...pageContentForm, features: updated });
                              }}
                              className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded border border-red-600/30"
                            >
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats Editor - только для главной */}
                {editingPageId === 'home' && (
                  <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg flex items-center gap-2">
                        <BarChart className="text-red-500" size={20} />
                        Статистика (Stats)
                      </h4>
                      <button
                        onClick={() => {
                          const newStats = [...(pageContentForm.stats || []), {
                            id: Date.now().toString(),
                            value: '0',
                            label: 'Новая статистика'
                          }];
                          setPageContentForm({ ...pageContentForm, stats: newStats });
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
                      >
                        <Plus size={14} />
                        Добавить
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {(pageContentForm.stats || []).map((stat: any, idx: number) => (
                        <div key={stat.id || idx} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Значение (100+)"
                              value={stat.value || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.stats || [])];
                                updated[idx] = { ...updated[idx], value: e.target.value };
                                setPageContentForm({ ...pageContentForm, stats: updated });
                              }}
                              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Подпись"
                              value={stat.label || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.stats || [])];
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                setPageContentForm({ ...pageContentForm, stats: updated });
                              }}
                              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const updated = (pageContentForm.stats || []).filter((_: any, i: number) => i !== idx);
                                setPageContentForm({ ...pageContentForm, stats: updated });
                              }}
                              className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded border border-red-600/30"
                            >
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Editor - только для главной */}
                {editingPageId === 'home' && (
                  <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg flex items-center gap-2">
                        <Briefcase className="text-red-500" size={20} />
                        Проекты (Projects)
                      </h4>
                      <button
                        onClick={() => {
                          const newProjects = [...(pageContentForm.projects || []), {
                            id: Date.now().toString(),
                            title: 'Новый проект',
                            category: 'Категория',
                            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
                            description: 'Описание проекта',
                            tech: []
                          }];
                          setPageContentForm({ ...pageContentForm, projects: newProjects });
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
                      >
                        <Plus size={14} />
                        Добавить
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(pageContentForm.projects || []).map((project: any, idx: number) => (
                        <div key={project.id || idx} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                              type="text"
                              placeholder="Название проекта"
                              value={project.title || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.projects || [])];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setPageContentForm({ ...pageContentForm, projects: updated });
                              }}
                              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Категория"
                              value={project.category || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.projects || [])];
                                updated[idx] = { ...updated[idx], category: e.target.value };
                                setPageContentForm({ ...pageContentForm, projects: updated });
                              }}
                              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="URL изображения"
                            value={project.image || ''}
                            onChange={(e) => {
                              const updated = [...(pageContentForm.projects || [])];
                              updated[idx] = { ...updated[idx], image: e.target.value };
                              setPageContentForm({ ...pageContentForm, projects: updated });
                            }}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm mb-3 focus:border-red-500 focus:outline-none"
                          />
                          <textarea
                            placeholder="Описание проекта"
                            value={project.description || ''}
                            onChange={(e) => {
                              const updated = [...(pageContentForm.projects || [])];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setPageContentForm({ ...pageContentForm, projects: updated });
                            }}
                            rows={2}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm mb-3 focus:border-red-500 focus:outline-none resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Технологии (через запятую)"
                              value={(project.tech || []).join(', ')}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.projects || [])];
                                updated[idx] = { ...updated[idx], tech: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) };
                                setPageContentForm({ ...pageContentForm, projects: updated });
                              }}
                              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const updated = (pageContentForm.projects || []).filter((_: any, i: number) => i !== idx);
                                setPageContentForm({ ...pageContentForm, projects: updated });
                              }}
                              className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded border border-red-600/30"
                            >
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Solutions Editor - только для главной */}
                {editingPageId === 'home' && (
                  <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg flex items-center gap-2">
                        <MessageSquare className="text-red-500" size={20} />
                        Решения (Solutions)
                      </h4>
                      <button
                        onClick={() => {
                          const newSolutions = [...(pageContentForm.solutions || []), {
                            id: Date.now().toString(),
                            title: 'Новое решение',
                            description: 'Описание',
                            link: '/templates',
                            icon: 'message-square'
                          }];
                          setPageContentForm({ ...pageContentForm, solutions: newSolutions });
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
                      >
                        <Plus size={14} />
                        Добавить
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(pageContentForm.solutions || []).map((solution: any, idx: number) => (
                        <div key={solution.id || idx} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                              type="text"
                              placeholder="Название"
                              value={solution.title || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.solutions || [])];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setPageContentForm({ ...pageContentForm, solutions: updated });
                              }}
                              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Иконка"
                              value={solution.icon || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.solutions || [])];
                                updated[idx] = { ...updated[idx], icon: e.target.value };
                                setPageContentForm({ ...pageContentForm, solutions: updated });
                              }}
                              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <textarea
                            placeholder="Описание"
                            value={solution.description || ''}
                            onChange={(e) => {
                              const updated = [...(pageContentForm.solutions || [])];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setPageContentForm({ ...pageContentForm, solutions: updated });
                            }}
                            rows={2}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm mb-3 focus:border-red-500 focus:outline-none resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Ссылка"
                              value={solution.link || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.solutions || [])];
                                updated[idx] = { ...updated[idx], link: e.target.value };
                                setPageContentForm({ ...pageContentForm, solutions: updated });
                              }}
                              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const updated = (pageContentForm.solutions || []).filter((_: any, i: number) => i !== idx);
                                setPageContentForm({ ...pageContentForm, solutions: updated });
                              }}
                              className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded border border-red-600/30"
                            >
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Capabilities Editor - только для главной */}
                {editingPageId === 'home' && (
                  <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg flex items-center gap-2">
                        <Layers className="text-red-500" size={20} />
                        Возможности (Capabilities)
                      </h4>
                      <button
                        onClick={() => {
                          const newCapabilities = [...(pageContentForm.capabilities || []), {
                            id: Date.now().toString(),
                            title: 'Новая возможность',
                            description: 'Описание',
                            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
                            icon: 'code'
                          }];
                          setPageContentForm({ ...pageContentForm, capabilities: newCapabilities });
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
                      >
                        <Plus size={14} />
                        Добавить
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(pageContentForm.capabilities || []).map((capability: any, idx: number) => (
                        <div key={capability.id || idx} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                              type="text"
                              placeholder="Название"
                              value={capability.title || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.capabilities || [])];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setPageContentForm({ ...pageContentForm, capabilities: updated });
                              }}
                              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Иконка"
                              value={capability.icon || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.capabilities || [])];
                                updated[idx] = { ...updated[idx], icon: e.target.value };
                                setPageContentForm({ ...pageContentForm, capabilities: updated });
                              }}
                              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="URL изображения"
                            value={capability.image || ''}
                            onChange={(e) => {
                              const updated = [...(pageContentForm.capabilities || [])];
                              updated[idx] = { ...updated[idx], image: e.target.value };
                              setPageContentForm({ ...pageContentForm, capabilities: updated });
                            }}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm mb-3 focus:border-red-500 focus:outline-none"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Описание"
                              value={capability.description || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.capabilities || [])];
                                updated[idx] = { ...updated[idx], description: e.target.value };
                                setPageContentForm({ ...pageContentForm, capabilities: updated });
                              }}
                              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const updated = (pageContentForm.capabilities || []).filter((_: any, i: number) => i !== idx);
                                setPageContentForm({ ...pageContentForm, capabilities: updated });
                              }}
                              className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded border border-red-600/30"
                            >
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats, Values, Technologies Editors - для About */}
                {editingPageId === 'about' && (
                  <>
                    {/* Stats Editor для About */}
                    <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg flex items-center gap-2">
                          <BarChart className="text-red-500" size={20} />
                          Статистика (Stats)
                        </h4>
                        <button
                          onClick={() => {
                            const newStats = [...(pageContentForm.stats || []), {
                              id: Date.now().toString(),
                              value: '0',
                              label: 'Новая статистика',
                              icon: 'target'
                            }];
                            setPageContentForm({ ...pageContentForm, stats: newStats });
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
                        >
                          <Plus size={14} />
                          Добавить
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {(pageContentForm.stats || []).map((stat: any, idx: number) => (
                          <div key={stat.id || idx} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Значение (100+)"
                                value={stat.value || ''}
                                onChange={(e) => {
                                  const updated = [...(pageContentForm.stats || [])];
                                  updated[idx] = { ...updated[idx], value: e.target.value };
                                  setPageContentForm({ ...pageContentForm, stats: updated });
                                }}
                                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  const updated = (pageContentForm.stats || []).filter((_: any, i: number) => i !== idx);
                                  setPageContentForm({ ...pageContentForm, stats: updated });
                                }}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded border border-red-600/30"
                              >
                                <Trash2 size={14} className="text-red-400" />
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Подпись"
                              value={stat.label || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.stats || [])];
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                setPageContentForm({ ...pageContentForm, stats: updated });
                              }}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm mb-2 focus:border-red-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Иконка (target, users, zap...)"
                              value={stat.icon || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.stats || [])];
                                updated[idx] = { ...updated[idx], icon: e.target.value };
                                setPageContentForm({ ...pageContentForm, stats: updated });
                              }}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Values Editor для About */}
                    <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg flex items-center gap-2">
                          <Award className="text-red-500" size={20} />
                          Ценности (Values)
                        </h4>
                        <button
                          onClick={() => {
                            const newValues = [...(pageContentForm.values || []), {
                              id: Date.now().toString(),
                              title: 'Новая ценность',
                              description: 'Описание',
                              icon: 'code2',
                              color: 'from-red-600 to-pink-600'
                            }];
                            setPageContentForm({ ...pageContentForm, values: newValues });
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
                        >
                          <Plus size={14} />
                          Добавить
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(pageContentForm.values || []).map((value: any, idx: number) => (
                          <div key={value.id || idx} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <input
                                type="text"
                                placeholder="Заголовок"
                                value={value.title || ''}
                                onChange={(e) => {
                                  const updated = [...(pageContentForm.values || [])];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  setPageContentForm({ ...pageContentForm, values: updated });
                                }}
                                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Иконка (code2, award, globe...)"
                                value={value.icon || ''}
                                onChange={(e) => {
                                  const updated = [...(pageContentForm.values || [])];
                                  updated[idx] = { ...updated[idx], icon: e.target.value };
                                  setPageContentForm({ ...pageContentForm, values: updated });
                                }}
                                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                              />
                            </div>
                            <textarea
                              placeholder="Описание"
                              value={value.description || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.values || [])];
                                updated[idx] = { ...updated[idx], description: e.target.value };
                                setPageContentForm({ ...pageContentForm, values: updated });
                              }}
                              rows={2}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm mb-3 focus:border-red-500 focus:outline-none resize-none"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Градиент (from-red-600 to-pink-600)"
                                value={value.color || ''}
                                onChange={(e) => {
                                  const updated = [...(pageContentForm.values || [])];
                                  updated[idx] = { ...updated[idx], color: e.target.value };
                                  setPageContentForm({ ...pageContentForm, values: updated });
                                }}
                                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  const updated = (pageContentForm.values || []).filter((_: any, i: number) => i !== idx);
                                  setPageContentForm({ ...pageContentForm, values: updated });
                                }}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded border border-red-600/30"
                              >
                                <Trash2 size={14} className="text-red-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies Editor для About */}
                    <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg flex items-center gap-2">
                          <Code className="text-red-500" size={20} />
                          Технологии (Technologies)
                        </h4>
                        <button
                          onClick={() => {
                            const newTechs = [...(pageContentForm.technologies || []), 'Новая технология'];
                            setPageContentForm({ ...pageContentForm, technologies: newTechs });
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
                        >
                          <Plus size={14} />
                          Добавить
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(pageContentForm.technologies || []).map((tech: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                            <input
                              type="text"
                              value={tech}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.technologies || [])];
                                updated[idx] = e.target.value;
                                setPageContentForm({ ...pageContentForm, technologies: updated });
                              }}
                              className="bg-transparent border-none text-white text-sm focus:outline-none w-32"
                            />
                            <button
                              onClick={() => {
                                const updated = (pageContentForm.technologies || []).filter((_: string, i: number) => i !== idx);
                                setPageContentForm({ ...pageContentForm, technologies: updated });
                              }}
                              className="p-1 bg-red-600/20 hover:bg-red-600/30 rounded"
                            >
                              <X size={12} className="text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* WorkflowSteps, Advantages, CaseStudies Editors - для Custom */}
                {editingPageId === 'custom' && (
                  <>
                    {/* Workflow Steps Editor для Custom */}
                    <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg flex items-center gap-2">
                          <GitBranch className="text-red-500" size={20} />
                          Шаги процесса (Workflow Steps)
                        </h4>
                        <button
                          onClick={() => {
                            const newSteps = [...(pageContentForm.workflowSteps || []), {
                              id: Date.now().toString(),
                              title: 'Новый шаг',
                              description: 'Описание',
                              duration: '1 день',
                              details: ['Деталь 1'],
                              icon: 'code'
                            }];
                            setPageContentForm({ ...pageContentForm, workflowSteps: newSteps });
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
                        >
                          <Plus size={14} />
                          Добавить
                        </button>
                      </div>
                      <div className="space-y-4">
                        {(pageContentForm.workflowSteps || []).map((step: any, idx: number) => (
                          <div key={step.id || idx} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <input
                                type="text"
                                placeholder="Название шага"
                                value={step.title || ''}
                                onChange={(e) => {
                                  const updated = [...(pageContentForm.workflowSteps || [])];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  setPageContentForm({ ...pageContentForm, workflowSteps: updated });
                                }}
                                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                              />
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Длительность (1-3 дня)"
                                  value={step.duration || ''}
                                  onChange={(e) => {
                                    const updated = [...(pageContentForm.workflowSteps || [])];
                                    updated[idx] = { ...updated[idx], duration: e.target.value };
                                    setPageContentForm({ ...pageContentForm, workflowSteps: updated });
                                  }}
                                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="Иконка"
                                  value={step.icon || ''}
                                  onChange={(e) => {
                                    const updated = [...(pageContentForm.workflowSteps || [])];
                                    updated[idx] = { ...updated[idx], icon: e.target.value };
                                    setPageContentForm({ ...pageContentForm, workflowSteps: updated });
                                  }}
                                  className="w-24 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                                />
                              </div>
                            </div>
                            <textarea
                              placeholder="Описание шага"
                              value={step.description || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.workflowSteps || [])];
                                updated[idx] = { ...updated[idx], description: e.target.value };
                                setPageContentForm({ ...pageContentForm, workflowSteps: updated });
                              }}
                              rows={2}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm mb-3 focus:border-red-500 focus:outline-none resize-none"
                            />
                            <div className="mb-3">
                              <label className="text-xs text-zinc-500 mb-2 block">Детали (через запятую)</label>
                              <input
                                type="text"
                                placeholder="Деталь 1, Деталь 2, Деталь 3"
                                value={(step.details || []).join(', ')}
                                onChange={(e) => {
                                  const updated = [...(pageContentForm.workflowSteps || [])];
                                  updated[idx] = { ...updated[idx], details: e.target.value.split(',').map((d: string) => d.trim()).filter(Boolean) };
                                  setPageContentForm({ ...pageContentForm, workflowSteps: updated });
                                }}
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const updated = (pageContentForm.workflowSteps || []).filter((_: any, i: number) => i !== idx);
                                setPageContentForm({ ...pageContentForm, workflowSteps: updated });
                              }}
                              className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded border border-red-600/30"
                            >
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Advantages Editor для Custom */}
                    <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg flex items-center gap-2">
                          <Check className="text-red-500" size={20} />
                          Преимущества (Advantages)
                        </h4>
                        <button
                          onClick={() => {
                            const newAdvantages = [...(pageContentForm.advantages || []), {
                              id: Date.now().toString(),
                              title: 'Новое преимущество',
                              description: 'Описание',
                              icon: 'layers'
                            }];
                            setPageContentForm({ ...pageContentForm, advantages: newAdvantages });
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
                        >
                          <Plus size={14} />
                          Добавить
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(pageContentForm.advantages || []).map((advantage: any, idx: number) => (
                          <div key={advantage.id || idx} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <input
                                type="text"
                                placeholder="Заголовок"
                                value={advantage.title || ''}
                                onChange={(e) => {
                                  const updated = [...(pageContentForm.advantages || [])];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  setPageContentForm({ ...pageContentForm, advantages: updated });
                                }}
                                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Иконка (layers, zap...)"
                                value={advantage.icon || ''}
                                onChange={(e) => {
                                  const updated = [...(pageContentForm.advantages || [])];
                                  updated[idx] = { ...updated[idx], icon: e.target.value };
                                  setPageContentForm({ ...pageContentForm, advantages: updated });
                                }}
                                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <textarea
                                placeholder="Описание"
                                value={advantage.description || ''}
                                onChange={(e) => {
                                  const updated = [...(pageContentForm.advantages || [])];
                                  updated[idx] = { ...updated[idx], description: e.target.value };
                                  setPageContentForm({ ...pageContentForm, advantages: updated });
                                }}
                                rows={2}
                                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none resize-none"
                              />
                              <button
                                onClick={() => {
                                  const updated = (pageContentForm.advantages || []).filter((_: any, i: number) => i !== idx);
                                  setPageContentForm({ ...pageContentForm, advantages: updated });
                                }}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded border border-red-600/30"
                              >
                                <Trash2 size={14} className="text-red-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Case Studies Editor для Custom */}
                    <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg flex items-center gap-2">
                          <Briefcase className="text-red-500" size={20} />
                          Кейсы (Case Studies)
                        </h4>
                        <button
                          onClick={() => {
                            const newCaseStudies = [...(pageContentForm.caseStudies || []), {
                              id: Date.now().toString(),
                              title: 'Новый кейс',
                              description: 'Описание кейса',
                              tech: []
                            }];
                            setPageContentForm({ ...pageContentForm, caseStudies: newCaseStudies });
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
                        >
                          <Plus size={14} />
                          Добавить
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(pageContentForm.caseStudies || []).map((study: any, idx: number) => (
                          <div key={study.id || idx} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                            <input
                              type="text"
                              placeholder="Название кейса"
                              value={study.title || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.caseStudies || [])];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setPageContentForm({ ...pageContentForm, caseStudies: updated });
                              }}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm mb-3 focus:border-red-500 focus:outline-none"
                            />
                            <textarea
                              placeholder="Описание кейса"
                              value={study.description || ''}
                              onChange={(e) => {
                                const updated = [...(pageContentForm.caseStudies || [])];
                                updated[idx] = { ...updated[idx], description: e.target.value };
                                setPageContentForm({ ...pageContentForm, caseStudies: updated });
                              }}
                              rows={3}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm mb-3 focus:border-red-500 focus:outline-none resize-none"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Технологии (через запятую)"
                                value={(study.tech || []).join(', ')}
                                onChange={(e) => {
                                  const updated = [...(pageContentForm.caseStudies || [])];
                                  updated[idx] = { ...updated[idx], tech: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) };
                                  setPageContentForm({ ...pageContentForm, caseStudies: updated });
                                }}
                                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:border-red-500 focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  const updated = (pageContentForm.caseStudies || []).filter((_: any, i: number) => i !== idx);
                                  setPageContentForm({ ...pageContentForm, caseStudies: updated });
                                }}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded border border-red-600/30"
                              >
                                <Trash2 size={14} className="text-red-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Save Button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button 
                    onClick={() => {
                      setEditingPageId(null);
                      setPageContentForm({});
                    }}
                    className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-all"
                  >
              Отмена
            </button>
                  <button 
                    onClick={() => {
                      updatePage(editingPageId, {
                        content: pageContentForm,
                        updated: 'только что'
                      });
                      alert(`Контент страницы "${editingPage.name}" сохранён!`);
                      setEditingPageId(null);
                      setPageContentForm({});
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2"
                  >
              <Save size={18} />
              Сохранить изменения
            </button>
          </div>
        </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
      
      {!editingPageId && (
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="text-center py-8">
            <FileText className="mx-auto mb-4 text-zinc-600" size={48} />
            <p className="text-zinc-500 text-lg mb-2">Редактор контента</p>
            <p className="text-zinc-600 text-sm">Выберите страницу для редактирования выше</p>
      </div>
        </div>
      )}
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Шаблоны решений</h2>
          <p className="text-zinc-400">Управление готовыми workflow шаблонами</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2">
          <Plus size={18} />
          Новый шаблон
        </button>
      </div>

      <div className="grid gap-6">
        {filteredTemplates.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-red-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
                  <GitBranch size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-white mb-1">{template.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span>{template.workflow.length} узлов</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${template.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                      {template.status === 'active' ? 'Активен' : 'Неактивен'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedTemplate(template.id)}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-blue-500 transition-all flex items-center gap-2"
                >
                  <Eye size={16} />
                  Просмотр
                </button>
                <button 
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setActiveSection('schemas');
                  }}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-red-500 transition-all flex items-center gap-2"
                >
                  <Edit size={16} />
                  Редактировать
                </button>
                <button 
                  onClick={() => duplicateTemplate(template.id)}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-purple-500 transition-all flex items-center gap-2"
                >
                  <Copy size={16} />
                  Дублировать
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Вы уверены, что хотите удалить этот шаблон?')) {
                      deleteTemplate(template.id);
                    }
                  }}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-red-600 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Портфолио проектов</h2>
          <p className="text-zinc-400">Управление кейсами на странице портфолио</p>
        </div>
        <button 
          onClick={() => setShowProjectForm(!showProjectForm)}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Новый проект
        </button>
      </div>

      {/* Project Form */}
      <AnimatePresence>
        {showProjectForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl"
          >
            <h3 className="text-xl mb-6 flex items-center gap-2">
              <Code className="text-red-500" size={24} />
              {editingProject ? 'Редактирование проекта' : 'Новый проект'}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                    <Type size={16} />
                    Название проекта
                  </label>
                  <input
                    type="text"
                    placeholder="E-commerce платформа..."
                    value={projectForm.name || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                    <Users size={16} />
                    Клиент
                  </label>
                  <input
                    type="text"
                    placeholder="Fashion House"
                    value={projectForm.client || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                  <FileText size={16} />
                  Описание проекта
                </label>
                <textarea
                  placeholder="Полноценный интернет-магазин с интеграцией платежных систем..."
                  rows={4}
                  value={projectForm.description || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                    <Tag size={16} />
                    Категория
                  </label>
                  <select 
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                    value={projectForm.category || 'E-commerce'}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  >
                    <option>E-commerce</option>
                    <option>Dashboard</option>
                    <option>EdTech</option>
                    <option>Management</option>
                    <option>Marketplace</option>
                    <option>Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                    <Calendar size={16} />
                    Дата (YYYY-MM)
                  </label>
                  <input
                    type="text"
                    placeholder="2025-12"
                    value={projectForm.date || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                    <Sparkles size={16} />
                    Избранное
                  </label>
                  <div className="flex items-center h-[52px]">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={projectForm.featured || false}
                        onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:bg-red-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                  <Code size={16} />
                  Технологии (через запятую)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, PostgreSQL, 1C Integration, Stripe"
                  value={projectForm.technologies?.join(', ') || ''}
                  onChange={(e) => setProjectForm({ 
                    ...projectForm, 
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                  })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Страниц</label>
                  <input
                    type="number"
                    placeholder="24"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Компонентов</label>
                  <input
                    type="number"
                    placeholder="67"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Интеграций</label>
                  <input
                    type="number"
                    placeholder="8"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                  <Image size={16} />
                  Скриншот сайта
                </label>
                
                {/* Превью изображения */}
                {projectForm.screenshot && (
                  <div className="mb-3">
                    <img 
                      src={projectForm.screenshot} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border border-zinc-700"
                    />
                  </div>
                )}

                {/* Кнопка загрузки файла */}
                <label className="block mb-2">
                  <div className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-red-500 cursor-pointer transition-all text-center text-white">
                    <Upload size={20} className="inline-block mr-2" />
                    {projectForm.screenshot ? 'Изменить изображение' : 'Загрузить изображение'}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Или ввести URL */}
                <div className="mt-3">
                  <p className="text-xs text-zinc-500 mb-2">Или введите URL изображения:</p>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={projectForm.screenshot?.startsWith('http') ? projectForm.screenshot : ''}
                    onChange={(e) => setProjectForm({ ...projectForm, screenshot: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-2 block flex items-center gap-2">
                  <ExternalLink size={16} />
                  URL сайта
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={projectForm.url || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  onClick={() => {
                    setShowProjectForm(false);
                    setEditingProject(null);
                    setProjectForm({});
                  }}
                  className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-all"
                >
                  Отмена
                </button>
                <button 
                  onClick={handleSaveProject}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2"
                >
                  <Save size={18} />
                  {editingProject ? 'Сохранить изменения' : 'Создать проект'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      <div className="grid gap-6">
        {filteredWebsites.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-red-500/50 transition-all"
          >
            <div className="flex gap-6">
              {/* Project Image */}
              <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                <img 
                  src={project.screenshot} 
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Project Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl text-white">{project.name}</h3>
                      {project.featured && (
                        <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full text-xs text-yellow-500 flex items-center gap-1">
                          <Sparkles size={12} />
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {project.client}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Tag size={14} />
                        {project.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {project.date}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-400 text-sm mb-3">{project.description}</p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-zinc-800/50 border border-zinc-700 rounded text-xs text-zinc-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-blue-500 transition-all flex items-center gap-2 text-white"
                >
                  <ExternalLink size={16} />
                  Открыть
                </a>
                <button 
                  onClick={() => handleEditProject(project.id)}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-red-500 transition-all flex items-center gap-2"
                >
                  <Edit size={16} />
                  Редактировать
                </button>
                <button 
                  onClick={() => duplicateWebsite(project.id)}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-purple-500 transition-all flex items-center gap-2"
                >
                  <Copy size={16} />
                  Дублировать
                </button>
                <button 
                  onClick={() => handleDeleteProject(project.id)}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-red-600 transition-all flex items-center gap-2 text-red-400"
                >
                  <Trash2 size={16} />
                  Удалить
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {websites.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-block p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <Briefcase className="text-zinc-600 mb-4 mx-auto" size={48} />
            <p className="text-zinc-500 font-mono">Проектов пока нет</p>
            <p className="text-zinc-600 text-sm font-mono mt-2">
              <span className="text-red-500">$</span> Добавьте первый проект
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Настройки сайта</h2>
        <p className="text-zinc-400">Общие параметры и конфигурация</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Globe className="text-red-500" size={24} />
            Общие настройки
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Название сайта</label>
                <input
                  type="text"
                  value={settingsForm.siteName || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Домен</label>
                <input
                  type="text"
                  value={settingsForm.domain || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, domain: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Описание</label>
              <textarea
                rows={3}
                value={settingsForm.description || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Palette className="text-red-500" size={24} />
            Настройки темы
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Основной цвет</label>
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded-lg border-2 border-white" style={{ backgroundColor: settingsForm.primaryColor || '#EF4444' }} />
                  <input
                    type="text"
                    value={settingsForm.primaryColor || '#EF4444'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Акцентный цвет</label>
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded-lg border-2 border-zinc-700" style={{ backgroundColor: settingsForm.accentColor || '#9333EA' }} />
                  <input
                    type="text"
                    value={settingsForm.accentColor || '#9333EA'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, accentColor: e.target.value })}
                    className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Фоновый цвет</label>
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded-lg border-2 border-zinc-700" style={{ backgroundColor: settingsForm.backgroundColor || '#000000' }} />
                  <input
                    type="text"
                    value={settingsForm.backgroundColor || '#000000'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, backgroundColor: e.target.value })}
                    className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Target className="text-red-500" size={24} />
            SEO настройки
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Meta заголовок</label>
              <input
                type="text"
                placeholder="Заголовок для поисковых систем"
                value={settingsForm.metaTitle || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, metaTitle: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Meta описание</label>
              <textarea
                rows={3}
                placeholder="Описание для поисковых систем"
                value={settingsForm.metaDescription || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, metaDescription: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Ключевые слова</label>
              <input
                type="text"
                placeholder="автоматизация, workflow, IT-решения"
                value={settingsForm.keywords || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, keywords: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={() => setSettingsForm(settings)}
            className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-all"
          >
            Сбросить
          </button>
          <button 
            onClick={handleSaveSettings}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2"
          >
            <Save size={18} />
            Сохранить настройки
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cyberpunk Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 via-black to-purple-950/10" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Animated orbs */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-900/50 border-r border-zinc-800 backdrop-blur-xl p-6">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">
              АТИИ <span className="text-red-500">Admin</span>
            </h1>
            <p className="text-sm text-zinc-500">Панель управления</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'schemas', icon: GitBranch, label: 'Редактор схем' },
              { id: 'content', icon: FileText, label: 'Контент' },
              { id: 'templates', icon: Layers, label: 'Шаблоны' },
              { id: 'portfolio', icon: Briefcase, label: 'Портфолио' },
              { id: 'settings', icon: Settings, label: 'Настройки' },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 5 }}
                onClick={() => setActiveSection(item.id as Section)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/30'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* User Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm">Администратор</p>
                  <p className="text-xs text-zinc-500">admin@atii.ru</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl mb-2">
                  {activeSection === 'dashboard' && 'Dashboard'}
                  {activeSection === 'schemas' && 'Редактор схем'}
                  {activeSection === 'content' && 'Управление контентом'}
                  {activeSection === 'templates' && 'Шаблоны решений'}
                  {activeSection === 'portfolio' && 'Портфолио проектов'}
                  {activeSection === 'settings' && 'Настройки'}
                </h1>
                <p className="text-zinc-500">
                  {new Date().toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                  <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                
                <button
                  onClick={refreshDataFromServer}
                  disabled={isRefreshing}
                  className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg hover:bg-red-600/30 hover:border-red-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Обновить данные с сервера"
                >
                  <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                  {isRefreshing ? 'Обновление...' : 'Обновить'}
                </button>
                
                <button
                  onClick={exportData}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-all flex items-center gap-2"
                  title="Экспорт данных"
                >
                  <Download size={18} />
                  Экспорт
                </button>
                
                <label className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-all flex items-center gap-2 cursor-pointer">
                  <Upload size={18} />
                  Импорт
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === 'dashboard' && renderDashboard()}
                {activeSection === 'schemas' && renderSchemas()}
                {activeSection === 'content' && renderContent()}
                {activeSection === 'templates' && renderTemplates()}
                {activeSection === 'portfolio' && renderPortfolio()}
                {activeSection === 'settings' && renderSettings()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
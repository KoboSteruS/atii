import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Website {
  id: string;
  name: string;
  client: string;
  description: string;
  url: string;
  screenshot: string;
  technologies: string[];
  category: string;
  date: string;
  featured: boolean;
}

export interface WorkflowStep {
  id: string;
  label: string;
  type: 'trigger' | 'process' | 'api' | 'notification' | 'complete';
  description?: string;
  position: string; // Позиция: "1", "2", "2.1", "2.2", "3", "4.1" и т.д.
}

export interface Template {
  id: string;
  title: string;
  description: string;
  customizable: string[];
  workflow: WorkflowStep[];
  status: 'active' | 'inactive';
}

// Удалили WorkflowNode - теперь используем только WorkflowStep

// Секция контента страницы
export interface ContentSection {
  id: string;
  type: 'hero' | 'features' | 'text' | 'image' | 'list' | 'grid' | 'form';
  title?: string;
  subtitle?: string;
  description?: string;
  text?: string;
  imageUrl?: string;
  items?: Array<{
    id: string;
    title?: string;
    description?: string;
    icon?: string;
    link?: string;
    image?: string;
    [key: string]: any;
  }>;
  settings?: {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    columns?: number;
    [key: string]: any;
  };
}

export interface PageContent {
  id: string;
  name: string;
  sections: number;
  updated: string;
  content: {
    hero?: {
      badge?: string;
      title?: string;
      subtitle?: string;
      description?: string;
      ctaText?: string;
      ctaLink?: string;
    };
    features?: Array<{
      id: string;
      title: string;
      description: string;
      link?: string;
      icon?: string;
    }>;
    projects?: Array<{
      id: string;
      title: string;
      category: string;
      image: string;
      description: string;
      tech: string[];
    }>;
    solutions?: Array<{
      id: string;
      title: string;
      description: string;
      link?: string;
      icon?: string;
    }>;
    capabilities?: Array<{
      id: string;
      title: string;
      description: string;
      image: string;
      icon?: string;
    }>;
    stats?: Array<{
      id: string;
      value: string;
      label: string;
      icon?: string;
    }>;
    values?: Array<{
      id: string;
      title: string;
      description: string;
      icon?: string;
      color?: string;
    }>;
    technologies?: string[];
    workflowSteps?: Array<{
      id: string;
      title: string;
      description: string;
      duration: string;
      details: string[];
      icon?: string;
    }>;
    advantages?: Array<{
      id: string;
      title: string;
      description: string;
      icon?: string;
    }>;
    caseStudies?: Array<{
      id: string;
      title: string;
      description: string;
      image?: string;
      tech: string[];
    }>;
    sections?: ContentSection[];
  };
}

export interface Settings {
  siteName: string;
  domain: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

interface AppContextType {
  // Portfolio
  websites: Website[];
  addWebsite: (website: Omit<Website, 'id'>) => void;
  updateWebsite: (id: string, website: Partial<Website>) => void;
  deleteWebsite: (id: string) => void;
  duplicateWebsite: (id: string) => void;

  // Templates
  templates: Template[];
  addTemplate: (template: Omit<Template, 'id'>) => void;
  updateTemplate: (id: string, template: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;

  // Workflow Schemas
  workflowSchemas: Record<string, WorkflowNode[]>;
  saveWorkflowSchema: (templateId: string, nodes: WorkflowNode[]) => void;
  getWorkflowSchema: (templateId: string) => WorkflowNode[];

  // Pages
  pages: PageContent[];
  updatePage: (id: string, page: Partial<PageContent>) => void;

  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default data
const defaultWebsites: Website[] = [
  {
    id: '1',
    name: 'FashionHub Online Store',
    client: 'Fashion House',
    description: 'Интернет-магазин премиум одежды с каталогом 5000+ товаров, личным кабинетом, интеграцией с платежными системами и системой лояльности',
    url: 'https://example-fashion.com',
    screenshot: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
    technologies: ['React', 'Next.js', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
    category: 'E-commerce',
    date: '2025-12',
    featured: true
  },
  {
    id: '2',
    name: 'LogiTrack Dashboard',
    client: 'Cargo Express',
    description: 'Панель управления логистической компанией с трекингом грузов в реальном времени',
    url: 'https://example-cargo.com',
    screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
    technologies: ['Vue.js', 'Django', 'WebSocket', 'Redis', 'Google Maps API'],
    category: 'Dashboard',
    date: '2025-11',
    featured: true
  },
  {
    id: '3',
    name: 'EduPlatform Learning',
    client: 'EduTech',
    description: 'Образовательная платформа с видеокурсами, тестированием и AI-помощником',
    url: 'https://example-edu.com',
    screenshot: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=800&fit=crop',
    technologies: ['Next.js', 'Python', 'TensorFlow', 'MongoDB', 'AWS'],
    category: 'EdTech',
    date: '2025-10',
    featured: false
  }
];

const defaultTemplates: Template[] = [
  {
    id: 'crm-integration',
    title: 'CRM интеграция с мессенджерами',
    description: 'Автоматическая синхронизация обращений клиентов из мессенджеров в вашу CRM-систему',
    customizable: ['Мессенджер', 'CRM система', 'Правила фильтрации'],
    workflow: [
      { id: '1', label: 'Webhook', type: 'trigger', description: 'Получение сообщения из мессенджера', position: '1' },
      { id: '2', label: 'Парсинг', type: 'process', description: 'Извлечение текста и метаданных', position: '2' },
      { id: '3', label: 'Логирование', type: 'process', description: 'Сохранение в БД для аналитики', position: '3' },
      { id: '4', label: 'Поиск в CRM', type: 'api', description: 'Проверка существования клиента', position: '4' },
      { id: '5', label: 'Существует?', type: 'process', description: 'Проверка наличия контакта', position: '5' },
      { id: '6', label: 'Создать контакт', type: 'api', description: 'Добавление нового клиента', position: '6.1' },
      { id: '7', label: 'Обновить данные', type: 'api', description: 'Обновление контакта', position: '6.2' },
      { id: '8', label: 'Создать обращение', type: 'api', description: 'Запись обращения в CRM', position: '7' },
      { id: '9', label: 'Уведомить менеджера', type: 'notification', description: 'Отправка уведомления', position: '8' },
      { id: '10', label: 'Ответ клиенту', type: 'notification', description: 'Автоответ в мессенджер', position: '9' },
      { id: '11', label: 'Готово', type: 'complete', description: 'Обработка завершена', position: '10' }
    ],
    status: 'active'
  },
  {
    id: 'ai-support',
    title: 'AI Ассистент для поддержки',
    description: 'Умный бот с GPT-4 для автоматической обработки запросов клиентов и эскалации к людям',
    customizable: ['AI модель', 'База знаний', 'Правила эскалации'],
    workflow: [
      { id: '1', label: 'Новый запрос', type: 'trigger', description: 'Сообщение от клиента', position: '1' },
      { id: '2', label: 'Классификация', type: 'process', description: 'AI определяет тип вопроса', position: '2' },
      { id: '3', label: 'Простой вопрос', type: 'process', description: 'FAQ, инструкции', position: '3.1' },
      { id: '4', label: 'Сложный вопрос', type: 'process', description: 'Требует человека', position: '3.2' },
      { id: '5', label: 'AI ответ', type: 'api', description: 'GPT генерирует ответ', position: '4.1' },
      { id: '6', label: 'Назначить оператору', type: 'api', description: 'Создание тикета', position: '4.2' },
      { id: '7', label: 'Отправка клиенту', type: 'notification', description: 'Ответ в мессенджер', position: '5' },
      { id: '8', label: 'Сбор обратной связи', type: 'process', description: 'Оценка качества ответа', position: '6' },
      { id: '9', label: 'Обучение модели', type: 'process', description: 'Улучшение AI', position: '7' },
      { id: '10', label: 'Готово', type: 'complete', description: 'Запрос обработан', position: '8' }
    ],
    status: 'active'
  },
  {
    id: 'ecommerce-funnel',
    title: 'E-commerce воронка продаж',
    description: 'Автоматизация пути клиента от брошенной корзины до повторной покупки с персонализацией',
    customizable: ['Платформа', 'Триггеры', 'Скидки и офферы'],
    workflow: [
      { id: '1', label: 'Брошенная корзина', type: 'trigger', description: 'Клиент не завершил покупку', position: '1' },
      { id: '2', label: 'Анализ поведения', type: 'process', description: 'Изучение истории клиента', position: '2' },
      { id: '3', label: 'Ждем 1 час', type: 'process', description: 'Отложенная отправка', position: '3' },
      { id: '4', label: 'Email со скидкой 10%', type: 'notification', description: 'Первое напоминание', position: '4' },
      { id: '5', label: 'Купил?', type: 'process', description: 'Проверка заказа', position: '5' },
      { id: '6', label: 'Спасибо за покупку', type: 'notification', description: 'Благодарность + кросс-селл', position: '6.2' },
      { id: '7', label: 'Ждем 24 часа', type: 'process', description: 'Второе ожидание', position: '6.1' },
      { id: '8', label: 'SMS со скидкой 15%', type: 'notification', description: 'Последняя попытка', position: '7' },
      { id: '9', label: 'Push в ретаргетинг', type: 'api', description: 'Реклама в соцсетях', position: '8' },
      { id: '10', label: 'Готово', type: 'complete', description: 'Воронка завершена', position: '9' }
    ],
    status: 'active'
  },
  {
    id: 'monitoring-alerts',
    title: 'Система мониторинга и алертов',
    description: 'Автоматический мониторинг сервисов с умной эскалацией инцидентов и самовосстановлением',
    customizable: ['Метрики', 'Пороги срабатывания', 'Команды on-call'],
    workflow: [
      { id: '1', label: 'Метрики сервера', type: 'trigger', description: 'Каждые 30 секунд', position: '1' },
      { id: '2', label: 'Анализ аномалий', type: 'process', description: 'AI детекция проблем', position: '2' },
      { id: '3', label: 'Все ОК', type: 'process', description: 'Нормальные показатели', position: '3.2' },
      { id: '4', label: 'Проблема!', type: 'process', description: 'Превышен порог', position: '3.1' },
      { id: '5', label: 'Авто-исправление', type: 'api', description: 'Перезапуск, масштабирование', position: '4.1' },
      { id: '6', label: 'Slack уведомление', type: 'notification', description: 'Оповещение дежурному', position: '4.2' },
      { id: '7', label: 'Проблема решена?', type: 'process', description: 'Проверка через 2 минуты', position: '5' },
      { id: '8', label: 'Звонок on-call', type: 'notification', description: 'Критичная эскалация', position: '6.1' },
      { id: '9', label: 'Инцидент закрыт', type: 'api', description: 'Создание отчёта', position: '6.2' },
      { id: '10', label: 'Готово', type: 'complete', description: 'Мониторинг продолжается', position: '7' }
    ],
    status: 'active'
  }
];

const defaultPages: PageContent[] = [
  { 
    id: 'home', 
    name: 'Главная', 
    sections: 5, 
    updated: '2 часа назад', 
    content: {
      hero: {
        badge: 'Информационные технологии будущего',
        title: 'Информационные решения\nдля вашего бизнеса',
        subtitle: 'для вашего бизнеса',
        description: 'IT-компания, которая помогает решать проблемы через современные технологии. Мы можем разработать почти всё что угодно.',
        ctaText: 'Начать проект',
        ctaLink: '/custom'
      },
      features: [
        {
          id: '1',
          title: 'Готовые решения',
          description: 'Библиотека проверенных шаблонов для быстрого старта вашего проекта',
          link: '/templates',
          icon: 'code'
        },
        {
          id: '2',
          title: 'Быстрое внедрение',
          description: 'От идеи до запуска за 2-4 недели благодаря автоматизации',
          link: '/templates',
          icon: 'zap'
        },
        {
          id: '3',
          title: 'Полная безопасность',
          description: 'Современные протоколы шифрования и защита данных на всех уровнях',
          link: '/about',
          icon: 'shield'
        }
      ],
      projects: [
        {
          id: '1',
          title: 'E-commerce платформа',
          category: 'Интернет-магазин',
          image: 'https://images.unsplash.com/photo-1592773307163-962d25055c3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzY4MzMwOTE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
          description: 'Полнофункциональная платформа с интеграцией платежей и аналитикой',
          tech: ['React', 'Node.js', 'PostgreSQL']
        },
        {
          id: '2',
          title: 'Аналитическая dashboard',
          category: 'Бизнес-аналитика',
          image: 'https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBwbGF0Zm9ybXxlbnwxfHx8fDE3NjgzMDgwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
          description: 'Визуализация данных в реальном времени для принятия решений',
          tech: ['Python', 'Django', 'Redis']
        },
        {
          id: '3',
          title: 'Мобильное приложение',
          category: 'Mobile Development',
          image: 'https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY4MzE1OTE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
          description: 'Кроссплатформенное приложение для iOS и Android',
          tech: ['React Native', 'TypeScript']
        }
      ],
      solutions: [
        {
          id: '1',
          title: 'CRM интеграция',
          description: 'Автоматическая синхронизация обращений клиентов из мессенджеров',
          link: '/templates',
          icon: 'message-square'
        },
        {
          id: '2',
          title: 'Email-рассылки',
          description: 'Триггерные рассылки с персонализацией и аналитикой',
          link: '/templates',
          icon: 'mail'
        },
        {
          id: '3',
          title: 'Синхронизация данных',
          description: 'Двусторонняя синхронизация между системами в реальном времени',
          link: '/templates',
          icon: 'database'
        }
      ],
      capabilities: [
        {
          id: '1',
          title: 'Data Analytics',
          description: 'Визуализация и анализ',
          image: 'https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGdyYXBofGVufDF8fHx8MTc2ODQyNDQxNHww&ixlib=rb-4.1.0&q=80&w=1080',
          icon: 'boxes'
        },
        {
          id: '2',
          title: 'AI & ML',
          description: 'Машинное обучение',
          image: 'https://images.unsplash.com/photo-1675495277087-10598bf7bcd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwbWF0cml4JTIwZGlnaXRhbHxlbnwxfHx8fDE3Njg0MjQ0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
          icon: 'cpu'
        },
        {
          id: '3',
          title: 'Backend API',
          description: 'Серверные решения',
          image: 'https://images.unsplash.com/photo-1661669999755-1e5b36d9e9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdGVjaG5vbG9neSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzY4NDI0NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          icon: 'code'
        },
        {
          id: '4',
          title: '3D визуализация',
          description: 'Интерактивные модели',
          image: 'https://images.unsplash.com/photo-1658806283210-6d7330062704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGFic3RyYWN0JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3Njg0MjQ0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
          icon: 'workflow'
        }
      ],
      stats: [
        { id: '1', value: '100+', label: 'Реализованных проектов' },
        { id: '2', value: '50+', label: 'Довольных клиентов' },
        { id: '3', value: '5+', label: 'Лет опыта' },
        { id: '4', value: '24/7', label: 'Техподдержка' }
      ],
      sections: []
    }
  },
  { 
    id: 'about', 
    name: 'О нас', 
    sections: 4, 
    updated: '1 день назад', 
    content: {
      hero: {
        badge: 'О компании АТИИ',
        title: 'Мы создаем\nбудущее',
        subtitle: 'будущее',
        description: 'IT-компания, которая помогает решать проблемы через информационные решения. Мы можем разработать почти всё что угодно.'
      },
      stats: [
        { id: '1', value: '100+', label: 'Проектов реализовано', icon: 'target' },
        { id: '2', value: '50+', label: 'Довольных клиентов', icon: 'users' },
        { id: '3', value: '24/7', label: 'Техническая поддержка', icon: 'zap' },
        { id: '4', value: '5+', label: 'Лет на рынке', icon: 'trending-up' }
      ],
      values: [
        {
          id: '1',
          title: 'Технологическая экспертиза',
          description: 'Мы владеем современными технологиями и всегда следим за инновациями в IT-индустрии',
          icon: 'code2',
          color: 'from-red-600 to-pink-600'
        },
        {
          id: '2',
          title: 'Качество превыше всего',
          description: 'Каждый проект проходит строгий контроль качества и соответствует лучшим практикам',
          icon: 'award',
          color: 'from-purple-600 to-red-600'
        },
        {
          id: '3',
          title: 'Глобальный подход',
          description: 'Работаем с клиентами по всему миру, создавая решения мирового уровня',
          icon: 'globe',
          color: 'from-red-600 to-orange-600'
        },
        {
          id: '4',
          title: 'Инновации и творчество',
          description: 'Каждое решение - это уникальный продукт, созданный с творческим подходом',
          icon: 'sparkles',
          color: 'from-red-600 to-red-800'
        }
      ],
      technologies: [
        'React', 'Node.js', 'Python', 'TypeScript', 'Docker', 'Kubernetes',
        'AWS', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
        'Microservices', 'CI/CD', 'Machine Learning', 'Blockchain'
      ],
      sections: []
    }
  },
  { 
    id: 'templates', 
    name: 'Готовые решения', 
    sections: 6, 
    updated: '3 часа назад', 
    content: {
      hero: {
        title: 'Готовые решения',
        description: 'Проверенные шаблоны и алгоритмы с возможностью настройки под ваши задачи.'
      },
      sections: []
    }
  },
  { 
    id: 'custom', 
    name: 'Под ключ', 
    sections: 7, 
    updated: '5 часов назад', 
    content: {
      hero: {
        badge: 'Премиум услуга',
        title: 'Решения под ключ',
        subtitle: 'под ключ',
        description: 'Любая ваша идея — от концепции до полной реализации. Вы управляете процессом, мы воплощаем самые смелые задачи.'
      },
      workflowSteps: [
        {
          id: '1',
          title: 'Консультация',
          description: 'Детально обсуждаем вашу задачу и формируем техническое задание',
          duration: '1-3 дня',
          details: ['Анализ бизнес-процессов', 'Определение целей проекта', 'Оценка сроков и бюджета'],
          icon: 'users'
        },
        {
          id: '2',
          title: 'Проектирование',
          description: 'Разрабатываем архитектуру и план реализации вашего решения',
          duration: '5-10 дней',
          details: ['Техническая архитектура', 'Дизайн интерфейсов', 'План разработки'],
          icon: 'target'
        },
        {
          id: '3',
          title: 'Разработка',
          description: 'Создаем ваше решение с использованием современных технологий',
          duration: '2-8 недель',
          details: ['Backend разработка', 'Frontend разработка', 'Интеграции с сервисами'],
          icon: 'code'
        },
        {
          id: '4',
          title: 'Запуск',
          description: 'Тестирование, внедрение и передача проекта',
          duration: '3-7 дней',
          details: ['Тестирование системы', 'Развертывание', 'Обучение команды'],
          icon: 'rocket'
        }
      ],
      advantages: [
        { id: '1', title: 'Гибкость', description: 'Полный контроль над процессом разработки', icon: 'layers' },
        { id: '2', title: 'Любые технологии', description: 'Используем оптимальный стек для вашего проекта', icon: 'zap' },
        { id: '3', title: 'Масштабируемость', description: 'Система растет вместе с вашим бизнесом', icon: 'line-chart' },
        { id: '4', title: 'Безопасность', description: 'Современные протоколы защиты данных', icon: 'shield' },
        { id: '5', title: 'Полная интеграция', description: 'Подключение к любым внешним системам', icon: 'globe' },
        { id: '6', title: 'Поддержка 24/7', description: 'Техническое сопровождение после запуска', icon: 'users' }
      ],
      caseStudies: [
        {
          id: '1',
          title: 'Платформа для финтех',
          description: 'Система для управления финансовыми операциями с интеграцией банковских API',
          tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe API']
        },
        {
          id: '2',
          title: 'AI-аналитика для e-commerce',
          description: 'Платформа прогнозирования спроса с использованием машинного обучения',
          tech: ['Python', 'TensorFlow', 'FastAPI', 'Kubernetes']
        }
      ],
      sections: []
    }
  },
];

const defaultSettings: Settings = {
  siteName: 'АТИИ - IT решения',
  domain: 'atii.ru',
  description: 'IT-компания, которая помогает решать проблемы через информационные решения',
  primaryColor: '#EF4444',
  accentColor: '#9333EA',
  backgroundColor: '#000000',
  metaTitle: '',
  metaDescription: '',
  keywords: '',
};

export function AppProvider({ children }: { children: ReactNode }) {
  // Load from localStorage or use defaults
  const [websites, setWebsites] = useState<Website[]>(() => {
    try {
      const stored = localStorage.getItem('atii_websites');
      return stored ? JSON.parse(stored) : defaultWebsites;
    } catch {
      return defaultWebsites;
    }
  });

  const [templates, setTemplates] = useState<Template[]>(() => {
    try {
      const stored = localStorage.getItem('atii_templates');
      if (!stored) return defaultTemplates;
      
      const parsed = JSON.parse(stored);
      // Миграция старых данных: конвертируем order/yPosition в position
      return parsed.map((template: any) => ({
        ...template,
        workflow: (template.workflow || []).map((step: any, idx: number) => {
          // Если position уже есть и это строка - используем её
          if (step.position && typeof step.position === 'string') {
            return step;
          }
          // Если есть старые поля order/yPosition - конвертируем
          if (typeof step.order === 'number') {
            return {
              ...step,
              position: String(step.order),
              order: undefined,
              yPosition: undefined
            };
          }
          // Fallback - используем индекс
          return {
            ...step,
            position: String(idx + 1)
          };
        })
      }));
    } catch {
      return defaultTemplates;
    }
  });

  const [workflowSchemas, setWorkflowSchemas] = useState<Record<string, WorkflowNode[]>>(() => {
    try {
      const stored = localStorage.getItem('atii_workflow_schemas');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [pages, setPages] = useState<PageContent[]>(() => {
    try {
      const stored = localStorage.getItem('atii_pages');
      return stored ? JSON.parse(stored) : defaultPages;
    } catch {
      return defaultPages;
    }
  });

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem('atii_settings');
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Ref для отслеживания внутренних обновлений (избегаем циклических обновлений)
  const isInternalUpdateRef = React.useRef(false);
  const isServerUpdateRef = React.useRef(false);

  // URL сервера (по умолчанию localhost:3001, можно изменить через .env)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Функция для сохранения данных на сервер
  const saveToServer = React.useCallback(async (key: string, data: any) => {
    if (isServerUpdateRef.current) return;
    
    try {
      const response = await fetch(`${API_URL}/api/data/${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка сохранения на сервер');
      }
    } catch (error) {
      // Тихая ошибка - не мешаем работе, если сервер недоступен
      console.warn(`Сервер недоступен, данные сохранены только локально:`, error);
    }
  }, [API_URL]);

  // Загрузка данных с сервера при старте
  useEffect(() => {
    const loadFromServer = async () => {
      try {
        const response = await fetch(`${API_URL}/api/data`);
        
        if (!response.ok) {
          throw new Error('Сервер недоступен');
        }
        
        const serverData = await response.json();
        
        if (serverData && !isServerUpdateRef.current) {
          isInternalUpdateRef.current = true;
          isServerUpdateRef.current = true;
          
          try {
            if (serverData.websites && Array.isArray(serverData.websites)) {
              setWebsites(serverData.websites);
              localStorage.setItem('atii_websites', JSON.stringify(serverData.websites));
            }
            if (serverData.templates && Array.isArray(serverData.templates)) {
              setTemplates(serverData.templates);
              localStorage.setItem('atii_templates', JSON.stringify(serverData.templates));
            }
            if (serverData.pages && Array.isArray(serverData.pages)) {
              setPages(serverData.pages);
              localStorage.setItem('atii_pages', JSON.stringify(serverData.pages));
            }
            if (serverData.settings && typeof serverData.settings === 'object') {
              setSettings(serverData.settings);
              localStorage.setItem('atii_settings', JSON.stringify(serverData.settings));
            }
            if (serverData.workflowSchemas && typeof serverData.workflowSchemas === 'object') {
              setWorkflowSchemas(serverData.workflowSchemas);
              localStorage.setItem('atii_workflow_schemas', JSON.stringify(serverData.workflowSchemas));
            }
          } finally {
            setTimeout(() => {
              isInternalUpdateRef.current = false;
              isServerUpdateRef.current = false;
            }, 100);
          }
        }
      } catch (error) {
        // Сервер недоступен - используем данные из localStorage
        console.warn('Сервер недоступен, используем локальные данные:', error);
      }
    };

    loadFromServer();
    
    // Периодическая проверка обновлений (каждые 30 секунд)
    const interval = setInterval(loadFromServer, 30000);
    
    return () => clearInterval(interval);
  }, [API_URL]);

  // Save to localStorage whenever data changes (внутренние изменения)
  useEffect(() => {
    if (isInternalUpdateRef.current) return;
    
    isInternalUpdateRef.current = true;
    localStorage.setItem('atii_websites', JSON.stringify(websites));
    // Триггерим custom событие для синхронизации в рамках одного окна
    window.dispatchEvent(new CustomEvent('atii-storage-update', {
      detail: {
        key: 'atii_websites',
        newValue: JSON.stringify(websites),
        storageArea: localStorage
      }
    }));
    // Синхронизируем с сервером
    saveToServer('websites', websites);
    setTimeout(() => { isInternalUpdateRef.current = false; }, 0);
  }, [websites, saveToServer]);

  useEffect(() => {
    if (isInternalUpdateRef.current) return;
    
    isInternalUpdateRef.current = true;
    localStorage.setItem('atii_templates', JSON.stringify(templates));
    window.dispatchEvent(new CustomEvent('atii-storage-update', {
      detail: {
        key: 'atii_templates',
        newValue: JSON.stringify(templates),
        storageArea: localStorage
      }
    }));
    saveToServer('templates', templates);
    setTimeout(() => { isInternalUpdateRef.current = false; }, 0);
  }, [templates, saveToServer]);

  useEffect(() => {
    if (isInternalUpdateRef.current) return;
    
    isInternalUpdateRef.current = true;
    localStorage.setItem('atii_workflow_schemas', JSON.stringify(workflowSchemas));
    window.dispatchEvent(new CustomEvent('atii-storage-update', {
      detail: {
        key: 'atii_workflow_schemas',
        newValue: JSON.stringify(workflowSchemas),
        storageArea: localStorage
      }
    }));
    saveToServer('workflowSchemas', workflowSchemas);
    setTimeout(() => { isInternalUpdateRef.current = false; }, 0);
  }, [workflowSchemas, saveToServer]);

  useEffect(() => {
    if (isInternalUpdateRef.current) return;
    
    isInternalUpdateRef.current = true;
    localStorage.setItem('atii_pages', JSON.stringify(pages));
    window.dispatchEvent(new CustomEvent('atii-storage-update', {
      detail: {
        key: 'atii_pages',
        newValue: JSON.stringify(pages),
        storageArea: localStorage
      }
    }));
    saveToServer('pages', pages);
    setTimeout(() => { isInternalUpdateRef.current = false; }, 0);
  }, [pages, saveToServer]);

  useEffect(() => {
    if (isInternalUpdateRef.current) return;
    
    isInternalUpdateRef.current = true;
    localStorage.setItem('atii_settings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('atii-storage-update', {
      detail: {
        key: 'atii_settings',
        newValue: JSON.stringify(settings),
        storageArea: localStorage
      }
    }));
    saveToServer('settings', settings);
    setTimeout(() => { isInternalUpdateRef.current = false; }, 0);
  }, [settings, saveToServer]);

  // Слушаем изменения localStorage из других вкладок и из того же окна
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      // Игнорируем изменения, которые мы сами инициировали
      if (isInternalUpdateRef.current) return;

      let key: string | null = null;
      let newValue: string | null = null;

      if (e instanceof StorageEvent) {
        // Событие из другой вкладки
        key = e.key;
        newValue = e.newValue;
      } else if (e instanceof CustomEvent && e.detail) {
        // Custom событие из того же окна
        key = e.detail.key;
        newValue = e.detail.newValue;
      }

      if (!key || !newValue) return;

      try {
        isInternalUpdateRef.current = true;
        
        switch (key) {
          case 'atii_websites':
            const newWebsites = JSON.parse(newValue);
            setWebsites(newWebsites);
            break;
          case 'atii_templates':
            const newTemplates = JSON.parse(newValue);
            setTemplates(newTemplates);
            break;
          case 'atii_workflow_schemas':
            const newSchemas = JSON.parse(newValue);
            setWorkflowSchemas(newSchemas);
            break;
          case 'atii_pages':
            const newPages = JSON.parse(newValue);
            setPages(newPages);
            break;
          case 'atii_settings':
            const newSettings = JSON.parse(newValue);
            setSettings(newSettings);
            break;
        }
      } catch (error) {
        console.error('Ошибка при синхронизации данных:', error);
      } finally {
        setTimeout(() => { isInternalUpdateRef.current = false; }, 100);
      }
    };

    // Слушаем изменения из других вкладок (storage event)
    window.addEventListener('storage', handleStorageChange as EventListener);
    
    // Слушаем изменения из того же окна (custom event)
    window.addEventListener('atii-storage-update', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('atii-storage-update', handleStorageChange as EventListener);
    };
  }, []);

  // Portfolio methods
  const addWebsite = (website: Omit<Website, 'id'>) => {
    const newWebsite: Website = {
      ...website,
      id: Date.now().toString(),
    };
    setWebsites([...websites, newWebsite]);
  };

  const updateWebsite = (id: string, updates: Partial<Website>) => {
    setWebsites(websites.map(w => w.id === id ? { ...w, ...updates } : w));
    // Update page update time
    const page = pages.find(p => p.id === 'portfolio');
    if (page) {
      updatePage('portfolio', { updated: 'только что' });
    }
  };

  const deleteWebsite = (id: string) => {
    setWebsites(websites.filter(w => w.id !== id));
  };

  const duplicateWebsite = (id: string) => {
    const website = websites.find(w => w.id === id);
    if (website) {
      const duplicated: Website = {
        ...website,
        id: Date.now().toString(),
        name: `${website.name} (копия)`,
      };
      setWebsites([...websites, duplicated]);
    }
  };

  // Template methods
  const addTemplate = (template: Omit<Template, 'id'>) => {
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`,
    };
    setTemplates([...templates, newTemplate]);
  };

  const updateTemplate = (id: string, updates: Partial<Template>) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    // Also remove associated workflow schema
    const newSchemas = { ...workflowSchemas };
    delete newSchemas[id];
    setWorkflowSchemas(newSchemas);
  };

  const duplicateTemplate = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      const duplicated: Template = {
        ...template,
        id: `template-${Date.now()}`,
        title: `${template.title} (копия)`,
        workflow: template.workflow.map(step => ({
          ...step,
          id: `${step.id}-${Date.now()}`,
        })),
      };
      setTemplates([...templates, duplicated]);
    }
  };

  // Workflow schema methods
  const saveWorkflowSchema = (templateId: string, nodes: WorkflowNode[]) => {
    setWorkflowSchemas({ ...workflowSchemas, [templateId]: nodes });
  };

  const getWorkflowSchema = (templateId: string): WorkflowNode[] => {
    return workflowSchemas[templateId] || [];
  };

  // Page methods
  const updatePage = (id: string, updates: Partial<PageContent>) => {
    setPages(pages.map(p => p.id === id ? { ...p, ...updates, updated: 'только что' } : p));
  };

  // Settings methods
  const updateSettings = (updates: Partial<Settings>) => {
    setSettings({ ...settings, ...updates });
  };

  const value: AppContextType = {
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

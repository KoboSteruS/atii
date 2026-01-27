/**
 * AppContext с поддержкой API бэкенда
 * Использует API как источник истины, LocalStorage как кеш/fallback
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api/client';
import type {
  Website,
  Template,
  PageContent,
  Settings,
  WorkflowStep,
} from './AppContext';

// Импортируем типы из оригинального контекста
import type { AppContextType } from './AppContext';

// Тип WorkflowNode для визуального редактора схем
// Это узлы для отображения в редакторе (React Flow и т.п.)
export type WorkflowNode = any; // Можно определить более строго при необходимости

// Состояние загрузки
interface LoadingState {
  websites: boolean;
  templates: boolean;
  pages: boolean;
  settings: boolean;
  workflowSchemas: boolean;
}

export function AppProviderWithAPI({ children }: { children: ReactNode }) {
  // Состояния данных
  const [websites, setWebsites] = useState<Website[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [workflowSchemas, setWorkflowSchemas] = useState<Record<string, any[]>>({});
  
  // Тип для совместимости с AppContextType
  type WorkflowNode = any;
  const [pages, setPages] = useState<PageContent[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  // Состояния загрузки
  const [loading, setLoading] = useState<LoadingState>({
    websites: true,
    templates: true,
    pages: true,
    settings: true,
    workflowSchemas: true,
  });

  // Флаг использования API (можно переключать через env переменную)
  const useAPI = import.meta.env.VITE_USE_API !== 'false';

  // Загрузка данных с API при монтировании
  useEffect(() => {
    if (!useAPI) return;

    const loadData = async () => {
      try {
        // Загружаем все данные параллельно
        const [websitesData, templatesData, pagesData, settingsData] = await Promise.allSettled([
          apiClient.getWebsites(),
          apiClient.getTemplates(),
          apiClient.getPages(),
          apiClient.getSettings(),
        ]);

        // Обрабатываем веб-сайты
        if (websitesData.status === 'fulfilled') {
          setWebsites(websitesData.value);
          // Кешируем в LocalStorage
          localStorage.setItem('atii_websites', JSON.stringify(websitesData.value));
        } else {
          console.error('Ошибка загрузки веб-сайтов:', websitesData.reason);
          // Fallback на LocalStorage
          const cached = localStorage.getItem('atii_websites');
          if (cached) {
            setWebsites(JSON.parse(cached));
          }
        }
        setLoading(prev => ({ ...prev, websites: false }));

        // Обрабатываем шаблоны
        if (templatesData.status === 'fulfilled') {
          const templatesWithWorkflow = templatesData.value.map((template: any) => ({
            ...template,
            workflow: template.workflow_steps || [],
          }));
          setTemplates(templatesWithWorkflow);
          localStorage.setItem('atii_templates', JSON.stringify(templatesWithWorkflow));
        } else {
          console.error('Ошибка загрузки шаблонов:', templatesData.reason);
          const cached = localStorage.getItem('atii_templates');
          if (cached) {
            setTemplates(JSON.parse(cached));
          }
        }
        setLoading(prev => ({ ...prev, templates: false }));

        // Обрабатываем страницы
        if (pagesData.status === 'fulfilled') {
          setPages(pagesData.value);
          localStorage.setItem('atii_pages', JSON.stringify(pagesData.value));
        } else {
          console.error('Ошибка загрузки страниц:', pagesData.reason);
          const cached = localStorage.getItem('atii_pages');
          if (cached) {
            setPages(JSON.parse(cached));
          }
        }
        setLoading(prev => ({ ...prev, pages: false }));

        // Обрабатываем настройки
        if (settingsData.status === 'fulfilled') {
          setSettings(settingsData.value);
          localStorage.setItem('atii_settings', JSON.stringify(settingsData.value));
        } else {
          console.error('Ошибка загрузки настроек:', settingsData.reason);
          const cached = localStorage.getItem('atii_settings');
          if (cached) {
            setSettings(JSON.parse(cached));
          }
        }
        setLoading(prev => ({ ...prev, settings: false }));

        // Загружаем workflow схемы для всех шаблонов
        if (templatesData.status === 'fulfilled') {
          const schemas: Record<string, WorkflowNode[]> = {};
          const schemaPromises = templatesData.value.map(async (template: any) => {
            try {
              const schema = await apiClient.getWorkflowSchemaByTemplate(template.id);
              schemas[template.id] = schema.nodes || [];
            } catch (error) {
              console.error(`Ошибка загрузки схемы для шаблона ${template.id}:`, error);
            }
          });
          await Promise.all(schemaPromises);
          setWorkflowSchemas(schemas);
          localStorage.setItem('atii_workflow_schemas', JSON.stringify(schemas));
        }
        setLoading(prev => ({ ...prev, workflowSchemas: false }));

      } catch (error) {
        console.error('Критическая ошибка загрузки данных:', error);
        // Fallback на LocalStorage для всех данных
        const cachedWebsites = localStorage.getItem('atii_websites');
        const cachedTemplates = localStorage.getItem('atii_templates');
        const cachedPages = localStorage.getItem('atii_pages');
        const cachedSettings = localStorage.getItem('atii_settings');
        const cachedSchemas = localStorage.getItem('atii_workflow_schemas');

        if (cachedWebsites) setWebsites(JSON.parse(cachedWebsites));
        if (cachedTemplates) setTemplates(JSON.parse(cachedTemplates));
        if (cachedPages) setPages(JSON.parse(cachedPages));
        if (cachedSettings) setSettings(JSON.parse(cachedSettings));
        if (cachedSchemas) setWorkflowSchemas(JSON.parse(cachedSchemas));

        setLoading({
          websites: false,
          templates: false,
          pages: false,
          settings: false,
          workflowSchemas: false,
        });
      }
    };

    loadData();
  }, [useAPI]);

  // Portfolio methods
  const addWebsite = async (website: Omit<Website, 'id'>) => {
    try {
      if (useAPI) {
        const newWebsite = await apiClient.createWebsite(website);
        setWebsites([...websites, newWebsite]);
        localStorage.setItem('atii_websites', JSON.stringify([...websites, newWebsite]));
      } else {
        const newWebsite: Website = {
          ...website,
          id: Date.now().toString(),
        };
        setWebsites([...websites, newWebsite]);
        localStorage.setItem('atii_websites', JSON.stringify([...websites, newWebsite]));
      }
    } catch (error) {
      console.error('Ошибка создания веб-сайта:', error);
      // Fallback на локальное создание
      const newWebsite: Website = {
        ...website,
        id: Date.now().toString(),
      };
      setWebsites([...websites, newWebsite]);
      localStorage.setItem('atii_websites', JSON.stringify([...websites, newWebsite]));
    }
  };

  const updateWebsite = async (id: string, updates: Partial<Website>) => {
    try {
      if (useAPI) {
        const updated = await apiClient.updateWebsite(id, updates);
        setWebsites(websites.map(w => w.id === id ? updated : w));
        localStorage.setItem('atii_websites', JSON.stringify(websites.map(w => w.id === id ? updated : w)));
      } else {
        const updated = websites.map(w => w.id === id ? { ...w, ...updates } : w);
        setWebsites(updated);
        localStorage.setItem('atii_websites', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Ошибка обновления веб-сайта:', error);
      const updated = websites.map(w => w.id === id ? { ...w, ...updates } : w);
      setWebsites(updated);
      localStorage.setItem('atii_websites', JSON.stringify(updated));
    }
  };

  const deleteWebsite = async (id: string) => {
    try {
      if (useAPI) {
        await apiClient.deleteWebsite(id);
      }
      const updated = websites.filter(w => w.id !== id);
      setWebsites(updated);
      localStorage.setItem('atii_websites', JSON.stringify(updated));
    } catch (error) {
      console.error('Ошибка удаления веб-сайта:', error);
      const updated = websites.filter(w => w.id !== id);
      setWebsites(updated);
      localStorage.setItem('atii_websites', JSON.stringify(updated));
    }
  };

  const duplicateWebsite = async (id: string) => {
    const website = websites.find(w => w.id === id);
    if (website) {
      const duplicated: Omit<Website, 'id'> = {
        ...website,
        name: `${website.name} (копия)`,
      };
      await addWebsite(duplicated);
    }
  };

  // Template methods
  const addTemplate = async (template: Omit<Template, 'id'>) => {
    try {
      if (useAPI) {
        const workflowSteps = template.workflow || [];
        const templateData = {
          ...template,
          workflow: workflowSteps.map(step => ({
            label: step.label,
            type: step.type,
            description: step.description,
            position: step.position,
          })),
        };
        const newTemplate = await apiClient.createTemplate(templateData);
        const templateWithWorkflow = {
          ...newTemplate,
          workflow: newTemplate.workflow_steps || [],
        };
        setTemplates([...templates, templateWithWorkflow]);
        localStorage.setItem('atii_templates', JSON.stringify([...templates, templateWithWorkflow]));
      } else {
        const newTemplate: Template = {
          ...template,
          id: `template-${Date.now()}`,
        };
        setTemplates([...templates, newTemplate]);
        localStorage.setItem('atii_templates', JSON.stringify([...templates, newTemplate]));
      }
    } catch (error) {
      console.error('Ошибка создания шаблона:', error);
      const newTemplate: Template = {
        ...template,
        id: `template-${Date.now()}`,
      };
      setTemplates([...templates, newTemplate]);
      localStorage.setItem('atii_templates', JSON.stringify([...templates, newTemplate]));
    }
  };

  const updateTemplate = async (id: string, updates: Partial<Template>) => {
    try {
      if (useAPI) {
        const template = templates.find(t => t.id === id);
        if (template) {
          const workflowSteps = updates.workflow || template.workflow || [];
          const templateData: any = {
            ...updates,
            workflow: workflowSteps.map(step => ({
              label: step.label,
              type: step.type,
              description: step.description,
              position: step.position,
            })),
          };
          const updated = await apiClient.updateTemplate(id, templateData);
          const templateWithWorkflow = {
            ...updated,
            workflow: updated.workflow_steps || [],
          };
          setTemplates(templates.map(t => t.id === id ? templateWithWorkflow : t));
          localStorage.setItem('atii_templates', JSON.stringify(templates.map(t => t.id === id ? templateWithWorkflow : t)));
        }
      } else {
        const updated = templates.map(t => t.id === id ? { ...t, ...updates } : t);
        setTemplates(updated);
        localStorage.setItem('atii_templates', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Ошибка обновления шаблона:', error);
      const updated = templates.map(t => t.id === id ? { ...t, ...updates } : t);
      setTemplates(updated);
      localStorage.setItem('atii_templates', JSON.stringify(updated));
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      if (useAPI) {
        await apiClient.deleteTemplate(id);
      }
      const updated = templates.filter(t => t.id !== id);
      setTemplates(updated);
      localStorage.setItem('atii_templates', JSON.stringify(updated));
      
      // Удаляем связанную workflow схему
      const newSchemas = { ...workflowSchemas };
      delete newSchemas[id];
      setWorkflowSchemas(newSchemas);
      localStorage.setItem('atii_workflow_schemas', JSON.stringify(newSchemas));
    } catch (error) {
      console.error('Ошибка удаления шаблона:', error);
      const updated = templates.filter(t => t.id !== id);
      setTemplates(updated);
      localStorage.setItem('atii_templates', JSON.stringify(updated));
    }
  };

  const duplicateTemplate = async (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      const duplicated: Omit<Template, 'id'> = {
        ...template,
        title: `${template.title} (копия)`,
        workflow: template.workflow.map(step => ({
          ...step,
          id: `${step.id}-${Date.now()}`,
        })),
      };
      await addTemplate(duplicated);
    }
  };

  // Workflow schema methods
  const saveWorkflowSchema = async (templateId: string, nodes: any[]) => {
    try {
      if (useAPI) {
        try {
          await apiClient.updateWorkflowSchema(templateId, { nodes });
        } catch (error: any) {
          // Если схема не существует, создаем её
          if (error.message?.includes('404') || error.message?.includes('не найдена')) {
            await apiClient.createWorkflowSchema({ template_id: templateId, nodes });
          } else {
            throw error;
          }
        }
      }
      const newSchemas = { ...workflowSchemas, [templateId]: nodes };
      setWorkflowSchemas(newSchemas);
      localStorage.setItem('atii_workflow_schemas', JSON.stringify(newSchemas));
    } catch (error) {
      console.error('Ошибка сохранения workflow схемы:', error);
      const newSchemas = { ...workflowSchemas, [templateId]: nodes };
      setWorkflowSchemas(newSchemas);
      localStorage.setItem('atii_workflow_schemas', JSON.stringify(newSchemas));
    }
  };

  const getWorkflowSchema = (templateId: string): WorkflowNode[] | any[] => {
    return workflowSchemas[templateId] || [];
  };

  // Page methods
  const updatePage = async (id: string, updates: Partial<PageContent>) => {
    try {
      if (useAPI) {
        const updated = await apiClient.updatePage(id, { ...updates, updated: 'только что' });
        setPages(pages.map(p => p.id === id ? updated : p));
        localStorage.setItem('atii_pages', JSON.stringify(pages.map(p => p.id === id ? updated : p)));
      } else {
        const updated = pages.map(p => p.id === id ? { ...p, ...updates, updated: 'только что' } : p);
        setPages(updated);
        localStorage.setItem('atii_pages', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Ошибка обновления страницы:', error);
      const updated = pages.map(p => p.id === id ? { ...p, ...updates, updated: 'только что' } : p);
      setPages(updated);
      localStorage.setItem('atii_pages', JSON.stringify(updated));
    }
  };

  // Settings methods
  const updateSettings = async (updates: Partial<Settings>) => {
    if (!settings) return;
    
    try {
      if (useAPI) {
        const updated = await apiClient.updateSettings(updates);
        setSettings(updated);
        localStorage.setItem('atii_settings', JSON.stringify(updated));
      } else {
        const updated = { ...settings, ...updates };
        setSettings(updated);
        localStorage.setItem('atii_settings', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Ошибка обновления настроек:', error);
      const updated = { ...settings, ...updates };
      setSettings(updated);
      localStorage.setItem('atii_settings', JSON.stringify(updated));
    }
  };

  const value: Omit<AppContextType, 'workflowSchemas' | 'saveWorkflowSchema' | 'getWorkflowSchema'> & {
    workflowSchemas: Record<string, any[]>;
    saveWorkflowSchema: (templateId: string, nodes: any[]) => void | Promise<void>;
    getWorkflowSchema: (templateId: string) => any[];
  } = {
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
    settings: settings || {
      siteName: 'АТИИ - IT решения',
      domain: 'atii.ru',
      description: '',
      primaryColor: '#EF4444',
      accentColor: '#9333EA',
      backgroundColor: '#000000',
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    },
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Импортируем оригинальный контекст для использования
import { AppContext } from './AppContext';

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

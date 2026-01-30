/**
 * Синхронизация данных из LocalStorage в БД через API.
 * Читает atii_* ключи и отправляет сущности в бэкенд (требуется JWT).
 */
import { apiClient } from './client';
import {
  defaultWebsites,
  defaultTemplates,
  defaultPages,
  defaultSettings,
} from '../store/AppContext';

const STORAGE_KEYS = {
  websites: 'atii_websites',
  templates: 'atii_templates',
  pages: 'atii_pages',
  settings: 'atii_settings',
  workflowSchemas: 'atii_workflow_schemas',
} as const;

export interface SyncResult {
  ok: boolean;
  message: string;
  details: {
    websites: { created: number; errors: string[] };
    templates: { created: number; errors: string[]; newIds: string[] };
    pages: { created: number; errors: string[] };
    settings: { updated: boolean; error?: string };
    workflowSchemas: { created: number; errors: string[] };
  };
}

function parseJson<T>(key: string, raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Собирает данные из LocalStorage и отправляет в API.
 * Порядок: настройки → веб-сайты → шаблоны → страницы → workflow-схемы (по новым id шаблонов).
 */
export async function syncLocalStorageToApi(): Promise<SyncResult> {
  const details: SyncResult['details'] = {
    websites: { created: 0, errors: [] },
    templates: { created: 0, errors: [], newIds: [] },
    pages: { created: 0, errors: [] },
    settings: { updated: false },
    workflowSchemas: { created: 0, errors: [] },
  };

  const websites = parseJson<Array<Record<string, unknown>>>(STORAGE_KEYS.websites, localStorage.getItem(STORAGE_KEYS.websites));
  const templates = parseJson<Array<Record<string, unknown>>>(STORAGE_KEYS.templates, localStorage.getItem(STORAGE_KEYS.templates));
  const pages = parseJson<Array<Record<string, unknown>>>(STORAGE_KEYS.pages, localStorage.getItem(STORAGE_KEYS.pages));
  const settings = parseJson<Record<string, unknown>>(STORAGE_KEYS.settings, localStorage.getItem(STORAGE_KEYS.settings));
  const workflowSchemas = parseJson<Record<string, unknown[]>>(STORAGE_KEYS.workflowSchemas, localStorage.getItem(STORAGE_KEYS.workflowSchemas));

  const hasAny = websites?.length || templates?.length || pages?.length || settings || (workflowSchemas && Object.keys(workflowSchemas).length);
  if (!hasAny) {
    return {
      ok: false,
      message: 'В LocalStorage нет данных. Сначала сохраните текущие данные в LocalStorage или импортируйте JSON.',
      details,
    };
  }

  try {
    // 1. Настройки (PUT)
    if (settings && typeof settings === 'object') {
      try {
        const payload = {
          site_name: settings.site_name,
          domain: settings.domain,
          description: settings.description,
          primary_color: settings.primary_color,
          accent_color: settings.accent_color,
          background_color: settings.background_color,
          meta_title: settings.meta_title,
          meta_description: settings.meta_description,
          keywords: settings.keywords,
        };
        await apiClient.updateSettings(payload);
        details.settings.updated = true;
      } catch (e) {
        details.settings.error = e instanceof Error ? e.message : String(e);
      }
    }

    // 2. Веб-сайты (POST каждый)
    if (Array.isArray(websites)) {
      for (const w of websites) {
        try {
          await apiClient.createWebsite({
            name: w.name ?? '',
            client: w.client ?? null,
            description: w.description ?? null,
            url: w.url ?? null,
            screenshot: w.screenshot ?? null,
            technologies: Array.isArray(w.technologies) ? w.technologies : [],
            category: w.category ?? null,
            date: w.date ?? null,
            featured: Boolean(w.featured),
          });
          details.websites.created += 1;
        } catch (e) {
          details.websites.errors.push(w.name ? `${w.name}: ${e instanceof Error ? e.message : String(e)}` : String(e));
        }
      }
    }

    // 3. Шаблоны (POST каждый), собираем новые id по порядку
    if (Array.isArray(templates)) {
      for (const t of templates) {
        try {
          const workflow = Array.isArray(t.workflow) ? t.workflow.map((s: Record<string, unknown>) => ({
            label: s.label ?? '',
            type: s.type ?? 'process',
            description: s.description ?? null,
            position: s.position ?? '',
          })) : undefined;
          const created = await apiClient.createTemplate({
            title: t.title ?? '',
            description: t.description ?? null,
            customizable: Array.isArray(t.customizable) ? t.customizable : [],
            status: (t.status as string) ?? 'active',
            workflow,
          }) as { id: string };
          details.templates.created += 1;
          details.templates.newIds.push(created.id);
        } catch (e) {
          details.templates.errors.push(t.title ? `${t.title}: ${e instanceof Error ? e.message : String(e)}` : String(e));
          details.templates.newIds.push('');
        }
      }
    }

    // 4. Страницы (POST каждая)
    if (Array.isArray(pages)) {
      for (const p of pages) {
        try {
          await apiClient.createPage({
            page_id: p.page_id ?? p.id ?? '',
            name: p.name ?? '',
            sections: typeof p.sections === 'number' ? p.sections : 0,
            updated: (p.updated as string) ?? null,
            content: (p.content as Record<string, unknown>) ?? {},
          });
          details.pages.created += 1;
        } catch (e) {
          details.pages.errors.push(p.name ? `${p.name}: ${e instanceof Error ? e.message : String(e)}` : String(e));
        }
      }
    }

    // 5. Workflow-схемы: старый template_id → новый (по индексу)
    if (workflowSchemas && typeof workflowSchemas === 'object' && Array.isArray(templates)) {
      const oldIds = templates.map(t => t.id as string);
      const newIds = details.templates.newIds;
      for (let i = 0; i < oldIds.length; i++) {
        const oldId = oldIds[i];
        const newId = newIds[i];
        const nodes = oldId ? workflowSchemas[oldId] : undefined;
        if (!newId || !Array.isArray(nodes) || nodes.length === 0) continue;
        try {
          await apiClient.createWorkflowSchema({ template_id: newId, nodes });
          details.workflowSchemas.created += 1;
        } catch (e) {
          details.workflowSchemas.errors.push(`Шаблон ${oldId}: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    }

  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'Ошибка синхронизации',
      details,
    };
  }

  return {
    ok: true,
    message: `Готово: настроек ${details.settings.updated ? 1 : 0}, сайтов ${details.websites.created}, шаблонов ${details.templates.created}, страниц ${details.pages.created}, схем ${details.workflowSchemas.created}. Ошибки: ${[...details.websites.errors, ...details.templates.errors, ...details.pages.errors, ...details.workflowSchemas.errors].length}.`,
    details,
  };
}

/**
 * Загружает демо-данные (из кода) в БД через API.
 * Не зависит от LocalStorage — подходит для пустой БД.
 */
export async function seedDemoDataToApi(): Promise<SyncResult> {
  const details: SyncResult['details'] = {
    websites: { created: 0, errors: [] },
    templates: { created: 0, errors: [], newIds: [] },
    pages: { created: 0, errors: [] },
    settings: { updated: false },
    workflowSchemas: { created: 0, errors: [] },
  };

  try {
    // 1. Настройки (camelCase → snake_case)
    try {
      await apiClient.updateSettings({
        site_name: defaultSettings.siteName,
        domain: defaultSettings.domain ?? null,
        description: defaultSettings.description ?? null,
        primary_color: defaultSettings.primaryColor,
        accent_color: defaultSettings.accentColor,
        background_color: defaultSettings.backgroundColor,
        meta_title: defaultSettings.metaTitle ?? null,
        meta_description: defaultSettings.metaDescription ?? null,
        keywords: defaultSettings.keywords ?? null,
      });
      details.settings.updated = true;
    } catch (e) {
      details.settings.error = e instanceof Error ? e.message : String(e);
    }

    // 2. Веб-сайты
    for (const w of defaultWebsites) {
      try {
        await apiClient.createWebsite({
          name: w.name,
          client: w.client ?? null,
          description: w.description ?? null,
          url: w.url ?? null,
          screenshot: w.screenshot ?? null,
          technologies: w.technologies ?? [],
          category: w.category ?? null,
          date: w.date ?? null,
          featured: w.featured ?? false,
        });
        details.websites.created += 1;
      } catch (e) {
        details.websites.errors.push(`${w.name}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // 3. Шаблоны (workflow без id)
    for (const t of defaultTemplates) {
      try {
        const workflow = Array.isArray(t.workflow)
          ? t.workflow.map((s: { label: string; type: string; description?: string; position: string }) => ({
              label: s.label,
              type: s.type,
              description: s.description ?? null,
              position: s.position,
            }))
          : undefined;
        const created = await apiClient.createTemplate({
          title: t.title,
          description: t.description ?? null,
          customizable: t.customizable ?? [],
          status: t.status ?? 'active',
          workflow,
        }) as { id: string };
        details.templates.created += 1;
        details.templates.newIds.push(created.id);
      } catch (e) {
        details.templates.errors.push(`${t.title}: ${e instanceof Error ? e.message : String(e)}`);
        details.templates.newIds.push('');
      }
    }

    // 4. Страницы (page_id = id из дефолта: home, about, custom)
    for (const p of defaultPages) {
      try {
        await apiClient.createPage({
          page_id: p.id,
          name: p.name,
          sections: p.sections ?? 0,
          updated: p.updated ?? null,
          content: p.content ?? {},
        });
        details.pages.created += 1;
      } catch (e) {
        details.pages.errors.push(`${p.name}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'Ошибка загрузки демо-данных',
      details,
    };
  }

  return {
    ok: true,
    message: `Демо-данные загружены: настроек ${details.settings.updated ? 1 : 0}, сайтов ${details.websites.created}, шаблонов ${details.templates.created}, страниц ${details.pages.created}. Ошибки: ${[...details.websites.errors, ...details.templates.errors, ...details.pages.errors].length}.`,
    details,
  };
}

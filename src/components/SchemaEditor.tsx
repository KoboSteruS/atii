import React, { useState } from 'react';
import { WorkflowStep } from '../store/AppContext';
import { Plus, Trash2, ChevronUp, ChevronDown, Edit2, Save, X, Zap, Settings, Globe, Bell, CheckCircle } from 'lucide-react';

interface SchemaEditorProps {
  steps: WorkflowStep[];
  onChange: (steps: WorkflowStep[]) => void;
}

// Функция для парсинга позиции "1", "2.1", "3.2.1" -> [1], [2, 1], [3, 2, 1]
function parsePosition(pos: string | undefined): number[] {
  if (!pos || typeof pos !== 'string') return [0];
  return pos.split('.').map(n => parseFloat(n));
}

// Функция для сравнения позиций для сортировки
function comparePositions(a: string, b: string): number {
  const aParts = parsePosition(a);
  const bParts = parsePosition(b);
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;
    if (aVal !== bVal) return aVal - bVal;
  }
  return 0;
}

export function SchemaEditor({ steps, onChange }: SchemaEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<WorkflowStep>>({});

  // Сортируем по position
  const sortedSteps = [...steps].sort((a, b) => comparePositions(a.position, b.position));

  const handleAdd = () => {
    // Находим максимальную основную позицию
    const maxMainPosition = steps.reduce((max, step) => {
      if (!step.position || typeof step.position !== 'string') return max;
      const mainPos = parseFloat(step.position.split('.')[0]);
      return Math.max(max, mainPos);
    }, 0);
    
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      label: 'Новый узел',
      type: 'process',
      description: 'Описание узла',
      position: String(maxMainPosition + 1)
    };
    onChange([...steps, newStep]);
  };

  const handleDelete = (id: string) => {
    onChange(steps.filter(s => s.id !== id));
  };

  const handleMoveUp = (id: string) => {
    const idx = sortedSteps.findIndex(s => s.id === id);
    if (idx === 0) return;
    
    const updated = [...sortedSteps];
    [updated[idx], updated[idx - 1]] = [updated[idx - 1], updated[idx]];
    onChange(updated);
  };

  const handleMoveDown = (id: string) => {
    const idx = sortedSteps.findIndex(s => s.id === id);
    if (idx === sortedSteps.length - 1) return;
    
    const updated = [...sortedSteps];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    onChange(updated);
  };

  const startEdit = (step: WorkflowStep) => {
    setEditingId(step.id);
    setEditForm(step);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    const updated = steps.map(s => 
      s.id === editingId ? { ...s, ...editForm } as WorkflowStep : s
    );
    onChange(updated);
    cancelEdit();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-green-100 text-green-800 border-green-300';
      case 'process': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'api': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'notification': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'complete': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'trigger': return 'from-red-500 to-red-600';
      case 'process': return 'from-gray-600 to-gray-700';
      case 'api': return 'from-blue-500 to-blue-600';
      case 'notification': return 'from-purple-500 to-purple-600';
      case 'complete': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'trigger': return 'Триггер';
      case 'process': return 'Процесс';
      case 'api': return 'API';
      case 'notification': return 'Уведомление';
      case 'complete': return 'Завершение';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Zap size={16} />;
      case 'process': return <Settings size={16} />;
      case 'api': return <Globe size={16} />;
      case 'notification': return <Bell size={16} />;
      case 'complete': return <CheckCircle size={16} />;
      default: return <Settings size={16} />;
    }
  };

  // Вычисляем уровень вложенности для отображения
  const getIndentLevel = (position: string | undefined): number => {
    if (!position || typeof position !== 'string') return 0;
    return position.split('.').length - 1;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Узлы схемы</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Добавить узел
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
        <strong>Подсказка:</strong> Позиция определяет расположение узла. Примеры:
        <ul className="mt-1 ml-4 list-disc">
          <li><code>1</code>, <code>2</code>, <code>3</code> - основная линия (по центру)</li>
          <li><code>2.1</code>, <code>2.2</code> - разветвление от узла 2</li>
          <li><code>5.1</code>, <code>5.2</code>, <code>5.3</code> - три ветки от узла 5</li>
        </ul>
      </div>

      {sortedSteps.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">Схема пуста</p>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Добавить первый узел
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSteps.map((step, idx) => {
            const indentLevel = getIndentLevel(step.position);
            
            return (
              <div
                key={step.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                style={{ marginLeft: `${indentLevel * 24}px` }}
              >
                {editingId === step.id ? (
                  // Режим редактирования
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Название
                        </label>
                        <input
                          type="text"
                          value={editForm.label || ''}
                          onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Тип
                        </label>
                        <select
                          value={editForm.type || 'process'}
                          onChange={(e) => setEditForm({ ...editForm, type: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          style={{ color: '#111827', backgroundColor: '#ffffff' }}
                        >
                          <option value="trigger" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Триггер</option>
                          <option value="process" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Процесс</option>
                          <option value="api" style={{ color: '#111827', backgroundColor: '#ffffff' }}>API</option>
                          <option value="notification" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Уведомление</option>
                          <option value="complete" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Завершение</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Позиция
                        </label>
                        <input
                          type="text"
                          value={editForm.position || '1'}
                          onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="1, 2.1, 3.2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Описание
                      </label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save size={16} />
                        Сохранить
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X size={16} />
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  // Режим просмотра
                  <div className="flex items-start gap-4">
                    {/* Кнопки перемещения */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveUp(step.id)}
                        disabled={idx === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Переместить вверх"
                      >
                        <ChevronUp size={20} />
                      </button>
                      <button
                        onClick={() => handleMoveDown(step.id)}
                        disabled={idx === sortedSteps.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Переместить вниз"
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>

                    {/* Позиция */}
                    <div className="flex-shrink-0 w-16 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg font-bold text-white text-base shadow-md">
                      {step.position}
                    </div>

                    {/* Превью узла (как он будет выглядеть на сайте) */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center bg-gray-900 shadow-lg">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTypeGradient(step.type)} flex items-center justify-center mb-1 shadow-md`}>
                          <div className="text-white">
                            {getTypeIcon(step.type)}
                          </div>
                        </div>
                        <div className="text-[9px] text-gray-300 text-center px-1 leading-tight max-w-[70px] truncate">
                          {step.label}
                        </div>
                      </div>
                    </div>

                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg">{step.label}</h4>
                        <span className={`px-3 py-1 text-sm font-medium rounded-lg border-2 flex items-center gap-1.5 ${getTypeColor(step.type)}`}>
                          {getTypeIcon(step.type)}
                          {getTypeLabel(step.type)}
                        </span>
                      </div>
                      {step.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                      )}
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(step)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(step.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

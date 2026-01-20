import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Database, Webhook, Settings, ArrowRight, Sparkles, Play, Check, Users, Wrench, TestTube, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TerminalCard, MarkdownHeading, CodeList, CodeBadge, StatusLog } from './CodeStyleElements';
import { useApp, Template, WorkflowStep } from '../store/AppContext';

// Удалили старые интерфейсы - теперь используем WorkflowStep из контекста!

// Icon mapping for templates
const templateIcons: Record<string, React.ReactNode> = {
  'crm-integration': <MessageSquare size={32} />,
  'email-automation': <Mail size={32} />,
  'data-sync': <Database size={32} />,
  'webhook-handler': <Webhook size={32} />,
};

export function Templates() {
  const { templates: appTemplates } = useApp();
  
  // Convert app templates to display format
  const templates: Array<Template & { icon: React.ReactNode; workflow: WorkflowStep[] }> = appTemplates.map(t => ({
    ...t,
    icon: templateIcons[t.id] || <Settings size={32} />,
    workflow: t.workflow || [],
  }));

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  
  // Схема теперь прямо в selectedTemplate.workflow - никакого localStorage!

  if (templates.length === 0) {
    return (
      <div className="min-h-screen py-12 text-center">
        <p className="text-zinc-400">Шаблоны не найдены</p>
      </div>
    );
  }

  if (!selectedTemplate) {
    setSelectedTemplate(templates[0]);
    return null;
  }

  // Схема прямо из шаблона - сортируем и рассчитываем позиции
  const sortedSteps = [...selectedTemplate.workflow].sort((a, b) => {
    const aParts = a.position.split('.').map(n => parseFloat(n));
    const bParts = b.position.split('.').map(n => parseFloat(n));
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aVal = aParts[i] || 0;
      const bVal = bParts[i] || 0;
      if (aVal !== bVal) return aVal - bVal;
    }
    return 0;
  });
  
  // Группируем узлы по основной позиции (первая цифра)
  const groups = new Map<number, typeof sortedSteps>();
  sortedSteps.forEach(step => {
    const mainPos = parseFloat(step.position.split('.')[0]);
    if (!groups.has(mainPos)) groups.set(mainPos, []);
    groups.get(mainPos)!.push(step);
  });
  
  const workflowSteps = sortedSteps.map(step => {
    const parts = step.position.split('.');
    const mainPos = parseFloat(parts[0]);
    const subPos = parts.length > 1 ? parseFloat(parts[1]) : 0;
    
    // Вычисляем X позицию по основной позиции - ФИКСИРОВАННОЕ РАССТОЯНИЕ
    const totalMainPositions = groups.size;
    // Фиксированное расстояние между узлами: 12%
    const fixedSpacing = 12;
    const startX = 10; // Начинаем с 10% от левого края
    const x = startX + fixedSpacing * (mainPos - 1);
    
    // Вычисляем Y позицию
    let y = 50; // По умолчанию центр (для целых чисел: 1, 2, 3...)
    
    if (subPos > 0) {
      // Фиксированные позиции:
      // X.1 = вниз (75%)
      // X.2 = вверх (25%)
      if (subPos === 1) {
        y = 75; // Вниз
      } else if (subPos === 2) {
        y = 25; // Вверх
      } else {
        // Fallback для других подпозиций (если будут)
        y = 50;
      }
    }
    
    return {
      ...step,
      position: { x, y }
    };
  });

  const playWorkflow = async () => {
    setIsPlaying(true);
    setCurrentStep(-1);

    for (let i = 0; i < workflowSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsPlaying(false);
    setCurrentStep(-1);
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'from-red-600 to-red-700';
      case 'process': return 'from-zinc-700 to-zinc-800';
      case 'api': return 'from-blue-600 to-blue-700';
      case 'notification': return 'from-purple-600 to-purple-700';
      case 'complete': return 'from-green-600 to-green-700';
      default: return 'from-zinc-700 to-zinc-800';
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'trigger': return <MessageSquare size={20} />;
      case 'process': return <Database size={20} />;
      case 'api': return <ArrowRight size={20} />;
      case 'notification': return <Mail size={20} />;
      case 'complete': return <Check size={20} />;
      default: return <Settings size={20} />;
    }
  };

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Global background for whole page */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-purple-950/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
        
        {/* Moving particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-red-500/60 rounded-full"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 11) % 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 5 + (i % 3) * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
      
      {/* Animated glow orbs */}
      <motion.div 
        className="fixed top-1/3 right-1/4 w-[500px] h-[500px] bg-red-600/30 rounded-full blur-[120px] -z-10"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[120px] -z-10"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-500/50 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles size={16} className="text-red-500" />
            <span className="text-red-400">Готовые решения</span>
          </div>
          <h1 className="text-6xl mb-6">
            Готовые <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">решения</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Проверенные шаблоны и алгоритмы с возможностью настройки под ваши задачи.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-8">
          {/* Top: Workflow Visualization - 90% of screen */}
          <div className="min-h-[85vh]">
            <div className="bg-zinc-950/80 border-2 border-zinc-800 rounded-2xl p-8 backdrop-blur-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Settings className="text-red-500" size={24} />
                  <h2 className="text-2xl">Схема работы: <span className="text-red-500">Базовая</span></h2>
                </div>
                <motion.button
                  onClick={playWorkflow}
                  disabled={isPlaying}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-red-900/50"
                  whileHover={!isPlaying ? { scale: 1.05 } : {}}
                  whileTap={!isPlaying ? { scale: 0.95 } : {}}
                >
                  <Play size={20} />
                  {isPlaying ? 'Выполняется...' : 'Проверить'}
                </motion.button>
              </div>

              {/* Workflow Container - Fixed size with proper boundaries */}
              <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-xl relative overflow-hidden" style={{ minHeight: '500px' }}>
                {/* Grid background */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(rgba(63, 63, 70, 0.4) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(63, 63, 70, 0.4) 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px'
                }} />
                
                {/* Grid dots at intersections */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                  backgroundPosition: '0 0'
                }} />
                
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 0 }}>
                  <defs>
                    <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#a1a1aa" />
                    </marker>
                    <marker id="arrowhead-active" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
                    </marker>
                    {/* Фильтр для свечения */}
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Линии убраны */}
                </svg>

                {/* Nodes */}
                <div className="absolute inset-0" style={{ zIndex: 2 }}>
                  {workflowSteps.map((step, idx) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.08, type: "spring", stiffness: 200 }}
                      style={{
                        position: 'absolute',
                        left: `${step.position.x}%`,
                        top: `${step.position.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        className="relative"
                      >
                        {/* SVG Circle with animated stroke */}
                        <svg className="absolute inset-0 w-24 h-24" style={{ transform: 'rotate(-90deg)' }}>
                          {/* Background circle */}
                          <circle
                            cx="48"
                            cy="48"
                            r="44"
                            fill="none"
                            stroke={currentStep >= idx ? '#3f3f46' : '#3f3f46'}
                            strokeWidth="4"
                          />
                          {/* Animated progress circle - clockwise */}
                          {currentStep === idx && (
                            <motion.circle
                              cx="48"
                              cy="48"
                              r="44"
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 44}
                              initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                              animate={{ strokeDashoffset: 0 }}
                              transition={{ duration: 1, ease: "linear" }}
                            />
                          )}
                          {/* Completed circle - full red */}
                          {currentStep > idx && (
                            <circle
                              cx="48"
                              cy="48"
                              r="44"
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="4"
                            />
                          )}
                        </svg>

                        {/* Main Circle Node */}
                        <motion.div
                          className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                            currentStep >= idx
                              ? 'bg-red-900/40 shadow-lg shadow-red-500/50'
                              : 'bg-zinc-900/90'
                          }`}
                          animate={
                            currentStep === idx
                              ? {
                                  boxShadow: [
                                    '0 0 20px rgba(239, 68, 68, 0.4)',
                                    '0 0 50px rgba(239, 68, 68, 0.8)',
                                    '0 0 20px rgba(239, 68, 68, 0.4)',
                                  ],
                                  scale: [1, 1.05, 1],
                                  transition: { duration: 1.2, repeat: Infinity }
                                }
                              : {}
                          }
                        >
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getNodeColor(step.type)} flex items-center justify-center mb-1 shadow-lg`}>
                            <div className="text-white">
                              {getIconForType(step.type)}
                            </div>
                          </div>
                          
                          {/* Label - smaller text */}
                          <div className={`text-[10px] font-medium text-center px-1 leading-tight ${
                            currentStep >= idx ? 'text-red-300' : 'text-zinc-300'
                          }`}>
                            {step.label}
                          </div>
                        </motion.div>

                        {/* Checkmark for completed */}
                        {currentStep > idx && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-zinc-900"
                          >
                            <Check size={16} className="text-white" />
                          </motion.div>
                        )}

                        {/* Tooltip on hover */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          <div className="bg-zinc-900 border-2 border-zinc-700 rounded-lg p-3 whitespace-nowrap shadow-2xl max-w-xs">
                            <div className="text-sm font-medium text-white mb-1">{step.label}</div>
                            <div className="text-xs text-zinc-400 whitespace-normal">{step.description}</div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Result Message */}
              <AnimatePresence>
                {currentStep === workflowSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 p-6 bg-green-900/20 border-2 border-green-500/50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl mb-1 text-green-400">Процесс завершен успешно!</h3>
                        <p className="text-zinc-300">
                          Все этапы выполнены корректно. Данные обработаны и система готова к работе.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Template Details - Outside the workflow box */}
            <div className="mt-6 p-6 bg-zinc-950/60 border border-zinc-800 rounded-xl">
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Sparkles className="text-red-500" size={20} />
                Настраиваемые параметры
              </h3>
              <div className="flex flex-wrap gap-3">
                {selectedTemplate.customizable.map((param, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-red-600/10 text-red-400 rounded-lg border border-red-900/50"
                  >
                    {param}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: Template Selection */}
          <div>
            <h2 className="text-2xl mb-6 flex items-center gap-2">
              <Settings className="text-red-500" size={24} />
              Выберите кейс
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map((template, idx) => (
                <motion.button
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    setSelectedTemplate(template as any);
                    setIsPlaying(false);
                    setCurrentStep(-1);
                  }}
                  className={`text-left p-6 rounded-xl border-2 transition-all ${
                    selectedTemplate.id === template.id
                      ? 'bg-red-900/20 border-red-500 shadow-lg shadow-red-900/50'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedTemplate.id === template.id
                        ? 'bg-gradient-to-br from-red-600 to-pink-600 shadow-lg shadow-red-500/50'
                        : 'bg-zinc-800'
                    }`}>
                      <div className="text-white">{template.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg mb-2 ${
                        selectedTemplate.id === template.id ? 'text-red-400' : 'text-white'
                      }`}>
                        {template.title}
                      </h3>
                      <p className="text-sm text-zinc-400 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Block */}
        <motion.div 
          className="p-10 bg-gradient-to-br from-red-950/20 to-zinc-950 border border-red-900/30 rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl mb-8 text-center">Как это работает?</h3>
          <div className="grid md:grid-cols-3 gap-8 text-zinc-300">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="text-center"
            >
              <div className="text-red-500 text-6xl mb-4">1</div>
              <p className="text-lg">Выберите подходящий шаблон из списка кейсов</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-red-500 text-6xl mb-4">2</div>
              <p className="text-lg">Посмотрите как работает схема и проверьте процесс</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="text-center"
            >
              <div className="text-red-500 text-6xl mb-4">3</div>
              <p className="text-lg">Настройте параметры под ваши требования</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Implementation Process Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24 mt-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">
              Этапы <span className="text-red-500">внедрения</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              От выбора шаблона до полного запуска за 3-7 дней
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Step 1: Consultation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1765020553734-2c050ddb9494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBjb25zdWx0YXRpb258ZW58MXx8fHwxNzY4Mzk4NzUxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Консультация"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-6 left-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center shadow-2xl">
                    <Users className="text-white" size={32} />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl">Консультация</h3>
                    <span className="px-3 py-1 bg-red-600/80 text-red-100 rounded-full text-sm backdrop-blur-sm">
                      1 день
                    </span>
                  </div>
                  <p className="text-zinc-300">
                    Обсуждаем ваши задачи, выбираем оптимальный шаблон и определяем параметры настройки
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <Check className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Анализ текущих бизнес-процессов</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Подбор подходящего шаблона</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Оценка сроков и стоимости</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Step 2: Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759143545924-beb85b33c0f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JrZmxvdyUyMGF1dG9tYXRpb24lMjBzZXR1cHxlbnwxfHx8fDE3Njg0MjkzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Настройка"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-6 left-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-2xl">
                    <Wrench className="text-white" size={32} />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl">Настройка</h3>
                    <span className="px-3 py-1 bg-blue-600/80 text-blue-100 rounded-full text-sm backdrop-blur-sm">
                      2-3 дня
                    </span>
                  </div>
                  <p className="text-zinc-300">
                    Адаптируем шаблон под ваши системы, настраиваем интеграции и параметры
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <Check className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Подключение к вашим сервисам</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Настройка правил и логики</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Создание тестового окружения</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Step 3: Testing */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1763568258492-9569a0af2127?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRlc3RpbmclMjBjb2RlfGVufDF8fHx8MTc2ODQyOTMyOXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Тестирование"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-6 left-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl">
                    <TestTube className="text-white" size={32} />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl">Тестирование</h3>
                    <span className="px-3 py-1 bg-purple-600/80 text-purple-100 rounded-full text-sm backdrop-blur-sm">
                      1-2 дня
                    </span>
                  </div>
                  <p className="text-zinc-300">
                    Проверяем работу всех сценариев, исправляем ошибки и оптимизируем производительность
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <Check className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Тестирование всех сценариев</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Проверка интеграций</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Оптимизация работы</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Step 4: Launch */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="group"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1762135245629-1e79d4cc30b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrZXQlMjBsYXVuY2glMjBzdWNjZXNzfGVufDF8fHx8MTc2ODQyOTMyNnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Запуск"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-6 left-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-2xl">
                    <Rocket className="text-white" size={32} />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl">Запуск</h3>
                    <span className="px-3 py-1 bg-green-600/80 text-green-100 rounded-full text-sm backdrop-blur-sm">
                      1 день
                    </span>
                  </div>
                  <p className="text-zinc-300">
                    Запускаем систему в production, обучаем вашу команду и передаем документацию
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Развертывание в production</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Обучение команды</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Передача документации</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
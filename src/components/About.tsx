import React from 'react';
import { motion } from 'motion/react';
import { Code2, Zap, Users, Target, TrendingUp, Award, Globe, Sparkles, MessageCircle, Wrench, TestTube, Rocket, Check, FileCode, GitBranch, Terminal } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useApp } from '../store/AppContext';
import { 
  TerminalCard, 
  MarkdownHeading, 
  CodeList, 
  GitTimeline, 
  CodeBadge, 
  StatusLog,
  MethodCard,
  CodeProgress,
  JsonDisplay
} from './CodeStyleElements';

// Icon mapping helper для About
const aboutIconMap: Record<string, any> = {
  code2: Code2,
  zap: Zap,
  users: Users,
  target: Target,
  trendingup: TrendingUp,
  award: Award,
  globe: Globe,
  sparkles: Sparkles,
};

const getAboutIcon = (iconName?: string, size: number = 24) => {
  if (!iconName) return null;
  const IconComponent = aboutIconMap[iconName.toLowerCase()];
  return IconComponent ? <IconComponent size={size} className="text-white" /> : null;
};

export function About() {
  const { pages } = useApp();
  const aboutPage = pages.find(p => (p.page_id || p.id) === 'about');
  const content = aboutPage?.content || {};
  const heroContent = content.hero || {};
  
  // Дефолтные значения
  const defaultStats = [
    { id: '1', value: '100+', label: 'Проектов реализовано', icon: 'target' },
    { id: '2', value: '50+', label: 'Довольных клиентов', icon: 'users' },
    { id: '3', value: '24/7', label: 'Техническая поддержка', icon: 'zap' },
    { id: '4', value: '5+', label: 'Лет на рынке', icon: 'trendingup' }
  ];

  const defaultValues = [
    { id: '1', title: 'Технологическая экспертиза', description: 'Мы владеем современными технологиями и всегда следим за инновациями в IT-индустрии', icon: 'code2', color: 'from-red-600 to-pink-600' },
    { id: '2', title: 'Качество превыше всего', description: 'Каждый проект проходит строгий контроль качества и соответствует лучшим практикам', icon: 'award', color: 'from-purple-600 to-red-600' },
    { id: '3', title: 'Глобальный подход', description: 'Работаем с клиентами по всему миру, создавая решения мирового уровня', icon: 'globe', color: 'from-red-600 to-orange-600' },
    { id: '4', title: 'Инновации и творчество', description: 'Каждое решение - это уникальный продукт, созданный с творческим подходом', icon: 'sparkles', color: 'from-red-600 to-red-800' }
  ];

  const defaultTechnologies = [
    'React', 'Node.js', 'Python', 'TypeScript', 'Docker', 'Kubernetes',
    'AWS', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
    'Microservices', 'CI/CD', 'Machine Learning', 'Blockchain'
  ];
  
  const stats = (content.stats && content.stats.length > 0) ? content.stats : defaultStats;
  const values = (content.values && content.values.length > 0) ? content.values : defaultValues;
  const technologies = (content.technologies && content.technologies.length > 0) ? content.technologies : defaultTechnologies;
  const sectionTitles = content.sectionTitles || {};
  const st = (key: string) => sectionTitles[key] || {};
  const sectionTitle = (key: string, def: string) => st(key).title || def;

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Enhanced background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/15 via-black to-zinc-950" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Diagonal pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(239, 68, 68, 0.1) 100px, rgba(239, 68, 68, 0.1) 102px)'
        }} />
        
        {/* Moving particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-red-500/60 rounded-full"
            style={{
              left: `${(i * 8 + 10) % 100}%`,
              top: `${(i * 9 + 15) % 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 6 + (i % 2) * 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>
      
      {/* Animated glow orbs */}
      <motion.div 
        className="fixed top-1/4 right-1/3 w-[500px] h-[500px] bg-red-600/30 rounded-full blur-[120px] -z-10"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="fixed bottom-1/3 left-1/4 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[120px] -z-10"
        animate={{
          scale: [1, 1.4, 1],
          y: [0, -30, 0],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {heroContent.badge && (
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-500/50 rounded-full mb-8 backdrop-blur-sm"
            animate={{
              boxShadow: [
                '0 0 20px rgba(239, 68, 68, 0.3)',
                '0 0 40px rgba(239, 68, 68, 0.5)',
                '0 0 20px rgba(239, 68, 68, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={16} className="text-red-500" />
              <span className="text-red-400">{heroContent.badge}</span>
          </motion.div>
          )}

          <h1 className="text-7xl mb-6">
            {heroContent.title?.split('\n')[0] || 'Мы создаем'}
            {heroContent.subtitle || heroContent.title?.split('\n')[1] ? (
              <>
                {' '}
                <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                  {heroContent.subtitle || heroContent.title?.split('\n')[1]}
                </span>
              </>
            ) : (
              <>
                {' '}
                <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">будущее</span>
              </>
            )}
          </h1>
          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto">
            {heroContent.description || 'IT-компания, которая помогает решать проблемы через информационные решения. Мы можем разработать почти всё что угодно.'}
          </p>
        </motion.div>

        {/* Stats Section - Glitch Effect */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {stats.map((stat: any, idx: number) => (
            <motion.div
              key={(stat as any).id || idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                rotate: idx % 2 === 0 ? 2 : -2,
              }}
              className="relative p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center group hover:border-red-500/50 transition-all backdrop-blur-sm overflow-hidden"
            >
              {/* Glowing background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/20 group-hover:to-purple-600/20 transition-all duration-500" />
              
              <div className="mx-auto mb-4 text-red-500 relative z-10 flex justify-center">
                {getAboutIcon((stat as any).icon || 'target', 40)}
              </div>
              <div className="text-5xl mb-2 text-red-500 relative z-10 font-bold">{(stat as any).value || stat.value || '0'}</div>
              <div className="text-zinc-400 relative z-10">{(stat as any).label || stat.label || ''}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values Section - Staggered Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-5xl mb-16 text-center">
            {(() => {
              const t = sectionTitle('values', 'Наши ценности');
              const idx = t.lastIndexOf(' ');
              if (idx === -1) return t;
              return (
                <>
                  {t.slice(0, idx + 1)}
                  <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">{t.slice(idx + 1)}</span>
                </>
              );
            })()}
          </h2>

          <div className="grid grid-cols-12 gap-6">
            {values.map((value: any, idx: number) => (
              <motion.div
                key={(value as any).id || idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ 
                  y: -10,
                  rotate: idx % 2 === 0 ? -2 : 2,
                }}
                className={`${
                  idx === 0 ? 'col-span-12 md:col-span-7' :
                  idx === 1 ? 'col-span-12 md:col-span-5' :
                  idx === 2 ? 'col-span-12 md:col-span-6' :
                  'col-span-12 md:col-span-6'
                } group relative p-10 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-red-500/50 transition-all backdrop-blur-sm overflow-hidden`}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${(value as any).color || value.color || 'from-red-600 to-pink-600'} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                {/* Neon line */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                </div>

                <motion.div
                  className={`relative w-16 h-16 bg-gradient-to-br ${(value as any).color || value.color || 'from-red-600 to-pink-600'} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 10,
                    boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)'
                  }}
                >
                  {getAboutIcon((value as any).icon || 'code2')}
                </motion.div>

                <h3 className="relative text-2xl mb-4 group-hover:text-red-400 transition-colors">
                  {(value as any).title || value.title}
                </h3>
                <p className="relative text-zinc-400 text-lg">
                  {(value as any).description || value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technologies Cloud */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-5xl mb-12 text-center">
            {(() => {
              const t = sectionTitle('technologies', 'Технологии, с которыми мы работаем');
              const idx = t.lastIndexOf(' ');
              if (idx === -1) return t;
              return (
                <>
                  {t.slice(0, idx + 1)}
                  <span className="text-red-500">{t.slice(idx + 1)}</span>
                </>
              );
            })()}
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ 
                  scale: 1.15,
                  rotate: Math.random() * 10 - 5,
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)'
                }}
                className="px-6 py-3 bg-zinc-900/70 border border-zinc-700 rounded-full text-zinc-300 hover:bg-red-600/20 hover:border-red-500/50 hover:text-white transition-all backdrop-blur-sm cursor-pointer"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How We Work Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-4">
              Как мы <span className="text-red-500">работаем</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Наш проверенный процесс разработки, который гарантирует качество и результат
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Step 1: Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1634326080825-985cfc816db6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwZGlzY3Vzc2lvbiUyMG1lZXRpbmd8ZW58MXx8fHwxNzY4NDMwNzk1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Анализ и планирование"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-6 left-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center shadow-2xl">
                    <MessageCircle className="text-white" size={32} />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl">Анализ и планирование</h3>
                    <span className="px-3 py-1 bg-red-600/80 text-red-100 rounded-full text-sm backdrop-blur-sm">
                      Этап 1
                    </span>
                  </div>
                  <p className="text-zinc-300">
                    Глубокое погружение в вашу задачу, анализ требований и разработка архитектуры решения
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <Check className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Детальный анализ бизнес-процессов</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Проектирование технической архитектуры</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Составление дорожной карты проекта</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Step 2: Development */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1531498860502-7c67cf02f657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BtZW50JTIwY29kaW5nfGVufDF8fHx8MTc2ODM5NDAxOXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Разработка"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-6 left-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-2xl">
                    <Code2 className="text-white" size={32} />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl">Разработка</h3>
                    <span className="px-3 py-1 bg-blue-600/80 text-blue-100 rounded-full text-sm backdrop-blur-sm">
                      Этап 2
                    </span>
                  </div>
                  <p className="text-zinc-300">
                    Создание продукта с применением лучших практик и современных технологий
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <Check className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Agile-разработка с еженедельными демо</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Code review и парное программирование</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Непрерывная интеграция и деплой</span>
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
                  src="https://images.unsplash.com/photo-1700727448542-50531bc60211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFsaXR5JTIwY29udHJvbCUyMHRlc3Rpbmd8ZW58MXx8fHwxNzY4MzMwMjA4fDA&ixlib=rb-4.1.0&q=80&w=1080"
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
                      Этап 3
                    </span>
                  </div>
                  <p className="text-zinc-300">
                    Комплексное тестирование для обеспечения надежности и производительности
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <Check className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Автоматизированное и ручное тестирование</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Нагрузочное и стресс-тестирование</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Проверка безопасности и уязвимостей</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Step 4: Launch & Support */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="group"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1763568258752-fe55f4ab7267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9qZWN0JTIwZGVwbG95bWVudCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY4NDMwNzk2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Запуск и поддержка"
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
                    <h3 className="text-2xl">Запуск и поддержка</h3>
                    <span className="px-3 py-1 bg-green-600/80 text-green-100 rounded-full text-sm backdrop-blur-sm">
                      Этап 4
                    </span>
                  </div>
                  <p className="text-zinc-300">
                    Плавный запуск в production и долгосрочная техническая поддержка
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Пошаговое развертывание без простоев</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Обучение команды и документация</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <span>Мониторинг и поддержка 24/7</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Mission Statement - Skewed Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ rotate: -1 }}
          className="relative p-12 bg-gradient-to-br from-red-950/30 via-zinc-900 to-purple-950/30 border-2 border-red-900/50 rounded-3xl overflow-hidden mb-24"
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-5xl mb-8">
              Наша <span className="text-red-500">миссия</span>
            </h2>
            <p className="text-2xl text-zinc-300 leading-relaxed mb-8">
              Мы стремимся создавать технологические решения, которые не просто решают задачи, 
              а трансформируют бизнес-процессы наших клиентов, делая их более эффективными, 
              прозрачными и масштабируемыми.
            </p>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Каждый наш проект — это партнерство, где мы не просто выполняем техническое задание, 
              а погружаемся в бизнес клиента, понимаем его потребности и создаем решения, 
              которые приносят реальную ценность.
            </p>
          </div>
        </motion.div>

        {/* Code Style Section - Documentation & Project Management */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <MarkdownHeading level={1} className="mb-6 justify-center">
              <span>Как мы ведем <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">проекты</span></span>
            </MarkdownHeading>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Прозрачность, контроль и организация на каждом этапе
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Project Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <TerminalCard title="project_history.git" variant="success">
                <div className="mb-4 flex items-center gap-2">
                  <GitBranch size={16} className="text-green-500" />
                  <span className="text-green-400 text-sm font-mono">main branch</span>
                </div>
                <GitTimeline
                  items={[
                    {
                      hash: 'f7a3c21',
                      author: 'DevTeam',
                      date: 'Сегодня',
                      message: 'Release v2.1.0 - Новые функции аналитики',
                      branch: 'production'
                    },
                    {
                      hash: 'b4d2e19',
                      author: 'QA Team',
                      date: '2 дня назад',
                      message: 'Все тесты пройдены успешно',
                      branch: 'testing'
                    },
                    {
                      hash: 'c9a1f44',
                      author: 'Backend',
                      date: '5 дней назад',
                      message: 'Оптимизация API endpoints',
                      branch: 'develop'
                    },
                    {
                      hash: 'e2f8b33',
                      author: 'Frontend',
                      date: '1 неделю назад',
                      message: 'Новый UI dashboard компонент',
                      branch: 'feature'
                    }
                  ]}
                />
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <StatusLog 
                    status="success" 
                    message="Проект развивается по графику"
                    timestamp="2024"
                  />
                </div>
              </TerminalCard>
            </motion.div>

            {/* Project Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <TerminalCard title="project_metrics.json" variant="default">
                <div className="space-y-4 mb-6">
                  <JsonDisplay
                    title="Метрики проекта"
                    data={{
                      status: 'active',
                      sprint: 'Sprint 12',
                      team_size: 8,
                      velocity: '42 points',
                      code_quality: '95%',
                      test_coverage: '87%'
                    }}
                  />
                </div>
                <div className="space-y-4 mt-6">
                  <CodeProgress label="Backend Development" percentage={92} />
                  <CodeProgress label="Frontend Implementation" percentage={88} />
                  <CodeProgress label="Testing & QA" percentage={75} />
                  <CodeProgress label="Documentation" percentage={95} />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <CodeBadge color="green">on-track</CodeBadge>
                  <CodeBadge color="blue">agile</CodeBadge>
                  <CodeBadge color="purple">ci/cd</CodeBadge>
                  <CodeBadge color="yellow">monitored</CodeBadge>
                </div>
              </TerminalCard>
            </motion.div>
          </div>

          {/* Development Practices */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MarkdownHeading level={2} className="mb-6">
              Практики разработки
            </MarkdownHeading>
            <div className="grid md:grid-cols-2 gap-6">
              <CodeList
                items={[
                  {
                    icon: <FileCode size={18} className="text-blue-500" />,
                    text: 'Code Review обязателен',
                    subtext: 'Каждая строка кода проверяется senior-разработчиком'
                  },
                  {
                    icon: <Terminal size={18} className="text-green-500" />,
                    text: 'Автоматизированное тестирование',
                    subtext: 'Unit, Integration, E2E тесты для всего кода'
                  },
                  {
                    icon: <GitBranch size={18} className="text-purple-500" />,
                    text: 'Git Flow workflow',
                    subtext: 'Структурированная работа с ветками и релизами'
                  }
                ]}
              />
              <CodeList
                items={[
                  {
                    icon: <Check size={18} className="text-red-500" />,
                    text: 'Continuous Integration',
                    subtext: 'Автоматическая сборка и деплой при каждом коммите'
                  },
                  {
                    icon: <FileCode size={18} className="text-yellow-500" />,
                    text: 'Документация кода',
                    subtext: 'Inline комментарии, README, API документация'
                  },
                  {
                    icon: <Terminal size={18} className="text-cyan-500" />,
                    text: 'Мониторинг 24/7',
                    subtext: 'Отслеживание ошибок и производительности в реальном времени'
                  }
                ]}
              />
            </div>
          </motion.div>

          {/* API Methods Example */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MarkdownHeading level={2} className="mb-6">
              Пример нашей документации
            </MarkdownHeading>
            <div className="grid md:grid-cols-2 gap-6">
              <MethodCard
                name="createProject"
                description="Создает новый проект в системе с заданными параметрами"
                params={[
                  { name: 'name', type: 'string' },
                  { name: 'description', type: 'string' },
                  { name: 'team', type: 'Array<User>' },
                  { name: 'deadline', type: 'Date' }
                ]}
                returns="Promise<Project>"
              />
              <MethodCard
                name="deployToProduction"
                description="Развертывает приложение в production окружение"
                params={[
                  { name: 'environment', type: 'string' },
                  { name: 'version', type: 'string' },
                  { name: 'rollback', type: 'boolean' }
                ]}
                returns="Promise<DeploymentStatus>"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Communication Tools Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <MarkdownHeading level={1} className="mb-6 justify-center">
              <span>Инструменты <span className="text-red-500">коммуникации</span></span>
            </MarkdownHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TerminalCard title="daily_standup.log" variant="success">
              <StatusLog 
                status="success" 
                message="Ежедневные стендапы в 10:00"
                timestamp="каждый день"
              />
              <div className="mt-4 text-sm text-zinc-400">
                <p className="mb-2">• Что сделали вчера</p>
                <p className="mb-2">• Планы на сегодня</p>
                <p>• Блокеры и проблемы</p>
              </div>
            </TerminalCard>

            <TerminalCard title="sprint_review.md" variant="default">
              <StatusLog 
                status="running" 
                message="Демо каждые 2 недели"
                timestamp="bi-weekly"
              />
              <div className="mt-4 text-sm text-zinc-400">
                <p className="mb-2">• Демонстрация новых функций</p>
                <p className="mb-2">• Обратная связь от клиента</p>
                <p>• Планирование следующего спринта</p>
              </div>
            </TerminalCard>

            <TerminalCard title="documentation.docs" variant="default">
              <StatusLog 
                status="pending" 
                message="Постоянное обновление документации"
                timestamp="continuous"
              />
              <div className="mt-4 text-sm text-zinc-400">
                <p className="mb-2">• Техническая документация</p>
                <p className="mb-2">• Руководства пользователя</p>
                <p>• API референсы</p>
              </div>
            </TerminalCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
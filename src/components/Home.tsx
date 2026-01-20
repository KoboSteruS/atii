import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, Code, Zap, Shield, MessageSquare, Mail, Database, TrendingUp, Cpu, Boxes, Workflow, Sparkles, CheckCircle, Clock, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../store/AppContext';
import { 
  TerminalCard, 
  MarkdownHeading, 
  CodeList, 
  GitTimeline, 
  CodeBadge, 
  StatusLog,
  MethodCard,
  CodeProgress
} from './CodeStyleElements';

// Icon mapping helper
const iconMap: Record<string, any> = {
  code: Code,
  zap: Zap,
  shield: Shield,
  'message-square': MessageSquare,
  mail: Mail,
  database: Database,
  boxes: Boxes,
  cpu: Cpu,
  workflow: Workflow,
};

const getIcon = (iconName?: string, size: number = 32) => {
  if (!iconName) return null;
  const IconComponent = iconMap[iconName.toLowerCase()];
  return IconComponent ? <IconComponent size={size} /> : null;
};

export function Home() {
  const { pages } = useApp();
  const homePage = pages.find(p => p.id === 'home');
  const content = homePage?.content || {};
  const heroContent = content.hero || {};
  
  // Используем данные из Context, если они есть, иначе используем дефолтные значения
  const defaultFeatures = [
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
  ];
  
  const defaultProjects = [
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
  ];
  
  const defaultSolutions = [
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
  ];
  
  const defaultCapabilities = [
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
  ];
  
  const defaultStats = [
    { id: '1', value: '100+', label: 'Реализованных проектов' },
    { id: '2', value: '50+', label: 'Довольных клиентов' },
    { id: '3', value: '5+', label: 'Лет опыта' },
    { id: '4', value: '24/7', label: 'Техподдержка' }
  ];
  
  // Используем данные из Context, если они есть и не пустые, иначе дефолтные
  const features = (content.features && content.features.length > 0) ? content.features : defaultFeatures;
  const projects = (content.projects && content.projects.length > 0) ? content.projects : defaultProjects;
  const solutions = (content.solutions && content.solutions.length > 0) ? content.solutions : defaultSolutions;
  const capabilities = (content.capabilities && content.capabilities.length > 0) ? content.capabilities : defaultCapabilities;
  const stats = (content.stats && content.stats.length > 0) ? content.stats : defaultStats;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-red-950/20" />
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }} />
        </div>
        
        {/* Glow orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-600/25 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {heroContent.badge && (
              <motion.div 
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600/10 border border-red-500/30 rounded-full mb-8 backdrop-blur-sm"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(239, 68, 68, 0.2)',
                    '0 0 35px rgba(239, 68, 68, 0.4)',
                    '0 0 20px rgba(239, 68, 68, 0.2)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles size={16} className="text-red-500" />
                <span className="text-red-400 text-sm">{heroContent.badge}</span>
              </motion.div>
            )}

            <h1 className="text-6xl lg:text-7xl mb-6 tracking-tight">
              {heroContent.title?.split('\n')[0] || 'Информационные решения'}
              {heroContent.subtitle || heroContent.title?.split('\n')[1] ? (
                <>
                  <br />
                  <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                    {heroContent.subtitle || heroContent.title?.split('\n')[1]}
                  </span>
                </>
              ) : (
                <>
                  <br />
                  <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                    для вашего бизнеса
                  </span>
                </>
              )}
            </h1>
            <p className="text-xl lg:text-2xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              {heroContent.description || 'IT-компания, которая помогает решать проблемы через современные технологии. Мы можем разработать почти всё что угодно.'}
            </p>
          </motion.div>
          
          {(heroContent.ctaText || heroContent.ctaLink) && (
            <motion.div 
              className="flex gap-4 justify-center flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link 
                to={heroContent.ctaLink || '/custom'} 
                className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 transition-all rounded-lg flex items-center gap-3 overflow-hidden shadow-lg shadow-red-900/50"
              >
                <span className="relative z-10 text-white font-medium">{heroContent.ctaText || 'Начать проект'}</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform text-white" size={20} />
              </Link>
              <Link 
                to="/templates" 
                className="px-8 py-4 bg-transparent hover:bg-zinc-900 transition-all rounded-lg border-2 border-zinc-700 hover:border-red-500/50 backdrop-blur-sm"
              >
                <span className="font-medium">Готовые решения</span>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section with Circuit Background */}
      <section className="relative py-16 border-y border-zinc-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1675602487652-3a4d8cdada94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXJjdWl0JTIwYm9hcmQlMjBwYXR0ZXJufGVufDF8fHx8MTc2ODQyNDQxNHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Circuit Board"
            className="w-full h-full object-cover opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/95 to-black" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={(stat as any).id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl mb-2 text-red-500 font-bold">{(stat as any).value || stat.value}</div>
                <div className="text-zinc-400">{(stat as any).label || stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/20 to-black" />
          {/* Hexagonal pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `
              radial-gradient(circle, rgba(239, 68, 68, 0.2) 1px, transparent 1px),
              radial-gradient(circle, rgba(239, 68, 68, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            backgroundPosition: '0 0, 25px 25px'
          }} />
        </div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-500/30 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl mb-6">
              Почему выбирают <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">АТИИ</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Мы предлагаем комплексные решения для автоматизации и оптимизации ваших бизнес-процессов
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Link
                  to={(feature as any).link || feature.link || '/templates'}
                  className="block group relative p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-red-500/50 transition-all backdrop-blur-sm h-full"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:to-purple-600/10 transition-all duration-500 rounded-2xl" />
                  
                  {/* Top glow line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

                  <motion.div
                    className="relative w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-900/50"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <div className="text-white">{getIcon((feature as any).icon, 32)}</div>
                  </motion.div>

                  <h3 className="relative text-2xl mb-4 group-hover:text-red-400 transition-colors">
                    {(feature as any).title || feature.title}
                  </h3>
                  <p className="relative text-zinc-400 leading-relaxed">
                    {(feature as any).description || feature.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Can Do Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950/10 via-black to-black" />
          {/* Animated diagonal lines */}
          <motion.div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(147, 51, 234, 0.3) 80px, rgba(147, 51, 234, 0.3) 82px)'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '160px 160px']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Floating orbs */}
        <motion.div 
          className="absolute top-20 right-20 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <MarkdownHeading level={1} className="mb-6 justify-center">
              <span>Что мы <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">умеем</span></span>
            </MarkdownHeading>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto text-center">
              От простых интеграций до сложных AI-систем — мы реализуем проекты любой сложности
            </p>
          </motion.div>

          {/* Code Style Cards Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <TerminalCard title="workflow_manager.ts" variant="success">
                <StatusLog 
                  status="success" 
                  message="Автоматизация бизнес-процессов активна"
                  timestamp="2024"
                />
                <div className="mt-4 space-y-3">
                  <CodeProgress label="CRM интеграция" percentage={95} />
                  <CodeProgress label="Email автоматизация" percentage={88} />
                  <CodeProgress label="Синхронизация данных" percentage={92} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <CodeBadge color="blue">real-time</CodeBadge>
                  <CodeBadge color="green">scalable</CodeBadge>
                  <CodeBadge color="purple">cloud-native</CodeBadge>
                </div>
              </TerminalCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <TerminalCard title="project_timeline.log" variant="default">
                <GitTimeline
                  items={[
                    {
                      hash: 'a7f3c21',
                      author: 'АТИИ Team',
                      date: '2 недели назад',
                      message: 'Завершена интеграция с API клиента',
                      branch: 'production'
                    },
                    {
                      hash: 'b2d4e19',
                      author: 'АТИИ Team',
                      date: '1 месяц назад',
                      message: 'Развернута автоматизация рассылок',
                      branch: 'main'
                    },
                    {
                      hash: 'c9a1f44',
                      author: 'АТИИ Team',
                      date: '2 месяца назад',
                      message: 'Запуск MVP проекта',
                      branch: 'release'
                    }
                  ]}
                />
              </TerminalCard>
            </motion.div>
          </div>

          {/* Services List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MarkdownHeading level={2} className="mb-6">
              Наши сервисы
            </MarkdownHeading>
            <CodeList
              items={[
                {
                  icon: <CheckCircle size={18} className="text-green-500" />,
                  text: 'Разработка веб-приложений',
                  subtext: 'React, Vue, Angular + Node.js, Python backend'
                },
                {
                  icon: <CheckCircle size={18} className="text-green-500" />,
                  text: 'Мобильная разработка',
                  subtext: 'React Native, Flutter для iOS и Android'
                },
                {
                  icon: <CheckCircle size={18} className="text-green-500" />,
                  text: 'API интеграции',
                  subtext: 'REST, GraphQL, WebSocket, стороннние сервисы'
                },
                {
                  icon: <CheckCircle size={18} className="text-green-500" />,
                  text: 'Бизнес автоматизация',
                  subtext: 'n8n, Zapier-подобные решения, кастомные workflow'
                },
                {
                  icon: <CheckCircle size={18} className="text-green-500" />,
                  text: 'DevOps & Инфраструктура',
                  subtext: 'Docker, Kubernetes, CI/CD, облачные решения'
                }
              ]}
            />
          </motion.div>

          {/* Capabilities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, idx) => (
              <motion.div
                key={(capability as any).id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 transition-all"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={(capability as any).image || capability.image}
                    alt={(capability as any).title || capability.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                </div>
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
                      {getIcon((capability as any).icon, 24)}
                    </div>
                    <h3 className="text-lg group-hover:text-red-400 transition-colors">
                      {(capability as any).title || capability.title}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-400">{(capability as any).description || capability.description}</p>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/20 to-black" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl mb-6">
              Примеры <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">наших работ</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Реализованные проекты для различных отраслей бизнеса
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={(project as any).id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 transition-all"
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden bg-zinc-900">
                  <img 
                    src={(project as any).image || project.image}
                    alt={(project as any).title || project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="text-sm text-red-400 mb-2">{(project as any).category || project.category}</div>
                  <h3 className="text-xl mb-3 group-hover:text-red-400 transition-colors">
                    {(project as any).title || project.title}
                  </h3>
                  <p className="text-zinc-400 mb-4 leading-relaxed">{(project as any).description || project.description}</p>
                  
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2">
                    {((project as any).tech || project.tech || []).map((tech: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-zinc-800/50 text-zinc-400 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Overlay glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700 hover:border-red-500/50 rounded-lg transition-all backdrop-blur-sm"
            >
              Посмотреть все проекты
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Solutions Preview */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/30 to-black" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl mb-6">
              Готовые <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">решения</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Быстрый старт с проверенными шаблонами автоматизации
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {solutions.map((solution, idx) => (
              <motion.div
                key={(solution as any).id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <Link
                  to={(solution as any).link || solution.link || '/templates'}
                  className="block group p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-red-500/50 transition-all h-full backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-14 h-14 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-900/50"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <div className="text-white">{getIcon((solution as any).icon, 28)}</div>
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl mb-2 group-hover:text-red-400 transition-colors">
                        {(solution as any).title || solution.title}
                      </h3>
                      <p className="text-zinc-400 leading-relaxed">{(solution as any).description || solution.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-10 py-5 bg-red-600 hover:bg-red-700 rounded-lg transition-all text-lg shadow-lg shadow-red-900/50"
            >
              Посмотреть все решения
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section with 3D Background */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1658806283210-6d7330062704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGFic3RyYWN0JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3Njg0MjQ0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="3D Abstract"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        </div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-12 bg-gradient-to-br from-red-950/20 via-zinc-900/50 to-purple-950/20 border border-red-900/30 rounded-3xl overflow-hidden backdrop-blur-sm"
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl mb-6">
                Готовы начать <span className="text-red-500">свой проект?</span>
              </h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                Свяжитесь с нами для обсуждения вашей задачи. Мы поможем выбрать оптимальное решение.
              </p>
              
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/custom"
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-lg shadow-red-900/50"
                >
                  Обсудить проект
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-all"
                >
                  Узнать больше
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
import React, { useState } from 'react';
import { Sparkles, CheckCircle, ArrowRight, Users, Target, Rocket, Code, Layers, Zap, LineChart, Shield, Globe, Terminal, FileCode, GitBranch } from 'lucide-react';
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

interface FormData {
  name: string;
  email: string;
  company: string;
  description: string;
  budget: string;
}

export function CustomSolutions() {
  const { pages } = useApp();
  const customPage = pages.find(p => p.id === 'custom');
  const heroContent = customPage?.content?.hero || {};
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    description: '',
    budget: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Enhanced background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/15 via-black to-red-950/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '70px 70px'
        }} />
        
        {/* Circuit-like pattern */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(239, 68, 68, 0.1) 50px, rgba(239, 68, 68, 0.1) 51px),
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(147, 51, 234, 0.08) 50px, rgba(147, 51, 234, 0.08) 51px)
          `
        }} />
        
        {/* Moving particles */}
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-red-500/50 rounded-full"
            style={{
              left: `${(i * 6 + 5) % 100}%`,
              top: `${(i * 7 + 10) % 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, (i % 2 === 0 ? 40 : -40), 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 7 + (i % 3) * 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      
      {/* Animated glow orbs */}
      <motion.div 
        className="fixed top-1/4 left-1/3 w-[600px] h-[600px] bg-red-600/30 rounded-full blur-[120px] -z-10"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="fixed bottom-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/25 rounded-full blur-[120px] -z-10"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.25, 0.45, 0.25],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {heroContent.badge && (
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-500/50 rounded-full mb-6 backdrop-blur-sm"
            animate={{
              boxShadow: [
                '0 0 20px rgba(239, 68, 68, 0.3)',
                '0 0 40px rgba(239, 68, 68, 0.5)',
                '0 0 20px rgba(239, 68, 68, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={20} className="text-red-500" />
              <span className="text-red-400">{heroContent.badge}</span>
          </motion.div>
          )}
          
          <h1 className="text-6xl mb-6">
            {heroContent.title?.split('\n')[0] || 'Решения'} 
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
                <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">под ключ</span>
              </>
            )}
          </h1>
          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto">
            {heroContent.description || 'Любая ваша идея — от концепции до полной реализации. Вы управляете процессом, мы воплощаем самые смелые задачи.'}
          </p>
        </motion.div>

        {/* Interactive Process - Main Feature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-24"
        >
          <h2 className="text-4xl mb-12 text-center">
            Процесс <span className="text-red-500">работы</span>
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-red-500/50 to-transparent hidden lg:block" />

            <div className="space-y-16">
              {workflowSteps.map((step: any, idx: number) => {
                const stepId = typeof step.id === 'number' ? step.id : parseInt((step as any).id) || idx + 1;
                return (
                <motion.div
                  key={(step as any).id || idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className={`flex items-center gap-8 ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Content */}
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02, x: idx % 2 === 0 ? 10 : -10 }}
                    onHoverStart={() => setActiveStep(stepId)}
                    onHoverEnd={() => setActiveStep(null)}
                  >
                    <div className={`p-8 bg-zinc-900/50 border-2 rounded-2xl backdrop-blur-sm transition-all ${
                      activeStep === stepId ? 'border-red-500 bg-red-900/20' : 'border-zinc-800'
                    }`}>
                      <div className="flex items-start gap-6">
                        <motion.div
                          className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                            activeStep === stepId
                              ? 'bg-gradient-to-br from-red-600 to-pink-600 shadow-red-500/50'
                              : 'bg-gradient-to-br from-zinc-700 to-zinc-800'
                          }`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                          {getCustomIcon((step as any).icon || 'code', 32)}
                        </motion.div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className={`text-2xl transition-colors ${
                              activeStep === stepId ? 'text-red-400' : 'text-white'
                            }`}>
                              {(step as any).title || step.title}
                            </h3>
                            <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">
                              {(step as any).duration || step.duration}
                            </span>
                          </div>
                          <p className="text-zinc-400 mb-4">{(step as any).description || step.description}</p>

                          <div className="grid md:grid-cols-3 gap-3">
                            {((step as any).details || step.details || []).map((detail: string, i: number) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.2 + i * 0.1 }}
                                className="flex items-center gap-2 text-sm text-zinc-500"
                              >
                                <CheckCircle size={16} className="text-red-500 flex-shrink-0" />
                                {detail}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Step Number - Center */}
                  <motion.div
                    className="hidden lg:flex w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-pink-600 items-center justify-center text-2xl font-bold shadow-lg flex-shrink-0 relative z-10"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {stepId}
                  </motion.div>

                  {/* Spacer */}
                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              );
              })}
            </div>
          </div>
        </motion.div>

        {/* Advantages Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-4xl mb-12 text-center">
            Что вы <span className="text-red-500">получаете</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage: any, idx: number) => (
              <motion.div
                key={(advantage as any).id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, rotate: idx % 2 === 0 ? 1 : -1 }}
                className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-red-500/50 transition-all backdrop-blur-sm"
              >
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg flex items-center justify-center mb-4 shadow-lg"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  {getCustomIcon((advantage as any).icon || 'layers', 24)}
                </motion.div>
                <h3 className="text-xl mb-2">{(advantage as any).title || advantage.title}</h3>
                <p className="text-zinc-400">{(advantage as any).description || advantage.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Case Studies */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-4xl mb-12 text-center">
            Примеры <span className="text-red-500">реализованных проектов</span>
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.map((study: any, idx: number) => (
              <motion.div
                key={(study as any).id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -10, rotate: idx % 2 === 0 ? -1 : 1 }}
                className="group p-8 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800 rounded-2xl hover:border-red-500/50 transition-all backdrop-blur-sm"
              >
                <h3 className="text-2xl mb-4 group-hover:text-red-400 transition-colors">
                  {(study as any).title || study.title}
                </h3>
                <p className="text-zinc-300 mb-6">{(study as any).description || study.description}</p>
                <div className="flex flex-wrap gap-2">
                  {((study as any).tech || study.tech || []).map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Code Style Section - Development Process */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <MarkdownHeading level={1} className="mb-6 justify-center">
              <span>Прозрачная <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">разработка</span></span>
            </MarkdownHeading>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Вы управляете процессом на каждом этапе с полным контролем и доступом
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Project Management */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <TerminalCard title="custom_project.log" variant="success">
                <StatusLog 
                  status="running" 
                  message="Проект в разработке - Sprint 5"
                  timestamp="Active"
                />
                <div className="mt-6 space-y-4">
                  <CodeProgress label="UI/UX Design" percentage={100} />
                  <CodeProgress label="Backend API" percentage={78} />
                  <CodeProgress label="Frontend Components" percentage={65} />
                  <CodeProgress label="Testing" percentage={45} />
                  <CodeProgress label="Documentation" percentage={88} />
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-800">
                  <div className="flex flex-wrap gap-2">
                    <CodeBadge color="green">on-time</CodeBadge>
                    <CodeBadge color="blue">high-quality</CodeBadge>
                    <CodeBadge color="purple">custom</CodeBadge>
                  </div>
                </div>
              </TerminalCard>
            </motion.div>

            {/* Development Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <TerminalCard title="sprint_history.git" variant="default">
                <div className="mb-4 flex items-center gap-2">
                  <GitBranch size={16} className="text-blue-500" />
                  <span className="text-blue-400 text-sm font-mono">feature/custom-solution</span>
                </div>
                <GitTimeline
                  items={[
                    {
                      hash: 'd8e5c92',
                      author: 'Senior Dev',
                      date: 'Вчера',
                      message: 'Реализована кастомная интеграция с CRM',
                      branch: 'feature'
                    },
                    {
                      hash: 'a3f7b21',
                      author: 'UI Designer',
                      date: '3 дня назад',
                      message: 'Финальный дизайн dashboard утвержден клиентом',
                      branch: 'design'
                    },
                    {
                      hash: 'c9k4m88',
                      author: 'Backend',
                      date: '1 неделю назад',
                      message: 'API endpoints готовы к тестированию',
                      branch: 'develop'
                    }
                  ]}
                />
              </TerminalCard>
            </motion.div>
          </div>

          {/* Development Standards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MarkdownHeading level={2} className="mb-6">
              Стандарты разработки
            </MarkdownHeading>
            <div className="grid md:grid-cols-2 gap-6">
              <CodeList
                items={[
                  {
                    icon: <FileCode size={18} className="text-red-500" />,
                    text: 'Полная кастомизация',
                    subtext: 'Архитектура разработана индивидуально под вашу задачу'
                  },
                  {
                    icon: <Terminal size={18} className="text-blue-500" />,
                    text: 'Еженедельные демо',
                    subtext: 'Вы видите прогресс и можете вносить изменения'
                  },
                  {
                    icon: <GitBranch size={18} className="text-green-500" />,
                    text: 'Доступ к репозиторию',
                    subtext: 'Полный доступ к коду с первого дня разработки'
                  }
                ]}
              />
              <CodeList
                items={[
                  {
                    icon: <CheckCircle size={18} className="text-purple-500" />,
                    text: 'Ваш выбор технологий',
                    subtext: 'Подбираем оптимальный стек или используем ваш'
                  },
                  {
                    icon: <Shield size={18} className="text-yellow-500" />,
                    text: 'Безопасность по умолчанию',
                    subtext: 'OWASP Top 10, GDPR compliance, шифрование'
                  },
                  {
                    icon: <Globe size={18} className="text-cyan-500" />,
                    text: 'Неограниченные интеграции',
                    subtext: 'Подключаем любые API и сервисы'
                  }
                ]}
              />
            </div>
          </motion.div>

          {/* Service Level Agreement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MarkdownHeading level={2} className="mb-6">
              Гарантии качества (SLA)
            </MarkdownHeading>
            <div className="grid md:grid-cols-2 gap-6">
              <MethodCard
                name="availability"
                description="Гарантированное время работы вашего решения"
                params={[
                  { name: 'uptime', type: '99.9%' },
                  { name: 'support', type: '24/7' },
                  { name: 'response_time', type: '<15 min' }
                ]}
                returns="SLA Guarantee"
              />
              <MethodCard
                name="performance"
                description="Производительность и масштабируемость системы"
                params={[
                  { name: 'load_time', type: '<2 sec' },
                  { name: 'concurrent_users', type: 'unlimited' },
                  { name: 'scalability', type: 'auto' }
                ]}
                returns="Performance SLA"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="p-10 bg-zinc-900/50 border-2 border-zinc-800 rounded-3xl backdrop-blur-sm">
            {!submitted ? (
              <>
                <h2 className="text-3xl mb-6 text-center">Расскажите о вашем проекте</h2>
                <p className="text-zinc-400 mb-8 text-center">
                  Заполните форму, и мы свяжемся с вами для обсуждения деталей
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm mb-2 text-zinc-300">Ваше имя *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-zinc-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-zinc-300">Email *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-zinc-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-zinc-300">Компания</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-black/50 border border-zinc-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-zinc-300">Описание задачи *</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-black/50 border border-zinc-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Расскажите подробнее о вашем проекте и требованиях"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-zinc-300">Планируемый бюджет</label>
                    <select
                      className="w-full px-4 py-3 bg-black/50 border border-zinc-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      <option value="">Выберите диапазон</option>
                      <option value="small">До 500 000 ₽</option>
                      <option value="medium">500 000 - 1 500 000 ₽</option>
                      <option value="large">1 500 000 - 5 000 000 ₽</option>
                      <option value="enterprise">Более 5 000 000 ₽</option>
                    </select>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 transition-colors rounded-lg flex items-center justify-center gap-2 text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Отправить заявку
                    <ArrowRight size={20} />
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl mb-4">Заявка отправлена!</h3>
                <p className="text-zinc-400 mb-8">
                  Мы свяжемся с вами в ближайшее время для обсуждения деталей проекта.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg"
                >
                  Отправить еще одну заявку
                </button>
              </motion.div>
            )}
          </div>

          {/* Pricing Note */}
          <div className="mt-6 p-6 bg-red-950/20 border border-red-900/30 rounded-xl">
            <h4 className="text-lg mb-2 text-red-400">О стоимости</h4>
            <p className="text-zinc-400 text-sm">
              Цена на кастомные решения зависит от сложности задачи и требований. 
              В среднем, стоимость в 2 раза выше готовых шаблонов, но вы получаете 
              полностью индивидуальное решение, идеально подходящее для вашего бизнеса.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
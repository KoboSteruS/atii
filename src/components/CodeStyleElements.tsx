import React from 'react';
import { motion } from 'motion/react';
import { Check, GitBranch, GitCommit, Hash, ChevronRight, Terminal, FileCode, Braces } from 'lucide-react';

// Карточка в стиле терминала
interface TerminalCardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function TerminalCard({ title, children, variant = 'default' }: TerminalCardProps) {
  const colors = {
    default: { dot: 'bg-blue-500', border: 'border-blue-500/30', glow: 'from-blue-500/10' },
    success: { dot: 'bg-green-500', border: 'border-green-500/30', glow: 'from-green-500/10' },
    warning: { dot: 'bg-yellow-500', border: 'border-yellow-500/30', glow: 'from-yellow-500/10' },
    error: { dot: 'bg-red-500', border: 'border-red-500/30', glow: 'from-red-500/10' }
  };

  return (
    <div className={`bg-zinc-950 border ${colors[variant].border} rounded-lg overflow-hidden hover:border-opacity-60 transition-all`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className={`w-3 h-3 rounded-full ${colors[variant].dot}`} />
          </div>
          <Terminal size={14} className="text-zinc-500 ml-2" />
          <span className="text-sm text-zinc-400 font-mono">{title}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 font-mono text-sm">
        {children}
      </div>

      {/* Bottom glow */}
      <div className={`h-1 bg-gradient-to-r ${colors[variant].glow} via-transparent to-transparent`} />
    </div>
  );
}

// Заголовок в Markdown стиле
interface MarkdownHeadingProps {
  level?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

export function MarkdownHeading({ level = 2, children, className = '' }: MarkdownHeadingProps) {
  const hashes = '#'.repeat(level);
  const sizes = { 1: 'text-3xl', 2: 'text-2xl', 3: 'text-xl' };
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-red-500 font-mono opacity-50">{hashes}</span>
      <h2 className={`${sizes[level]} font-normal`}>{children}</h2>
    </div>
  );
}

// Список в code стиле
interface CodeListProps {
  items: Array<{ icon?: React.ReactNode; text: string; subtext?: string }>;
}

export function CodeList({ items }: CodeListProps) {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
          className="flex items-start gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-red-500/30 transition-all group"
        >
          <ChevronRight size={18} className="text-red-500 mt-0.5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          {item.icon && (
            <div className="text-zinc-400 mt-0.5 flex-shrink-0">{item.icon}</div>
          )}
          <div className="flex-1">
            <div className="text-zinc-200 font-mono text-sm">{item.text}</div>
            {item.subtext && (
              <div className="text-zinc-500 text-xs mt-1 font-mono">{item.subtext}</div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Git-коммит стиль для истории/этапов
interface GitTimelineProps {
  items: Array<{
    hash: string;
    author: string;
    date: string;
    message: string;
    branch?: string;
  }>;
}

export function GitTimeline({ items }: GitTimelineProps) {
  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="relative pl-8 pb-4 border-l-2 border-zinc-800 last:border-transparent hover:border-red-500/30 transition-all"
        >
          {/* Commit dot */}
          <div className="absolute -left-[9px] top-0 w-4 h-4 bg-red-500 rounded-full border-4 border-black" />
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-red-500/30 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <GitCommit size={16} className="text-red-500" />
                <code className="text-red-400 text-xs">{item.hash}</code>
                {item.branch && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded text-xs">
                    <GitBranch size={12} className="text-blue-400" />
                    <span className="text-blue-400">{item.branch}</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-zinc-500 font-mono">{item.date}</span>
            </div>
            
            <div className="mb-2 text-zinc-200 font-mono text-sm">{item.message}</div>
            <div className="text-xs text-zinc-500 font-mono">by {item.author}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// JSON/Object стиль для данных
interface JsonDisplayProps {
  data: Record<string, any>;
  title?: string;
}

export function JsonDisplay({ data, title }: JsonDisplayProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2">
          <Braces size={16} className="text-purple-500" />
          <span className="text-sm text-zinc-400 font-mono">{title}</span>
        </div>
      )}
      
      <div className="p-4 font-mono text-sm">
        <div className="text-zinc-500">{'{'}</div>
        {Object.entries(data).map(([key, value], idx) => (
          <div key={idx} className="ml-4 flex items-start gap-2">
            <span className="text-blue-400">"{key}"</span>
            <span className="text-zinc-600">:</span>
            <span className={typeof value === 'string' ? 'text-green-400' : 'text-orange-400'}>
              {typeof value === 'string' ? `"${value}"` : value}
            </span>
            {idx < Object.entries(data).length - 1 && <span className="text-zinc-600">,</span>}
          </div>
        ))}
        <div className="text-zinc-500">{'}'}</div>
      </div>
    </div>
  );
}

// Кнопка в code стиле
interface CodeButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success';
  icon?: React.ReactNode;
}

export function CodeButton({ children, onClick, variant = 'primary', icon }: CodeButtonProps) {
  const variants = {
    primary: 'border-red-500/30 hover:border-red-500 text-red-400 hover:bg-red-500/10',
    secondary: 'border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:bg-zinc-800',
    success: 'border-green-500/30 hover:border-green-500 text-green-400 hover:bg-green-500/10'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-4 py-2 border ${variants[variant]} rounded font-mono text-sm transition-all flex items-center gap-2`}
    >
      <span className="text-zinc-600">$</span>
      {icon}
      {children}
    </motion.button>
  );
}

// Badge в code стиле
interface CodeBadgeProps {
  children: React.ReactNode;
  color?: 'red' | 'blue' | 'green' | 'purple' | 'yellow';
}

export function CodeBadge({ children, color = 'red' }: CodeBadgeProps) {
  const colors = {
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 ${colors[color]} border rounded text-xs font-mono`}>
      <Hash size={10} />
      {children}
    </span>
  );
}

// Статус индикатор в стиле лога
interface StatusLogProps {
  status: 'running' | 'success' | 'error' | 'pending';
  message: string;
  timestamp?: string;
}

export function StatusLog({ status, message, timestamp }: StatusLogProps) {
  const statusConfig = {
    running: { icon: '⚡', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    success: { icon: '✓', color: 'text-green-400', bg: 'bg-green-500/10' },
    error: { icon: '✗', color: 'text-red-400', bg: 'bg-red-500/10' },
    pending: { icon: '○', color: 'text-yellow-400', bg: 'bg-yellow-500/10' }
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-3 p-3 ${config.bg} border border-zinc-800 rounded font-mono text-sm`}>
      <span className={`${config.color} text-lg`}>{config.icon}</span>
      <div className="flex-1">
        <span className={config.color}>[{status.toUpperCase()}]</span>
        <span className="text-zinc-300 ml-2">{message}</span>
      </div>
      {timestamp && <span className="text-zinc-600 text-xs">{timestamp}</span>}
    </div>
  );
}

// Карточка функции/метода
interface MethodCardProps {
  name: string;
  description: string;
  params?: Array<{ name: string; type: string }>;
  returns?: string;
}

export function MethodCard({ name, description, params, returns }: MethodCardProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 hover:border-red-500/30 transition-all group">
      <div className="flex items-start gap-3 mb-3">
        <FileCode size={20} className="text-red-500 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-mono text-lg mb-2">
            <span className="text-purple-400">function</span>{' '}
            <span className="text-red-400">{name}</span>
            <span className="text-zinc-500">(</span>
            {params && params.length > 0 && (
              <span className="text-blue-400">
                {params.map(p => p.name).join(', ')}
              </span>
            )}
            <span className="text-zinc-500">)</span>
          </div>
          
          <p className="text-zinc-400 text-sm mb-3">{description}</p>
          
          {params && params.length > 0 && (
            <div className="mb-2">
              <div className="text-xs text-zinc-600 mb-1">Parameters:</div>
              <div className="space-y-1">
                {params.map((param, idx) => (
                  <div key={idx} className="text-xs font-mono">
                    <span className="text-blue-400">{param.name}</span>
                    <span className="text-zinc-600">: </span>
                    <span className="text-green-400">{param.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {returns && (
            <div className="text-xs font-mono">
              <span className="text-zinc-600">Returns: </span>
              <span className="text-orange-400">{returns}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Прогресс бар в code стиле
interface CodeProgressProps {
  label: string;
  percentage: number;
  showPercentage?: boolean;
}

export function CodeProgress({ label, percentage, showPercentage = true }: CodeProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-mono">
        <span className="text-zinc-400">{label}</span>
        {showPercentage && <span className="text-red-400">{percentage}%</span>}
      </div>
      <div className="h-2 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-red-500 to-pink-500 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}

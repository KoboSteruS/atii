import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, Calendar, Tag, Code, Globe, Eye, Search,
  Filter, ChevronRight, Terminal, GitBranch, MonitorPlay, Sparkles,
  X, Maximize2
} from 'lucide-react';
import { TerminalCard, MarkdownHeading } from './CodeStyleElements';
import { useApp, Website } from '../store/AppContext';

const categories = ['Все', 'E-commerce', 'Dashboard', 'EdTech', 'Management', 'Marketplace', 'Corporate'];

export function Portfolio() {
  const { websites } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewWebsite, setPreviewWebsite] = useState<Website | null>(null);

  const filteredWebsites = websites.filter(site => {
    const matchesCategory = selectedCategory === 'Все' || site.category === selectedCategory;
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredWebsites = websites.filter(w => w.featured);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <MonitorPlay className="text-red-500" size={32} />
            <MarkdownHeading level={1}>## Портфолио Проектов</MarkdownHeading>
          </div>
          <p className="text-zinc-400 text-lg font-mono">
            <span className="text-red-500">$</span> ls --websites --all --production
          </p>
          <div className="mt-4 flex items-center gap-2 text-zinc-500 font-mono text-sm">
            <Globe size={16} />
            <span>{websites.length} Проектов разработано</span>
            <ChevronRight size={16} />
            <span>{featuredWebsites.length} в избранном</span>
          </div>
        </motion.div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Поиск проектов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 transition-colors font-mono"
            />
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="text-zinc-500" size={18} />
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg border font-mono text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-red-500/20 border-red-500 text-red-500'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Tag className="inline mr-2" size={14} />
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Featured Websites */}
        {selectedCategory === 'Все' && featuredWebsites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-yellow-500" size={24} />
              <h2 className="text-2xl font-mono">
                <span className="text-yellow-500">#</span> Избранные Проекты
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredWebsites.map((site, idx) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden hover:border-red-500/50 transition-all"
                >
                  {/* Screenshot */}
                  <div className="relative h-56 overflow-hidden bg-zinc-950">
                    <img 
                      src={site.screenshot} 
                      alt={site.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    
                    {/* Featured badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full backdrop-blur-sm">
                      <Sparkles className="inline mr-1" size={12} />
                      <span className="text-xs font-mono text-yellow-500">Featured</span>
                    </div>

                    {/* Hover overlay with actions */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setPreviewWebsite(site)}
                        className="p-3 bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
                      >
                        <Eye size={20} />
                      </motion.button>
                      <motion.a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                      >
                        <ExternalLink size={20} />
                      </motion.a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg text-white font-mono mb-1">{site.name}</h3>
                    <p className="text-zinc-500 text-sm font-mono mb-3">
                      <span className="text-cyan-500">client:</span> {site.client}
                    </p>
                    
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                      {site.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {site.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-zinc-800/50 border border-zinc-700 rounded text-xs font-mono text-zinc-400">
                          {tech}
                        </span>
                      ))}
                      {site.technologies.length > 3 && (
                        <span className="px-2 py-1 text-xs font-mono text-zinc-500">
                          +{site.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                        <Calendar size={14} />
                        {site.date}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
                        <Tag size={14} />
                        {site.category}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Websites */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Globe className="text-red-500" size={24} />
            <h2 className="text-2xl font-mono">
              <span className="text-red-500">#</span> Все Проекты
            </h2>
            <span className="ml-auto text-zinc-500 font-mono text-sm">
              {filteredWebsites.length} найдено
            </span>
          </div>

          <AnimatePresence mode="wait">
            {filteredWebsites.length > 0 ? (
              <motion.div 
                key="websites"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {filteredWebsites.map((site, idx) => (
                  <motion.div
                    key={site.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <TerminalCard title={`${site.name.toLowerCase().replace(/\s+/g, '-')}.html`} variant="default">
                      <div className="space-y-4">
                        {/* Screenshot Preview */}
                        <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden bg-zinc-950 border-b border-zinc-800">
                          <img 
                            src={site.screenshot} 
                            alt={site.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                          
                          {/* Quick actions overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setPreviewWebsite(site)}
                              className="p-2 bg-red-600 rounded hover:bg-red-500 transition-colors"
                            >
                              <Eye size={18} />
                            </motion.button>
                            <motion.a
                              href={site.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-zinc-800 rounded hover:bg-zinc-700 transition-colors"
                            >
                              <ExternalLink size={18} />
                            </motion.a>
                          </div>
                        </div>

                        {/* Header */}
                        <div>
                          <h3 className="text-white text-lg mb-2">{site.name}</h3>
                          <div className="text-zinc-500 text-sm">
                            <span className="text-cyan-500">const</span>{' '}
                            <span className="text-yellow-500">client</span> = 
                            <span className="text-green-500"> "{site.client}"</span>;
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-zinc-400 text-sm border-l-2 border-zinc-700 pl-3">
                          {site.description}
                        </p>

                        {/* Technologies */}
                        <div>
                          <div className="text-purple-500 mb-2 text-sm">// Stack:</div>
                          <div className="flex flex-wrap gap-2">
                            {site.technologies.map((tech, i) => (
                              <span key={i} className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-600">
                          <div className="flex items-center gap-4">
                            <span>
                              <Tag className="inline mr-1" size={12} />
                              {site.category}
                            </span>
                            <span>
                              <Calendar className="inline mr-1" size={12} />
                              {site.date}
                            </span>
                          </div>
                          <a 
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
                          >
                            <Globe size={14} />
                            Visit
                          </a>
                        </div>
                      </div>
                    </TerminalCard>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="inline-block p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <MonitorPlay className="text-zinc-600 mb-4 mx-auto" size={48} />
                  <p className="text-zinc-500 font-mono">Проекты не найдены</p>
                  <p className="text-zinc-600 text-sm font-mono mt-2">
                    <span className="text-red-500">error:</span> No matching websites
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <div className="p-8 bg-gradient-to-r from-red-600/10 via-pink-600/10 to-purple-600/10 border border-red-500/30 rounded-xl text-center">
            <h3 className="text-2xl mb-3 font-mono">
              <span className="text-red-500">&gt;</span> Хотите свой проект?
            </h3>
            <p className="text-zinc-400 mb-6 font-mono text-sm">
              <span className="text-cyan-500">const</span> yourWebsite = 
              <span className="text-yellow-500"> await</span> createWebsite();
            </p>
            <div className="flex gap-4 justify-center">
              {/* <motion.a
                href="/templates"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-red-500/50 transition-all font-mono"
              >
                Готовые решения
              </motion.a> Временно скрыто */}
              <motion.a
                href="/custom"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all font-mono"
              >
                Под ключ
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Website Preview Modal */}
      <AnimatePresence>
        {previewWebsite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setPreviewWebsite(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden max-w-6xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-xl font-mono text-white">{previewWebsite.name}</h3>
                  <p className="text-sm text-zinc-500 font-mono">{previewWebsite.client}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewWebsite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <button
                    onClick={() => setPreviewWebsite(null)}
                    className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content - Large Screenshot */}
              <div className="flex-1 overflow-auto p-6 bg-zinc-950">
                <img 
                  src={previewWebsite.screenshot} 
                  alt={previewWebsite.name}
                  className="w-full rounded-lg border border-zinc-800"
                />
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-zinc-400 text-sm font-mono mb-2">Описание:</h4>
                    <p className="text-zinc-300">{previewWebsite.description}</p>
                  </div>

                  <div>
                    <h4 className="text-zinc-400 text-sm font-mono mb-2">Технологии:</h4>
                    <div className="flex flex-wrap gap-2">
                      {previewWebsite.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'motion/react';
import logo from '../assets/fae284cb14d195ca8a500c6871ab1edb884752c1.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/10 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <img src={logo} alt="АТИИ" className="h-12 mb-6" />
            <p className="text-zinc-400 mb-6">
              IT-компания, которая помогает решать проблемы через информационные решения
            </p>
            <div className="flex gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg mb-6 text-white">Навигация</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-zinc-400 hover:text-red-500 transition-colors">
                  Главная
                </Link>
              </li>
              {/* <li>
                <Link to="/templates" className="text-zinc-400 hover:text-red-500 transition-colors">
                  Готовые решения
                </Link>
              </li> Временно скрыто */}
              <li>
                <Link to="/custom" className="text-zinc-400 hover:text-red-500 transition-colors">
                  Под ключ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-zinc-400 hover:text-red-500 transition-colors">
                  О нас
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg mb-6 text-white">Услуги</h3>
            <ul className="space-y-3 text-zinc-400">
              <li>CRM интеграция</li>
              <li>Email-рассылки</li>
              <li>Синхронизация данных</li>
              <li>Webhook обработка</li>
              <li>Кастомная разработка</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg mb-6 text-white">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-zinc-400">
                <Mail size={20} className="flex-shrink-0 mt-0.5 text-red-500" />
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Email</div>
                  <a href="mailto:info@atii.ru" className="hover:text-red-500 transition-colors">
                    info@atii.ru
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-zinc-400">
                <Phone size={20} className="flex-shrink-0 mt-0.5 text-red-500" />
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Телефон</div>
                  <a href="tel:+74951234567" className="hover:text-red-500 transition-colors">
                    +7 (495) 123-45-67
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-zinc-400">
                <MapPin size={20} className="flex-shrink-0 mt-0.5 text-red-500" />
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Адрес</div>
                  <span>Москва, Россия</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © {currentYear} АТИИ. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-red-500 transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-red-500 transition-colors">Условия использования</a>
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
    </footer>
  );
}
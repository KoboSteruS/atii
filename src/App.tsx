import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, Navigate } from 'react-router';
import { Menu, X } from 'lucide-react';
import { apiClient } from './api/client';
import { AppProviderWithAPI } from './store/AppContextWithAPI';
import { Home } from './components/Home';
import { Templates } from './components/Templates';
import { CustomSolutions } from './components/CustomSolutions';
import { About } from './components/About';
import { Portfolio } from './components/Portfolio';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import logo from './assets/fae284cb14d195ca8a500c6871ab1edb884752c1.png';

// Компонент для проверки JWT токена и входа в админку
function AdminRoute() {
  const { token } = useParams<{ token: string }>();

  const isValidJWT = (t: string | undefined): boolean => {
    if (!t) return false;
    const parts = t.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  };

  useEffect(() => {
    if (token && isValidJWT(token)) {
      apiClient.setToken(token);
    }
  }, [token]);

  if (!isValidJWT(token)) {
    return <Navigate to="/" replace />;
  }

  return <AdminPanel />;
}

function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Определяем размер экрана
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 450);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Закрываем мобильное меню при смене роута (всегда вызываем хук, порядок важен)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Hide navigation on admin page (проверяем паттерн /token/admin)
  if (location.pathname.match(/^\/[^/]+\/admin$/)) {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { path: '/', label: 'Главная' },
    // { path: '/templates', label: 'Готовые решения' }, // Временно скрыто
    { path: '/custom', label: 'Под ключ' },
    { path: '/portfolio', label: 'Портфолио' },
    { path: '/about', label: 'О нас' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 relative">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="АТИИ" className="h-12" />
          </Link>
          
          {/* Десктопное меню - показывается только на больших экранах (>450px) */}
          {!isMobile && (
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`transition-colors ${isActive(link.path) ? 'text-red-500' : 'text-white hover:text-red-500'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Бургер-кнопка - показывается только на мобилке (≤450px) */}
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              className="flex items-center justify-center w-10 h-10 text-white hover:text-red-500 transition-colors"
              aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* Мобильное выпадающее меню - простое, под навигацией */}
        {isMobile && isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-0 bg-black border-b border-zinc-800 shadow-xl">
            <div className="flex flex-col py-4 px-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-3 px-4 rounded-lg transition-colors text-base ${
                    isActive(link.path)
                      ? 'text-red-500 bg-red-500/10 border border-red-500/30'
                      : 'text-white hover:text-red-500 hover:bg-zinc-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Компонент для автоматического скролла наверх при смене роута
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.match(/^\/[^/]+\/admin$/) !== null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <ScrollToTop />
      <Navigation />
      <main className={isAdminPage ? '' : 'pt-20 flex-1'}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/templates" element={<Templates />} /> Временно скрыто */}
          <Route path="/templates" element={<Navigate to="/" replace />} />
          <Route path="/custom" element={<CustomSolutions />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/:token/admin" element={<AdminRoute />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppProviderWithAPI>
      <Router>
        <AppContent />
      </Router>
    </AppProviderWithAPI>
  );
}
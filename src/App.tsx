import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, Navigate } from 'react-router';
import { AppProvider } from './store/AppContext';
import { Home } from './components/Home';
import { Templates } from './components/Templates';
import { CustomSolutions } from './components/CustomSolutions';
import { About } from './components/About';
import { Portfolio } from './components/Portfolio';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import logo from './assets/fae284cb14d195ca8a500c6871ab1edb884752c1.png';

// Компонент для проверки JWT токена
function AdminRoute() {
  const { token } = useParams<{ token: string }>();
  
  // Простая проверка формата JWT (три части через точку)
  const isValidJWT = (t: string | undefined): boolean => {
    if (!t) return false;
    const parts = t.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  };
  
  if (!isValidJWT(token)) {
    return <Navigate to="/" replace />;
  }
  
  return <AdminPanel />;
}

function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Hide navigation on admin page (проверяем паттерн /token/admin)
  if (location.pathname.match(/^\/[^/]+\/admin$/)) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="АТИИ" className="h-12" />
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-red-500' : 'text-white hover:text-red-500'}`}
            >
              Главная
            </Link>
            <Link 
              to="/templates" 
              className={`transition-colors ${isActive('/templates') ? 'text-red-500' : 'text-white hover:text-red-500'}`}
            >
              Готовые решения
            </Link>
            <Link 
              to="/custom" 
              className={`transition-colors ${isActive('/custom') ? 'text-red-500' : 'text-white hover:text-red-500'}`}
            >
              Под ключ
            </Link>
            <Link 
              to="/portfolio" 
              className={`transition-colors ${isActive('/portfolio') ? 'text-red-500' : 'text-white hover:text-red-500'}`}
            >
              Портфолио
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors ${isActive('/about') ? 'text-red-500' : 'text-white hover:text-red-500'}`}
            >
              О нас
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.match(/^\/[^/]+\/admin$/) !== null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />
      <main className={isAdminPage ? '' : 'pt-20 flex-1'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Templates />} />
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
    <AppProvider>
    <Router>
      <AppContent />
    </Router>
    </AppProvider>
  );
}
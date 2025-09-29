import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import store from './store';
import Timeline from './pages/Timeline.jsx';
import Capture from './pages/Capture.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Landing from './pages/Landing.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

function AppContent() {
  const location = useLocation();

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
      <Header />
      <main className={`flex-grow ${location.pathname === '/' ? '' : 'max-w-3xl mx-auto p-4 pt-20'}`}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/capture" element={<Capture />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}
export default App;

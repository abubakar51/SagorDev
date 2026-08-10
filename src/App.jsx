import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function RouteHandler() {
  const location = useLocation();
  const { siteSettings } = usePortfolio();

  useEffect(() => {
    // If on admin routes, strip any hash e.g. #home
    if (location.pathname.startsWith('/admin') && location.hash) {
      window.history.replaceState(null, '', location.pathname);
    }
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Update page title dynamically using website_name
    const webName = siteSettings?.website_name | "SagorDev | Portfolio";
    if (location.pathname.startsWith('/admin')) {
      document.title = `Admin Panel | ${webName}`;
    } else {
      document.title = webName;
    }
  }, [location.pathname, location.hash, siteSettings]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <RouteHandler />
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </AuthProvider>
  );
}

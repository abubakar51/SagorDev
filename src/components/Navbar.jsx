import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Menu, X, ChevronRight, Download } from 'lucide-react';

export default function Navbar() {
  const { siteSettings } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const allNavLinks = [
    { name: 'Home', href: '#home', visible: siteSettings?.show_hero_section !== false },
    { name: 'About', href: '#about', visible: siteSettings?.show_about_section !== false },
    { name: 'Skills', href: '#skills', visible: siteSettings?.show_skills_section !== false },
    { name: 'Projects', href: '#projects', visible: siteSettings?.show_projects_section !== false },
    { name: 'Services', href: '#services', visible: siteSettings?.show_services_section !== false },
    { name: 'Experience', href: '#experience', visible: siteSettings?.show_experience_section !== false },
    { name: 'Contact', href: '#contact', visible: siteSettings?.show_contact_section !== false },
  ];

  const navLinks = allNavLinks.filter(l => l.visible);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Track active section based on scroll position
      const sections = navLinks.map(link => link.href.replace('#', ''));
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setActiveSection(targetId);
      if (href === '#home') {
        window.history.replaceState(null, '', '/');
      } else {
        window.history.replaceState(null, '', href);
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            {siteSettings?.developer_name ? siteSettings.developer_name.charAt(0) : 'A'}
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              {siteSettings?.header_logo_text || '<Dev.Portfolio />'}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/50 backdrop-blur-md p-1.5 rounded-full border border-slate-700/60 shadow-inner">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-cyan-500 rounded-full shadow-md shadow-cyan-500/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Button: Download CV */}
        <div className="hidden md:flex items-center gap-3">
          {siteSettings?.resume_url && (
            <a
              href={siteSettings.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download CV</span>
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-xl border-b border-slate-800 px-4 pt-3 pb-6 shadow-2xl animate-fadeIn">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </a>
              );
            })}

            {siteSettings?.resume_url && (
              <a
                href={siteSettings.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-sm my-1"
              >
                <Download className="w-4 h-4" />
                <span>Download CV</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


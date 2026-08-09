import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import OverviewTab from '../components/admin/OverviewTab.jsx';
import SiteSettingsTab from '../components/admin/SiteSettingsTab.jsx';
import ProjectsTab from '../components/admin/ProjectsTab.jsx';
import SkillsTab from '../components/admin/SkillsTab.jsx';
import ServicesTab from '../components/admin/ServicesTab.jsx';
import ExperiencesTab from '../components/admin/ExperiencesTab.jsx';
import MessagesTab from '../components/admin/MessagesTab.jsx';
import ProfileTab from '../components/admin/ProfileTab.jsx';

import {
  LayoutDashboard,
  Sliders,
  FolderGit2,
  Cpu,
  Wrench,
  Briefcase,
  MessageSquare,
  User,
  LogOut,
  Globe,
  ExternalLink,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const { admin, loading: authLoading, logout } = useAuth();
  const { siteSettings, messages } = usePortfolio();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, authLoading, navigate]);

  if (authLoading || !admin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-semibold">Verifying Admin Permissions...</p>
      </div>
    );
  }

  const unreadMessages = messages.filter(m => !m.is_read).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'site', label: 'Site & Header/Footer', icon: Sliders },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'experiences', label: 'Experience', icon: Briefcase },
    { id: 'messages', label: 'Inbox', icon: MessageSquare, badge: unreadMessages },
    { id: 'profile', label: 'Admin Profile', icon: User }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative">
      
      {/* Mobile Top Navbar Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <span className="font-bold text-white text-sm">Admin Control Center</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 z-50 h-screen w-72 sm:w-64 max-w-[85vw] bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 sm:p-5 transition-transform duration-300 ease-in-out overflow-y-auto shrink-0
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base leading-tight">Admin Panel</h1>
              <p className="text-[11px] text-cyan-400 font-medium truncate max-w-[130px]" title={siteSettings?.website_name || 'Full Stack Portfolio'}>
                {siteSettings?.website_name || 'Full Stack Portfolio'}
              </p>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-slate-950' : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Footer Actions & Profile */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          
          <a
            href={siteSettings?.live_site_url || '/'}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3 text-slate-500 ml-auto" />
          </a>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => {
                setActiveTab('profile');
                setMobileMenuOpen(false);
              }}
              className="truncate pr-2 text-left hover:opacity-80 transition-opacity"
              title="Click to edit profile"
            >
              <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                <span>{admin.name || 'Admin User'}</span>
                <User className="w-3 h-3 text-cyan-400 shrink-0" />
              </div>
              <div className="text-[10px] text-slate-400 truncate">{admin.email}</div>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
        {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
        {activeTab === 'site' && <SiteSettingsTab />}
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'skills' && <SkillsTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'experiences' && <ExperiencesTab />}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

    </div>
  );
}

import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { FolderGit2, Cpu, MessageSquare, Wrench, Database, ExternalLink, Sparkles, User, Briefcase, Mail, Layers, Eye, EyeOff, RefreshCw, Download } from 'lucide-react';

export default function OverviewTab({ setActiveTab }) {
  const { siteSettings, updateSiteSettings, skills, projects, services, experiences, messages, dbStatus } = usePortfolio();

  const [togglingId, setTogglingId] = useState(null);

  const handleToggleSection = async (key, currentValue) => {
    setTogglingId(key);
    try {
      await updateSiteSettings({ [key]: !currentValue });
    } catch (e) {
      console.error(e);
    } finally {
      setTogglingId(null);
    }
  };

  const sectionsList = [
    { key: 'show_hero_section', label: 'Hero Section', desc: 'Main headline, intro & CTA buttons', icon: Sparkles, tab: 'site' },
    { key: 'show_about_section', label: 'About Section', desc: 'Biography & experience stats', icon: User, tab: 'site' },
    { key: 'show_skills_section', label: 'Skills Section', desc: 'Technical skills & categories', icon: Cpu, tab: 'skills' },
    { key: 'show_projects_section', label: 'Projects Section', desc: 'Portfolio project cards', icon: FolderGit2, tab: 'projects' },
    { key: 'show_services_section', label: 'Services Section', desc: 'Development services & offerings', icon: Wrench, tab: 'services' },
    { key: 'show_experience_section', label: 'Experience Section', desc: 'Career history timeline', icon: Briefcase, tab: 'experiences' },
    { key: 'show_contact_section', label: 'Contact Section', desc: 'Contact info & message form', icon: Mail, tab: 'site' },
  ];

  const unreadMessages = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-8">
      
      {/* Database Connection Status Bar */}
      <div className="p-5 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 shrink-0 text-emerald-400" />
          <div>
            <h4 className="font-bold text-white text-base">
              PostgreSQL Database: Active & Connected
            </h4>
            <p className="text-xs opacity-80 mt-0.5">
              {dbStatus?.host ? `Connected to PostgreSQL host (${dbStatus.host})` : 'All content updates sync live across visitors & database.'}
            </p>
          </div>
        </div>
        <a
          href={siteSettings?.live_site_url || '/'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold shrink-0"
        >
          <span>View Live Portfolio</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
        </a>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div 
          onClick={() => setActiveTab('projects')}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all shadow-xl space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Projects</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{projects.length}</div>
          <div className="text-xs text-cyan-400 font-semibold flex items-center gap-1">Manage Works →</div>
        </div>

        <div 
          onClick={() => setActiveTab('skills')}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all shadow-xl space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Skills</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{skills.length}</div>
          <div className="text-xs text-indigo-400 font-semibold flex items-center gap-1">Manage Skills →</div>
        </div>

        <div 
          onClick={() => setActiveTab('messages')}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all shadow-xl space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inquiries Inbox</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-white">{messages.length}</div>
            {unreadMessages > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {unreadMessages} new
              </span>
            )}
          </div>
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">View Messages →</div>
        </div>

        <div 
          onClick={() => setActiveTab('site')}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all shadow-xl space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Site & CV Settings</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-bold text-white truncate">{siteSettings?.developer_name || 'Developer'}</div>
          <div className="text-xs text-purple-400 font-semibold flex items-center gap-1">Manage CV & Banner →</div>
        </div>

      </div>

      {/* Section Visibility Quick Toggles Grid */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Frontend Section Visibility Master Control</h3>
              <p className="text-slate-400 text-xs">Switch sections on or off to immediately show or hide them on the portfolio website (Header & Footer always remain active).</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionsList.map((item) => {
            const Icon = item.icon;
            const isEnabled = siteSettings ? siteSettings[item.key] !== false : true;
            const isToggling = togglingId === item.key;

            return (
              <div
                key={item.key}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isEnabled 
                    ? 'bg-slate-950 border-cyan-500/30' 
                    : 'bg-slate-950/50 border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg border shrink-0 ${
                    isEnabled 
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{item.label}</h4>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        isEnabled ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600'
                      }`} />
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{item.desc}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleSection(item.key, isEnabled)}
                  disabled={isToggling}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 relative flex items-center shrink-0 cursor-pointer ${
                    isEnabled ? 'bg-gradient-to-r from-cyan-500 to-indigo-600' : 'bg-slate-800'
                  }`}
                  title={isEnabled ? 'Click to hide this section' : 'Click to show this section'}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}>
                    {isToggling && <RefreshCw className="w-2.5 h-2.5 text-slate-950 animate-spin" />}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Summary Preview */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Current Active Banner & CV Link</h3>
          {siteSettings?.resume_url && (
            <a
              href={siteSettings.resume_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Test Download CV</span>
            </a>
          )}
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-sm">
          <div className="text-cyan-400 font-bold">{siteSettings?.developer_name} — {siteSettings?.developer_title}</div>
          <div className="text-slate-300 font-medium text-base">{siteSettings?.hero_title}</div>
          <div className="text-slate-400 text-xs">{siteSettings?.hero_subtitle}</div>
          <div className="pt-2 text-xs text-slate-500 font-mono">
            Resume URL: <span className="text-emerald-400">{siteSettings?.resume_url || 'Not set'}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

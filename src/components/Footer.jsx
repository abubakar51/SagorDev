import React from 'react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Github, Linkedin, Twitter, ArrowUp, Download } from 'lucide-react';

export default function Footer() {
  const { siteSettings } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          
          {/* Logo & Info */}
          <div className="space-y-2 text-center md:text-left">
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
                window.history.replaceState(null, '', '/');
              }}
              className="text-xl font-black text-white hover:text-cyan-400 transition-colors"
            >
              {siteSettings?.header_logo_text || '<Dev.Portfolio />'}
            </a>
            <p className="text-xs text-slate-500 max-w-md">
              {siteSettings?.developer_title || 'Full Stack Web Developer'} {siteSettings?.developer_name ? `• ${siteSettings.developer_name}` : ''}
            </p>
          </div>

          {/* Social Links & Download CV */}
          <div className="flex items-center gap-3">
            {siteSettings?.resume_url && (
              <a
                href={siteSettings.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download CV</span>
              </a>
            )}

            {siteSettings?.github_url && (
              <a href={siteSettings.github_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-cyan-400 hover:border-slate-700 transition-all">
                <Github className="w-5 h-5" />
              </a>
            )}
            {siteSettings?.linkedin_url && (
              <a href={siteSettings.linkedin_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-cyan-400 hover:border-slate-700 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {siteSettings?.twitter_url && (
              <a href={siteSettings.twitter_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-cyan-400 hover:border-slate-700 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            )}
            
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all ml-2"
              title="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            {siteSettings?.footer_text || `© ${new Date().getFullYear()} ${siteSettings?.developer_name || 'Developer'}. All rights reserved.`}
          </div>
        </div>

      </div>
    </footer>
  );
}

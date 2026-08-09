import React from 'react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { ArrowRight, Download, Github, Linkedin, Twitter, Mail, MapPin, Sparkles, Terminal, User } from 'lucide-react';

export default function Hero() {
  const { siteSettings, loading } = usePortfolio();

  if (loading && !siteSettings) {
    return (
      <section id="home" className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-slate-950 text-white">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden bg-slate-950 text-white">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Banner Graphic Overlay from Database */}
      {siteSettings?.banner_url && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img 
            src={siteSettings.banner_url} 
            alt="Hero Banner" 
            className="w-full h-full object-cover filter contrast-125 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-cyan-400 shadow-xl">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available for Full-time Roles & Projects</span>
            </div>

            {/* Developer Title & Name */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-300 flex items-center justify-center lg:justify-start gap-2">
                <Terminal className="w-6 h-6 text-cyan-400" />
                <span>{siteSettings?.developer_name || 'Developer'}</span>
              </h2>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                {siteSettings?.hero_title || 'Building Modern Web Applications with Scalable Architecture'}
              </h1>
            </div>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              {siteSettings?.hero_subtitle || 'Specializing in React, Node.js, Express, PostgreSQL & Cloud Architectures.'}
            </p>

            {/* Location & Contact Meta */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-400">
              {siteSettings?.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>{siteSettings.location}</span>
                </div>
              )}
              {siteSettings?.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>{siteSettings.email}</span>
                </div>
              )}
            </div>

            {/* Action Buttons including Download CV */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href={siteSettings?.primary_cta_link || '#projects'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all"
              >
                <span>{siteSettings?.primary_cta_text || 'View Projects'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {siteSettings?.resume_url ? (
                <a
                  href={siteSettings.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02] transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV</span>
                </a>
              ) : (
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-sm hover:bg-slate-700 transition-all"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download CV</span>
                </a>
              )}

              <a
                href={siteSettings?.secondary_cta_link || '#contact'}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-800 hover:text-white transition-all"
              >
                <span>{siteSettings?.secondary_cta_text || 'Contact Me'}</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 mr-2">Connect:</span>
              {siteSettings?.github_url && (
                <a href={siteSettings.github_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {siteSettings?.linkedin_url && (
                <a href={siteSettings.linkedin_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {siteSettings?.twitter_url && (
                <a href={siteSettings.twitter_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>

          </div>

          {/* Hero Right Avatar Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-75 transition duration-500" />
              
              <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6">
                
                {/* Image Container */}
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-800 relative border border-slate-700 flex items-center justify-center">
                  {siteSettings?.avatar_url ? (
                    <img
                      src={siteSettings.avatar_url}
                      alt={siteSettings?.developer_name || 'Developer Avatar'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-500 p-6 text-center">
                      <User className="w-20 h-20 text-slate-600" />
                      <span className="text-xs">No Avatar Uploaded</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-xs">
                    <div className="font-semibold text-white">{siteSettings?.developer_title || 'Full Stack Web Developer'}</div>
                    <div className="text-cyan-400 text-[11px] font-mono mt-0.5">Stack: ReactJS • NextJS • MongoDB</div>
                  </div>
                </div>

                {/* Tech Badges */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-slate-300 font-medium">
                    ⚡ React 19 & JS
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-slate-300 font-medium">
                    🚀 Node / Express
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-slate-300 font-medium">
                    🐘 PostgreSQL DB
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-slate-300 font-medium">
                    🔐 Auth Protected
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

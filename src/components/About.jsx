import React from 'react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Award, CheckCircle2, Code2, Users, Download, FileText } from 'lucide-react';

export default function About() {
  const { aboutInfo, siteSettings } = usePortfolio();

  return (
    <section id="about" className="py-24 bg-slate-900 border-t border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <UserIcon className="w-3.5 h-3.5" />
            <span>About The Developer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {aboutInfo?.title || 'Passionate Full Stack Engineer & Software Architect'}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-indigo-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Bio Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light whitespace-pre-line">
              {aboutInfo?.bio_text || 'I am a full stack web developer with over 5 years of experience building high-performance web applications, RESTful microservices, and elegant frontends.'}
            </p>

            {/* Highlights List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Full Stack REST APIs</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Robust Express & Node.js backend controllers with JWT authentication middleware.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Database Engineering</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Relational database schemas, indexing & query optimization.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Interactive React UI</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Fast component layouts engineered with modern React, Tailwind CSS & HeroUI.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Admin Dashboard Systems</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Dynamic content administration for real-time site management.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Stats Column */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 shadow-xl flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-black text-white tracking-tight">
                  {aboutInfo?.years_experience || '5+'}
                </div>
                <div className="text-sm font-medium text-slate-400">Years of Development Experience</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 shadow-xl flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Code2 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-black text-white tracking-tight">
                  {aboutInfo?.completed_projects || '30+'}
                </div>
                <div className="text-sm font-medium text-slate-400">Completed Full Stack Projects</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 shadow-xl flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-black text-white tracking-tight">
                  {aboutInfo?.happy_clients || '25+'}
                </div>
                <div className="text-sm font-medium text-slate-400">Satisfied Clients & Partners</div>
              </div>
            </div>

          </div>

        </div>

        {/* Download CV / Resume Banner Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Looking for my complete resume & qualifications?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Download my official CV / Resume PDF containing detailed experience, tech stack & project achievements.
            </p>
          </div>
          <a
            href={siteSettings?.resume_url || '#contact'}
            target={siteSettings?.resume_url ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download CV</span>
          </a>
        </div>

      </div>
    </section>
  );
}

function UserIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

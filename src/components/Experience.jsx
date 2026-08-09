import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Briefcase, GraduationCap, MapPin, Calendar, Clock } from 'lucide-react';

export default function Experience() {
  const { experiences } = usePortfolio();
  const [activeTab, setActiveTab] = useState('all');

  const filteredExp = activeTab === 'all'
    ? experiences
    : experiences.filter(e => e.type === activeTab);

  return (
    <section id="experience" className="py-24 bg-slate-900 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>Career Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Experience & Education Timeline
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Professional work history and academic qualifications.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-indigo-600 mx-auto rounded-full" />
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Timeline ({experiences.length})
          </button>
          <button
            onClick={() => setActiveTab('work')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'work'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Work History</span>
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'education'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Education</span>
          </button>
        </div>

        {/* Timeline List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredExp.map((item, idx) => (
            <div
              key={item.id}
              className="relative pl-8 sm:pl-10 pb-6 border-l-2 border-slate-800 last:border-l-0 group"
            >
              {/* Timeline Icon Node */}
              <div className="absolute -left-3.5 sm:-left-4 top-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-950 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors shadow-lg">
                {item.type === 'education' ? (
                  <GraduationCap className="w-3.5 h-3.5" />
                ) : (
                  <Briefcase className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Card Box */}
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                      item.type === 'education' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      {item.type === 'education' ? 'Academic Degree' : 'Work Position'}
                    </span>
                    <h3 className="text-xl font-bold text-white">{item.role_or_degree}</h3>
                    <h4 className="text-sm font-semibold text-cyan-400">{item.company_or_institution}</h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {item.start_date} - {item.end_date || 'Present'}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line pt-2">
                  {item.description}
                </p>
              </div>

            </div>
          ))}
        </div>

        {filteredExp.length === 0 && (
          <div className="text-center py-16 text-slate-500 bg-slate-950/50 rounded-2xl border border-slate-800">
            No career timeline entries added yet. Add work history and education from the Admin Dashboard.
          </div>
        )}

      </div>
    </section>
  );
}

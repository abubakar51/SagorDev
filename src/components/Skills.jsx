import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import IconRenderer from './IconRenderer.jsx';
import { Cpu, Layers, Sparkles } from 'lucide-react';

export default function Skills() {
  const { skills } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(skills.map(s => s.category))];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  const getLevelLabel = (percent) => {
    if (percent >= 90) return { label: 'Expert', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
    if (percent >= 80) return { label: 'Advanced', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
    return { label: 'Proficient', color: 'text-slate-300 bg-slate-800 border-slate-700' };
  };

  return (
    <section id="skills" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Expertise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Skills & Core Technologies
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Managed dynamically via the Admin Dashboard.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-indigo-600 mx-auto rounded-full" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => {
            const level = getLevelLabel(skill.proficiency_percent);
            return (
              <div
                key={skill.id}
                className="group relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:text-cyan-300 transition-all">
                      <IconRenderer name={skill.icon_name} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {skill.name}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-500">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  {/* Level Tag */}
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${level.color}`}>
                    {level.label}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Proficiency</span>
                    <span className="text-cyan-400 font-mono">{skill.proficiency_percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-1000"
                      style={{ width: `${skill.proficiency_percent}%` }}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No skills found in this category.
          </div>
        )}

      </div>
    </section>
  );
}

import React from 'react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import IconRenderer from './IconRenderer.jsx';
import { Wrench, Sparkles } from 'lucide-react';

export default function Services() {
  const { services } = usePortfolio();

  return (
    <section id="services" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <Wrench className="w-3.5 h-3.5" />
            <span>Development Offerings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Services & Solutions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            High quality full-stack web engineering, custom API development, and software design services.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-indigo-600 mx-auto rounded-full" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <IconRenderer name={service.icon_name} className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center gap-1 text-xs font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn More</span>
                <Sparkles className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-16 text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
            No services listed yet. You can add services from the Admin Dashboard.
          </div>
        )}

      </div>
    </section>
  );
}

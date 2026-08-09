import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

export default function SectionToggleHeader({ title, description, fieldKey, icon: Icon }) {
  const { siteSettings, updateSiteSettings } = usePortfolio();
  const [toggling, setToggling] = useState(false);

  // Default to true if undefined
  const isEnabled = siteSettings ? siteSettings[fieldKey] !== false : true;

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      await updateSiteSettings({ [fieldKey]: !isEnabled });
    } catch (err) {
      console.error('Failed to toggle section visibility:', err);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
      isEnabled 
        ? 'bg-slate-900/90 border-cyan-500/30 shadow-cyan-500/5' 
        : 'bg-slate-900/60 border-slate-800'
    }`}>
      <div className="flex items-start sm:items-center gap-3.5">
        <div className={`p-2.5 rounded-xl border shrink-0 ${
          isEnabled 
            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
            : 'bg-slate-800 border-slate-700 text-slate-500'
        }`}>
          {Icon ? <Icon className="w-5 h-5" /> : (isEnabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />)}
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-bold text-white text-base leading-snug">{title}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              isEnabled 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              {isEnabled ? '● Live on Site' : '○ Hidden on Site'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>

      {/* Switch Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={toggling}
        className="flex items-center gap-3 self-end sm:self-auto px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shrink-0"
      >
        <span className="text-xs font-semibold text-slate-300">
          {isEnabled ? 'Section Enabled' : 'Section Disabled'}
        </span>

        {/* Toggle Switch Pill */}
        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative flex items-center ${
          isEnabled ? 'bg-gradient-to-r from-cyan-500 to-indigo-600' : 'bg-slate-800'
        }`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
            isEnabled ? 'translate-x-6' : 'translate-x-0'
          }`}>
            {toggling && <RefreshCw className="w-2.5 h-2.5 text-slate-950 animate-spin" />}
          </div>
        </div>
      </button>
    </div>
  );
}

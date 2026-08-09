import React from 'react';
import { X, ExternalLink, Github, Tag, CheckCircle } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  const tagsList = project.tags ? project.tags.split(',').map(t => t.trim()) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Project Image Banner */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
          <img
            src={project.banner_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop'}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          {project.featured && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cyan-500/90 text-slate-950 text-xs font-bold shadow-lg">
              ★ Featured Project
            </div>
          )}
        </div>

        {/* Title & Tags */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white">{project.name}</h2>
          
          <div className="flex flex-wrap gap-2">
            {tagsList.map((tag, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-cyan-400 text-xs font-medium border border-slate-700">
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <p className="font-semibold text-white bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {project.short_description}
          </p>
          <div className="whitespace-pre-line text-slate-400">
            {project.full_description || project.short_description}
          </div>
        </div>

        {/* Links Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.live_demo_url && (
              <a
                href={project.live_demo_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm shadow-lg hover:scale-105 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-sm"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}

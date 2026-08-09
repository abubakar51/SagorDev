import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import ProjectModal from './ProjectModal.jsx';
import { FolderGit2, Github, ExternalLink, Search, Star, ArrowUpRight } from 'lucide-react';

export default function Projects() {
  const { projects } = usePortfolio();
  const [filter, setFilter] = useState('all'); // 'all' or 'featured'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'featured' ? p.featured : true;
    const matchesSearch = (
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="projects" className="py-24 bg-slate-900 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Featured Portfolio Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Featured Projects & Applications
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            All project titles, banner images, github links and live demos are fully manageable in the Admin Panel.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-indigo-600 mx-auto rounded-full" />
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 bg-slate-950 p-3 rounded-2xl border border-slate-800">
          
          {/* Tab Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Works ({projects.length})
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === 'featured'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Featured Only</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const tags = project.tags ? project.tags.split(',').map(t => t.trim()) : [];
            return (
              <div
                key={project.id}
                className="group relative rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={project.banner_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                    
                    {project.featured && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow-md">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {project.name}
                    </h3>
                    
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {project.short_description}
                    </p>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {tags.slice(0, 4).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                          {tag}
                        </span>
                      ))}
                      {tags.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] text-slate-500">
                          +{tags.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-6 pt-0 border-t border-slate-900 flex items-center justify-between gap-3 mt-4">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="GitHub Repo"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.live_demo_url && (
                      <a
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
            No projects matched your criteria. You can add new projects in the Admin Dashboard!
          </div>
        )}

        {/* Modal View */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { Plus, Trash2, Edit3, Github, ExternalLink, Star, X, CheckCircle2, AlertCircle, FolderGit2 } from 'lucide-react';
import SectionToggleHeader from './SectionToggleHeader.jsx';

export default function ProjectsTab() {
  const { projects, addProject, updateProject, deleteProject } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    full_description: '',
    banner_url: '',
    github_url: '',
    live_demo_url: '',
    featured: false,
    tags: '',
    order_index: 0
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      short_description: '',
      full_description: '',
      banner_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
      github_url: 'https://github.com/example/my-project',
      live_demo_url: 'https://example.com/demo',
      featured: false,
      tags: 'React, Node.js, PostgreSQL',
      order_index: projects.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name || '',
      short_description: p.short_description || '',
      full_description: p.full_description || '',
      banner_url: p.banner_url || '',
      github_url: p.github_url || '',
      live_demo_url: p.live_demo_url || '',
      featured: !!p.featured,
      tags: p.tags || '',
      order_index: p.order_index || 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      if (editingId) {
        const res = await updateProject(editingId, formData);
        if (res.success) {
          setMsg({ type: 'success', text: 'Project updated successfully!' });
          setIsModalOpen(false);
        } else {
          setMsg({ type: 'error', text: res.error || 'Failed to update' });
        }
      } else {
        const res = await addProject(formData);
        if (res.success) {
          setMsg({ type: 'success', text: 'New project added successfully!' });
          setIsModalOpen(false);
        } else {
          setMsg({ type: 'error', text: res.error || 'Failed to add' });
        }
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = async (id) => {
    const res = await deleteProject(id);
    if (res.success) {
      setMsg({ type: 'success', text: 'Project deleted successfully!' });
    } else {
      setMsg({ type: 'error', text: res.error || 'Failed to delete project' });
    }
    setConfirmDeleteId(null);
  };

  const toggleFeatured = async (p) => {
    await updateProject(p.id, { ...p, featured: !p.featured });
  };

  return (
    <div className="space-y-6">
      
      {/* Section Switch Toggle */}
      <SectionToggleHeader
        title="Projects Section Visibility"
        description="Toggle whether the Projects showcase section is visible on the public frontend website."
        fieldKey="show_projects_section"
        icon={FolderGit2}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Project Works Management</h2>
          <p className="text-slate-400 text-xs">Add, edit, feature or delete portfolio project entries.</p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl border text-sm flex items-center gap-2.5 ${
          msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Projects Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                <img src={p.banner_url} alt={p.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => toggleFeatured(p)}
                  className={`absolute top-2 right-2 p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 backdrop-blur-md shadow-lg ${
                    p.featured ? 'bg-amber-500 text-slate-950' : 'bg-slate-900/80 text-slate-400'
                  }`}
                  title="Toggle Featured"
                >
                  <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-current' : ''}`} />
                  <span>{p.featured ? 'Featured' : 'Mark Featured'}</span>
                </button>
              </div>

              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <p className="text-slate-400 text-xs line-clamp-2 mt-1">{p.short_description}</p>
              
              <div className="text-[11px] font-mono text-cyan-400 mt-2 truncate">
                Tags: {p.tags}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="p-1.5 rounded bg-slate-800 hover:text-white"><Github className="w-3.5 h-3.5" /></a>}
                {p.live_demo_url && <a href={p.live_demo_url} target="_blank" rel="noreferrer" className="p-1.5 rounded bg-slate-800 hover:text-cyan-400"><ExternalLink className="w-3.5 h-3.5" /></a>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Edit</span>
                </button>

                {confirmDeleteId === p.id ? (
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-rose-500/10 border border-rose-500/30">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-2 py-1 rounded bg-rose-600 text-white font-bold text-xs"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(p.id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Edit Project Details' : 'Add New Project'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              
              <div>
                <label className="text-xs font-semibold text-slate-300">Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. CloudFlow SaaS Analytics"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Short Summary Description *</label>
                <input
                  type="text"
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Brief summary shown on cards..."
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Full Project Description</label>
                <textarea
                  rows={4}
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  placeholder="Detailed breakdown shown in modal window..."
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Banner / Image URL</label>
                  <input
                    type="text"
                    value={formData.banner_url}
                    onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Tech Stack Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">GitHub Repository Link</label>
                  <input
                    type="text"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Live Demo URL</label>
                  <input
                    type="text"
                    value={formData.live_demo_url}
                    onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="featuredCheck" className="text-sm font-semibold text-slate-200">
                  Mark as Featured Project on Hero & Home Sections
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold shadow-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { Plus, Trash2, Edit3, X, CheckCircle2, AlertCircle, Briefcase, Calendar } from 'lucide-react';
import SectionToggleHeader from './SectionToggleHeader.jsx';

export default function ExperiencesTab() {
  const { experiences, addExperience, updateExperience, deleteExperience } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    period: '',
    description: '',
    order_index: 0
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      company: '',
      role: '',
      period: '2023 - Present',
      description: '',
      order_index: experiences.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingId(exp.id);
    setFormData({
      company: exp.company || '',
      role: exp.role || '',
      period: exp.period || '',
      description: exp.description || '',
      order_index: exp.order_index || 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      if (editingId) {
        const res = await updateExperience(editingId, formData);
        if (res.success) {
          setMsg({ type: 'success', text: 'Work experience updated successfully!' });
          setIsModalOpen(false);
        } else {
          setMsg({ type: 'error', text: res.error });
        }
      } else {
        const res = await addExperience(formData);
        if (res.success) {
          setMsg({ type: 'success', text: 'New experience entry added!' });
          setIsModalOpen(false);
        } else {
          setMsg({ type: 'error', text: res.error });
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
    const res = await deleteExperience(id);
    if (res.success) setMsg({ type: 'success', text: 'Experience record deleted' });
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Section Switch Toggle */}
      <SectionToggleHeader
        title="Experience Section Visibility"
        description="Toggle whether the Career Experience & Timeline section is visible on the public frontend website."
        fieldKey="show_experience_section"
        icon={Briefcase}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Career Experience Management</h2>
          <p className="text-slate-400 text-xs">Manage timeline of professional employment & roles.</p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
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

      {/* List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{exp.role}</h3>
                  <div className="text-xs text-cyan-400 font-semibold">{exp.company}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{exp.period}</span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed pt-1">{exp.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEditModal(exp)} className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700">
                <Edit3 className="w-4 h-4" />
              </button>

              {confirmDeleteId === exp.id ? (
                <div className="flex items-center gap-1 p-1 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <button
                    onClick={() => handleDelete(exp.id)}
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
                <button onClick={() => setConfirmDeleteId(exp.id)} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Edit Work Experience' : 'Add Experience Entry'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-300">Job Title / Role *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. TechCorp Solutions Inc."
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Employment Period *</label>
                <input
                  type="text"
                  required
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="e.g. 2022 - Present"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Role Responsibilities & Achievements</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold shadow-lg">
                  {saving ? 'Saving...' : editingId ? 'Update Experience' : 'Add Experience'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

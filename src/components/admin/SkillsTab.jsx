import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import IconRenderer from '../IconRenderer.jsx';
import { Plus, Trash2, Edit3, X, CheckCircle2, AlertCircle, Cpu } from 'lucide-react';
import SectionToggleHeader from './SectionToggleHeader.jsx';

export default function SkillsTab() {
  const { skills, addSkill, updateSkill, deleteSkill } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category: 'Frontend',
    name: '',
    proficiency_percent: 90,
    icon_name: 'Code2',
    order_index: 0
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const iconOptions = [
    'Code2', 'FileCode', 'Palette', 'Server', 'Cpu', 'Database',
    'HardDrive', 'Container', 'GitBranch', 'Zap', 'Globe', 'Terminal',
    'Layout', 'Shield', 'Smartphone', 'Sparkles', 'Box', 'Layers'
  ];

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      category: 'Frontend',
      name: '',
      proficiency_percent: 85,
      icon_name: 'Code2',
      order_index: skills.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingId(s.id);
    setFormData({
      category: s.category || 'Frontend',
      name: s.name || '',
      proficiency_percent: s.proficiency_percent || 85,
      icon_name: s.icon_name || 'Code2',
      order_index: s.order_index || 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      if (editingId) {
        const res = await updateSkill(editingId, formData);
        if (res.success) {
          setMsg({ type: 'success', text: 'Skill updated successfully!' });
          setIsModalOpen(false);
        } else {
          setMsg({ type: 'error', text: res.error });
        }
      } else {
        const res = await addSkill(formData);
        if (res.success) {
          setMsg({ type: 'success', text: 'New skill added successfully!' });
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
    const res = await deleteSkill(id);
    if (res.success) {
      setMsg({ type: 'success', text: 'Skill deleted' });
    }
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Section Switch Toggle */}
      <SectionToggleHeader
        title="Skills Section Visibility"
        description="Toggle whether the Skills & Technologies section is visible on the public frontend website."
        fieldKey="show_skills_section"
        icon={Cpu}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Skills & Technologies Management</h2>
          <p className="text-slate-400 text-xs">Manage technical skills, proficiency levels, categories & icons.</p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
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

      {/* Skills Table List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Icon & Skill Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Proficiency</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {skills.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                      <IconRenderer name={s.icon_name} className="w-4 h-4" />
                    </div>
                    <span>{s.name}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300">
                      {s.category}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 w-44">
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${s.proficiency_percent}%` }} />
                      </div>
                      <span className="text-xs font-mono text-slate-400">{s.proficiency_percent}%</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {confirmDeleteId === s.id ? (
                        <div className="flex items-center gap-1 p-1 rounded-lg bg-rose-500/10 border border-rose-500/30">
                          <button
                            onClick={() => handleDelete(s.id)}
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
                          onClick={() => setConfirmDeleteId(s.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Edit Technical Skill' : 'Add New Skill'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              
              <div>
                <label className="text-xs font-semibold text-slate-300">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Skill / Technology Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React / Next.js"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Proficiency Percentage</span>
                  <span className="text-cyan-400 font-mono">{formData.proficiency_percent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={formData.proficiency_percent}
                  onChange={(e) => setFormData({ ...formData, proficiency_percent: parseInt(e.target.value, 10) })}
                  className="w-full mt-2 accent-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Lucide Icon Name</label>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                    <IconRenderer name={formData.icon_name} className="w-5 h-5" />
                  </div>
                  <select
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
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
                  {saving ? 'Saving...' : editingId ? 'Update Skill' : 'Save Skill'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

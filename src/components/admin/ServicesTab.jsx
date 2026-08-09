import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import IconRenderer from '../IconRenderer.jsx';
import { Plus, Trash2, Edit3, X, CheckCircle2, AlertCircle, Wrench } from 'lucide-react';
import SectionToggleHeader from './SectionToggleHeader.jsx';

export default function ServicesTab() {
  const { services, addService, updateService, deleteService } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'Code',
    order_index: 0
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const iconOptions = ['Code', 'Server', 'Database', 'Layout', 'Cpu', 'Globe', 'Zap', 'Shield', 'Smartphone'];

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', icon_name: 'Code', order_index: services.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingId(s.id);
    setFormData({
      title: s.title || '',
      description: s.description || '',
      icon_name: s.icon_name || 'Code',
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
        const res = await updateService(editingId, formData);
        if (res.success) {
          setMsg({ type: 'success', text: 'Service updated successfully!' });
          setIsModalOpen(false);
        }
      } else {
        const res = await addService(formData);
        if (res.success) {
          setMsg({ type: 'success', text: 'New service added successfully!' });
          setIsModalOpen(false);
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
    const res = await deleteService(id);
    if (res.success) setMsg({ type: 'success', text: 'Service deleted' });
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Section Switch Toggle */}
      <SectionToggleHeader
        title="Services Section Visibility"
        description="Toggle whether the Services & Offerings section is visible on the public frontend website."
        fieldKey="show_services_section"
        icon={Wrench}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Services & Offerings Management</h2>
          <p className="text-slate-400 text-xs">Manage development services, descriptions and icons.</p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <IconRenderer name={s.icon_name} className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{s.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{s.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEditModal(s)} className="p-2 rounded-lg bg-slate-800 text-cyan-400">
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
                <button onClick={() => setConfirmDeleteId(s.id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-300">Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Full Stack Web Development"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Icon</label>
                <select
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold shadow-lg">
                  {saving ? 'Saving...' : editingId ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

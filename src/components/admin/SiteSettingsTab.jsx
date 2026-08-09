import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { Save, CheckCircle2, AlertCircle, RefreshCw, FileText, Download, ExternalLink, Sparkles, User, Mail } from 'lucide-react';
import SectionToggleHeader from './SectionToggleHeader.jsx';

export default function SiteSettingsTab() {
  const { siteSettings, aboutInfo, updateSiteSettings, updateAboutInfo } = usePortfolio();

  const [settingsForm, setSettingsForm] = useState({
    website_name: '',
    developer_name: '',
    developer_title: '',
    header_logo_text: '',
    hero_title: '',
    hero_subtitle: '',
    primary_cta_text: '',
    primary_cta_link: '',
    secondary_cta_text: '',
    secondary_cta_link: '',
    avatar_url: '',
    resume_url: '',
    banner_url: '',
    footer_text: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    email: '',
    phone: '',
    location: '',
    live_site_url: ''
  });

  const [aboutForm, setAboutForm] = useState({
    title: '',
    bio_text: '',
    years_experience: '',
    completed_projects: '',
    happy_clients: ''
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (siteSettings) setSettingsForm({ ...siteSettings });
    if (aboutInfo) setAboutForm({ ...aboutInfo });
  }, [siteSettings, aboutInfo]);

  const handleSettingsChange = (e) => {
    setSettingsForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAboutChange = (e) => {
    setAboutForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const res1 = await updateSiteSettings(settingsForm);
      const res2 = await updateAboutInfo(aboutForm);

      if (res1.success && res2.success) {
        setMsg({ type: 'success', text: 'Site settings & Download CV link updated successfully!' });
      } else {
        setMsg({ type: 'error', text: res1.error || res2.error || 'Update failed' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Header & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">General Site & Download CV Settings</h2>
          <p className="text-slate-400 text-xs">Manage website header, titles, banner images, CV download link, and footer text.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving Changes...' : 'Save Site Settings'}</span>
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

      {/* Download CV / Resume Dedicated Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Download CV / Resume Management</h3>
              <p className="text-slate-400 text-xs">Set the link for the Download CV button displayed across Hero, Navbar, About, and Footer.</p>
            </div>
          </div>

          {settingsForm.resume_url && (
            <a
              href={settingsForm.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold transition-all shrink-0 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Test Download CV</span>
            </a>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <span>Resume / CV Download URL (PDF or Drive link)</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">Managed on Admin Panel</span>
            </label>
            <input
              type="text"
              name="resume_url"
              value={settingsForm.resume_url || ''}
              onChange={handleSettingsChange}
              placeholder="https://example.com/alex_vance_resume.pdf"
              className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Visitors can click "Download CV" to view or download your latest CV file directly.</span>
            {settingsForm.resume_url ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Link Configured
              </span>
            ) : (
              <span className="text-amber-400 font-semibold">No URL set</span>
            )}
          </div>
        </div>
      </div>

      {/* Basic Identity & Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-cyan-400 border-b border-slate-800 pb-2">Website Branding & Header</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Website Title Name</label>
            <input
              type="text"
              name="website_name"
              value={settingsForm.website_name || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Developer Name</label>
            <input
              type="text"
              name="developer_name"
              value={settingsForm.developer_name || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Developer Professional Role Title</label>
            <input
              type="text"
              name="developer_title"
              value={settingsForm.developer_title || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Header Logo Text (e.g. &lt;Alex.Dev /&gt;)</label>
            <input
              type="text"
              name="header_logo_text"
              value={settingsForm.header_logo_text || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Avatar Image URL</label>
            <input
              type="text"
              name="avatar_url"
              value={settingsForm.avatar_url || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between gap-2 mb-1">
              <label className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <span>Live Published Site URL (Render / Production Domain)</span>
              </label>
              {settingsForm.live_site_url && (
                <a
                  href={settingsForm.live_site_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 underline"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="url"
              name="live_site_url"
              placeholder="e.g. https://my-portfolio.onrender.com"
              value={settingsForm.live_site_url || ''}
              onChange={handleSettingsChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Used by the admin panel "View Public Site" buttons to navigate directly to your published live deployment (e.g. Render, Vercel, or custom domain). Leave blank to use default relative path.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Banner Controls */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <SectionToggleHeader
          title="Hero Section Visibility"
          description="Toggle whether the top Hero banner, developer title, bio tagline & CTA buttons are shown on the portfolio frontend."
          fieldKey="show_hero_section"
          icon={Sparkles}
        />

        <h3 className="text-base font-bold text-cyan-400 border-b border-slate-800 pb-2">Hero & Banner Section Content</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Hero Main Banner Headline Title</label>
            <input
              type="text"
              name="hero_title"
              value={settingsForm.hero_title || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Hero Subtitle Text / Description</label>
            <textarea
              name="hero_subtitle"
              rows={3}
              value={settingsForm.hero_subtitle || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300">Primary CTA Text</label>
              <input
                type="text"
                name="primary_cta_text"
                value={settingsForm.primary_cta_text || ''}
                onChange={handleSettingsChange}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Primary CTA Link (e.g. #projects)</label>
              <input
                type="text"
                name="primary_cta_link"
                value={settingsForm.primary_cta_link || ''}
                onChange={handleSettingsChange}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300">Secondary CTA Text</label>
              <input
                type="text"
                name="secondary_cta_text"
                value={settingsForm.secondary_cta_text || ''}
                onChange={handleSettingsChange}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Secondary CTA Link (e.g. #contact)</label>
              <input
                type="text"
                name="secondary_cta_link"
                value={settingsForm.secondary_cta_link || ''}
                onChange={handleSettingsChange}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Banner Graphic Image URL</label>
            <input
              type="text"
              name="banner_url"
              value={settingsForm.banner_url || ''}
              onChange={handleSettingsChange}
              placeholder="https://..."
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* About Section Management */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <SectionToggleHeader
          title="About Section Visibility"
          description="Toggle whether the About Me story biography and statistics counters are shown on the portfolio frontend."
          fieldKey="show_about_section"
          icon={User}
        />

        <h3 className="text-base font-bold text-cyan-400 border-b border-slate-800 pb-2">About Section & Stats</h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">About Section Title</label>
            <input
              type="text"
              name="title"
              value={aboutForm.title || ''}
              onChange={handleAboutChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Biography / Full About Text</label>
            <textarea
              name="bio_text"
              rows={4}
              value={aboutForm.bio_text || ''}
              onChange={handleAboutChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300">Years Experience (e.g. 5+)</label>
              <input
                type="text"
                name="years_experience"
                value={aboutForm.years_experience || ''}
                onChange={handleAboutChange}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Completed Projects (e.g. 30+)</label>
              <input
                type="text"
                name="completed_projects"
                value={aboutForm.completed_projects || ''}
                onChange={handleAboutChange}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Happy Clients (e.g. 25+)</label>
              <input
                type="text"
                name="happy_clients"
                value={aboutForm.happy_clients || ''}
                onChange={handleAboutChange}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social & Contact Meta */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <SectionToggleHeader
          title="Contact Section Visibility"
          description="Toggle whether the Contact Information & Message Inquiry Form section is shown on the portfolio frontend."
          fieldKey="show_contact_section"
          icon={Mail}
        />

        <h3 className="text-base font-bold text-cyan-400 border-b border-slate-800 pb-2">Social Links & Contact Info</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">GitHub Profile URL</label>
            <input
              type="text"
              name="github_url"
              value={settingsForm.github_url || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">LinkedIn Profile URL</label>
            <input
              type="text"
              name="linkedin_url"
              value={settingsForm.linkedin_url || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Twitter / X URL</label>
            <input
              type="text"
              name="twitter_url"
              value={settingsForm.twitter_url || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Public Contact Email</label>
            <input
              type="email"
              name="email"
              value={settingsForm.email || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Public Phone Number</label>
            <input
              type="text"
              name="phone"
              value={settingsForm.phone || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Location / Region</label>
            <input
              type="text"
              name="location"
              value={settingsForm.location || ''}
              onChange={handleSettingsChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">Footer Copyright Text</label>
          <input
            type="text"
            name="footer_text"
            value={settingsForm.footer_text || ''}
            onChange={handleSettingsChange}
            className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500"
          />
        </div>
      </div>

    </form>
  );
}

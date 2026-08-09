import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export default function Contact() {
  const { siteSettings, sendContactMessage } = usePortfolio();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, message: '', error: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, message: '', error: '' });

    try {
      const res = await sendContactMessage(formData);
      if (res.success) {
        setStatus({
          loading: false,
          success: true,
          message: 'Thank you! Your message has been received. I will get back to you soon.',
          error: ''
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({
          loading: false,
          success: false,
          message: '',
          error: res.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: '',
        error: 'Network connection issue. Please try again later.'
      });
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Contact Me & Start a Project
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Have a project in mind or looking for a full stack engineer? Send me a message below.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-indigo-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
              
              <h3 className="text-2xl font-bold text-white">Contact Information</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Feel free to reach out directly via email or phone. Messages sent through the form are saved directly to my developer database inbox.
              </p>

              <div className="space-y-4 pt-2">
                
                {siteSettings?.email && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Direct Email</div>
                      <a href={`mailto:${siteSettings.email}`} className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors">
                        {siteSettings.email}
                      </a>
                    </div>
                  </div>
                )}

                {siteSettings?.phone && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Phone Number</div>
                      <a href={`tel:${siteSettings.phone}`} className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">
                        {siteSettings.phone}
                      </a>
                    </div>
                  </div>
                )}

                {siteSettings?.location && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Current Location</div>
                      <div className="text-sm font-semibold text-white">
                        {siteSettings.location}
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>

          {/* Message Form Column */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
              
              <h3 className="text-2xl font-bold text-white">Send a Message</h3>

              {status.success && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{status.message}</span>
                </div>
              )}

              {status.error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{status.error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project Discussion / Job Offer"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Your Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message details here..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all disabled:opacity-50"
              >
                {status.loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { User, Mail, Lock, KeyRound, Save, RefreshCw, CheckCircle2, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';

export default function ProfileTab() {
  const { admin, updateAdminProfile } = useAuth();

  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!name.trim() || !email.trim()) {
      setMsg({ type: 'error', text: 'Name and email address are required.' });
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        setMsg({ type: 'error', text: 'Please enter your current password to set a new password.' });
        return;
      }
      if (newPassword.length < 6) {
        setMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setMsg({ type: 'error', text: 'New passwords do not match. Please check again.' });
        return;
      }
    }

    setSaving(true);

    try {
      const res = await updateAdminProfile({
        name: name.trim(),
        email: email.trim(),
        currentPassword,
        newPassword
      });

      if (res.success) {
        setMsg({ type: 'success', text: res.message || 'Profile updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMsg({ type: 'error', text: res.error || 'Failed to update profile.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Account Security</span>
          </div>
          <h2 className="text-xl font-bold text-white">Admin Profile & Security Settings</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Update your admin display name, login email address, and change password securely.
          </p>
        </div>
      </div>

      {/* Alert Messages */}
      {msg.text && (
        <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 animate-fadeIn ${
          msg.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          )}
          <span className="leading-relaxed">{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Profile & Password Form */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Account Info Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <h3 className="text-base font-bold text-cyan-400 border-b border-slate-800 pb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Basic Account Details</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Admin Display Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Developer Admin"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Admin Login Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@developer.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Changing your email will update your login credentials immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Password Change Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>Change Password</span>
                </h3>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded-full font-mono">
                  Optional
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Leave password fields empty if you only want to update your name or email.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password to authorize changes"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Profile...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Side: Account Overview Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-6">
            
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 mx-auto flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-cyan-500/20">
                {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">{admin?.name || 'Admin User'}</h4>
                <p className="text-xs text-slate-400 truncate">{admin?.email}</p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="capitalize">{admin?.role || 'Administrator'}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Session Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Auth Encryption</span>
                <span className="text-slate-200 font-mono">Bcrypt (Salt 10)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Token Storage</span>
                <span className="text-slate-200 font-mono">HTTP-Only Cookie</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
              💡 <span className="font-semibold text-slate-300">Security Tip:</span> Keep your admin password strong and unique. Whenever you update your profile details, your active session token is updated automatically without disconnecting.
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

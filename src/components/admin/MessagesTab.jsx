import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { Mail, Check, Trash2, Calendar, User, MessageSquare, AlertTriangle, RefreshCw } from 'lucide-react';

export default function MessagesTab() {
  const { messages, fetchMessages, markMessageRead, deleteMessage } = usePortfolio();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await deleteMessage(id);
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Client & Recruiter Contact Messages</h2>
          <p className="text-slate-400 text-xs mt-0.5">View all submitted inquiries from the website contact form.</p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 self-start sm:self-auto shrink-0">
          Total Inquiries: <span className="text-cyan-400 font-bold">{messages.length}</span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 space-y-3">
          <MessageSquare className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm font-semibold">No messages received yet.</p>
          <p className="text-xs text-slate-500">Form submissions from the portfolio contact section will show up here.</p>
        </div>
      ) : (
        <div className="space-y-4 w-full min-w-0">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-4 sm:p-6 rounded-2xl border transition-all space-y-3 shadow-xl min-w-0 w-full overflow-hidden ${
                m.is_read
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                  : 'bg-slate-900 border-cyan-500/40 text-white ring-1 ring-cyan-500/20'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 min-w-0">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 font-bold shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white flex flex-wrap items-center gap-2">
                      <span className="truncate max-w-full text-sm sm:text-base">{m.name}</span>
                      {!m.is_read && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0">
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 min-w-0">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <a href={`mailto:${m.email}`} className="hover:text-cyan-400 underline break-all truncate">{m.email}</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0 self-start md:self-auto">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Subject */}
              {m.subject && (
                <div className="text-xs sm:text-sm font-semibold text-cyan-300 break-words">
                  Subject: <span className="text-white">{m.subject}</span>
                </div>
              )}

              {/* Message Content */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800/90 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap break-words overflow-x-auto max-w-full">
                {m.message}
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-500">
                  ID: #{m.id}
                </div>

                <div className="flex items-center gap-2">
                  {!m.is_read && (
                    <button
                      onClick={() => markMessageRead(m.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}

                  {confirmDeleteId === m.id ? (
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-rose-500/10 border border-rose-500/30">
                      <span className="text-xs text-rose-300 font-semibold px-2 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        Confirm?
                      </span>
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={deletingId === m.id}
                        className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors flex items-center gap-1"
                      >
                        {deletingId === m.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          'Yes, Delete'
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(m.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}


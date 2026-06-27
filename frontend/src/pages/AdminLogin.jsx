import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Sparkles, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { GlassCard } from "../components/UI.jsx";

export default function AdminLogin({ onSuccess, onClose, inline = false }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form.email, form.password);
      if (onSuccess) {
        onSuccess();
        return;
      }
      navigate(location.state?.from || "/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={inline ? "w-full" : "flex items-center justify-center min-h-[70vh]"}>
      <GlassCard className={`w-full ${inline ? "max-w-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.04] to-accent-cyan/10 shadow-[0_25px_80px_rgba(3,7,18,0.35)]" : "max-w-sm"}`}>
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 text-accent-cyan">
              <Lock size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin sign in</p>
              <p className="text-xs text-white/40">Secure access for the owner of this site</p>
            </div>
          </div>
          {onClose && (
            <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/50 transition hover:bg-white/10 hover:text-white" aria-label="Close admin sign-in">
              <X size={16} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-white/50">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus-ring"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-white/50">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus-ring"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-400/15 bg-emerald-400/10 px-3 py-2 text-[11px] text-emerald-200">
          <Sparkles size={13} />
          Elegant, in-site access for managing your portfolio.
        </div>
      </GlassCard>
    </div>
  );
}

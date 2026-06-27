import React, { useEffect, useState } from "react";
import { Mail, Github, Linkedin, Send, CheckCircle2 } from "lucide-react";
import api from "../api/client.js";
import { PageHeader, GlassCard } from "../components/UI.jsx";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    api.post("/visits", { path: "/contact" }).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      await api.post("/contact", form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.error || "That didn't go through. Try again.");
      setStatus("idle");
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Contact" title="Let's build something that scales" description="Open to internships and entry-level cloud or DevOps roles." />

      <div className="grid lg:grid-cols-2 gap-8">
        <GlassCard>
          {status === "sent" ? (
            <div className="text-center py-8">
              <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-medium mb-1">Message sent</p>
              <p className="text-sm text-white/50">I'll get back to you soon.</p>
              <button onClick={() => setStatus("idle")} className="mt-4 text-sm text-accent-cyan/80 hover:text-accent-cyan transition-colors">
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus-ring"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus-ring"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus-ring resize-none"
                  placeholder="What's on your mind?"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <Send size={15} /> {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </GlassCard>

        <div className="space-y-3">
          <a href="mailto:jayasriselvi23@gmail.com" className="flex items-center gap-3 glass rounded-xl p-4 hover:bg-white/[0.06] transition-colors">
            <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-accent-cyan"><Mail size={16} /></div>
            <div>
              <p className="text-sm text-white">Email</p>
              <p className="text-xs text-white/40">Usually reply within a day</p>
            </div>
          </a>
          <a href="https://www.linkedin.com/in/jayasri-karthikeyan-634085321/" target="_blank" rel="noreferrer" className="flex items-center gap-3 glass rounded-xl p-4 hover:bg-white/[0.06] transition-colors">
            <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-accent-purple"><Linkedin size={16} /></div>
            <div>
              <p className="text-sm text-white">LinkedIn</p>
              <p className="text-xs text-white/40">Connect or message directly</p>
            </div>
          </a>
          <a href="https://github.com/JayasriKarthi" target="_blank" rel="noreferrer" className="flex items-center gap-3 glass rounded-xl p-4 hover:bg-white/[0.06] transition-colors">
            <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/70"><Github size={16} /></div>
            <div>
              <p className="text-sm text-white">GitHub</p>
              <p className="text-xs text-white/40">See the code behind every project</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

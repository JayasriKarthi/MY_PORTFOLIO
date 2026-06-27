import React, { useEffect, useState } from "react";
import { Eye, Mail, TrendingUp, Save } from "lucide-react";
import api from "../api/client.js";
import { PageHeader, GlassCard, StatCard, Spinner } from "../components/UI.jsx";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [messages, setMessages] = useState(null);
  const [journey, setJourney] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/visits/summary").then((res) => setSummary(res.data)).catch(() => {});
    api.get("/contact").then((res) => setMessages(res.data)).catch(() => {});
    api.get("/journey").then((res) => setJourney(res.data)).catch(() => {});
  }, []);

  async function saveJourney() {
    setSaving(true);
    try {
      await api.put("/journey", journey);
    } finally {
      setSaving(false);
    }
  }

  function updateArea(area, value) {
    setJourney({ ...journey, progressByArea: { ...journey.progressByArea, [area]: Number(value) } });
  }

  if (!summary || !messages || !journey) return <Spinner />;

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Dashboard" description="Everything visitors can't see." />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        <StatCard icon={Eye} label="Total visits" value={summary.total} accent="cyan" />
        <StatCard icon={TrendingUp} label="Last 30 days" value={summary.last30Days} accent="purple" />
        <StatCard icon={Mail} label="Messages" value={messages.length} accent="orange" />
      </div>

      <h2 className="font-display text-lg font-semibold text-white mb-4">Career progress</h2>
      <GlassCard className="mb-10">
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {Object.entries(journey.progressByArea).map(([area, value]) => (
            <div key={area}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-white/70 capitalize">{area}</label>
                <span className="text-xs font-mono text-white/45">{value}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => updateArea(area, e.target.value)}
                className="w-full"
              />
            </div>
          ))}
        </div>
        <button
          onClick={saveJourney}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          <Save size={14} /> {saving ? "Saving…" : "Save changes"}
        </button>
      </GlassCard>

      <h2 className="font-display text-lg font-semibold text-white mb-4">Recent messages</h2>
      {messages.length === 0 ? (
        <p className="text-sm text-white/45">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.slice(0, 10).map((m) => (
            <GlassCard key={m._id}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-medium text-white">{m.name}</p>
                <span className="text-xs text-white/35">{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-white/40 mb-2">{m.email}</p>
              <p className="text-sm text-white/65 leading-relaxed">{m.message}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

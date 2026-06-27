import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { PageHeader, GlassCard, ProgressBar, Spinner, ErrorState } from "../components/UI.jsx";

export default function Skills() {
  const { isAdmin } = useAuth();
  const [skills, setSkills] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ category: "", name: "", proficiency: 50 });

  function load() {
    api.get("/skills").then((res) => setSkills(res.data)).catch(() => setError("Couldn't load skills."));
  }

  useEffect(() => {
    api.post("/visits", { path: "/skills" }).catch(() => {});
    load();
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!skills) return <Spinner />;

  const grouped = skills.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  async function saveEdit(id) {
    await api.put(`/skills/${id}`, draft);
    setEditingId(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this skill?")) return;
    await api.delete(`/skills/${id}`);
    load();
  }

  async function addSkill() {
    if (!newSkill.category || !newSkill.name) return;
    await api.post("/skills", newSkill);
    setNewSkill({ category: "", name: "", proficiency: 50 });
    setAdding(false);
    load();
  }

  return (
    <div>
      <PageHeader eyebrow="Skills" title="What I work with" description="Organized by category, with an honest read on how comfortable I am with each." />

      {isAdmin && (
        <div className="mb-6">
          {!adding ? (
            <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-white/80 text-sm hover:bg-white/5 transition-colors">
              <Plus size={14} /> Add skill
            </button>
          ) : (
            <GlassCard className="flex flex-wrap items-end gap-3">
              <input
                placeholder="Category (e.g. Cloud)"
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus-ring"
              />
              <input
                placeholder="Skill name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus-ring"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={newSkill.proficiency}
                onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })}
                className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus-ring"
              />
              <button onClick={addSkill} className="p-2 rounded-lg bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/25 transition-colors"><Check size={15} /></button>
              <button onClick={() => setAdding(false)} className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition-colors"><X size={15} /></button>
            </GlassCard>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {Object.entries(grouped).map(([category, items]) => (
          <GlassCard key={category}>
            <p className="text-sm font-medium text-white mb-4">{category}</p>
            <div className="space-y-3">
              {items.map((s) => (
                <div key={s._id}>
                  {editingId === s._id ? (
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus-ring"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={draft.proficiency}
                        onChange={(e) => setDraft({ ...draft, proficiency: Number(e.target.value) })}
                        className="w-14 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus-ring"
                      />
                      <button onClick={() => saveEdit(s._id)} className="text-emerald-300"><Check size={14} /></button>
                      <button onClick={() => setEditingId(null)} className="text-white/50"><X size={14} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/75">{s.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-white/40">{s.proficiency}%</span>
                        {isAdmin && (
                          <>
                            <button onClick={() => { setEditingId(s._id); setDraft(s); }} className="text-white/40 hover:text-white"><Pencil size={12} /></button>
                            <button onClick={() => remove(s._id)} className="text-white/40 hover:text-red-400"><Trash2 size={12} /></button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  <ProgressBar value={s.proficiency} />
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

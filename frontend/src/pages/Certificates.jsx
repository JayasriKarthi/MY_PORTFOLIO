import React, { useEffect, useState } from "react";
import { Award, ExternalLink, Plus, PencilLine, X } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { PageHeader, GlassCard, StatusBadge, ProgressBar, Spinner, ErrorState } from "../components/UI.jsx";

const emptyForm = {
  name: "",
  issuer: "",
  status: "completed",
  progress: 0,
  expectedDate: "",
  notes: "",
  credentialUrl: "",
  badgeImageUrl: "",
  isActive: true,
  order: 0,
};

export default function Certificates() {
  const { isAdmin } = useAuth();
  const [certs, setCerts] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.post("/visits", { path: "/certificates" }).catch(() => {});
    api.get("/certificates").then((res) => setCerts(res.data)).catch(() => setError("Couldn't load certificates."));
  }, []);

  const visibleCerts = (certs || []).filter((c) => isAdmin || c.isActive !== false);

  function resetForm() {
    setShowForm(false);
    setEditingCert(null);
    setForm(emptyForm);
  }

  function openPreview(cert) {
    setSelectedCert(cert);
  }

  function handleCardClick(cert) {
    const targetUrl = cert.credentialUrl || cert.badgeImageUrl;
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      return;
    }
    openPreview(cert);
  }

  function closePreview() {
    setSelectedCert(null);
  }

  function openCreate() {
    setEditingCert(null);
    setForm({ ...emptyForm, isActive: true });
    setShowForm(true);
  }

  function openEdit(cert) {
    setEditingCert(cert);
    setForm({
      ...emptyForm,
      ...cert,
      progress: cert.progress ?? 0,
      isActive: cert.isActive !== false,
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        progress: Number(form.progress || 0),
        order: Number(form.order || 0),
      };

      if (editingCert) {
        const res = await api.put(`/certificates/${editingCert._id}`, payload);
        setCerts((current) => current.map((item) => (item._id === editingCert._id ? res.data : item)));
      } else {
        const res = await api.post("/certificates", payload);
        setCerts((current) => [...current, res.data].sort((a, b) => a.order - b.order));
      }

      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't save that certificate.");
    } finally {
      setSaving(false);
    }
  }

  if (error) return <ErrorState message={error} />;
  if (!certs) return <Spinner />;

  return (
    <div>
      <PageHeader eyebrow="Certifications" title="Credentials, earned and in progress" description="Every certificate can be published instantly and opened from the card itself when a credential URL is available." />

      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl border border-accent-cyan/20 bg-accent-cyan/10 px-4 py-2.5 text-sm font-medium text-accent-cyan transition hover:bg-accent-cyan/20"
          >
            <Plus size={15} /> Add certificate
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {visibleCerts.map((c) => (
          <div key={c._id} className="relative">
            <button
              type="button"
              onClick={() => handleCardClick(c)}
              className="w-full text-left"
            >
              <GlassCard className={`h-full transition hover:-translate-y-1 hover:border-white/20 ${c.isActive === false ? "opacity-60" : ""}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                    {c.badgeImageUrl ? (
                      <img src={c.badgeImageUrl} alt={`${c.name} badge`} className="w-full h-full object-cover" />
                    ) : (
                      <Award size={18} className="text-accent-orange" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white leading-snug">{c.name}</p>
                    <p className="text-xs text-white/40">{c.issuer}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                {c.status === "in_progress" && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/45">Progress</span>
                      <span className="text-xs font-mono text-white/45">{c.progress}%</span>
                    </div>
                    <ProgressBar value={c.progress} />
                    {c.expectedDate && <p className="text-xs text-white/35 mt-1.5">Expected {c.expectedDate}</p>}
                  </div>
                )}

                {c.notes && <p className="text-xs text-white/45 mt-2">{c.notes}</p>}

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-white/35">{c.isActive === false ? "Hidden" : "Active"}</span>
                  {c.credentialUrl && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-accent-cyan/80">
                      <ExternalLink size={12} /> Open credential
                    </span>
                  )}
                </div>
              </GlassCard>
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(c);
                }}
                className="absolute right-3 top-3 rounded-full border border-white/10 bg-slate-950/70 p-2 text-white/60 transition hover:bg-slate-900 hover:text-white"
                aria-label={`Edit ${c.name}`}
              >
                <PencilLine size={14} />
              </button>
            )}
          </div>
        ))}

        {isAdmin && (
          <button
            type="button"
            onClick={openCreate}
            className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 p-5 text-white/40 transition hover:border-white/30 hover:text-white/70"
          >
            <Plus size={20} />
            <span className="text-sm">Add certificate</span>
          </button>
        )}
      </div>

      {selectedCert && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-xl">
          <div className="relative w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <button
              type="button"
              onClick={closePreview}
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Close certificate preview"
            >
              <X size={16} />
            </button>

            <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                {selectedCert.badgeImageUrl ? (
                  <img src={selectedCert.badgeImageUrl} alt={`${selectedCert.name} certificate`} className="max-h-[420px] w-full rounded-xl object-contain" />
                ) : selectedCert.credentialUrl ? (
                  <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-900/70 px-4 py-8 text-center">
                    <p className="text-sm font-medium text-white">Preview is ready</p>
                    <p className="mt-2 text-sm text-white/50">Open the credential link below to view the full certificate.</p>
                  </div>
                ) : (
                  <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-900/70 px-4 py-8 text-center">
                    <Award size={24} className="mb-3 text-accent-orange" />
                    <p className="text-sm font-medium text-white">No preview available yet</p>
                    <p className="mt-2 text-sm text-white/50">Add a credential URL or badge image to display it here.</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-accent-cyan/80">Certificate preview</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{selectedCert.name}</h3>
                  <p className="mt-1 text-sm text-white/45">{selectedCert.issuer}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Status</span>
                    <StatusBadge status={selectedCert.status} />
                  </div>
                  {selectedCert.status === "in_progress" && (
                    <div className="mt-4">
                      <div className="mb-1 flex items-center justify-between text-xs text-white/45">
                        <span>Progress</span>
                        <span>{selectedCert.progress}%</span>
                      </div>
                      <ProgressBar value={selectedCert.progress} />
                    </div>
                  )}
                  {selectedCert.expectedDate && <p className="mt-3 text-sm text-white/45">Expected: {selectedCert.expectedDate}</p>}
                </div>

                {selectedCert.notes && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-medium text-white">Notes</p>
                    <p className="mt-2 text-sm text-white/45">{selectedCert.notes}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {selectedCert.credentialUrl && (
                    <a href={selectedCert.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
                      <ExternalLink size={15} /> Open credential
                    </a>
                  )}
                  <button type="button" onClick={closePreview} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 px-4 py-8 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <button
              type="button"
              onClick={resetForm}
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Close certificate form"
            >
              <X size={16} />
            </button>

            <div className="mb-5">
              <p className="text-sm font-medium text-white">{editingCert ? "Edit certificate" : "Add a certificate"}</p>
              <p className="text-xs text-white/40">Publish it instantly and let visitors open the credential from the card.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs text-white/50">Certificate name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus-ring" placeholder="AWS Certified Cloud Practitioner" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/50">Issuer</label>
                <input required value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus-ring" placeholder="Amazon Web Services" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/50">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus-ring">
                  <option value="completed">Completed</option>
                  <option value="in_progress">In progress</option>
                  <option value="not_started">Not started</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/50">Progress</label>
                <input type="number" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/50">Expected date</label>
                <input value={form.expectedDate} onChange={(e) => setForm({ ...form, expectedDate: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus-ring" placeholder="2026-09" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs text-white/50">Credential URL</label>
                <input value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus-ring" placeholder="https://example.com/credential" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs text-white/50">Badge image URL</label>
                <input value={form.badgeImageUrl} onChange={(e) => setForm({ ...form, badgeImageUrl: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus-ring" placeholder="https://.../badge.png" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs text-white/50">Notes</label>
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus-ring" placeholder="Anything worth sharing about this certification" />
              </div>
              <div className="md:col-span-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                <div>
                  <p className="text-sm text-white">Publish this certificate</p>
                  <p className="text-xs text-white/40">Active certificates appear to visitors and open when clicked.</p>
                </div>
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-white/20 bg-transparent" />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={resetForm} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-brand-gradient px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60">{saving ? "Saving…" : editingCert ? "Save changes" : "Create certificate"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { FileText, Download, Eye, Upload, CheckCircle2 } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { PageHeader, GlassCard, Spinner } from "../components/UI.jsx";

export default function Resume() {
  const { isAdmin } = useAuth();
  const [resume, setResume] = useState(undefined);
  const [uploading, setUploading] = useState(false);

  function load() {
    api.get("/resume").then((res) => setResume(res.data)).catch(() => setResume(null));
  }

  useEffect(() => {
    api.post("/visits", { path: "/resume" }).catch(() => {});
    load();
  }, []);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);
    try {
      await api.post("/resume", formData, { headers: { "Content-Type": "multipart/form-data" } });
      load();
    } finally {
      setUploading(false);
    }
  }

  if (resume === undefined) return <Spinner />;

  return (
    <div>
      <PageHeader eyebrow="Resume" title="My latest resume" description="Always the current version — old versions stay archived, never linked." />

      <GlassCard className="max-w-md">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-accent-purple/15 flex items-center justify-center text-accent-purple">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Resume</p>
            {resume ? (
              <p className="text-xs text-emerald-300 flex items-center gap-1 mt-0.5"><CheckCircle2 size={12} /> Up to date · v{resume.version}</p>
            ) : (
              <p className="text-xs text-white/40 mt-0.5">No resume uploaded yet</p>
            )}
          </div>
        </div>

        {resume ? (
          <div className="flex gap-3">
            <a href={resume.fileUrl} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity">
              <Eye size={15} /> View
            </a>
            <a href={resume.fileUrl} download className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/15 text-white/85 text-sm hover:bg-white/5 transition-colors">
              <Download size={15} /> Download
            </a>
          </div>
        ) : (
          <p className="text-sm text-white/45">Check back soon — resume coming shortly.</p>
        )}

        {isAdmin && (
          <div className="mt-5 pt-5 border-t border-white/8">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-white/70 text-sm hover:bg-white/5 transition-colors cursor-pointer">
              <Upload size={14} /> {uploading ? "Uploading…" : "Upload new version"}
              <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            <p className="text-xs text-white/35 mt-2">Admin only. Uploading creates a new version automatically.</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

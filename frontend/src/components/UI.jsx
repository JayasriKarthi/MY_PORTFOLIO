import React from "react";

export function GlassCard({ children, className = "" }) {
  return <div className={`glass rounded-2xl p-5 ${className}`}>{children}</div>;
}

export function StatCard({ icon: Icon, label, value, accent = "purple" }) {
  const accentMap = {
    purple: "text-accent-purple",
    blue: "text-accent-blue",
    cyan: "text-accent-cyan",
    orange: "text-accent-orange",
  };
  return (
    <GlassCard className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center ${accentMap[accent]}`}>
        <Icon size={17} />
      </div>
      <div>
        <p className="text-lg font-display font-semibold text-white leading-none">{value}</p>
        <p className="text-xs text-white/45 mt-0.5">{label}</p>
      </div>
    </GlassCard>
  );
}

export function ProgressBar({ value, max = 100, className = "" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`h-2 rounded-full bg-white/8 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    completed: { label: "Completed", dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-400/10" },
    active: { label: "Active", dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-400/10" },
    in_progress: { label: "In progress", dot: "bg-accent-orange", text: "text-amber-300", bg: "bg-amber-400/10" },
    not_started: { label: "Not started", dot: "bg-white/30", text: "text-white/50", bg: "bg-white/5" },
    planned: { label: "Planned", dot: "bg-white/30", text: "text-white/50", bg: "bg-white/5" },
  };
  const s = map[status] || map.not_started;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${s.text} ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function ServiceTag({ children }) {
  return (
    <span className="font-mono text-[11px] px-2 py-1 rounded-md border border-white/10 bg-white/[0.03] text-accent-cyan/90">
      {children}
    </span>
  );
}

export function DifficultyStars({ value, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Difficulty ${value} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`w-1.5 h-1.5 rounded-full ${i < value ? "bg-accent-orange" : "bg-white/15"}`} />
      ))}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="font-mono text-xs text-accent-cyan/80 tracking-wide mb-2">{eyebrow}</p>}
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">{title}</h1>
      {description && <p className="text-white/50 mt-2 max-w-xl">{description}</p>}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-white/15 border-t-accent-cyan rounded-full animate-spin" />
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="text-center py-16 text-white/50 text-sm">
      {message || "Couldn't load this. Try refreshing."}
    </div>
  );
}

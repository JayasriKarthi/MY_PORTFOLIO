import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Github, ExternalLink } from "lucide-react";
import api from "../api/client.js";
import { PageHeader, GlassCard, StatusBadge, ServiceTag, DifficultyStars, Spinner, ErrorState } from "../components/UI.jsx";

const CATEGORIES = ["all", "cloud", "ai", "android", "devops", "networking"];

export default function Projects() {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.post("/visits", { path: "/projects" }).catch(() => {});
    api.get("/projects").then((res) => setProjects(res.data)).catch(() => setError("Couldn't load projects."));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!projects) return <Spinner />;

  const filtered = projects.filter((p) => {
    const matchesCategory = category === "all" || p.category === category;
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.summary.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <PageHeader eyebrow="Projects" title="Things I've built and shipped" description="Each one includes the architecture, the AWS services involved, and what went wrong along the way." />

      <div className="flex flex-col sm:flex-row gap-3 mb-7">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-white/35 focus-ring"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors focus-ring ${
                category === c ? "bg-brand-gradient text-white" : "bg-white/5 text-white/55 hover:bg-white/10"
              }`}
            >
              {c === "all" ? "All" : c[0].toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/45 text-sm">No projects match that search.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <GlassCard key={p._id} className="flex flex-col hover:bg-white/[0.06] transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link to={`/projects/${p.slug}`} className="font-display text-base font-semibold text-white hover:text-accent-cyan transition-colors leading-snug focus-ring">
                  {p.name}
                </Link>
                <DifficultyStars value={p.difficulty} />
              </div>
              <StatusBadge status={p.status} />
              <p className="text-sm text-white/55 leading-relaxed my-3">{p.summary}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.awsServices.slice(0, 4).map((s) => <ServiceTag key={s}>{s}</ServiceTag>)}
              </div>
              <div className="mt-auto flex items-center gap-4 pt-3 border-t border-white/8">
                {p.githubUrl && (
                  <a href={p.githubUrl} className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"><Github size={13} /> Code</a>
                )}
                {p.demoUrl && (
                  <a href={p.demoUrl} className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"><ExternalLink size={13} /> Demo</a>
                )}
                <Link to={`/projects/${p.slug}`} className="ml-auto text-xs text-accent-cyan/80 hover:text-accent-cyan transition-colors">
                  View →
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

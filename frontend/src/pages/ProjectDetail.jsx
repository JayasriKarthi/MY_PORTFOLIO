import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink, FileText, PlayCircle } from "lucide-react";
import api from "../api/client.js";
import { GlassCard, StatusBadge, ServiceTag, DifficultyStars, Spinner, ErrorState } from "../components/UI.jsx";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.post("/visits", { path: `/projects/${slug}` }).catch(() => {});
    api
      .get(`/projects/${slug}`)
      .then((res) => setProject(res.data))
      .catch(() => setError("That project couldn't be found."));
  }, [slug]);

  if (error) return <ErrorState message={error} />;
  if (!project) return <Spinner />;

  return (
    <div>
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-6">
        <ArrowLeft size={14} /> All projects
      </Link>

      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">{project.name}</h1>
        <DifficultyStars value={project.difficulty} />
      </div>
      <div className="flex items-center gap-3 mb-6">
        <StatusBadge status={project.status} />
        <span className="text-xs text-white/40 capitalize">{project.category}</span>
      </div>

      <p className="text-white/65 leading-relaxed mb-8 max-w-2xl">{project.summary}</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.awsServices.map((s) => <ServiceTag key={s}>{s}</ServiceTag>)}
      </div>

      {project.flow?.length > 0 && (
        <GlassCard className="mb-8">
          <p className="text-sm font-medium text-white mb-3">Architecture flow</p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {project.flow.map((step, i) => (
              <React.Fragment key={step}>
                <span className="whitespace-nowrap font-mono text-xs px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/70">{step}</span>
                {i < project.flow.length - 1 && <span className="text-accent-cyan/70 text-sm">→</span>}
              </React.Fragment>
            ))}
          </div>
        </GlassCard>
      )}

      {project.architectureImageUrl && (
        <div className="mb-8">
          <p className="text-sm font-medium text-white mb-3">Architecture diagram</p>
          <img src={project.architectureImageUrl} alt={`${project.name} architecture diagram`} className="rounded-xl border border-white/10 w-full" />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        {project.problem && (
          <GlassCard>
            <p className="text-sm font-medium text-white mb-2">Problem</p>
            <p className="text-sm text-white/60 leading-relaxed">{project.problem}</p>
          </GlassCard>
        )}
        {project.solution && (
          <GlassCard>
            <p className="text-sm font-medium text-white mb-2">Solution</p>
            <p className="text-sm text-white/60 leading-relaxed">{project.solution}</p>
          </GlassCard>
        )}
        {project.challenges && (
          <GlassCard>
            <p className="text-sm font-medium text-white mb-2">Challenges</p>
            <p className="text-sm text-white/60 leading-relaxed">{project.challenges}</p>
          </GlassCard>
        )}
        {project.lessonsLearned && (
          <GlassCard>
            <p className="text-sm font-medium text-white mb-2">Lessons learned</p>
            <p className="text-sm text-white/60 leading-relaxed">{project.lessonsLearned}</p>
          </GlassCard>
        )}
      </div>

      {project.screenshotUrls?.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-medium text-white mb-3">Screenshots</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {project.screenshotUrls.map((url, i) => (
              <img key={i} src={url} alt={`${project.name} screenshot ${i + 1}`} className="rounded-xl border border-white/10 w-full" />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {project.githubUrl && (
          <a href={project.githubUrl} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-white/85 text-sm hover:bg-white/5 transition-colors">
            <Github size={15} /> View code
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-white/85 text-sm hover:bg-white/5 transition-colors">
            <ExternalLink size={15} /> Live demo
          </a>
        )}
        {project.videoUrl && (
          <a href={project.videoUrl} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-white/85 text-sm hover:bg-white/5 transition-colors">
            <PlayCircle size={15} /> Video demo
          </a>
        )}
        {project.docsUrl && (
          <a href={project.docsUrl} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-white/85 text-sm hover:bg-white/5 transition-colors">
            <FileText size={15} /> Documentation
          </a>
        )}
      </div>
    </div>
  );
}

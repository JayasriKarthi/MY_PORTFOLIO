import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, Github, Linkedin, FolderGit2, Award, Wrench, Eye, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import CloudCore from "../components/CloudCore.jsx";
import PhotoGallery from "../components/PhotoGallery.jsx";
import { GlassCard, StatCard, ProgressBar, Spinner } from "../components/UI.jsx";

export default function Home({ onOpenAdmin }) {
  const [journey, setJourney] = useState(null);
  const [projectCount, setProjectCount] = useState(null);
  const [certCount, setCertCount] = useState(null);

  useEffect(() => {
    api.post("/visits", { path: "/" }).catch(() => {});
    Promise.all([
      api.get("/journey"),
      api.get("/projects"),
      api.get("/certificates"),
    ])
      .then(([j, p, c]) => {
        setJourney(j.data);
        setProjectCount(p.data.length);
        setCertCount(c.data.filter((x) => x.status !== "not_started").length);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className="grid lg:grid-cols-2 gap-10 items-center pt-6 pb-14">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 text-xs font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available for opportunities
          </span>

          <p className="font-mono text-sm text-accent-cyan/80 mb-2">Hi, I'm</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient leading-[1.1] mb-4">
            Jayasri K
          </h1>
          <p className="text-white/55 leading-relaxed max-w-md mb-7">
            Cloud enthusiast passionate about designing scalable, secure, and
            cost-effective solutions on AWS. I build with a focus on
            performance, automation, and great user experience.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Link to="/resume" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity">
              <Download size={15} /> Download resume
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/15 text-white/85 text-sm hover:bg-white/5 transition-colors">
              <Mail size={15} /> Contact me
            </Link>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 rounded-lg border border-accent-cyan/20 bg-accent-cyan/10 px-5 py-2.5 text-sm font-medium text-accent-cyan transition hover:bg-accent-cyan/20"
            >
              <ShieldCheck size={15} /> Open admin console
            </button>
          </div>

          <div className="flex items-center gap-4 text-white/45">
            <a href="https://github.com/JayasriKarthi" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-white transition-colors"><Github size={18} /></a>
            <a href="https://www.linkedin.com/in/jayasri-karthikeyan-634085321/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
            <a href="mailto:jayasriselvi23@gmail.com" aria-label="Email" className="hover:text-white transition-colors"><Mail size={18} /></a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <CloudCore />
        </motion.div>
      </section>

      <PhotoGallery />

      <section className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-12">
        <StatCard icon={FolderGit2} label="Projects" value={projectCount ?? "—"} accent="purple" />
        <StatCard icon={Award} label="Certificates" value={certCount ?? "—"} accent="orange" />
        <StatCard icon={Wrench} label="Skills" value="18+" accent="blue" />
        <StatCard icon={Eye} label="Years learning" value="2+" accent="cyan" />
        <StatCard icon={Eye} label="Visitors" value="1.2K+" accent="purple" />
      </section>

      <GlassCard className="mt-8 border border-accent-cyan/20 bg-gradient-to-br from-accent-purple/15 via-white/5 to-accent-cyan/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-white">Manage this portfolio</p>
            <p className="mt-1 text-sm text-white/55">Open the in-site admin panel to update content and keep your story fresh.</p>
          </div>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <ShieldCheck size={15} /> Access admin
          </button>
        </div>
      </GlassCard>

      <section className="grid sm:grid-cols-2 gap-5 mt-8">
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-white">Current goal</p>
            <span className="text-xs font-mono text-accent-cyan">{journey?.currentGoalProgress ?? 0}%</span>
          </div>
          <p className="text-white/60 text-sm mb-3">{journey?.currentGoal || "AWS Solutions Architect Associate"}</p>
          <ProgressBar value={journey?.currentGoalProgress ?? 0} />
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-medium text-white mb-3">Latest achievement</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-300">
              <Award size={18} />
            </div>
            <div>
              <p className="text-sm text-white">AWS AI Practitioner</p>
              <p className="text-xs text-white/45">Certified</p>
            </div>
          </div>
        </GlassCard>
      </section>

      {!journey && <Spinner />}
    </div>
  );
}

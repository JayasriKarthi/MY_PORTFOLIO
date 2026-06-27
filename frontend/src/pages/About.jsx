import React from "react";
import { PageHeader, GlassCard } from "../components/UI.jsx";

const TIMELINE = [
  { year: "2024", label: "Started Computer Science Engineering" },
  { year: "2024", label: "AWS Cloud Practitioner certified" },
  { year: "2025", label: "Learned Docker and containerization" },
  { year: "2025", label: "Deployed first workload on Amazon EKS" },
  { year: "2025", label: "AWS AI Practitioner certified" },
  { year: "2026", label: "Competed in two hackathons" },
  { year: "2026", label: "Studying for AWS Solutions Architect Associate" },
];

export default function About() {
  return (
    <div>
      <PageHeader
        eyebrow="About"
        title="From coursework to cloud infrastructure"
        description="A computer science student who'd rather learn AWS by deploying something real than by reading slides."
      />

      <GlassCard className="mb-10">
        <p className="text-white/65 leading-relaxed">
          I'm a Computer Science Engineering student based in Chennai, focused
          on designing scalable, secure, and cost-effective cloud solutions on
          AWS. My interests sit at the intersection of cloud architecture,
          DevOps, Kubernetes, and applied AI — and most of what I know, I
          learned by shipping a project that broke first and worked second.
        </p>
      </GlassCard>

      <h2 className="font-display text-lg font-semibold text-white mb-6">Timeline</h2>
      <div className="space-y-0">
        {TIMELINE.map((item, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-accent-purple to-accent-cyan" />
              {i < TIMELINE.length - 1 && <span className="w-px flex-1 bg-white/10 my-1" />}
            </div>
            <div className="pb-7">
              <p className="font-mono text-xs text-accent-cyan/80 mb-1">{item.year}</p>
              <p className="text-white/75 text-sm">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

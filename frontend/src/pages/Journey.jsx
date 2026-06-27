import React, { useEffect, useState } from "react";
import { Code2, GitCommit, Trophy, Cloud } from "lucide-react";
import api from "../api/client.js";
import { PageHeader, GlassCard, StatCard, ProgressBar, Spinner } from "../components/UI.jsx";

export default function Journey() {
  const [journey, setJourney] = useState(null);

  useEffect(() => {
    api.post("/visits", { path: "/journey" }).catch(() => {});
    api.get("/journey").then((res) => setJourney(res.data)).catch(() => {});
  }, []);

  if (!journey) return <Spinner />;

  return (
    <div>
      <PageHeader eyebrow="My journey" title="Career progress, tracked honestly" description="The numbers behind the portfolio — updated as I go, not polished after the fact." />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <StatCard icon={Code2} label="LeetCode solved" value={journey.leetcodeProblems} accent="purple" />
        <StatCard icon={GitCommit} label="GitHub commits" value={journey.githubCommits} accent="blue" />
        <StatCard icon={Trophy} label="Hackathons" value={journey.hackathons} accent="orange" />
        <StatCard icon={Cloud} label="AWS services learned" value={`${journey.awsServicesLearned}/${journey.awsServicesTotal}`} accent="cyan" />
      </div>

      <h2 className="font-display text-lg font-semibold text-white mb-4">Progress by area</h2>
      <GlassCard>
        <div className="space-y-5">
          {Object.entries(journey.progressByArea).map(([area, value]) => (
            <div key={area}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-white/75 capitalize">{area}</span>
                <span className="text-xs font-mono text-white/45">{value}%</span>
              </div>
              <ProgressBar value={value} />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

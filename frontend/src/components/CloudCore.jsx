import React from "react";
import { Cloud, Box, Database, Server, Network, Boxes } from "lucide-react";

const ORBIT_ICONS = [
  { Icon: Box, angle: 0, radius: 130, label: "EKS" },
  { Icon: Database, angle: 60, radius: 150, label: "RDS" },
  { Icon: Server, angle: 120, radius: 130, label: "EC2" },
  { Icon: Network, angle: 180, radius: 150, label: "VPC" },
  { Icon: Boxes, angle: 240, radius: 130, label: "Docker" },
  { Icon: Cloud, angle: 300, radius: 150, label: "S3" },
];

export default function CloudCore() {
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-accent-purple/15 blur-3xl" />
      <div className="absolute inset-8 rounded-full bg-accent-cyan/10 blur-2xl" />

      <svg viewBox="0 0 400 400" className="w-full h-full relative z-10">
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#2563EB" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <circle cx="200" cy="200" r="150" fill="none" stroke="url(#ringGrad)" strokeWidth="1" strokeDasharray="2 6" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="40s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="200" r="130" fill="none" stroke="url(#ringGrad)" strokeWidth="1" strokeDasharray="1 4" opacity="0.35">
          <animateTransform attributeName="transform" type="rotate" from="360 200 200" to="0 200 200" dur="55s" repeatCount="indefinite" />
        </circle>

        <circle cx="200" cy="200" r="70" fill="url(#coreGlow)" />
        <circle cx="200" cy="200" r="46" fill="#0F1330" stroke="#A78BFA" strokeWidth="1.5" opacity="0.9" />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <Cloud size={40} className="text-accent-cyan drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
      </div>

      {ORBIT_ICONS.map(({ Icon, angle, radius, label }, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 50 + (radius / 400) * 100 * Math.cos(rad);
        const y = 50 + (radius / 400) * 100 * Math.sin(rad);
        return (
          <div
            key={label}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div
              className="w-10 h-10 rounded-xl glass flex items-center justify-center text-accent-cyan animate-pulse"
              style={{ animationDuration: `${3 + i * 0.4}s` }}
            >
              <Icon size={17} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

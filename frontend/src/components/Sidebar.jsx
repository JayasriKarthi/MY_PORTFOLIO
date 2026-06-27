import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home, User, Wrench, FolderGit2, Award, FileText, Mail,
  Github, Linkedin, Moon, Sun, LogOut, ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About", icon: User },
  { to: "/skills", label: "Skills", icon: Wrench },
  { to: "/projects", label: "Projects", icon: FolderGit2 },
  { to: "/certificates", label: "Certificates", icon: Award },
  { to: "/resume", label: "Resume", icon: FileText },
  { to: "/contact", label: "Contact", icon: Mail },
];

export default function Sidebar({ dark, onToggleDark, onOpenAdmin }) {
  const { isAdmin, admin, logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-white/8 bg-base-950/80 px-5 py-6">
      <div className="flex items-center gap-2 mb-8 px-1">
        <span className="font-display font-bold text-lg text-gradient">JS</span>
        <div className="leading-tight">
          <p className="text-sm font-medium text-white">Jayasri K</p>
          <p className="text-xs text-white/40">Cloud · DevOps · AI</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <button
          type="button"
          onClick={onOpenAdmin}
          className="mb-3 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-accent-purple/20 via-accent-cyan/10 to-white/5 px-3 py-3 text-left text-sm text-white shadow-[0_12px_40px_rgba(6,182,212,0.16)]"
        >
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white/10 p-1.5">
              <ShieldCheck size={15} />
            </div>
            <div>
              <p className="font-medium">Admin console</p>
              <p className="text-[11px] text-white/45">Open in-site</p>
            </div>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-accent-cyan">
            Quick
          </span>
        </button>

        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors focus-ring ${
                isActive
                  ? "bg-gradient-to-r from-accent-purple/20 to-accent-cyan/10 text-white border border-white/10"
                  : "text-white/55 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors focus-ring ${
                isActive ? "bg-white/10 text-white" : "text-accent-cyan/80 hover:text-accent-cyan hover:bg-white/5"
              }`
            }
          >
            <ShieldCheck size={16} />
            Admin dashboard
          </NavLink>
        )}
      </nav>

      <div className="space-y-3 pt-4 border-t border-white/8">
        <p className="text-xs text-white/35 px-1 mb-1">Let's connect</p>
        <div className="flex items-center gap-3 px-1">
          <a href="https://github.com/JayasriKarthi" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-white/50 hover:text-white transition-colors"><Github size={16} /></a>
          <a href="https://www.linkedin.com/in/jayasri-karthikeyan-634085321/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-white/50 hover:text-white transition-colors"><Linkedin size={16} /></a>
          <a href="mailto:jayasriselvi23@gmail.com" aria-label="Email" className="text-white/50 hover:text-white transition-colors"><Mail size={16} /></a>
        </div>

        <div className="flex items-center justify-between px-1 pt-2">
          <span className="text-xs text-white/40 flex items-center gap-1.5">
            {dark ? <Moon size={13} /> : <Sun size={13} />}
            {dark ? "Dark mode" : "Light mode"}
          </span>
          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            className={`relative w-9 h-5 rounded-full transition-colors focus-ring ${dark ? "bg-accent-purple" : "bg-white/15"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                dark ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {isAdmin && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-1 pt-2 text-xs text-white/40 hover:text-white transition-colors focus-ring"
          >
            <LogOut size={13} /> Sign out ({admin?.email})
          </button>
        )}
      </div>
    </aside>
  );
}

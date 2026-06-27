import React from "react";
import { NavLink } from "react-router-dom";
import { Home, User, Wrench, FolderGit2, Award, Mail, ShieldCheck } from "lucide-react";

const LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About", icon: User },
  { to: "/skills", label: "Skills", icon: Wrench },
  { to: "/projects", label: "Work", icon: FolderGit2 },
  { to: "/certificates", label: "Certs", icon: Award },
  { to: "/contact", label: "Contact", icon: Mail },
];

export default function MobileNav({ onOpenAdmin }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-950/95 border-t border-white/8 backdrop-blur px-2 py-2 flex justify-between">
      {LINKS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] focus-ring ${
              isActive ? "text-accent-cyan" : "text-white/45"
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={onOpenAdmin}
        className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] focus-ring text-white/70"
      >
        <ShieldCheck size={18} />
        Admin
      </button>
    </nav>
  );
}

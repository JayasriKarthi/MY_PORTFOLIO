import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Sidebar from "./components/Sidebar.jsx";
import MobileNav from "./components/MobileNav.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Skills from "./pages/Skills.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Certificates from "./pages/Certificates.jsx";
import Resume from "./pages/Resume.jsx";
import Contact from "./pages/Contact.jsx";
import Journey from "./pages/Journey.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  const [dark, setDark] = useState(true);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function handleAdminSuccess() {
    setAdminModalOpen(false);
    navigate("/admin");
  }

  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.12),_transparent_28%),#050816]">
      <Sidebar dark={dark} onToggleDark={() => setDark((d) => !d)} onOpenAdmin={() => setAdminModalOpen(true)} />
      <main className="flex-1 px-5 sm:px-8 lg:px-12 py-8 pb-24 lg:pb-8 max-w-6xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Home onOpenAdmin={() => setAdminModalOpen(true)} />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin onClose={() => setAdminModalOpen(false)} onSuccess={handleAdminSuccess} />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
        </Routes>
      </main>
      <MobileNav onOpenAdmin={() => setAdminModalOpen(true)} />
      {adminModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-xl">
          <div className="relative w-full max-w-lg">
            <button
              type="button"
              onClick={() => setAdminModalOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-white/10 p-2 text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label="Close admin panel"
            >
              <X size={16} />
            </button>
            <AdminLogin onClose={() => setAdminModalOpen(false)} onSuccess={handleAdminSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AdminLogin from "../pages/AdminLogin.jsx";
import { Spinner, PageHeader } from "./UI.jsx";

export default function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Secure access"
          title="Open your studio"
          description="Sign in right here to manage the portfolio without leaving the site."
        />
        <AdminLogin />
      </div>
    );
  }
  return children;
}

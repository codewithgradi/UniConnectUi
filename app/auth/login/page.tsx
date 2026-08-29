// app/login/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // API integration goes here
    console.log("Login Payload:", formData);

    // Reset state after handling
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen w-full bg-[#06101E] flex flex-col justify-center items-center px-4 py-12">
      {/* Container Card */}
      <div className="w-full max-w-md bg-[#0A192F] border border-[#1E293B] rounded-lg shadow-xl overflow-[#0A192F]">
        {/* Brand Accent Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00A8E8] to-[#007EA7]" />

        <div className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Richfield Portal
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="name@richfield.ac.za"
                className="w-full rounded border border-[#1E293B] bg-[#06101E] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#00A8E8] focus:outline-none focus:ring-1 focus:ring-[#00A8E8]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#00A8E8] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full rounded border border-[#1E293B] bg-[#06101E] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#00A8E8] focus:outline-none focus:ring-1 focus:ring-[#00A8E8]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-[#00A8E8] py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#0096D1] focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:ring-offset-2 focus:ring-offset-[#0A192F] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#00A8E8] hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

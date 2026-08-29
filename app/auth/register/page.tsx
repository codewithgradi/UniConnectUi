// app/register/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

// Numeric enum matching standard ASP.NET Core JsonStringEnumConverter binding
export enum UserType {
  Student = "Student",
  Alumni = "Alumni",
  Company = "Company",
  Admin = "Admin",
}

interface RegisterRequest {
  email: string;
  password: string;
  userType: UserType;
  firstName?: string;
  lastName?: string;
  programme?: string;
  companyName?: string;
  studentNumber?: string;
}

export default function RegisterPage() {
  const [userType, setUserType] = useState<UserType>(UserType.Student);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    programme: "",
    companyName: "",
    studentNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserType(e.target.value as UserType);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    // Build payload matching C# DTO strictly
    const isCompany = userType === UserType.Company;

    const payload: RegisterRequest = {
      email: formData.email,
      password: formData.password,
      userType: userType,
      firstName: isCompany ? undefined : formData.firstName || undefined,
      lastName: isCompany ? undefined : formData.lastName || undefined,
      programme: !isCompany ? formData.programme || undefined : undefined,
      studentNumber: !isCompany ? formData.studentNumber || undefined : undefined,
      companyName: isCompany ? formData.companyName || undefined : undefined,
    };

    console.log("C# DTO Aligned Payload:", payload);

    // Execute API request here...
    
    setTimeout(() => setLoading(false), 1000);
  };

  const isCompany = userType === UserType.Company;

  return (
    <div className="min-h-screen w-full bg-[#06101E] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg bg-[#0A192F] border border-[#1E293B] rounded-lg shadow-xl overflow-hidden">
        
        {/* Brand Accent Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00A8E8] to-[#007EA7]" />

        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Create an Account
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Join the Richfield ecosystem
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* UserType Dynamic Dropdown */}
            <div>
              <label 
                htmlFor="userType" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Account Type
              </label>
              <select
                id="userType"
                value={userType}
                onChange={handleRoleChange}
                className="w-full rounded border border-[#1E293B] bg-[#06101E] px-3.5 py-2.5 text-sm text-white transition-colors focus:border-[#00A8E8] focus:outline-none focus:ring-1 focus:ring-[#00A8E8]"
              >
                <option value={UserType.Student}>Student</option>
                <option value={UserType.Alumni}>Alumni</option>
                <option value={UserType.Company}>Company / Business</option>
                <option value={UserType.Admin}>Administrator</option>
              </select>
            </div>

            {/* Account Credentials */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@domain.com"
                className="w-full rounded border border-[#1E293B] bg-[#06101E] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#00A8E8] focus:outline-none focus:ring-1 focus:ring-[#00A8E8]"
              />
            </div>

            {/* Conditional Fields based on UserType */}
            {isCompany ? (
              <div>
                <label 
                  htmlFor="companyName" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enterprise Solutions Ltd"
                  className="w-full rounded border border-[#1E293B] bg-[#06101E] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#00A8E8] focus:outline-none focus:ring-1 focus:ring-[#00A8E8]"
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label 
                      htmlFor="firstName" 
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full rounded border border-[#1E293B] bg-[#06101E] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#00A8E8] focus:outline-none focus:ring-1 focus:ring-[#00A8E8]"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="lastName" 
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full rounded border border-[#1E293B] bg-[#06101E] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#00A8E8] focus:outline-none focus:ring-1 focus:ring-[#00A8E8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label 
                      htmlFor="studentNumber" 
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                    >
                      Student / Reg Number
                    </label>
                    <input
                      id="studentNumber"
                      type="text"
                      value={formData.studentNumber}
                      onChange={handleInputChange}
                      placeholder="210000000"
                      className="w-full rounded border border-[#1E293B] bg-[#06101E] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#00A8E8] focus:outline-none focus:ring-1 focus:ring-[#00A8E8]"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="programme" 
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                    >
                      Programme
                    </label>
                    <input
                      id="programme"
                      type="text"
                      value={formData.programme}
                      onChange={handleInputChange}
                      placeholder="BSc Information Technology"
                      className="w-full rounded border border-[#1E293B] bg-[#06101E] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#00A8E8] focus:outline-none focus:ring-1 focus:ring-[#00A8E8]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full rounded border border-[#1E293B] bg-[#06101E] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#00A8E8] focus:outline-none focus:ring-1 focus:ring-[#00A8E8]"
                />
              </div>

              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full rounded border border-[#1E293B] bg-[#06101E] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#00A8E8] focus:outline-none focus:ring-1 focus:ring-[#00A8E8]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded bg-[#00A8E8] py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#0096D1] focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:ring-offset-2 focus:ring-offset-[#0A192F] disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Register Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="font-semibold text-[#00A8E8] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
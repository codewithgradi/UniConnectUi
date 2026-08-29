// app/admin/console/page.tsx
"use client";

import React, { useState, useEffect } from "react";

// --- DTO INTERFACES ---
export interface DailyRegistrationDto {
  date: string;
  count: number;
}

export interface AdminAnalyticsDto {
  totalUsers: number;
  totalStudents: number;
  totalBusinesses: number;
  totalAdmins: number;
  totalOpportunities: number;
  publishedOpportunities: number;
  pendingOpportunities: number;
  closedOpportunities: number;
  totalJobApplications: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalConnections: number;
  totalDirectMessages: number;
  pendingBusinessVerifications: number;
  recentRegistrations: DailyRegistrationDto[];
}

export interface CreateEventDto {
  title: string;
  description: string;
  eventDate: string;
}

export interface EventDto {
  id: string;
  title: string;
  description: string;
  eventDate: string;
}

export interface CreateSkillDto {
  name: string;
}

export interface SkillDto {
  id: string;
  name: string;
}

export interface UserProfileDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  programme: string;
  studentNumber: string;
}

export enum OpportunityStatus {
  PendingApproval = "PendingApproval",
  Published = "Published",
  Rejected = "Rejected",
  Closed = "Closed",
}

export interface OpportunityDto {
  id: string;
  businessProfileId: string;
  businessName?: string;
  title: string;
  description: string;
  targetProgramme: string;
  status: OpportunityStatus;
  createdAtUtc: string;
}

// --- ATOMIC UI PRIMITIVES ---

function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A192F] text-black dark:text-slate-100 shadow-sm transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      className={`text-lg font-bold leading-none tracking-tight text-black dark:text-white ${className}`}
    >
      {children}
    </h3>
  );
}

function CardDescription({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`text-xs font-semibold text-slate-600 dark:text-slate-400 ${className}`}
    >
      {children}
    </p>
  );
}

function CardContent({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

function Badge({
  variant = "default",
  children,
}: {
  variant?: "default" | "secondary" | "destructive" | "outline" | "accent";
  children: React.ReactNode;
}) {
  const styles = {
    default:
      "bg-[#00A8E8]/10 text-[#007EA7] dark:text-[#00A8E8] border-[#00A8E8]/30",
    secondary:
      "bg-slate-100 dark:bg-slate-800 text-black dark:text-slate-200 border-slate-300 dark:border-slate-700",
    destructive:
      "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
    outline:
      "text-black dark:text-slate-300 border-slate-300 dark:border-slate-800",
    accent:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-900",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-bold font-mono transition-colors ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

function Button({
  variant = "default",
  size = "default",
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg";
}) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
  const variants = {
    default: "bg-[#00A8E8] text-black hover:bg-[#0096D1] shadow-sm",
    outline:
      "border border-slate-300 dark:border-slate-700 bg-white dark:bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-black dark:text-slate-200",
    secondary:
      "bg-slate-100 dark:bg-slate-800 text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 shadow-sm dark:bg-red-900/60 dark:text-red-200 dark:border dark:border-red-800/80 dark:hover:bg-red-900",
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`flex h-9 w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-3 py-1 text-xs text-black dark:text-white shadow-sm transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8] ${props.className || ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`flex w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-3 py-2 text-xs text-black dark:text-white shadow-sm transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8] ${props.className || ""}`}
    />
  );
}

// --- MOCK DATA ---
const mockRegistrations: DailyRegistrationDto[] = [
  { date: "Mon", count: 12 },
  { date: "Tue", count: 24 },
  { date: "Wed", count: 18 },
  { date: "Thu", count: 32 },
  { date: "Fri", count: 45 },
  { date: "Sat", count: 28 },
  { date: "Sun", count: 54 },
];

const mockAnalytics: AdminAnalyticsDto = {
  totalUsers: 1420,
  totalStudents: 1150,
  totalBusinesses: 85,
  totalAdmins: 5,
  totalOpportunities: 320,
  publishedOpportunities: 280,
  pendingOpportunities: 15,
  closedOpportunities: 25,
  totalJobApplications: 4100,
  totalPosts: 890,
  totalComments: 3400,
  totalLikes: 12500,
  totalConnections: 3200,
  totalDirectMessages: 18400,
  pendingBusinessVerifications: 4,
  recentRegistrations: mockRegistrations,
};

const mockOpportunities: OpportunityDto[] = [
  {
    id: "op-101",
    businessProfileId: "b-1",
    businessName: "Enterprise Systems SA",
    title: "Junior C# Backend Engineer",
    description:
      "Looking for an energetic junior developer skilled in ASP.NET Core API design and SQL database management.",
    targetProgramme: "BSc Information Technology",
    status: OpportunityStatus.PendingApproval,
    createdAtUtc: "2026-08-28T14:30:00Z",
  },
];

const mockStudents: UserProfileDto[] = [
  {
    id: "p-1",
    userId: "u-1",
    firstName: "Gradi",
    lastName: "Puata",
    headline: "Backend Engineer & BSc IT Candidate",
    bio: "Specializing in C#, ASP.NET Core Clean Architecture, Next.js, and Cloud Infrastructure.",
    programme: "BSc Information Technology",
    studentNumber: "210084920",
  },
];

const mockEvents: EventDto[] = [
  {
    id: "e-1",
    title: "Richfield Tech Career Day 2026",
    description:
      "Connect with IT industry recruiter leads and present final-year capstone projects.",
    eventDate: "2026-10-15T09:00",
  },
];

const mockSkills: SkillDto[] = [
  { id: "s-1", name: "C# / ASP.NET Core" },
  { id: "s-2", name: "TypeScript / Next.js" },
  { id: "s-3", name: "PostgreSQL" },
];

type ActiveTab =
  | "analytics"
  | "opportunities"
  | "students"
  | "events"
  | "skills";

export default function AdminConsolePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("analytics");

  // Data State
  const [analytics] = useState<AdminAnalyticsDto>(mockAnalytics);
  const [opportunities, setOpportunities] =
    useState<OpportunityDto[]>(mockOpportunities);
  const [students] = useState<UserProfileDto[]>(mockStudents);
  const [events, setEvents] = useState<EventDto[]>(mockEvents);
  const [skills, setSkills] = useState<SkillDto[]>(mockSkills);

  // Form State
  const [newEvent, setNewEvent] = useState<CreateEventDto>({
    title: "",
    description: "",
    eventDate: "",
  });
  const [newSkill, setNewSkill] = useState<CreateSkillDto>({ name: "" });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handler: Add Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.eventDate) return;

    const created: EventDto = {
      id: crypto.randomUUID(),
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      eventDate: newEvent.eventDate,
    };

    setEvents([created, ...events]);
    setNewEvent({ title: "", description: "", eventDate: "" });
  };

  // Handler: Delete Event
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  // Handler: Add Skill Tag
  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    const created: SkillDto = {
      id: crypto.randomUUID(),
      name: newSkill.name.trim(),
    };

    setSkills([...skills, created]);
    setNewSkill({ name: "" });
  };

  // Handler: Delete Skill Tag
  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const handleApproveOpportunity = (id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "dark bg-[#040B14] text-slate-100" : "bg-white text-black"} flex flex-col font-sans transition-colors duration-200`}
    >
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A192F] px-6 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-1.5 bg-[#00A8E8] rounded-full shadow-[0_0_12px_#00A8E8]" />
          <span className="text-sm font-bold tracking-wider uppercase text-black dark:text-white">
            Richfield{" "}
            <span className="text-[#007EA7] dark:text-[#00A8E8] font-normal">
              Console
            </span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-3.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-black dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <Badge variant="accent">Admin Privileges</Badge>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
              System Administration
            </h1>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Manage institutional metrics, student profiles, events, skills,
              and business job approvals.
            </p>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#06101E] p-1 rounded-lg w-fit overflow-x-auto shadow-inner">
          {[
            { id: "analytics", label: "Analytics & Trends" },
            {
              id: "opportunities",
              label: "Post Approvals",
              badge: opportunities.length,
            },
            { id: "students", label: "Student Registry" },
            { id: "events", label: "Events Manager" },
            { id: "skills", label: "Skill Tags" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white dark:bg-[#0A192F] text-[#007EA7] dark:text-[#00A8E8] shadow-sm border border-slate-200 dark:border-slate-800"
                  : "text-slate-700 dark:text-slate-400 hover:text-black dark:hover:text-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#00A8E8] text-black font-extrabold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* --- TAB 1: ANALYTICS --- */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Platform Users"
                value={analytics.totalUsers}
                desc="Active registered accounts"
              />
              <MetricCard
                title="Total Students"
                value={analytics.totalStudents}
                desc="Enrolled learners"
                highlight
              />
              <MetricCard
                title="Business Partners"
                value={analytics.totalBusinesses}
                desc="Verified enterprise profiles"
              />
              <MetricCard
                title="Pending Approvals"
                value={opportunities.length}
                desc="Jobs awaiting review"
                warning
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>User Registrations Trend</CardTitle>
                  <CardDescription>
                    Daily breakdown of newly registered users over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-56 w-full pt-4">
                    <svg
                      className="w-full h-full overflow-visible"
                      viewBox="0 0 500 150"
                    >
                      {(analytics.recentRegistrations || []).map(
                        (item, idx) => {
                          const max = 60;
                          const height = (item.count / max) * 110;
                          const x = idx * 70 + 20;
                          const y = 120 - height;
                          return (
                            <g key={item.date} className="group">
                              <rect
                                x={x}
                                y={y}
                                width="36"
                                height={height}
                                rx="4"
                                className="fill-[#007EA7]/20 dark:fill-[#00A8E8]/20 group-hover:fill-[#00A8E8] transition-colors cursor-pointer"
                              />
                              <text
                                x={x + 18}
                                y={y - 8}
                                textAnchor="middle"
                                className="fill-[#007EA7] dark:fill-[#00A8E8] text-[10px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                {item.count}
                              </text>
                              <text
                                x={x + 18}
                                y="142"
                                textAnchor="middle"
                                className="fill-black dark:fill-slate-400 text-[10px] font-mono font-bold"
                              >
                                {item.date}
                              </text>
                            </g>
                          );
                        },
                      )}
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                  <CardDescription>
                    Engagement across social & communication modules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ActivityRow
                    label="Job Applications"
                    value={analytics.totalJobApplications}
                  />
                  <ActivityRow
                    label="Community Posts"
                    value={analytics.totalPosts}
                  />
                  <ActivityRow
                    label="Direct Messages"
                    value={analytics.totalDirectMessages}
                  />
                  <ActivityRow
                    label="Connections Established"
                    value={analytics.totalConnections}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* --- TAB 2: OPPORTUNITY APPROVALS --- */}
        {activeTab === "opportunities" && (
          <Card>
            <CardHeader>
              <CardTitle>Business Post Approvals</CardTitle>
              <CardDescription>
                Review and publish job postings submitted by business partners.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {opportunities.length === 0 ? (
                <div className="py-12 text-center text-slate-600 text-xs font-bold">
                  No pending business job requests.
                </div>
              ) : (
                <div className="space-y-4">
                  {opportunities.map((op) => (
                    <div
                      key={op.id}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#06101E] flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-black dark:text-white">
                            {op.title}
                          </h4>
                          <Badge variant="accent">Pending Review</Badge>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                          {op.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-[11px] text-slate-700 dark:text-slate-400 font-semibold pt-1">
                          <span>
                            Target:{" "}
                            <strong className="text-black dark:text-slate-200">
                              {op.targetProgramme}
                            </strong>
                          </span>
                          <span>
                            Company:{" "}
                            <strong className="text-[#007EA7] dark:text-[#00A8E8]">
                              {op.businessName}
                            </strong>
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleApproveOpportunity(op.id)}
                        >
                          Approve & Publish
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* --- TAB 3: STUDENT REGISTRY --- */}
        {activeTab === "students" && (
          <Card>
            <CardHeader>
              <CardTitle>Registered Student Profiles</CardTitle>
              <CardDescription>
                Directory of enrolled students across active academic
                programmes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#06101E] text-black dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Student Number</th>
                      <th className="p-3.5">Full Name</th>
                      <th className="p-3.5">Programme</th>
                      <th className="p-3.5">Headline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-transparent text-black dark:text-slate-200">
                    {students.map((st) => (
                      <tr
                        key={st.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="p-3.5 font-mono text-[#007EA7] dark:text-[#00A8E8] font-bold">
                          {st.studentNumber}
                        </td>
                        <td className="p-3.5 font-bold text-black dark:text-white">
                          {st.firstName} {st.lastName}
                        </td>
                        <td className="p-3.5 text-slate-800 dark:text-slate-300 font-semibold">
                          {st.programme}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-400 font-medium max-w-xs truncate">
                          {st.headline}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* --- TAB 4: EVENTS MANAGEMENT --- */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Create Institutional Event</CardTitle>
                <CardDescription>
                  Add campus career fairs, workshops, or academic events.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
                      Event Title
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. AWS Cloud Workshop"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
                      Description
                    </label>
                    <Textarea
                      rows={3}
                      placeholder="Details about the scheduled event..."
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
                      Date & Time
                    </label>
                    <Input
                      type="datetime-local"
                      value={newEvent.eventDate}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, eventDate: e.target.value })
                      }
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Add Event
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Scheduled Events ({events.length})</CardTitle>
                <CardDescription>
                  Current list of published platform events.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <div className="py-8 text-center text-slate-600 text-xs font-bold">
                    No upcoming events scheduled.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#06101E] flex justify-between items-start gap-4 shadow-sm"
                      >
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-black dark:text-white">
                            {ev.title}
                          </h4>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                            {ev.description}
                          </p>
                          <p className="text-[11px] font-mono font-bold text-[#007EA7] dark:text-[#00A8E8] pt-1">
                            📅 {new Date(ev.eventDate).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteEvent(ev.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* --- TAB 5: SKILLS TAG MANAGER --- */}
        {activeTab === "skills" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Add Skill Tag</CardTitle>
                <CardDescription>
                  Create standardized skills for student profiles and job
                  postings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSkill} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
                      Skill Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Docker, ASP.NET Core"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ name: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Skill
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  Skill Taxonomy Dictionary ({skills.length})
                </CardTitle>
                <CardDescription>
                  Available skills across candidate search and filtering
                  options.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {skills.length === 0 ? (
                  <div className="py-8 text-center text-slate-600 text-xs font-bold">
                    No skills registered yet.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {skills.map((sk) => (
                      <div
                        key={sk.id}
                        className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] text-xs text-black dark:text-slate-200 flex items-center space-x-2 shadow-sm font-bold"
                      >
                        <span>{sk.name}</span>
                        <button
                          onClick={() => handleDeleteSkill(sk.id)}
                          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold transition-colors ml-1"
                          title="Delete skill tag"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

// --- DEFENSIVE HELPER COMPONENTS ---

function MetricCard({
  title,
  value,
  desc,
  highlight,
  warning,
}: {
  title: string;
  value?: number | null;
  desc: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  const safeValue = typeof value === "number" && !isNaN(value) ? value : 0;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle
          className={`text-2xl font-bold font-mono ${highlight ? "text-[#007EA7] dark:text-[#00A8E8]" : warning ? "text-amber-600 dark:text-amber-400" : "text-black dark:text-white"}`}
        >
          {safeValue.toLocaleString()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}

function ActivityRow({
  label,
  value,
}: {
  label: string;
  value?: number | null;
}) {
  const safeValue = typeof value === "number" && !isNaN(value) ? value : 0;

  return (
    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/60 pb-2">
      <span className="text-xs font-bold text-slate-700 dark:text-slate-400">
        {label}
      </span>
      <span className="text-xs font-mono font-bold text-black dark:text-white">
        {safeValue.toLocaleString()}
      </span>
    </div>
  );
}

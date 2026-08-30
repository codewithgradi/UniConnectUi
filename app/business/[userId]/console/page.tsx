// app/business/[businessId]/console/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Briefcase,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  TrendingUp,
  PlusCircle,
  Building2,
  Globe,
  FileText,
  Search,
  MessageSquare,
  Heart,
  ChevronRight,
  Sun,
  Moon,
  ExternalLink,
  ShieldCheck,
  Send,
} from "lucide-react";

// --- DOMAIN ENUMS & TYPES ---

export enum OpportunityStatus {
  PendingApproval = "PendingApproval",
  Published = "Published",
  Rejected = "Rejected",
  Closed = "Closed",
}

export interface BusinessProfileDto {
  id: string;
  companyName: string;
  industry: string;
  websiteUrl: string;
  registrationNumber?: string;
}

export interface CreateBusinessDto {
  companyName: string;
  registrationNumber: string;
  industry: string;
  websiteUrl: string;
}

export interface CreateOpportunityDto {
  title: string;
  description: string;
  targetProgramme: string;
}

export interface JobApplicationDto {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantRole: "Student" | "Alumni";
  programme: string;
  appliedAt: string;
}

export interface Opportunity {
  id: string;
  businessProfileId: string;
  title: string;
  description: string;
  targetProgramme: string;
  status: OpportunityStatus;
  createdAtUtc: string;
  applicationsCount?: number;
}

export interface CommentDto {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface PostDto {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  isLiked?: boolean;
  comments?: CommentDto[];
}

export interface JobListingPerformanceDto {
  opportunityId: string;
  title: string;
  applicantCount: number;
  postedAtUtc: string;
  status: string;
}

export interface BusinessAnalyticsDto {
  businessId: string;
  activeJobListings: number;
  totalJobPostings: number;
  totalApplicantsReceived: number;
  pendingApplicantReviews: number;
  shortlistedCandidatesCount: number;
  profileViewsCount: number;
  topListings: JobListingPerformanceDto[];
}

// --- RECHARTS MOCK DATA ---

const engagementTrendData = [
  { month: "Mar", applications: 24, views: 110 },
  { month: "Apr", applications: 35, views: 180 },
  { month: "May", applications: 48, views: 240 },
  { month: "Jun", applications: 62, views: 320 },
  { month: "Jul", applications: 95, views: 490 },
  { month: "Aug", applications: 148, views: 620 },
];

const applicantDistributionData = [
  { name: "BSc IT", value: 68 },
  { name: "Diploma IT", value: 42 },
  { name: "BCom Info Sys", value: 26 },
  { name: "Alumni / Postgrad", value: 12 },
];

const COLORS = ["#00A8E8", "#007EA7", "#003459", "#00171F"];

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
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0A192F]/90 backdrop-blur-md text-slate-900 dark:text-slate-100 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 ${className}`}
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
    <div
      className={`flex flex-col space-y-1.5 p-6 border-b border-slate-100 dark:border-slate-800/80 ${className}`}
    >
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
      className={`text-lg font-extrabold tracking-tight text-slate-900 dark:text-white ${className}`}
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
      className={`text-xs font-medium text-slate-500 dark:text-slate-400 ${className}`}
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
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function Badge({ status }: { status: OpportunityStatus | string }) {
  const styles: Record<string, string> = {
    [OpportunityStatus.PendingApproval]:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    [OpportunityStatus.Published]:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    [OpportunityStatus.Rejected]:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    [OpportunityStatus.Closed]:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  };

  const currentStyle = styles[status] || styles[OpportunityStatus.Closed];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${currentStyle}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status === OpportunityStatus.PendingApproval ? "Pending Review" : status}
    </span>
  );
}

function Button({
  variant = "default",
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "secondary";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl text-xs md:text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8] disabled:opacity-50 active:scale-[0.98]";
  const variants = {
    default:
      "bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white shadow-lg shadow-[#00A8E8]/25 hover:brightness-110",
    outline:
      "border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200",
    secondary:
      "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700",
  };
  return (
    <button
      className={`${base} ${variants[variant]} h-10 px-4 py-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// --- INITIAL MOCK DATA ---

const mockProfile: BusinessProfileDto = {
  id: "b-902",
  companyName: "Apex Software Solutions",
  industry: "Enterprise IT & Cloud Infrastructure",
  websiteUrl: "https://apexsolutions.co.za",
  registrationNumber: "2024/987654/07",
};

const mockAnalytics: BusinessAnalyticsDto = {
  businessId: "b-902",
  activeJobListings: 4,
  totalJobPostings: 12,
  totalApplicantsReceived: 148,
  pendingApplicantReviews: 19,
  shortlistedCandidatesCount: 8,
  profileViewsCount: 620,
  topListings: [
    {
      opportunityId: "op-1",
      title: "Junior C# / ASP.NET Developer",
      applicantCount: 42,
      postedAtUtc: "2026-08-20T10:00:00Z",
      status: "Published",
    },
    {
      opportunityId: "op-3",
      title: "Cloud Infrastructure Specialist",
      applicantCount: 28,
      postedAtUtc: "2026-08-15T09:00:00Z",
      status: "Published",
    },
    {
      opportunityId: "op-4",
      title: "Full-Stack React & Node Intern",
      applicantCount: 19,
      postedAtUtc: "2026-08-10T11:20:00Z",
      status: "Closed",
    },
  ],
};

const mockOpportunities: Opportunity[] = [
  {
    id: "op-1",
    businessProfileId: "b-902",
    title: "Junior C# / ASP.NET Developer",
    description:
      "Looking for an energetic developer skilled in C#, Clean Architecture, and REST API development.",
    targetProgramme: "BSc Information Technology",
    status: OpportunityStatus.Published,
    createdAtUtc: "2026-08-20T10:00:00Z",
    applicationsCount: 8,
  },
  {
    id: "op-2",
    businessProfileId: "b-902",
    title: "Cloud Infrastructure Specialist",
    description:
      "Assist with deployment automation, Docker containers, and database setup in PostgreSQL.",
    targetProgramme: "BSc IT / Higher Certificate IT",
    status: OpportunityStatus.PendingApproval,
    createdAtUtc: "2026-08-28T14:30:00Z",
    applicationsCount: 0,
  },
];

const mockApplications: JobApplicationDto[] = [
  {
    id: "app-101",
    applicantId: "usr-1",
    applicantName: "Gradi Puata",
    applicantRole: "Student",
    programme: "BSc Information Technology",
    appliedAt: "2026-08-22T09:15:00Z",
  },
  {
    id: "app-102",
    applicantId: "usr-2",
    applicantName: "Sarah Jenkins",
    applicantRole: "Alumni",
    programme: "BSc Information Technology",
    appliedAt: "2026-08-23T11:40:00Z",
  },
];

const mockPosts: PostDto[] = [
  {
    id: "post-1",
    authorId: "usr-1",
    authorName: "Gradi Puata",
    authorRole: "Student (BSc IT)",
    content:
      "Published our new open-source C# JWT library! Excited to share this with the Richfield dev society.",
    createdAt: "2026-08-29T12:00:00Z",
    commentCount: 1,
    likeCount: 19,
    isLiked: false,
    comments: [
      {
        id: "c-1",
        authorName: "Apex Software Solutions",
        content:
          "Great work on this library! Looking forward to reviewing candidates with hands-on C# security experience.",
        createdAt: "2026-08-29T13:10:00Z",
      },
    ],
  },
  {
    id: "post-2",
    authorId: "b-902",
    authorName: "Apex Software Solutions",
    authorRole: "Verified Employer",
    content:
      "We are currently accepting junior application submissions for backend software roles!",
    createdAt: "2026-08-27T08:30:00Z",
    commentCount: 0,
    likeCount: 11,
    isLiked: true,
    comments: [],
  },
];

type TabType = "opportunities" | "create" | "feed" | "profile" | "analytics";

export default function BusinessConsolePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("opportunities");

  // State
  const [business, setBusiness] = useState<BusinessProfileDto>(mockProfile);
  const [analytics] = useState<BusinessAnalyticsDto>(mockAnalytics);
  const [profileForm, setProfileForm] = useState<CreateBusinessDto>({
    companyName: mockProfile.companyName,
    registrationNumber: mockProfile.registrationNumber || "",
    industry: mockProfile.industry,
    websiteUrl: mockProfile.websiteUrl,
  });

  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(mockOpportunities);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);

  // Feed Interactive State
  const [posts, setPosts] = useState<PostDto[]>(mockPosts);
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {},
  );

  // Form State
  const [newOpportunity, setNewOpportunity] = useState<CreateOpportunityDto>({
    title: "",
    description: "",
    targetProgramme: "",
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  // Handlers
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setBusiness((prev) => ({
      ...prev,
      companyName: profileForm.companyName.trim(),
      industry: profileForm.industry.trim(),
      websiteUrl: profileForm.websiteUrl.trim(),
      registrationNumber: profileForm.registrationNumber.trim(),
    }));
    alert("Profile details successfully updated!");
  };

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newOpportunity.title.trim() ||
      !newOpportunity.description.trim() ||
      !newOpportunity.targetProgramme.trim()
    )
      return;

    const created: Opportunity = {
      id: crypto.randomUUID(),
      businessProfileId: business.id,
      title: newOpportunity.title.trim(),
      description: newOpportunity.description.trim(),
      targetProgramme: newOpportunity.targetProgramme.trim(),
      status: OpportunityStatus.PendingApproval,
      createdAtUtc: new Date().toISOString(),
      applicationsCount: 0,
    };

    setOpportunities([created, ...opportunities]);
    setNewOpportunity({ title: "", description: "", targetProgramme: "" });
    setActiveTab("opportunities");
  };

  const handleToggleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const currentlyLiked = post.isLiked;
          return {
            ...post,
            isLiked: !currentlyLiked,
            likeCount: currentlyLiked ? post.likeCount - 1 : post.likeCount + 1,
          };
        }
        return post;
      }),
    );
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const newComment: CommentDto = {
      id: crypto.randomUUID(),
      authorName: business.companyName,
      content: commentText,
      createdAt: new Date().toISOString(),
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedComments = [...(post.comments || []), newComment];
          return {
            ...post,
            comments: updatedComments,
            commentCount: updatedComments.length,
          };
        }
        return post;
      }),
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "dark bg-[#040B14] text-slate-100"
          : "bg-slate-50 text-slate-900"
      } flex flex-col font-sans transition-colors duration-300`}
    >
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0A192F]/80 backdrop-blur-xl px-6 md:px-10 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#00A8E8] to-[#007EA7] flex items-center justify-center text-white shadow-lg shadow-[#00A8E8]/30">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                {business.companyName}
              </span>
              <ShieldCheck className="h-4 w-4 text-[#00A8E8]" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
              Employer Enterprise Portal
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Tab Selection Navigation */}
        <div className="flex space-x-1 border border-slate-200/80 dark:border-slate-800 bg-slate-200/50 dark:bg-[#06101E]/80 p-1.5 rounded-2xl w-full md:w-fit overflow-x-auto shadow-inner">
          {[
            {
              id: "opportunities",
              label: "My Opportunities",
              count: opportunities.length,
              icon: Briefcase,
            },
            { id: "create", label: "Post Opportunity", icon: PlusCircle },
            {
              id: "analytics",
              label: "Analytics & Performance",
              icon: TrendingUp,
            },
            { id: "feed", label: "Campus Feed", icon: MessageSquare },
            { id: "profile", label: "Company Profile", icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setSelectedOpportunity(null);
                }}
                className={`flex-1 md:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-white dark:bg-[#0A192F] text-[#007EA7] dark:text-[#00A8E8] shadow-md border border-slate-200/60 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-[#00A8E8]" : "opacity-70"}`}
                />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#00A8E8] text-white font-extrabold shadow-sm">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* --- TAB 1: OPPORTUNITIES --- */}
        {activeTab === "opportunities" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div
              className={
                selectedOpportunity
                  ? "hidden lg:block lg:col-span-1"
                  : "lg:col-span-3"
              }
            >
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Opportunities</CardTitle>
                  <CardDescription>
                    Manage active job postings and check approval progress.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {opportunities.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs font-bold">
                      No opportunities submitted yet.
                    </div>
                  ) : (
                    opportunities.map((op) => (
                      <div
                        key={op.id}
                        onClick={() => setSelectedOpportunity(op)}
                        className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                          selectedOpportunity?.id === op.id
                            ? "border-[#00A8E8] bg-[#00A8E8]/5 dark:bg-[#00A8E8]/10 shadow-md"
                            : "border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#06101E] hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                              {op.title}
                            </h4>
                            <Badge status={op.status} />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                            {op.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                          <span>Target: {op.targetProgramme}</span>
                          <span className="text-[#007EA7] dark:text-[#00A8E8] flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {op.applicationsCount ?? 0} Applicants
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {selectedOpportunity && (
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <CardTitle>{selectedOpportunity.title}</CardTitle>
                        <Badge status={selectedOpportunity.status} />
                      </div>
                      <CardDescription className="mt-1">
                        Submitted on{" "}
                        {new Date(
                          selectedOpportunity.createdAtUtc,
                        ).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedOpportunity(null)}
                    >
                      Close Detail
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Target Programme
                      </h5>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {selectedOpportunity.targetProgramme}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Description & Requirements
                      </h5>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedOpportunity.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
                        Applicant Review ({mockApplications.length})
                      </h5>

                      <div className="space-y-3">
                        {mockApplications.map((app) => (
                          <div
                            key={app.id}
                            className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#06101E] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                  {app.applicantName}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  {app.applicantRole}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium mt-1">
                                {app.programme}
                              </p>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">
                              Applied{" "}
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: POST OPPORTUNITY --- */}
        {activeTab === "create" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Post New Opportunity</CardTitle>
              <CardDescription>
                Submissions are sent for administrative approval before
                publishing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateOpportunity} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Job / Internship Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Junior Backend Software Engineer"
                    value={newOpportunity.title}
                    onChange={(e) =>
                      setNewOpportunity({
                        ...newOpportunity,
                        title: e.target.value,
                      })
                    }
                    className="flex h-10 w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-4 text-xs text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Target Programme
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSc Information Technology / Diploma in IT"
                    value={newOpportunity.targetProgramme}
                    onChange={(e) =>
                      setNewOpportunity({
                        ...newOpportunity,
                        targetProgramme: e.target.value,
                      })
                    }
                    className="flex h-10 w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-4 text-xs text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Job Description & Requirements
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Outline key responsibilities, requirements, and application instructions..."
                    value={newOpportunity.description}
                    onChange={(e) =>
                      setNewOpportunity({
                        ...newOpportunity,
                        description: e.target.value,
                      })
                    }
                    className="flex w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] p-4 text-xs text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <Button type="submit" className="w-full sm:w-auto">
                    Submit Opportunity
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* --- TAB 3: BUSINESS ANALYTICS (RECHARTS INTEGRATED) --- */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Metric KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                {
                  label: "Active Listings",
                  value: analytics.activeJobListings,
                  icon: Briefcase,
                },
                {
                  label: "Total Listings",
                  value: analytics.totalJobPostings,
                  icon: FileText,
                },
                {
                  label: "Total Applicants",
                  value: analytics.totalApplicantsReceived,
                  icon: Users,
                },
                {
                  label: "Pending Review",
                  value: analytics.pendingApplicantReviews,
                  icon: Clock,
                },
                {
                  label: "Shortlisted",
                  value: analytics.shortlistedCandidatesCount,
                  icon: CheckCircle2,
                },
                {
                  label: "Profile Views",
                  value: analytics.profileViewsCount,
                  icon: Eye,
                },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <Card key={idx} className="p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">
                        {stat.label}
                      </span>
                      <Icon className="h-4 w-4 text-[#00A8E8]" />
                    </div>
                    <span className="text-2xl font-black font-mono text-[#007EA7] dark:text-[#00A8E8] mt-3">
                      {stat.value}
                    </span>
                  </Card>
                );
              })}
            </div>

            {/* Recharts Analytics Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Engagement Area Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Application & Impression Growth</CardTitle>
                  <CardDescription>
                    6-month analytics breakdown for overall profile views vs
                    application conversions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[320px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={engagementTrendData}>
                      <defs>
                        <linearGradient
                          id="colorApps"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#00A8E8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#00A8E8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorViews"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#007EA7"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#007EA7"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis
                        dataKey="month"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#0A192F" : "#ffffff",
                          borderColor: isDarkMode ? "#1e293b" : "#e2e8f0",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="#007EA7"
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        name="Profile Impressions"
                      />
                      <Area
                        type="monotone"
                        dataKey="applications"
                        stroke="#00A8E8"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorApps)"
                        name="Submitted Applications"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Applicant Programme Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Applicants by Faculty</CardTitle>
                  <CardDescription>
                    Demographics of candidate academic backgrounds.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[320px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={applicantDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {applicantDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#0A192F" : "#ffffff",
                          borderColor: isDarkMode ? "#1e293b" : "#e2e8f0",
                          borderRadius: "12px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Listings Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Opportunities</CardTitle>
                <CardDescription>
                  Engagement breakdown per listing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                        <th className="pb-3 px-3">Opportunity Title</th>
                        <th className="pb-3 px-3 text-center">Applicants</th>
                        <th className="pb-3 px-3">Posted Date</th>
                        <th className="pb-3 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                      {analytics.topListings.map((listing) => (
                        <tr
                          key={listing.opportunityId}
                          className="hover:bg-slate-50 dark:hover:bg-slate-900/40"
                        >
                          <td className="py-4 px-3 font-bold text-slate-900 dark:text-white">
                            {listing.title}
                          </td>
                          <td className="py-4 px-3 text-center font-mono font-extrabold text-[#007EA7] dark:text-[#00A8E8]">
                            {listing.applicantCount}
                          </td>
                          <td className="py-4 px-3 text-slate-500 font-mono">
                            {new Date(listing.postedAtUtc).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-3 text-right">
                            <Badge status={listing.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* --- TAB 4: CAMPUS FEED --- */}
        {activeTab === "feed" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campus Community Feed</CardTitle>
                <CardDescription>
                  Engage directly with students, alumni, and tech initiatives.
                </CardDescription>
              </CardHeader>
            </Card>

            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {post.authorName}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                        {post.authorRole}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center space-x-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                        post.isLiked
                          ? "bg-[#00A8E8]/10 text-[#00A8E8]"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`}
                      />
                      <span>{post.likeCount}</span>
                    </button>

                    <button
                      onClick={() => handleToggleComments(post.id)}
                      className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.commentCount} Comments</span>
                    </button>
                  </div>

                  {/* Comment Section Expansion */}
                  {expandedComments[post.id] && (
                    <div className="pt-4 space-y-3 border-t border-slate-100 dark:border-slate-800/80">
                      {post.comments?.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-xs space-y-1"
                        >
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {comment.authorName}
                          </span>
                          <p className="text-slate-700 dark:text-slate-300">
                            {comment.content}
                          </p>
                        </div>
                      ))}

                      <form
                        onSubmit={(e) => handleAddComment(post.id, e)}
                        className="flex gap-2 pt-2"
                      >
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInputs[post.id] || ""}
                          onChange={(e) =>
                            setCommentInputs({
                              ...commentInputs,
                              [post.id]: e.target.value,
                            })
                          }
                          className="flex-1 h-9 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-3 text-xs text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                        />
                        <Button type="submit" className="h-9 px-3">
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      </form>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* --- TAB 5: COMPANY PROFILE --- */}
        {activeTab === "profile" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                Update official organizational information visible to campus
                recruits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.companyName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        companyName: e.target.value,
                      })
                    }
                    className="flex h-10 w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-4 text-xs text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.industry}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        industry: e.target.value,
                      })
                    }
                    className="flex h-10 w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-4 text-xs text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    required
                    value={profileForm.websiteUrl}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        websiteUrl: e.target.value,
                      })
                    }
                    className="flex h-10 w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-4 text-xs text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={profileForm.registrationNumber}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        registrationNumber: e.target.value,
                      })
                    }
                    className="flex h-10 w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-4 text-xs text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <Button type="submit">Save Profile Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

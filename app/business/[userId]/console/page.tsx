// app/business/[businessId]/console/page.tsx
"use client";

import React, { useState, useEffect } from "react";

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
    <div className={`flex flex-col space-y-1.5 p-5 md:p-6 ${className}`}>
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
      className={`text-base md:text-lg font-bold leading-none text-black dark:text-white ${className}`}
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
  return <div className={`p-5 md:p-6 pt-0 ${className}`}>{children}</div>;
}

function Badge({ status }: { status: OpportunityStatus | string }) {
  const styles: Record<string, string> = {
    [OpportunityStatus.PendingApproval]:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-900",
    [OpportunityStatus.Published]:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-900",
    [OpportunityStatus.Rejected]:
      "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
    [OpportunityStatus.Closed]:
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700",
  };

  const currentStyle = styles[status] || styles[OpportunityStatus.Closed];

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] md:text-xs font-bold font-mono ${currentStyle}`}
    >
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
    "inline-flex items-center justify-center rounded-md text-xs md:text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8] disabled:opacity-50 active:scale-[0.98]";
  const variants = {
    default: "bg-[#00A8E8] text-black hover:bg-[#0096D1] shadow-sm",
    outline:
      "border border-slate-300 dark:border-slate-700 bg-white dark:bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-black dark:text-slate-200",
    secondary:
      "bg-slate-100 dark:bg-slate-800 text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700",
  };
  return (
    <button
      className={`${base} ${variants[variant]} h-9 px-4 py-2 ${className}`}
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
  const [isDarkMode, setIsDarkMode] = useState(false);
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
      className={`min-h-screen ${isDarkMode ? "dark bg-[#040B14] text-slate-100" : "bg-white text-black"} flex flex-col font-sans transition-colors duration-200`}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A192F] px-4 md:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-1.5 bg-[#00A8E8] rounded-full shadow-[0_0_12px_#00A8E8]" />
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-black dark:text-white block leading-none">
              {business.companyName}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              Employer Console
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-black dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#06101E] p-1 rounded-lg w-full md:w-fit overflow-x-auto shadow-inner">
          {[
            {
              id: "opportunities",
              label: "My Opportunities",
              count: opportunities.length,
            },
            { id: "create", label: "+ Post Opportunity" },
            { id: "analytics", label: "Analytics" },
            { id: "feed", label: "Campus Feed" },
            { id: "profile", label: "Company Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                setSelectedOpportunity(null);
              }}
              className={`flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white dark:bg-[#0A192F] text-[#007EA7] dark:text-[#00A8E8] shadow-sm border border-slate-200 dark:border-slate-800"
                  : "text-slate-700 dark:text-slate-400 hover:text-black dark:hover:text-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#00A8E8] text-black font-extrabold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* --- TAB 1: OPPORTUNITIES LIST / DETAIL --- */}
        {activeTab === "opportunities" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    Manage active jobs and check pending admin review status.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {opportunities.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs font-bold">
                      No opportunities created yet.
                    </div>
                  ) : (
                    opportunities.map((op) => (
                      <div
                        key={op.id}
                        onClick={() => setSelectedOpportunity(op)}
                        className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          selectedOpportunity?.id === op.id
                            ? "border-[#00A8E8] bg-slate-50 dark:bg-slate-900/50"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#06101E] hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-bold text-black dark:text-white truncate">
                              {op.title}
                            </h4>
                            <Badge status={op.status} />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2">
                            {op.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                          <span>Target: {op.targetProgramme}</span>
                          <span className="text-[#007EA7] dark:text-[#00A8E8]">
                            {op.applicationsCount ?? 0} Applications
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
                      <div className="flex items-center space-x-2">
                        <CardTitle>{selectedOpportunity.title}</CardTitle>
                        <Badge status={selectedOpportunity.status} />
                      </div>
                      <CardDescription className="mt-1">
                        Posted{" "}
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
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Target Programme
                      </h5>
                      <p className="text-xs font-semibold text-black dark:text-slate-200">
                        {selectedOpportunity.targetProgramme}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Description
                      </h5>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {selectedOpportunity.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-black dark:text-slate-200 mb-3">
                        Student & Alumni Applications ({mockApplications.length}
                        )
                      </h5>

                      <div className="space-y-2">
                        {mockApplications.map((app) => (
                          <div
                            key={app.id}
                            className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#06101E] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-black dark:text-white">
                                  {app.applicantName}
                                </span>
                                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-black dark:text-slate-300">
                                  {app.applicantRole}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                                {app.programme}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">
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

        {/* --- TAB 2: CREATE OPPORTUNITY FORM --- */}
        {activeTab === "create" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Post New Opportunity</CardTitle>
              <CardDescription>
                Submissions are sent for administrator approval before
                publishing to students and alumni.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateOpportunity} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
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
                    className="flex h-9 w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-3 py-1 text-xs text-black dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
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
                    className="flex h-9 w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-3 py-1 text-xs text-black dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
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
                    className="flex w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-3 py-2 text-xs text-black dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" className="w-full sm:w-auto">
                    Submit for Admin Approval
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* --- TAB 3: BUSINESS ANALYTICS --- */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* High-Level Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {[
                {
                  label: "Active Listings",
                  value: analytics.activeJobListings,
                },
                { label: "Total Listings", value: analytics.totalJobPostings },
                {
                  label: "Total Applicants",
                  value: analytics.totalApplicantsReceived,
                },
                {
                  label: "Pending Reviews",
                  value: analytics.pendingApplicantReviews,
                },
                {
                  label: "Shortlisted",
                  value: analytics.shortlistedCandidatesCount,
                },
                { label: "Profile Views", value: analytics.profileViewsCount },
              ].map((stat, idx) => (
                <Card key={idx} className="p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </span>
                  <span className="text-xl md:text-2xl font-extrabold font-mono text-[#007EA7] dark:text-[#00A8E8] mt-2">
                    {stat.value}
                  </span>
                </Card>
              ))}
            </div>

            {/* Top Performing Listings Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Opportunities</CardTitle>
                <CardDescription>
                  Listing engagement metrics and total applicants received.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                        <th className="pb-3 px-2">Opportunity Title</th>
                        <th className="pb-3 px-2 text-center">Applicants</th>
                        <th className="pb-3 px-2">Posted Date</th>
                        <th className="pb-3 px-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {analytics.topListings.map((listing) => (
                        <tr
                          key={listing.opportunityId}
                          className="hover:bg-slate-50 dark:hover:bg-slate-900/40"
                        >
                          <td className="py-3 px-2 font-bold text-black dark:text-white">
                            {listing.title}
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-bold text-[#007EA7] dark:text-[#00A8E8]">
                            {listing.applicantCount}
                          </td>
                          <td className="py-3 px-2 text-slate-500 font-mono">
                            {new Date(listing.postedAtUtc).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2 text-right">
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
          <div className="max-w-2xl mx-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campus Community Feed</CardTitle>
                <CardDescription>
                  Engage with students and alumni by liking and commenting on
                  campus updates.
                </CardDescription>
              </CardHeader>
            </Card>

            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-black dark:text-white">
                        {post.authorName}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-500">
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

                  <div className="flex items-center space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-md transition-all ${
                        post.isLiked
                          ? "bg-[#00A8E8]/10 text-[#007EA7] dark:text-[#00A8E8]"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{post.isLiked ? "👍 Liked" : "👍 Like"}</span>
                      <span className="text-[10px] font-mono">
                        ({post.likeCount})
                      </span>
                    </button>

                    <button
                      onClick={() => handleToggleComments(post.id)}
                      className="flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      <span>💬 Comments</span>
                      <span className="text-[10px] font-mono">
                        ({post.commentCount})
                      </span>
                    </button>
                  </div>

                  {expandedComments[post.id] && (
                    <div className="pt-3 space-y-3 border-t border-slate-100 dark:border-slate-800">
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-2">
                          {post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-2.5 rounded-md bg-slate-50 dark:bg-[#06101E] border border-slate-200 dark:border-slate-800 text-xs"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-black dark:text-white text-[11px]">
                                  {comment.authorName}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono">
                                  {new Date(
                                    comment.createdAt,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <form
                        onSubmit={(e) => handleAddComment(post.id, e)}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={commentInputs[post.id] || ""}
                          onChange={(e) =>
                            setCommentInputs({
                              ...commentInputs,
                              [post.id]: e.target.value,
                            })
                          }
                          className="flex-1 h-8 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-3 text-xs text-black dark:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00A8E8]"
                        />
                        <button
                          type="submit"
                          className="h-8 px-3 rounded-md bg-[#00A8E8] text-black text-xs font-bold hover:bg-[#0096D1] transition-all shrink-0"
                        >
                          Post
                        </button>
                      </form>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* --- TAB 5: PROFILE SECTION & EDIT --- */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Public overview as seen by student applicants.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Company Name
                  </span>
                  <p className="text-sm font-bold text-black dark:text-white">
                    {business.companyName}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Industry Sector
                  </span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {business.industry}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Official Website
                  </span>
                  <p className="text-xs font-mono font-bold text-[#007EA7] dark:text-[#00A8E8] truncate">
                    <a
                      href={business.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {business.websiteUrl}
                    </a>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Registration Number
                  </span>
                  <p className="text-xs font-mono font-semibold text-black dark:text-slate-200">
                    {business.registrationNumber || "Not Provided"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Update Business Details</CardTitle>
                <CardDescription>
                  Modify your verified company profile details across the campus
                  portal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
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
                        className="flex h-9 w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-3 py-1 text-xs text-black dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.registrationNumber}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            registrationNumber: e.target.value,
                          })
                        }
                        className="flex h-9 w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-3 py-1 text-xs text-black dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
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
                      className="flex h-9 w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-3 py-1 text-xs text-black dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
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
                      className="flex h-9 w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#06101E] px-3 py-1 text-xs text-black dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E8]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button type="submit" className="w-full sm:w-auto">
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

// app/student/[studentId]/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

// --- DOMAIN DTOS & INTERFACES ---

export interface UpdateProfileDto {
  firstName: string;
  lastName: string;
  studentNumber: string;
  headline: string;
  bio: string;
  programme: string;
}

export interface ExperienceDto {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface CertificationDto {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialUrl: string;
}

export interface SkillDto {
  id: string;
  name: string;
}

export interface PeerStudentDto {
  id: string;
  name: string;
  programme: string;
  skills: {
    name: string;
    endorsementsCount: number;
    isEndorsedByMe: boolean;
  }[];
}

export interface StudentAnalyticsDto {
  studentId: string;
  appliedJobsCount: number;
  bookmarkedJobsCount: number;
  totalConnections: number;
  pendingConnectionRequests: number;
  totalEndorsementsReceived: number;
  profileViewsCount: number;
  recentApplications: {
    applicationId: string;
    jobTitle: string;
    companyName: string;
    status: "Pending" | "Reviewed" | "Shortlisted" | "Rejected";
    appliedAtUtc: string;
  }[];
}

export interface ContactDto {
  id: string;
  name: string;
  role: string;
  online: boolean;
}

export interface DirectMessageDto {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface OpportunityDto {
  id: string;
  title: string;
  companyName: string;
  description: string;
  targetProgramme: string;
  createdAtUtc: string;
}

export interface EventDto {
  id: string;
  title: string;
  description: string;
  eventDate: string;
}

export interface AnnouncementDto {
  id: string;
  title: string;
  content: string;
  postedAt: string;
  isImportant?: boolean;
  isRead?: boolean;
}

export interface FeedCommentDto {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface CampusPostDto {
  id: string;
  authorName: string;
  authorHandle: string;
  authorRole: "Student" | "Alumni";
  authorAvatarBg: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  comments: FeedCommentDto[];
}

// --- MOCK INITIAL DATA ---

const mockUpdateProfile: UpdateProfileDto = {
  firstName: "Gradi",
  lastName: "Puata",
  studentNumber: "202488392",
  headline: "Backend Engineer & C# Specialist",
  bio: "Focused on Clean Architecture, REST APIs, and scalable PostgreSQL implementations.",
  programme: "BSc Information Technology",
};

const mockExperiences: ExperienceDto[] = [
  {
    id: "exp-1",
    title: "Student Developer",
    company: "Richfield Dev Society",
    startDate: "2026-01-10",
    isCurrent: true,
  },
];

const mockCertifications: CertificationDto[] = [
  {
    id: "cert-1",
    name: "AWS Certified Cloud Practitioner",
    issuingOrganization: "Amazon Web Services",
    issueDate: "2026-05-15",
    credentialUrl: "https://aws.amazon.com/verification",
  },
];

const mockSkills: SkillDto[] = [
  { id: "sk-1", name: "C#" },
  { id: "sk-2", name: "ASP.NET Core" },
  { id: "sk-3", name: "PostgreSQL" },
];

const mockPeers: PeerStudentDto[] = [
  {
    id: "peer-1",
    name: "Sarah Jenkins",
    programme: "BSc Information Technology",
    skills: [
      { name: "C#", endorsementsCount: 14, isEndorsedByMe: false },
      {
        name: "System Architecture",
        endorsementsCount: 8,
        isEndorsedByMe: true,
      },
    ],
  },
  {
    id: "peer-2",
    name: "Michael Chen",
    programme: "BSc Computer Science",
    skills: [
      { name: "TypeScript", endorsementsCount: 9, isEndorsedByMe: false },
      { name: "PostgreSQL", endorsementsCount: 11, isEndorsedByMe: false },
    ],
  },
];

const mockAnalytics: StudentAnalyticsDto = {
  studentId: "st-771",
  appliedJobsCount: 14,
  bookmarkedJobsCount: 6,
  totalConnections: 42,
  pendingConnectionRequests: 3,
  totalEndorsementsReceived: 29,
  profileViewsCount: 184,
  recentApplications: [
    {
      applicationId: "app-101",
      jobTitle: "Junior C# / ASP.NET Developer",
      companyName: "Apex Solutions",
      status: "Shortlisted",
      appliedAtUtc: "2026-08-22T09:15:00Z",
    },
    {
      applicationId: "app-102",
      jobTitle: "Cloud Infrastructure Intern",
      companyName: "CloudPulse SA",
      status: "Reviewed",
      appliedAtUtc: "2026-08-18T14:30:00Z",
    },
    {
      applicationId: "app-103",
      jobTitle: "Backend Software Engineer",
      companyName: "Derivco Tech",
      status: "Pending",
      appliedAtUtc: "2026-08-10T11:00:00Z",
    },
    {
      applicationId: "app-104",
      jobTitle: "Junior Database Admin",
      companyName: "FinTech Hub",
      status: "Rejected",
      appliedAtUtc: "2026-07-28T08:00:00Z",
    },
  ],
};

const mockContacts: ContactDto[] = [
  {
    id: "usr-002",
    name: "Sarah Jenkins",
    role: "Alumni (BSc IT '25)",
    online: true,
  },
  {
    id: "usr-003",
    name: "Michael Chen",
    role: "Student (4th Year)",
    online: false,
  },
  {
    id: "usr-004",
    name: "Thabo Molefe",
    role: "Alumni (Software Eng Lead)",
    online: true,
  },
];

const mockDirectMessages: DirectMessageDto[] = [
  {
    id: "m-1",
    senderId: "usr-002",
    senderName: "Sarah Jenkins",
    receiverId: "usr-001",
    content: "Hey Gradi, saw your C# Jwt project. Looks clean!",
    sentAt: "2026-08-29T11:15:00Z",
    isRead: false,
  },
  {
    id: "m-2",
    senderId: "usr-001",
    senderName: "Gradi Puata",
    receiverId: "usr-002",
    content:
      "Thanks Sarah! I built it to simplify token validation in ASP.NET Core.",
    sentAt: "2026-08-29T11:18:00Z",
    isRead: true,
  },
  {
    id: "m-3",
    senderId: "usr-003",
    senderName: "Michael Chen",
    receiverId: "usr-001",
    content: "Are you attending the AWS workshop tomorrow?",
    sentAt: "2026-08-28T16:40:00Z",
    isRead: false,
  },
  {
    id: "m-4",
    senderId: "usr-004",
    senderName: "Thabo Molefe",
    receiverId: "usr-001",
    content: "We have an open graduate slot at Derivco if you're interested.",
    sentAt: "2026-08-27T10:00:00Z",
    isRead: true,
  },
];

const mockAvailableCatalogSkills: SkillDto[] = [
  { id: "sk-1", name: "C#" },
  { id: "sk-2", name: "ASP.NET Core" },
  { id: "sk-3", name: "PostgreSQL" },
  { id: "sk-4", name: "TypeScript" },
  { id: "sk-5", name: "React / Next.js" },
  { id: "sk-6", name: "Docker" },
  { id: "sk-7", name: "Python" },
  { id: "sk-8", name: "Clean Architecture" },
];

const mockOpportunities: OpportunityDto[] = [
  {
    id: "op-1",
    title: "Junior C# / ASP.NET Developer",
    companyName: "Apex Software Solutions",
    description:
      "Looking for a high-performing backend intern/junior familiar with C#, ASP.NET Core Web API, and SQL databases.",
    targetProgramme: "BSc Information Technology",
    createdAtUtc: "2026-08-20T10:00:00Z",
  },
  {
    id: "op-2",
    title: "Cloud & DevOps Graduate",
    companyName: "CloudPulse SA",
    description:
      "Hands-on experience with Linux administration, Docker containerization, and AWS infrastructure deployment.",
    targetProgramme: "BSc Information Technology / Diploma in IT",
    createdAtUtc: "2026-08-25T12:00:00Z",
  },
];

const mockEvents: EventDto[] = [
  {
    id: "ev-1",
    title: "Campus Hackathon 2026",
    description: "48-hour build contest focused on AI and Campus Solutions.",
    eventDate: "2026-09-15T09:00:00Z",
  },
  {
    id: "ev-2",
    title: "Tech Career Fair & Employer Meet",
    description:
      "Meet engineering leads and HR representatives from top local employers.",
    eventDate: "2026-09-22T10:00:00Z",
  },
];

const mockAnnouncements: AnnouncementDto[] = [
  {
    id: "an-1",
    title: "End of Term Exam Timetable Published",
    content:
      "Check your academic portal for full details on exam venues and times.",
    postedAt: "2026-08-28T09:00:00Z",
    isImportant: true,
    isRead: false,
  },
  {
    id: "an-2",
    title: "AWS Academy Vouchers Ready",
    content:
      "Students who completed Cloud Practitioner modules can request vouchers.",
    postedAt: "2026-08-24T14:10:00Z",
    isRead: true,
  },
];

// MOCK STUDENT & ALUMNI CAMPUS FEED POSTS
const mockCampusPosts: CampusPostDto[] = [
  {
    id: "post-101",
    authorName: "Sarah Jenkins",
    authorHandle: "@sarah_j",
    authorRole: "Alumni",
    authorAvatarBg: "bg-emerald-600",
    content:
      "Just landed my first Senior Backend Role! 🚀 Huge shoutout to the Richfield tech community. For everyone studying C# and ASP.NET Core right now: master Clean Architecture and dependency injection—it changed the game for my technical interviews!",
    createdAt: "2h",
    likesCount: 34,
    isLiked: false,
    isBookmarked: false,
    comments: [
      {
        id: "c-1",
        authorName: "Thabo Molefe",
        authorRole: "Alumni",
        content: "Huge congrats Sarah! Well deserved 🙌",
        createdAt: "1h",
      },
      {
        id: "c-2",
        authorName: "Gradi Puata",
        authorRole: "Student",
        content: "Awesome achievement Sarah! Thanks for the backend tips.",
        createdAt: "30m",
      },
    ],
  },
  {
    id: "post-102",
    authorName: "Michael Chen",
    authorHandle: "@mchen_dev",
    authorRole: "Student",
    authorAvatarBg: "bg-blue-600",
    content:
      "Building a full-stack Next.js and PostgreSQL app for the upcoming Campus Hackathon 2026. Looking for 1 more UI/UX design teammate! DM me if you're interested. 💻🎨",
    createdAt: "5h",
    likesCount: 19,
    isLiked: true,
    isBookmarked: true,
    comments: [],
  },
  {
    id: "post-103",
    authorName: "Thabo Molefe",
    authorHandle: "@thabo_tech",
    authorRole: "Alumni",
    authorAvatarBg: "bg-purple-600",
    content:
      "Tips for 3rd and 4th-year IT students: Don't just apply with a default resume. Put your live web app projects and public GitHub packages right at the top of your CV!",
    createdAt: "1d",
    likesCount: 52,
    isLiked: false,
    isBookmarked: false,
    comments: [],
  },
];

const profileViewsTrend = [
  { month: "Mar", views: 22 },
  { month: "Apr", views: 35 },
  { month: "May", views: 58 },
  { month: "Jun", views: 89 },
  { month: "Jul", views: 120 },
  { month: "Aug", views: 184 },
];

const applicationStatusData = [
  { name: "Pending", count: 4 },
  { name: "Reviewed", count: 5 },
  { name: "Shortlisted", count: 3 },
  { name: "Rejected", count: 2 },
];

type SectionTab =
  | "dashboard"
  | "profile"
  | "endorsements"
  | "richie"
  | "opportunities"
  | "applications"
  | "feed"
  | "catalog_skills"
  | "connections"
  | "messages"
  | "events"
  | "announcements";

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Profile Payload & Lists State
  const [profileForm, setProfileForm] =
    useState<UpdateProfileDto>(mockUpdateProfile);
  const [experiences, setExperiences] =
    useState<ExperienceDto[]>(mockExperiences);
  const [certifications, setCertifications] =
    useState<CertificationDto[]>(mockCertifications);
  const [skills, setSkills] = useState<SkillDto[]>(mockSkills);

  // CV File & Dedicated Upload State
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [uploadedCvName, setUploadedCvName] =
    useState<string>("gradi_puata_cv.pdf");
  const [pdfUploadError, setPdfUploadError] = useState<string>("");

  // Modals / Temporary Input fields for In-Profile Lists
  const [newExpTitle, setNewExpTitle] = useState("");
  const [newExpCompany, setNewExpCompany] = useState("");
  const [newCertName, setNewCertName] = useState("");
  const [newCertOrg, setNewCertOrg] = useState("");
  const [newSkillInput, setNewSkillInput] = useState("");

  // Peer Skill Endorsement State
  const [peerStudents, setPeerStudents] = useState<PeerStudentDto[]>(mockPeers);

  // Direct Messaging State
  const [contacts] = useState<ContactDto[]>(mockContacts);
  const [selectedContact, setSelectedContact] = useState<ContactDto>(
    mockContacts[0],
  );
  const [messages, setMessages] =
    useState<DirectMessageDto[]>(mockDirectMessages);
  const [newMessageText, setNewMessageText] = useState("");

  // Campus Feed State
  const [campusPosts, setCampusPosts] =
    useState<CampusPostDto[]>(mockCampusPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [feedCommentInputs, setFeedCommentInputs] = useState<
    Record<string, string>
  >({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(
    null,
  );

  // Notifications, Feeds & Catalog Skills
  const [announcements, setAnnouncements] =
    useState<AnnouncementDto[]>(mockAnnouncements);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityDto | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(["op-1"]);

  // Richie AI Assistant State
  const [chatLog, setChatLog] = useState<
    { sender: "user" | "richie"; text: string }[]
  >([
    {
      sender: "richie",
      text: "Hello Gradi! I'm Richie, your campus career and academic assistant. How can I assist your tech trajectory today?",
    },
  ]);
  const [userQuery, setUserQuery] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  // Mark direct messages read when opening specific chat
  useEffect(() => {
    if (activeTab === "messages" && selectedContact) {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === selectedContact.id && m.receiverId === "usr-001"
            ? { ...m, isRead: true }
            : m,
        ),
      );
    }
  }, [activeTab, selectedContact]);

  // Dynamic Sidebar Badges Calculation
  const unreadMessagesCount = messages.filter(
    (m) => m.receiverId === "usr-001" && !m.isRead,
  ).length;
  const unreadAnnouncementsCount = announcements.filter(
    (a) => !a.isRead,
  ).length;
  const pendingConnectionsCount = mockAnalytics.pendingConnectionRequests;

  // File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPdfUploadError("");

    if (file) {
      if (file.type !== "application/pdf") {
        setPdfUploadError(
          "Invalid file type. Only PDF documents (.pdf) are permitted.",
        );
        setSelectedPdfFile(null);
        return;
      }
      setSelectedPdfFile(file);
    }
  };

  // Dedicated Button Upload Execution
  const handleExecuteCvUpload = () => {
    if (!selectedPdfFile) return;
    setUploadedCvName(selectedPdfFile.name);
    setSelectedPdfFile(null);
    alert("CV PDF uploaded successfully!");
  };

  // Profile List Add/Remove Handlers
  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim() || !newExpCompany.trim()) return;
    const newExp: ExperienceDto = {
      id: crypto.randomUUID(),
      title: newExpTitle,
      company: newExpCompany,
      startDate: new Date().toISOString().split("T")[0],
      isCurrent: true,
    };
    setExperiences([...experiences, newExp]);
    setNewExpTitle("");
    setNewExpCompany("");
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim() || !newCertOrg.trim()) return;
    const newCert: CertificationDto = {
      id: crypto.randomUUID(),
      name: newCertName,
      issuingOrganization: newCertOrg,
      issueDate: new Date().toISOString().split("T")[0],
      credentialUrl: "https://credential.verify",
    };
    setCertifications([...certifications, newCert]);
    setNewCertName("");
    setNewCertOrg("");
  };

  const handleRemoveCertification = (id: string) => {
    setCertifications(certifications.filter((c) => c.id !== id));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const newSk: SkillDto = {
      id: crypto.randomUUID(),
      name: newSkillInput.trim(),
    };
    setSkills([...skills, newSk]);
    setNewSkillInput("");
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  // Endorse Peer Skills Handler
  const handleToggleEndorsePeerSkill = (peerId: string, skillName: string) => {
    setPeerStudents((prev) =>
      prev.map((peer) => {
        if (peer.id === peerId) {
          const updatedSkills = peer.skills.map((s) => {
            if (s.name === skillName) {
              const currentlyEndorsed = s.isEndorsedByMe;
              return {
                ...s,
                isEndorsedByMe: !currentlyEndorsed,
                endorsementsCount: currentlyEndorsed
                  ? s.endorsementsCount - 1
                  : s.endorsementsCount + 1,
              };
            }
            return s;
          });
          return { ...peer, skills: updatedSkills };
        }
        return peer;
      }),
    );
  };

  // Direct Message Send
  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedContact) return;

    const msg: DirectMessageDto = {
      id: crypto.randomUUID(),
      senderId: "usr-001",
      senderName: `${profileForm.firstName} ${profileForm.lastName}`,
      receiverId: selectedContact.id,
      content: newMessageText.trim(),
      sentAt: new Date().toISOString(),
      isRead: true,
    };

    setMessages([...messages, msg]);
    setNewMessageText("");
  };

  // Richie Chat
  const handleSendRichieMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const text = userQuery;
    setChatLog((prev) => [...prev, { sender: "user", text }]);
    setUserQuery("");

    setTimeout(() => {
      let reply =
        "I recommend refining your project portfolio and adding key backend credentials.";
      if (
        text.toLowerCase().includes("c#") ||
        text.toLowerCase().includes("job")
      ) {
        reply =
          "I noticed active C# / ASP.NET job listings matching your programme! Check the Campus Jobs tab to apply.";
      }
      setChatLog((prev) => [...prev, { sender: "richie", text: reply }]);
    }, 600);
  };

  // --- CAMPUS FEED ACTIONS ---
  const handleCreateCampusPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: CampusPostDto = {
      id: crypto.randomUUID(),
      authorName: `${profileForm.firstName} ${profileForm.lastName}`,
      authorHandle: `@${profileForm.firstName.toLowerCase()}_${profileForm.lastName.toLowerCase()}`,
      authorRole: "Student",
      authorAvatarBg: "bg-emerald-500",
      content: newPostContent.trim(),
      createdAt: "Just now",
      likesCount: 0,
      isLiked: false,
      isBookmarked: false,
      comments: [],
    };

    setCampusPosts([newPost, ...campusPosts]);
    setNewPostContent("");
  };

  const handleToggleLikePost = (postId: string) => {
    setCampusPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      }),
    );
  };

  const handleToggleBookmarkPost = (postId: string) => {
    setCampusPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p,
      ),
    );
  };

  const handleAddFeedComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = feedCommentInputs[postId]?.trim();
    if (!text) return;

    const newComment: FeedCommentDto = {
      id: crypto.randomUUID(),
      authorName: `${profileForm.firstName} ${profileForm.lastName}`,
      authorRole: "Student",
      content: text,
      createdAt: "Just now",
    };

    setCampusPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p,
      ),
    );

    setFeedCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  // Job Application Submit
  const handleApplyJob = (opId: string) => {
    if (!appliedJobIds.includes(opId)) {
      setAppliedJobIds([...appliedJobIds, opId]);
      alert("Application submitted using your uploaded PDF CV!");
    }
  };

  // Messages Scoped strictly between logged in student ("usr-001") and selected contact
  const activeConversationMessages = messages.filter(
    (m) =>
      (m.senderId === "usr-001" && m.receiverId === selectedContact?.id) ||
      (m.senderId === selectedContact?.id && m.receiverId === "usr-001"),
  );

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "dark bg-[#030712] text-slate-100" : "bg-slate-50 text-slate-900"} flex flex-col font-sans transition-colors duration-200`}
    >
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md px-4 md:px-8 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-extrabold text-emerald-400 text-sm">
            UC
          </div>
          <div>
            <span className="text-sm font-black uppercase tracking-widest text-white block leading-none">
              UniConnect <span className="text-emerald-400">Student</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {profileForm.firstName} {profileForm.lastName} •{" "}
              {profileForm.studentNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab("richie")}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all"
          >
            <span className="animate-pulse">🤖</span>
            <span>Richie AI</span>
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
          >
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 gap-6">
        {/* FULL SIDEBAR NAVIGATION WITH DYNAMIC NOTIFICATION BADGES */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          {[
            { id: "dashboard", label: "Analytics & Overview", icon: "📊" },
            { id: "profile", label: "Update Profile & CV", icon: "👤" },
            { id: "endorsements", label: "Endorse Peer Skills", icon: "⭐" },
            {
              id: "messages",
              label: "Direct Messages",
              icon: "✉️",
              badge: unreadMessagesCount,
            },
            { id: "opportunities", label: "Campus Jobs", icon: "💼" },
            { id: "applications", label: "My Applications", icon: "📑" },
            { id: "feed", label: "Campus Feed", icon: "💬" },
            { id: "catalog_skills", label: "Skills Catalog", icon: "⚡" },
            {
              id: "connections",
              label: "Connections",
              icon: "👥",
              badge: pendingConnectionsCount,
            },
            { id: "richie", label: "Richie AI Assistant", icon: "🤖" },
            { id: "events", label: "Institutional Events", icon: "📅" },
            {
              id: "announcements",
              label: "Announcements",
              icon: "📢",
              badge: unreadAnnouncementsCount,
            },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => {
                setActiveTab(nav.id as SectionTab);
                if (nav.id === "announcements") {
                  setAnnouncements(
                    announcements.map((a) => ({ ...a, isRead: true })),
                  );
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === nav.id
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <span className="text-base">{nav.icon}</span>
                <span className="truncate">{nav.label}</span>
              </div>
              {nav.badge !== undefined && nav.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500 text-black animate-pulse">
                  {nav.badge}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* MAIN CONTENT WORKSPACE */}
        <main className="flex-1 space-y-6 overflow-hidden">
          {/* --- SECTION 1: DASHBOARD ANALYTICS --- */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                {[
                  {
                    label: "Jobs Applied",
                    val: mockAnalytics.appliedJobsCount,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Bookmarked",
                    val: mockAnalytics.bookmarkedJobsCount,
                    color: "text-blue-400",
                  },
                  {
                    label: "Connections",
                    val: mockAnalytics.totalConnections,
                    color: "text-purple-400",
                  },
                  {
                    label: "Profile Views",
                    val: mockAnalytics.profileViewsCount,
                    color: "text-amber-400",
                  },
                ].map((st, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19] flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {st.label}
                    </span>
                    <span
                      className={`text-2xl font-black font-mono mt-2 ${st.color}`}
                    >
                      {st.val}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Profile Visibility Trend
                    </h3>
                    <p className="text-xs text-slate-400">
                      Monthly recruiter and peer views
                    </p>
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={profileViewsTrend}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="viewGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#10B981"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="95%"
                              stopColor="#10B981"
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                        <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                        <YAxis stroke="#6B7280" fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111827",
                            borderColor: "#374151",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="views"
                          stroke="#10B981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#viewGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Application Status Breakdown
                    </h3>
                    <p className="text-xs text-slate-400">
                      Distribution of current job submissions
                    </p>
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={applicationStatusData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                        <XAxis dataKey="name" stroke="#6B7280" fontSize={10} />
                        <YAxis stroke="#6B7280" fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111827",
                            borderColor: "#374151",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- SECTION 2: UPDATE PROFILE & CV WITH MANAGEABLE LISTS --- */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Details Payload Form */}
              <div className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-4">
                <h3 className="text-sm font-bold text-white">
                  Update Profile Details
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Profile details updated successfully!");
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">
                        Student Number
                      </label>
                      <input
                        type="text"
                        value={profileForm.studentNumber}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            studentNumber: e.target.value,
                          })
                        }
                        className="w-full h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">
                        Programme
                      </label>
                      <input
                        type="text"
                        value={profileForm.programme}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            programme: e.target.value,
                          })
                        }
                        className="w-full h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={profileForm.headline}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          headline: e.target.value,
                        })
                      }
                      className="w-full h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, bio: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400"
                  >
                    Save Profile Payload
                  </button>
                </form>
              </div>

              {/* PDF Document Upload Box with Separate Upload Action Button */}
              <div className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-3">
                <h3 className="text-sm font-bold text-white">
                  CV Document Upload
                </h3>
                <p className="text-xs text-slate-400">
                  Choose a PDF file and click upload to save changes.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="block text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200 cursor-pointer"
                  />

                  <button
                    onClick={handleExecuteCvUpload}
                    disabled={!selectedPdfFile}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      selectedPdfFile
                        ? "bg-emerald-500 text-black hover:bg-emerald-400"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Upload Chosen CV (PDF)
                  </button>
                </div>

                {pdfUploadError && (
                  <p className="text-xs text-red-400 font-bold">
                    {pdfUploadError}
                  </p>
                )}
                {uploadedCvName && (
                  <p className="text-xs text-emerald-400 font-mono">
                    Current CV on file: {uploadedCvName}
                  </p>
                )}
              </div>

              {/* In-Profile Lists: Experience, Certifications, Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Experiences List */}
                <div className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    Work Experience
                  </h3>

                  <div className="space-y-2">
                    {experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">
                            {exp.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {exp.company}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="text-xs text-red-400 font-bold hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleAddExperience}
                    className="space-y-2 pt-2 border-t border-slate-800"
                  >
                    <input
                      type="text"
                      placeholder="Title (e.g., Student Dev)"
                      value={newExpTitle}
                      onChange={(e) => setNewExpTitle(e.target.value)}
                      className="w-full h-8 rounded border border-slate-800 bg-slate-900 px-3 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={newExpCompany}
                      onChange={(e) => setNewExpCompany(e.target.value)}
                      className="w-full h-8 rounded border border-slate-800 bg-slate-900 px-3 text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 rounded bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700"
                    >
                      + Add Experience
                    </button>
                  </form>
                </div>

                {/* Certifications List */}
                <div className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    Certifications
                  </h3>

                  <div className="space-y-2">
                    {certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">
                            {cert.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {cert.issuingOrganization}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveCertification(cert.id)}
                          className="text-xs text-red-400 font-bold hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleAddCertification}
                    className="space-y-2 pt-2 border-t border-slate-800"
                  >
                    <input
                      type="text"
                      placeholder="Cert Name (e.g., AWS Cloud Practitioner)"
                      value={newCertName}
                      onChange={(e) => setNewCertName(e.target.value)}
                      className="w-full h-8 rounded border border-slate-800 bg-slate-900 px-3 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Issuing Org (e.g., AWS)"
                      value={newCertOrg}
                      onChange={(e) => setNewCertOrg(e.target.value)}
                      className="w-full h-8 rounded border border-slate-800 bg-slate-900 px-3 text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 rounded bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700"
                    >
                      + Add Certification
                    </button>
                  </form>
                </div>
              </div>

              {/* Profile Skills List */}
              <div className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-4">
                <h3 className="text-sm font-bold text-white">My Skills</h3>

                <div className="flex flex-wrap gap-2">
                  {skills.map((sk) => (
                    <span
                      key={sk.id}
                      className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold"
                    >
                      <span>{sk.name}</span>
                      <button
                        onClick={() => handleRemoveSkill(sk.id)}
                        className="text-red-400 hover:text-red-300 font-bold text-xs"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    placeholder="Add skill (e.g., Docker, Python)"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    className="flex-1 h-8 rounded border border-slate-800 bg-slate-900 px-3 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* --- SECTION 3: ENDORSE PEER SKILLS --- */}
          {activeTab === "endorsements" && (
            <div className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Endorse Peer Skills
                </h3>
                <p className="text-xs text-slate-400">
                  Recognize skills and competencies verified in fellow students.
                </p>
              </div>

              <div className="space-y-4">
                {peerStudents.map((peer) => (
                  <div
                    key={peer.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {peer.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {peer.programme}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {peer.skills.map((sk) => (
                        <button
                          key={sk.name}
                          onClick={() =>
                            handleToggleEndorsePeerSkill(peer.id, sk.name)
                          }
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            sk.isEndorsedByMe
                              ? "bg-emerald-500 text-black border border-emerald-400"
                              : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-emerald-500/50"
                          }`}
                        >
                          <span>
                            {sk.isEndorsedByMe ? "✓ Endorsed" : "+ Endorse"}{" "}
                            {sk.name}
                          </span>
                          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">
                            {sk.endorsementsCount}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SECTION 4: DIRECT MESSAGING --- */}
          {activeTab === "messages" && (
            <div className="rounded-xl border border-slate-800 bg-[#0B0F19] grid grid-cols-1 md:grid-cols-3 h-[540px] overflow-hidden">
              {/* Left Column: Direct Contact Chats */}
              <div className="border-r border-slate-800 flex flex-col">
                <div className="p-3 border-b border-slate-800 bg-slate-900/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Direct Chats
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                  {contacts.map((contact) => {
                    const unreadForContact = messages.filter(
                      (m) =>
                        m.senderId === contact.id &&
                        m.receiverId === "usr-001" &&
                        !m.isRead,
                    ).length;

                    const lastMsg = messages
                      .filter(
                        (m) =>
                          (m.senderId === "usr-001" &&
                            m.receiverId === contact.id) ||
                          (m.senderId === contact.id &&
                            m.receiverId === "usr-001"),
                      )
                      .slice(-1)[0];

                    return (
                      <div
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className={`p-3 cursor-pointer transition-all flex items-center justify-between ${
                          selectedContact?.id === contact.id
                            ? "bg-emerald-500/10 border-l-2 border-emerald-500"
                            : "hover:bg-slate-900/50"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <div className="relative shrink-0">
                            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                              {contact.name.charAt(0)}
                            </div>
                            {contact.online && (
                              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0B0F19]" />
                            )}
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-bold text-white truncate">
                              {contact.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate">
                              {lastMsg ? lastMsg.content : contact.role}
                            </p>
                          </div>
                        </div>

                        {unreadForContact > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-extrabold font-mono shrink-0">
                            {unreadForContact}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Individual Active Chat Room */}
              <div className="md:col-span-2 flex flex-col h-full bg-[#070C14]">
                {selectedContact ? (
                  <>
                    <div className="p-3 border-b border-slate-800 bg-[#0B0F19] flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                          {selectedContact.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white leading-none">
                            {selectedContact.name}
                          </h4>
                          <span className="text-[9px] text-slate-400 font-medium">
                            {selectedContact.role}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${selectedContact.online ? "text-emerald-400 bg-emerald-500/10" : "text-slate-500"}`}
                      >
                        {selectedContact.online ? "Online" : "Offline"}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {activeConversationMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-slate-500">
                          No prior conversation. Send a message to start
                          chatting!
                        </div>
                      ) : (
                        activeConversationMessages.map((m) => {
                          const isMe = m.senderId === "usr-001";
                          return (
                            <div
                              key={m.id}
                              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-xs p-3 rounded-xl text-xs ${
                                  isMe
                                    ? "bg-emerald-600 text-white rounded-br-none"
                                    : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                                }`}
                              >
                                <p className="leading-relaxed">{m.content}</p>
                                <span className="text-[9px] font-mono opacity-70 block text-right mt-1">
                                  {new Date(m.sentAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <form
                      onSubmit={handleSendDirectMessage}
                      className="p-3 border-t border-slate-800 bg-[#0B0F19] flex gap-2"
                    >
                      <input
                        type="text"
                        placeholder={`Message ${selectedContact.name}...`}
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        className="flex-1 h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="h-9 px-4 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400"
                      >
                        Send
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    Select a contact from the left panel to start messaging.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- SECTION 5: CAMPUS JOBS & OPPORTUNITIES --- */}
          {activeTab === "opportunities" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19]">
                <h3 className="text-sm font-bold text-white">
                  Verified Business Opportunities
                </h3>
                <p className="text-xs text-slate-400">
                  Submit your uploaded PDF CV directly to employers.
                </p>
              </div>

              {mockOpportunities.map((op) => (
                <div
                  key={op.id}
                  className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {op.title}
                      </h4>
                      <p className="text-xs text-emerald-400 font-medium">
                        {op.companyName}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(op.createdAtUtc).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {op.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400">
                      Target: {op.targetProgramme}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOpportunity(op)}
                        className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-200 font-bold"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleApplyJob(op.id)}
                        disabled={appliedJobIds.includes(op.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                          appliedJobIds.includes(op.id)
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "bg-emerald-500 text-black hover:bg-emerald-400"
                        }`}
                      >
                        {appliedJobIds.includes(op.id)
                          ? "Applied"
                          : "Apply with PDF CV"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- SECTION 6: MY APPLICATIONS --- */}
          {activeTab === "applications" && (
            <div className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-4">
              <h3 className="text-sm font-bold text-white">
                Submitted Job Applications
              </h3>
              <div className="space-y-2">
                {mockAnalytics.recentApplications.map((app) => (
                  <div
                    key={app.applicationId}
                    className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {app.jobTitle}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {app.companyName}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded font-mono text-xs font-bold bg-slate-800 text-emerald-400">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SECTION 7: CAMPUS FEED (NO REPOST/SHARE BUTTONS) --- */}
          {activeTab === "feed" && (
            <div className="max-w-xl mx-auto space-y-4">
              {/* Post Composer Box */}
              <div className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-3">
                <div className="flex space-x-3">
                  <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black text-xs shrink-0">
                    {profileForm.firstName.charAt(0)}
                  </div>
                  <textarea
                    rows={3}
                    placeholder="What's happening on campus?"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none resize-none pt-1"
                  />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                  <div className="flex space-x-3 text-emerald-400 text-sm">
                    <span
                      className="cursor-pointer hover:opacity-80"
                      title="Attach Image"
                    >
                      🖼️
                    </span>
                    <span
                      className="cursor-pointer hover:opacity-80"
                      title="Add Poll"
                    >
                      📊
                    </span>
                    <span
                      className="cursor-pointer hover:opacity-80"
                      title="Add Code Snippet"
                    >
                      💻
                    </span>
                  </div>
                  <button
                    onClick={handleCreateCampusPost}
                    disabled={!newPostContent.trim()}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      newPostContent.trim()
                        ? "bg-emerald-500 text-black hover:bg-emerald-400"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Feed Post List */}
              <div className="space-y-3">
                {campusPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19] hover:border-slate-700/80 transition-all space-y-3"
                  >
                    {/* Post Author Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-3">
                        <div
                          className={`h-9 w-9 rounded-full ${post.authorAvatarBg} flex items-center justify-center font-bold text-white text-xs shrink-0`}
                        >
                          {post.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-white">
                              {post.authorName}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {post.authorHandle}
                            </span>
                            <span className="text-[10px] text-slate-600">
                              •
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {post.createdAt}
                            </span>
                          </div>
                          <span
                            className={`inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded mt-0.5 ${
                              post.authorRole === "Alumni"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {post.authorRole}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleBookmarkPost(post.id)}
                        className={`text-xs ${post.isBookmarked ? "text-amber-400" : "text-slate-600 hover:text-slate-400"}`}
                        title="Bookmark"
                      >
                        🔖
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="text-xs text-slate-200 leading-relaxed pl-12">
                      {post.content}
                    </p>

                    {/* Action Controls Bar (Comments & Like Only) */}
                    <div className="flex items-center justify-start space-x-8 text-xs text-slate-500 pt-2 border-t border-slate-800/60 pl-12">
                      {/* Comment Toggle */}
                      <button
                        onClick={() =>
                          setActiveCommentPostId(
                            activeCommentPostId === post.id ? null : post.id,
                          )
                        }
                        className="flex items-center space-x-1.5 hover:text-blue-400 transition-colors"
                      >
                        <span>💬</span>
                        <span className="text-[10px] font-mono">
                          {post.comments.length}
                        </span>
                      </button>

                      {/* Like */}
                      <button
                        onClick={() => handleToggleLikePost(post.id)}
                        className={`flex items-center space-x-1.5 hover:text-pink-500 transition-colors ${
                          post.isLiked ? "text-pink-500 font-bold" : ""
                        }`}
                      >
                        <span>{post.isLiked ? "❤️" : "🤍"}</span>
                        <span className="text-[10px] font-mono">
                          {post.likesCount}
                        </span>
                      </button>
                    </div>

                    {/* Collapsible Comment Thread Section */}
                    {activeCommentPostId === post.id && (
                      <div className="pl-12 pt-3 space-y-3 border-t border-slate-800/80">
                        {post.comments.length > 0 && (
                          <div className="space-y-2">
                            {post.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="p-2.5 rounded-lg bg-slate-900/60 text-xs space-y-1"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-white text-[11px]">
                                    {comment.authorName}{" "}
                                    <span className="text-slate-500 text-[9px] font-normal">
                                      ({comment.authorRole})
                                    </span>
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-500">
                                    {comment.createdAt}
                                  </span>
                                </div>
                                <p className="text-slate-300 text-[11px]">
                                  {comment.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        <form
                          onSubmit={(e) => handleAddFeedComment(post.id, e)}
                          className="flex gap-2"
                        >
                          <input
                            type="text"
                            placeholder="Post your reply..."
                            value={feedCommentInputs[post.id] || ""}
                            onChange={(e) =>
                              setFeedCommentInputs({
                                ...feedCommentInputs,
                                [post.id]: e.target.value,
                              })
                            }
                            className="flex-1 h-8 rounded-full border border-slate-800 bg-slate-900 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="submit"
                            className="h-8 px-3 rounded-full bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400"
                          >
                            Reply
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SECTION 8: CATALOG SKILLS --- */}
          {activeTab === "catalog_skills" && (
            <div className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Admin-Validated Skills Catalog
                </h3>
                <p className="text-xs text-slate-400">
                  Select skills from the institutional catalog to attach to your
                  profile.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {mockAvailableCatalogSkills.map((sk) => {
                  const isSelected = skills.some((s) => s.id === sk.id);
                  return (
                    <button
                      key={sk.id}
                      onClick={() => {
                        if (isSelected)
                          setSkills(skills.filter((s) => s.id !== sk.id));
                        else setSkills([...skills, sk]);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-emerald-500 text-black border border-emerald-400"
                          : "bg-slate-900 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {isSelected ? `✓ ${sk.name}` : `+ ${sk.name}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- SECTION 9: CONNECTIONS --- */}
          {activeTab === "connections" && (
            <div className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-3">
              <h3 className="text-sm font-bold text-white">Connections</h3>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 flex justify-between items-center text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{contact.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {contact.role}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedContact(contact);
                        setActiveTab("messages");
                      }}
                      className="px-3 py-1 rounded bg-emerald-500 text-black font-bold text-[11px]"
                    >
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SECTION 10: RICHIE AI ASSISTANT --- */}
          {activeTab === "richie" && (
            <div className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] flex flex-col h-[520px]">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  🤖
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Richie Campus AI
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Ask about tech careers, resume optimization, or module
                    advice.
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {chatLog.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-xl text-xs ${
                        m.sender === "user"
                          ? "bg-emerald-600 text-white rounded-br-none"
                          : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSendRichieMessage}
                className="flex gap-2 pt-2 border-t border-slate-800"
              >
                <input
                  type="text"
                  placeholder="Ask Richie anything about your career path..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="flex-1 h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400"
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {/* --- SECTION 11: EVENTS --- */}
          {activeTab === "events" && (
            <div className="space-y-3">
              {mockEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19]"
                >
                  <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {ev.description}
                  </p>
                  <p className="text-[10px] font-mono text-emerald-400 mt-2">
                    Date: {new Date(ev.eventDate).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* --- SECTION 12: ANNOUNCEMENTS --- */}
          {activeTab === "announcements" && (
            <div className="space-y-3">
              {announcements.map((an) => (
                <div
                  key={an.id}
                  className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19]"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">{an.title}</h4>
                    {an.isImportant && (
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">
                        Important
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{an.content}</p>
                  <span className="text-[10px] font-mono text-slate-500 mt-2 block">
                    {new Date(an.postedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* SINGLE OPPORTUNITY MODAL */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-xl border border-slate-800 bg-[#0B0F19] space-y-4">
            <h3 className="text-base font-bold text-white">
              {selectedOpportunity.title}
            </h3>
            <p className="text-xs text-emerald-400 font-bold">
              {selectedOpportunity.companyName}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedOpportunity.description}
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApplyJob(selectedOpportunity.id);
                  setSelectedOpportunity(null);
                }}
                className="px-3 py-1.5 rounded bg-emerald-500 text-black text-xs font-bold"
              >
                Apply with PDF CV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

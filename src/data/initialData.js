export const initialProjects = [
  {
    id: "proj-1",
    name: "Launch Notion Template (CreatorOS)",
    description: "Build and distribute high-converting productivity OS template on Gumroad.",
    color: "#F59E0B", // amber
    icon: "Rocket",
    status: "active",
    createdAt: "2026-09-15"
  },
  {
    id: "proj-2",
    name: "Fitness & Wellness Routine",
    description: "Rebuild stamina, strength training, and healthy dietary habits.",
    color: "#10B981", // emerald
    icon: "Activity",
    status: "active",
    createdAt: "2026-09-20"
  },
  {
    id: "proj-3",
    name: "Content Engine 2026",
    description: "Consistent video content workflow for TikTok, Reels, and YouTube Shorts.",
    color: "#EC4899", // pink
    icon: "Video",
    status: "active",
    createdAt: "2026-09-25"
  }
];

export const initialTasks = [
  {
    id: "task-1",
    title: "Upload video ke TikTok",
    projectId: "proj-3",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-10-04",
    tags: ["Content", "TikTok"],
    notes: "Review hook di 3 detik pertama dan sertakan link bio.",
    sourceLabel: "Upcoming task",
    completedAt: null,
    createdAt: "2026-10-01"
  },
  {
    id: "task-2",
    title: "Kirim email newsletter mingguan",
    projectId: "proj-1",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-10-04",
    tags: ["Email", "CreatorOS"],
    notes: "Topik: 5 framework time blocking untuk solopreneur.",
    sourceLabel: "Upcoming task",
    completedAt: null,
    createdAt: "2026-10-02"
  },
  {
    id: "task-3",
    title: "Setup automasi email onboarding Gumroad",
    projectId: "proj-1",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-10-05",
    tags: ["Tech", "Launch"],
    notes: "Koneksikan Zapier ke ConvertKit dan bagikan template link.",
    sourceLabel: "Upcoming task",
    completedAt: null,
    createdAt: "2026-10-02"
  },
  {
    id: "task-4",
    title: "Final review mockup banner Gumroad",
    projectId: "proj-1",
    status: "review",
    priority: "high",
    dueDate: "2026-10-03",
    tags: ["Design"],
    notes: "Cek resolusi 1280x720 dan contrast text.",
    sourceLabel: "Review required",
    completedAt: null,
    createdAt: "2026-09-28"
  },
  {
    id: "task-5",
    title: "Audit tagihan langganan SaaS bulanan",
    projectId: null, // Unrelated task
    status: "review",
    priority: "low",
    dueDate: "2026-10-06",
    tags: ["Finance"],
    notes: "Batalkan tool yang tidak terpakai lebih dari 30 hari.",
    sourceLabel: "Unrelated task",
    completedAt: null,
    createdAt: "2026-10-01"
  },
  {
    id: "task-6",
    title: "Ide draft outline e-book produktivitas",
    projectId: null,
    status: "todo",
    priority: "low",
    dueDate: null, // inbox task with no due date
    tags: ["Brainstorm"],
    notes: "Kumpulkan 10 prinsip manajemen energi.",
    sourceLabel: "Inbox",
    completedAt: null,
    createdAt: "2026-10-04"
  },
  // Completed demo tasks
  {
    id: "task-7",
    title: "Beli perlengkapan studio & softbox lighting",
    projectId: "proj-3",
    status: "done",
    priority: "medium",
    dueDate: "2026-10-02",
    tags: ["Gear"],
    notes: "Sudah sampai dan dirakit.",
    sourceLabel: "Completed",
    completedAt: "2026-10-02",
    createdAt: "2026-09-24"
  },
  {
    id: "task-8",
    title: "Draft copy deskripsi Notion Template",
    projectId: "proj-1",
    status: "done",
    priority: "high",
    dueDate: "2026-10-01",
    tags: ["Copywriting"],
    notes: "Selesai di proofread.",
    sourceLabel: "Completed",
    completedAt: "2026-10-01",
    createdAt: "2026-09-22"
  },
  {
    id: "task-9",
    title: "Riset 20 keyword trending video TikTok",
    projectId: "proj-3",
    status: "done",
    priority: "medium",
    dueDate: "2026-09-30",
    tags: ["SEO", "Research"],
    notes: "List spreadsheet siap digunakan.",
    sourceLabel: "Completed",
    completedAt: "2026-09-30",
    createdAt: "2026-09-20"
  }
];

// Generate extra completed dummy items to reflect brief's realistic ~50 total / ~46 completed metrics if desired,
// or provide responsive dynamic calculation
for (let i = 10; i <= 50; i++) {
  initialTasks.push({
    id: `task-${i}`,
    title: `Arsip Task Selesai #${i - 9}`,
    projectId: i % 2 === 0 ? "proj-1" : (i % 3 === 0 ? "proj-2" : "proj-3"),
    status: "done",
    priority: i % 4 === 0 ? "high" : "medium",
    dueDate: `2026-09-${(i % 25 + 1).toString().padStart(2, "0")}`,
    tags: ["Archived"],
    notes: "Terselesaikan dalam siklus sprint sebelumnya.",
    sourceLabel: "Completed",
    completedAt: "2026-09-28",
    createdAt: "2026-09-01"
  });
}

export const initialEvents = [
  {
    id: "evt-1",
    title: "Sync Call bersama Komunitas Creator",
    date: "2026-10-04",
    startTime: "19:30",
    endTime: "21:00",
    projectId: "proj-3",
    location: "Google Meet",
    type: "event",
    category: "Community"
  },
  {
    id: "evt-2",
    title: "Badminton Night Sparring",
    date: "2026-10-05",
    startTime: "20:00",
    endTime: "22:00",
    projectId: "proj-2",
    location: "Gor Gelora Remaja",
    type: "event",
    category: "Sports"
  },
  {
    id: "evt-3",
    title: "Live Q&A Notion Workspace Setup",
    date: "2026-10-07",
    startTime: "15:00",
    endTime: "16:30",
    projectId: "proj-1",
    location: "YouTube Live",
    type: "event",
    category: "Launch"
  }
];

export const initialHabits = [
  {
    id: "habit-1",
    name: "Gym / Workout 45m",
    emoji: "💪",
    color: "#3B82F6", // Blue
    targetFrequency: "daily",
    type: "single",
    streak: 4,
    maxStreak: 12,
    archived: false,
    createdAt: "2026-09-01",
    // Logs for October 2026 (day numbers 1..31)
    logs: [1, 2, 3, 4] // completed on Oct 1, 2, 3, 4
  },
  {
    id: "habit-2",
    name: "Read 10 Pages",
    emoji: "📖",
    color: "#F59E0B", // Amber
    targetFrequency: "daily",
    type: "single",
    streak: 8,
    maxStreak: 21,
    archived: false,
    createdAt: "2026-09-01",
    logs: [1, 2, 3, 4]
  },
  {
    id: "habit-3",
    name: "No Screen Time before Bed",
    emoji: "📵",
    color: "#8B5CF6", // Purple
    targetFrequency: "daily",
    type: "single",
    streak: 1,
    maxStreak: 9,
    archived: false,
    createdAt: "2026-09-01",
    logs: [1, 2, 3]
  },
  {
    id: "habit-4",
    name: "Badminton",
    emoji: "🏸",
    color: "#EC4899", // Pink
    targetFrequency: "daily",
    type: "single",
    streak: 2,
    maxStreak: 5,
    archived: false,
    createdAt: "2026-09-01",
    logs: [2, 4]
  },
  {
    id: "habit-5",
    name: "Morning Skincare",
    emoji: "✨",
    color: "#10B981", // Emerald
    targetFrequency: "daily",
    type: "single",
    streak: 14,
    maxStreak: 28,
    archived: false,
    createdAt: "2026-09-01",
    logs: [1, 2, 3, 4]
  },
  {
    id: "habit-6",
    name: "Ibadah tepat waktu",
    emoji: "🕌",
    color: "#06B6D4", // Cyan
    targetFrequency: "daily",
    type: "checklist",
    subItems: ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"],
    archived: false,
    createdAt: "2026-09-01",
    // Daily subItem logs: { "2026-10-04": ["Subuh", "Dzuhur", "Ashar"], "2026-10-03": ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"] }
    checklistLogs: {
      "2026-10-01": ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"],
      "2026-10-02": ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"],
      "2026-10-03": ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"],
      "2026-10-04": ["Subuh", "Dzuhur", "Ashar"] // today in progress
    }
  }
];

export const initialGoals = [
  {
    id: "goal-1",
    title: "1,000 Template Gumroad Sales",
    targetDate: "2026-12-31",
    progress: 42,
    linkedProjectIds: ["proj-1"],
    linkedHabitIds: ["habit-2"]
  },
  {
    id: "goal-2",
    title: "Body Fat 15% & Bench Press 80kg",
    targetDate: "2026-11-30",
    progress: 68,
    linkedProjectIds: ["proj-2"],
    linkedHabitIds: ["habit-1", "habit-4"]
  },
  {
    id: "goal-3",
    title: "Capai 50K Followers di TikTok",
    targetDate: "2026-12-15",
    progress: 55,
    linkedProjectIds: ["proj-3"],
    linkedHabitIds: []
  }
];

export const initialNotes = [
  {
    id: "note-1",
    title: "Framework Hook TikTok Viral (Format 3 Detik)",
    content: "1. Visual pattern interruption\n2. Pertanyaan paradoksikal ('Kenapa kebanyakan to-do list malah bikin burnout?')\n3. Proof of result ('Ini cara saya beresin 8 project tanpa lembur').",
    projectId: "proj-3",
    updatedAt: "2026-10-03"
  },
  {
    id: "note-2",
    title: "Struktur Pricing CreatorOS Notion Template",
    content: "- Personal Tier: $29 (Core workspace)\n- Freelancer Tier: $49 (Bonus CRM & Invoice system)\n- Agency Tier: $99 (Team sync + video tutorial).",
    projectId: "proj-1",
    updatedAt: "2026-10-02"
  }
];

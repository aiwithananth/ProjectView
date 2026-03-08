# 🎨 Visual Guide

## Application Screenshots (Conceptual)

### Main Projects View
```
┌─────────────────────────────────────────────────────────────────┐
│  TaskTracker                                    🔔  ⚙️  👤 User │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📁 Projects                                    [+ New Project]  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🔵 Website Redesign                              ⋮        │  │
│  │ Complete overhaul of company website                     │  │
│  │ 15 tasks • 1 checklist                                   │  │
│  │                                                           │  │
│  │ ┌─────────────────────────────────────────────────────┐ │  │
│  │ │ TASKS                    [Expand All] [+ Add Task]  │ │  │
│  │ ├─────────────────────────────────────────────────────┤ │  │
│  │ │ ▾ Frontend Development    👤 Alice  ████░ 45%       │ │  │
│  │ │   ├─ ✓ Design System      👤 Alice  █████ 100%      │ │  │
│  │ │   │   └─ ✓ Color Palette  👤 Alice  █████ 100%      │ │  │
│  │ │   └─ ⚡ Component Library  👤 Bob    ████░ 60%       │ │  │
│  │ │       ├─ ✓ Button         👤 Bob    █████ 100%      │ │  │
│  │ │       └─ ⏳ Form Fields    👤 Bob    ███░░ 70%       │ │  │
│  │ │                                                       │ │  │
│  │ │ ▸ Backend API Development 👤 Bob    ██░░░ 35%       │ │  │
│  │ └─────────────────────────────────────────────────────┘ │  │
│  │                                                           │  │
│  │ ┌─────────────────────────────────────────────────────┐ │  │
│  │ │ CHECKLISTS                                          │ │  │
│  │ │ ▾ Pre-launch Checklist               ████░ 40%     │ │  │
│  │ │   ☑ Complete all unit tests                        │ │  │
│  │ │   ☑ Performance optimization                       │ │  │
│  │ │   ☐ Security audit                                 │ │  │
│  │ │   ☐ Documentation update                           │ │  │
│  │ └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🔴 Mobile App                                    ⋮        │  │
│  │ New mobile application for iOS and Android               │  │
│  │ 8 tasks • 1 checklist                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard View
```
┌─────────────────────────────────────────────────────────────────┐
│  TaskTracker                                    🔔  ⚙️  👤 User │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📊 Dashboard                                                    │
│  Overview of all projects and tasks                             │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 📁 Total │  │ ✅ Done  │  │ 🚫 Block │  │ ⏰ Over  │       │
│  │ Projects │  │  Tasks   │  │   Tasks  │  │   due    │       │
│  │    3     │  │  15/42   │  │    2     │  │    3     │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌────────────────────────┐  ┌────────────────────────┐        │
│  │ Project Summary        │  │ 30-Day Progress        │        │
│  │                        │  │                        │        │
│  │   Website Redesign     │  │    100% ┐              │        │
│  │        ╱───╲           │  │         │   ╱──╲       │        │
│  │       │ 45% │           │  │     50% ├──╱    ╲──   │        │
│  │        ╲───╱           │  │         │            ╲ │        │
│  │   🟢 Done    45%       │  │      0% └────────────┘ │        │
│  │   🔵 Progress 30%      │  │         Jan    Feb     │        │
│  │   🔴 Blocked   5%      │  │                        │        │
│  └────────────────────────┘  └────────────────────────┘        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🚫 Blocked Tasks (2)                                     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Authentication System  │ Website   │ 👤 Carol │ Mar 5   │  │
│  │ API Integration        │ Mobile    │ 👤 Bob   │ Mar 3   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Calendar View
```
┌─────────────────────────────────────────────────────────────────┐
│  TaskTracker                                    🔔  ⚙️  👤 User │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📅 Calendar                                                     │
│  View tasks by due date                                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         March 2026                     [◀] [▶]           │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Sun   Mon   Tue   Wed   Thu   Fri   Sat                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  1     2     3     4     5     6     7                   │  │
│  │       🔴🟢         🔵🟡                                   │  │
│  │                                                           │  │
│  │  8     9    10    11    12    13    14                   │  │
│  │ 🔴    🟢🔵  🟡    🔵          🔴🟢                       │  │
│  │                                                           │  │
│  │ 15    16    17    18    19    20    21                   │  │
│  │ 🟢    🔵         🟡🔴                                     │  │
│  │                                                           │  │
│  │ 22    23    24    25    26    27    28                   │  │
│  │      🔴🟢         🔵                                      │  │
│  │                                                           │  │
│  │ 29    30    31                                           │  │
│  │ 🟡    🔵    🔴                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Tasks for March 8, 2026                                  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ 🔴 Complete API Documentation    │ Website Redesign     │  │
│  │ 🟢 Deploy to staging             │ Infrastructure       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Tree

```
App
├── Sidebar
│   ├── Logo
│   ├── Navigation
│   │   ├── Projects Link
│   │   ├── Dashboard Link
│   │   ├── Calendar Link
│   │   ├── Users Link
│   │   └── Tags Link
│   └── Footer
│
├── TopBar
│   ├── Search (placeholder)
│   ├── Notifications
│   ├── Settings
│   └── User Profile
│
└── Routes
    ├── ProjectsPage
    │   └── ProjectList
    │       ├── ProjectCard
    │       │   ├── Header (collapsible)
    │       │   ├── TaskGroup
    │       │   │   ├── TaskRow (recursive)
    │       │   │   │   ├── ExpandButton
    │       │   │   │   ├── Title
    │       │   │   │   ├── OwnerAvatar
    │       │   │   │   ├── ProgressBar
    │       │   │   │   ├── StatusBadge
    │       │   │   │   ├── PhaseBadge
    │       │   │   │   ├── TagPills
    │       │   │   │   └── Actions
    │       │   │   └── TaskRow (children)
    │       │   └── ChecklistPanel
    │       │       └── ChecklistItem
    │       └── AddProjectModal
    │
    ├── DashboardPage
    │   ├── StatsCards
    │   │   ├── TotalProjects
    │   │   ├── CompletedTasks
    │   │   ├── BlockedTasks
    │   │   └── OverdueTasks
    │   ├── DonutChart
    │   ├── DayProgressChart
    │   ├── BlockersTable
    │   └── PendingTable
    │
    ├── CalendarPage
    │   └── CalendarView
    │       ├── BigCalendar
    │       └── TaskDot
    │
    ├── UsersPage
    │   ├── UserGrid
    │   └── AddUserModal
    │
    └── TagsPage
        ├── TagTable
        └── AddTagModal
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER ACTION                          │
│                  (Click, Type, Submit)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   REACT COMPONENT                           │
│              (Event Handler Triggered)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 REACT QUERY MUTATION                        │
│            (useMutation hook called)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    API CLIENT (Axios)                       │
│           POST /api/tasks { title, ... }                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXPRESS ROUTE                             │
│              router.post('/tasks', ...)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  ZOD VALIDATION                             │
│          createTaskSchema.parse(req.body)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  PRISMA CLIENT                              │
│           await db.task.create({ data })                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE                                │
│              INSERT INTO task ...                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  RESPONSE (JSON)                            │
│            { id, title, status, ... }                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              REACT QUERY CACHE UPDATE                       │
│         queryClient.invalidateQueries()                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 COMPONENT RE-RENDER                         │
│              (New data displayed)                           │
└─────────────────────────────────────────────────────────────┘
```

## Task Nesting Visualization

```
Project: Website Redesign
│
├─ 📋 Frontend Development (depth: 0)
│  ├─ ✅ Design System Setup (depth: 1)
│  │  ├─ ✅ Color Palette Definition (depth: 2)
│  │  │  ├─ ✅ Primary Colors (depth: 3)
│  │  │  └─ ✅ Semantic Colors (depth: 3)
│  │  └─ ✅ Typography System (depth: 2)
│  │
│  └─ ⚡ Component Library (depth: 1)
│     ├─ ✅ Button Component (depth: 2)
│     ├─ ⚡ Form Components (depth: 2)
│     └─ ⏳ Modal Component (depth: 2)
│
├─ 📋 Backend API Development (depth: 0)
│  ├─ ✅ Database Schema (depth: 1)
│  ├─ ⚡ REST API Endpoints (depth: 1)
│  └─ 🚫 Authentication System (depth: 1)
│
└─ 📋 Testing & QA (depth: 0)
   ├─ ⏳ Unit Tests (depth: 1)
   └─ ⏳ Integration Tests (depth: 1)

Legend:
✅ Done
⚡ In Progress
⏳ Pending
🚫 Blocked
```

## Database Schema Visualization

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │◄────────┐
│ name        │         │
│ email       │         │
│ avatar      │         │
└─────────────┘         │
       ▲                │
       │                │
       │                │
┌──────┴──────┐  ┌──────┴──────┐
│ProjectMember│  │    Task     │
├─────────────┤  ├─────────────┤
│ id          │  │ id          │
│ projectId   │──│ projectId   │
│ userId      │  │ parentId    │◄─┐
│ role        │  │ ownerId     │  │
└─────────────┘  │ title       │  │
       │         │ status      │  │
       │         │ phase       │  │
       │         │ progress    │  │
       │         │ dueDate     │  │
       │         └─────────────┘  │
       │                ▲         │
       │                │         │
       │                └─────────┘ (self-reference)
       │                │
       │                │
       │         ┌──────┴──────┐
       │         │  TaskTags   │
       │         │  (join)     │
       │         └──────┬──────┘
       │                │
       │         ┌──────▼──────┐
       │         │    Tag      │
       │         ├─────────────┤
       │         │ id          │
       │         │ name        │
       │         │ color       │
       │         └─────────────┘
       │
┌──────▼──────┐
│   Project   │
├─────────────┤
│ id          │
│ name        │
│ description │
│ color       │
│ collapsed   │
└─────────────┘
       │
       │
┌──────▼──────┐
│  Checklist  │
├─────────────┤
│ id          │
│ title       │
│ projectId   │
└─────────────┘
       │
       │
┌──────▼──────┐
│ChecklistItem│
├─────────────┤
│ id          │
│ label       │
│ done        │
│ checklistId │
│ order       │
└─────────────┘
```

## Status & Phase Color Coding

### Status Colors
```
🔴 OVERDUE     - Red      - Urgent attention needed
🟢 ON_TRACK    - Green    - Going well
🔵 IN_PROGRESS - Blue     - Currently working
🟠 BLOCKED     - Orange   - Impediment exists
⚪ PENDING     - Gray     - Not started
✅ DONE        - Emerald  - Completed
```

### Phase Colors
```
🟣 DEV         - Violet   - Development phase
🟡 TEST        - Yellow   - Testing phase
🌸 REVIEW      - Pink     - Review phase
```

## File Structure Tree

```
projectview/
│
├── client/                          # Frontend application
│   ├── src/
│   │   ├── api/                    # API client functions
│   │   │   ├── client.js           # Axios instance
│   │   │   ├── projects.js         # Project endpoints
│   │   │   ├── tasks.js            # Task endpoints
│   │   │   ├── users.js            # User endpoints
│   │   │   ├── tags.js             # Tag endpoints
│   │   │   ├── checklists.js       # Checklist endpoints
│   │   │   └── dashboard.js        # Dashboard endpoints
│   │   │
│   │   ├── components/
│   │   │   ├── calendar/           # Calendar components
│   │   │   ├── checklist/          # Checklist components
│   │   │   ├── common/             # Reusable UI components
│   │   │   ├── dashboard/          # Dashboard widgets
│   │   │   ├── layout/             # Layout components
│   │   │   ├── projects/           # Project components
│   │   │   └── tasks/              # Task components
│   │   │
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Utilities
│   │   ├── pages/                  # Page components
│   │   ├── store/                  # Zustand stores
│   │   ├── App.jsx                 # Main app
│   │   └── main.jsx                # Entry point
│   │
│   ├── index.html                  # HTML template
│   ├── package.json                # Frontend dependencies
│   └── vite.config.js              # Vite configuration
│
├── server/                          # Backend application
│   ├── config/
│   │   └── db.js                   # Database provider switch
│   │
│   ├── lib/
│   │   ├── prisma.js               # Prisma client
│   │   ├── dynamoAdapter.js        # DynamoDB adapter
│   │   └── taskTree.js             # Tree utilities
│   │
│   ├── middleware/
│   │   └── errorHandler.js         # Error handling
│   │
│   ├── routes/                     # API routes
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── users.js
│   │   ├── tags.js
│   │   ├── checklists.js
│   │   └── dashboard.js
│   │
│   └── index.js                    # Server entry point
│
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.js                     # Seed data
│
├── .env                            # Environment variables
├── package.json                    # Root dependencies
├── README.md                       # Main documentation
├── QUICKSTART.md                   # Quick start guide
├── ARCHITECTURE.md                 # Architecture docs
├── FEATURES.md                     # Feature checklist
├── PROJECT_SUMMARY.md              # Project summary
└── VISUAL_GUIDE.md                 # This file
```

---

This visual guide helps understand the structure and flow of the application at a glance.


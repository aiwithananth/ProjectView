# 🗂️ Task Tracker - Hierarchical Project Management

A full-stack task tracking application with unlimited subtask nesting, multi-project support, dashboards, calendar views, and configurable database backend.

![Tech Stack](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)

## ✨ Features

### Core Functionality
- **Hierarchical Task Management**: Unlimited nesting levels with visual tree structure
- **Multi-Project Support**: Organize tasks across multiple projects
- **Collapsible Projects**: Expand/collapse project views
- **Drag & Drop**: Reorder tasks and change hierarchy (planned)
- **Rich Task Properties**:
  - Status: Pending, In Progress, On Track, Blocked, Overdue, Done
  - Phase: Dev, Test, Review
  - Progress tracking (0-100%)
  - Due dates
  - Owner assignment
  - Tags with custom colors

### Dashboard & Analytics
- **Project Summary**: Donut charts showing task distribution per project
- **30-Day Progress**: Area chart tracking completion rates over time
- **Blockers Table**: Quick view of all blocked tasks
- **Pending Tasks**: Overview of pending and overdue items
- **Statistics Cards**: Total projects, tasks, completion rates

### Calendar View
- **Monthly/Weekly/Daily Views**: Visualize tasks by due date
- **Color-Coded Tasks**: Status-based color indicators
- **Day Selection**: Click any day to see tasks scheduled

### Checklist Module
- **Per-Project Checklists**: Separate from tasks
- **Progress Tracking**: Visual progress bars
- **Quick Toggle**: Mark items complete/incomplete inline

### User & Tag Management
- **User Profiles**: Avatar, email, task count
- **Custom Tags**: Color-coded labels for organization
- **Task Assignment**: Assign tasks to team members

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **shadcn/ui** components
- **React Query** for data fetching
- **Zustand** for state management
- **React Router** for navigation
- **Recharts** for data visualization
- **React Big Calendar** for calendar views
- **dnd-kit** for drag & drop (ready to implement)

### Backend
- **Node.js** with Express
- **Prisma ORM** with SQLite (dev)
- **Zod** for validation
- **CORS** enabled

### Database
- **SQLite** (development)
- **DynamoDB** adapter ready (Phase 6)
- Switchable via `DB_PROVIDER` environment variable

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd projectview
```

2. **Install dependencies and setup**
```bash
npm run setup
```

This command will:
- Install root dependencies
- Install client dependencies
- Generate Prisma client
- Push database schema
- Seed the database with sample data

### Manual Setup (Alternative)

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Setup Prisma
npx prisma generate
npx prisma db push

# Seed database
node prisma/seed.js
```

## 🚀 Running the Application

### Development Mode

Start both backend and frontend concurrently:

```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000

### Run Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## 📁 Project Structure

```
projectview/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # React components
│   │   │   ├── calendar/  # Calendar view
│   │   │   ├── checklist/ # Checklist components
│   │   │   ├── common/    # Reusable UI components
│   │   │   ├── dashboard/ # Dashboard widgets
│   │   │   ├── layout/    # Layout components
│   │   │   ├── projects/  # Project components
│   │   │   └── tasks/     # Task components
│   │   ├── hooks/         # React Query hooks
│   │   ├── lib/           # Utilities
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── config/           # Configuration
│   │   └── db.js         # Database provider switch
│   ├── lib/              # Libraries
│   │   ├── prisma.js     # Prisma client
│   │   ├── dynamoAdapter.js  # DynamoDB adapter
│   │   └── taskTree.js   # Tree building utilities
│   ├── middleware/       # Express middleware
│   │   └── errorHandler.js
│   ├── routes/           # API routes
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── users.js
│   │   ├── tags.js
│   │   ├── checklists.js
│   │   └── dashboard.js
│   └── index.js          # Server entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.js           # Seed data
├── .env                  # Environment variables
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Provider (sqlite | dynamodb)
DB_PROVIDER=sqlite

# SQLite Database URL
DATABASE_URL="file:./dev.db"

# DynamoDB Configuration (when DB_PROVIDER=dynamodb)
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
# DYNAMO_TABLE_NAME=task-tracker

# Server Port
PORT=3001
```

### Switching to DynamoDB

1. Set `DB_PROVIDER=dynamodb` in `.env`
2. Configure AWS credentials
3. Implement DynamoDB adapter methods in `server/lib/dynamoAdapter.js`
4. The application will automatically use DynamoDB instead of SQLite

## 📊 Database Schema

### Models

- **User**: Team members with avatar and email
- **Project**: Top-level organization with color coding
- **ProjectMember**: Many-to-many relationship with roles
- **Task**: Hierarchical tasks with unlimited nesting
- **Tag**: Color-coded labels for tasks
- **Checklist**: Per-project checklists
- **ChecklistItem**: Individual checklist items

### Key Relationships

- Tasks can have parent tasks (self-referential)
- Tasks belong to projects
- Tasks can have multiple tags
- Projects have multiple members
- Checklists belong to projects

## 🎯 API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/tasks` - Get project tasks (nested tree)

### Tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/reorder` - Reorder task
- `DELETE /api/tasks/:id` - Delete task (cascades to children)

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Tags
- `GET /api/tags` - List all tags
- `POST /api/tags` - Create tag
- `PATCH /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

### Checklists
- `GET /api/checklists/project/:projectId` - Get project checklists
- `POST /api/checklists` - Create checklist
- `POST /api/checklists/:id/items` - Add item
- `PATCH /api/checklists/items/:itemId` - Update item
- `DELETE /api/checklists/:id` - Delete checklist

### Dashboard
- `GET /api/dashboard/project-summary` - Project statistics
- `GET /api/dashboard/day-progress` - 30-day completion rates
- `GET /api/dashboard/blockers` - All blocked tasks
- `GET /api/dashboard/pending` - Pending/overdue tasks
- `GET /api/dashboard/calendar` - Tasks by date range
- `GET /api/dashboard/stats` - Overall statistics

## 🎨 UI Features

### Task Row (Recursive Component)
- Infinite nesting with visual indentation
- Tree connector lines
- Expand/collapse children
- Inline editing (status, phase, progress)
- Hover actions (add subtask, delete)
- Drag handle for reordering

### Status & Phase Badges
- Click to cycle through options
- Color-coded for quick identification
- Consistent design system

### Progress Tracking
- Visual progress bars
- Inline number input
- Color changes based on completion

### Responsive Design
- Mobile-friendly layouts
- Collapsible sidebar
- Scrollable content areas

## 🔮 Future Enhancements

### Phase 2 - Authentication
- JWT-based auth
- User login/logout
- Role-based permissions

### Phase 3 - Real-time Updates
- WebSocket integration
- Live collaboration
- Presence indicators

### Phase 4 - Advanced Features
- Task dependencies
- Gantt chart view
- Time tracking
- File attachments
- Comments & mentions

### Phase 5 - Integrations
- Slack notifications
- Email reminders
- GitHub integration
- Export to PDF/Excel

### Phase 6 - DynamoDB
- Complete DynamoDB adapter
- Single-table design
- GSI optimization
- Migration scripts

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001 (backend)
npx kill-port 3001

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

### Database Issues
```bash
# Reset database
rm dev.db
npx prisma db push
node prisma/seed.js
```

### Prisma Client Not Generated
```bash
npx prisma generate
```

## 📝 Sample Data

The seed script creates:
- 3 users (Alice, Bob, Carol)
- 3 projects (Website Redesign, Mobile App, Infrastructure Upgrade)
- 30+ tasks with 4 levels of nesting
- 4 tags (frontend, backend, design, infra)
- 3 checklists with 5 items each

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- React and the React ecosystem
- Prisma for excellent ORM
- TailwindCSS for utility-first styling
- Recharts for beautiful charts
- React Big Calendar for calendar views

---

Built with ❤️ using React, Node.js, and Prisma


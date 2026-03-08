# 🚀 Quick Start Guide

Get up and running with Task Tracker in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A terminal/command prompt

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Client Dependencies

```bash
cd client
npm install
cd ..
```

### 3. Setup Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Sample Data

```bash
node prisma/seed.js
```

### 5. Start the Application

```bash
npm run dev
```

This will start:
- Backend API on http://localhost:3001
- Frontend app on http://localhost:3000

## What's Included in Sample Data?

### Users
- **Alice Johnson** (alice@example.com)
- **Bob Smith** (bob@example.com)
- **Carol Davis** (carol@example.com)

### Projects
1. **Website Redesign** - Frontend & Backend development
2. **Mobile App** - iOS and Android development
3. **Infrastructure Upgrade** - Cloud migration

### Tasks
- 30+ tasks with up to 4 levels of nesting
- Various statuses (Pending, In Progress, Done, Blocked, etc.)
- Different phases (Dev, Test, Review)
- Progress tracking
- Due dates
- Owner assignments

### Tags
- `frontend` (blue)
- `backend` (green)
- `design` (pink)
- `infra` (amber)

### Checklists
- Pre-launch checklist for Website Redesign
- App Store requirements for Mobile App
- Infrastructure compliance for Infrastructure Upgrade

## First Steps After Launch

1. **Explore Projects** - Navigate to the Projects page (default)
2. **Expand a Project** - Click on any project to see its tasks
3. **Try Task Management**:
   - Click status badges to change status
   - Click phase badges to cycle through phases
   - Edit progress inline
   - Add subtasks by hovering over tasks
4. **Check Dashboard** - View analytics and charts
5. **Open Calendar** - See tasks by due date
6. **Manage Users & Tags** - Add team members and create custom tags

## Common Commands

```bash
# Start development servers
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Reset database
rm dev.db
npx prisma db push
node prisma/seed.js

# View database in Prisma Studio
npm run db:studio
```

## Troubleshooting

### "Port 3001 already in use"
```bash
npx kill-port 3001
```

### "Port 3000 already in use"
```bash
npx kill-port 3000
```

### Database errors
```bash
# Delete and recreate database
rm dev.db
npx prisma db push
node prisma/seed.js
```

### Prisma client errors
```bash
npx prisma generate
```

## Next Steps

- Add your own projects and tasks
- Customize tags and colors
- Invite team members
- Explore the dashboard analytics
- Try the calendar view

## Need Help?

Check the main README.md for detailed documentation, API endpoints, and architecture information.

Happy task tracking! 🎯


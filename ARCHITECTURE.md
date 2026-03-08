# 🏗️ Architecture Documentation

## System Overview

Task Tracker is a full-stack application built with a clear separation between frontend and backend, using modern web technologies and best practices.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │              React Router (SPA)                  │   │
│  │  ┌──────────┬──────────┬──────────┬──────────┐ │   │
│  │  │ Projects │Dashboard │ Calendar │  Users   │ │   │
│  │  │   Page   │   Page   │   Page   │   Page   │ │   │
│  │  └──────────┴──────────┴──────────┴──────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │          State Management Layer                  │   │
│  │  ┌──────────────┐  ┌──────────────────────────┐│   │
│  │  │   Zustand    │  │    React Query Cache     ││   │
│  │  │  (UI State)  │  │   (Server State)         ││   │
│  │  └──────────────┘  └──────────────────────────┘│   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │              API Client (Axios)                  │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP/REST
                           │
┌──────────────────────────▼──────────────────────────────┐
│                  Backend (Express)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │                  API Routes                      │   │
│  │  ┌──────┬──────┬──────┬──────┬──────┬────────┐ │   │
│  │  │ /api │ /api │ /api │ /api │ /api │  /api  │ │   │
│  │  │/proj │/tasks│/users│/tags │/chk  │/dashbrd│ │   │
│  │  └──────┴──────┴──────┴──────┴──────┴────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Business Logic Layer                   │   │
│  │  - Validation (Zod)                             │   │
│  │  - Tree Building (taskTree.js)                  │   │
│  │  - Error Handling                               │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Database Abstraction                   │   │
│  │  ┌──────────────┐  ┌──────────────────────────┐│   │
│  │  │   Prisma     │  │   DynamoDB Adapter       ││   │
│  │  │   Client     │  │   (Phase 6)              ││   │
│  │  └──────────────┘  └──────────────────────────┘│   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
        ┌───────▼────────┐   ┌───────▼────────┐
        │     SQLite     │   │    DynamoDB    │
        │  (Development) │   │   (Production) │
        └────────────────┘   └────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── BrowserRouter
│   ├── Sidebar (Navigation)
│   ├── TopBar (Header)
│   └── Routes
│       ├── ProjectsPage
│       │   └── ProjectList
│       │       └── ProjectCard (per project)
│       │           ├── TaskGroup
│       │           │   └── TaskRow (recursive)
│       │           │       └── TaskRow (children)
│       │           └── ChecklistPanel
│       │               └── ChecklistItem
│       ├── DashboardPage
│       │   ├── StatsCards
│       │   ├── DonutChart
│       │   ├── DayProgressChart
│       │   ├── BlockersTable
│       │   └── PendingTable
│       ├── CalendarPage
│       │   └── CalendarView
│       │       └── TaskDot
│       ├── UsersPage
│       └── TagsPage
```

### State Management Strategy

#### Zustand (Client State)
- UI state (expanded/collapsed items)
- User preferences
- Temporary form state

**Stores:**
- `useProjectStore` - Project UI state
- `useTaskStore` - Task expansion state
- `useUserStore` - Current user state

#### React Query (Server State)
- API data caching
- Automatic refetching
- Optimistic updates
- Loading/error states

**Query Keys:**
```javascript
['projects']                      // All projects
['projects', projectId]           // Single project
['projects', projectId, 'tasks']  // Project tasks
['tasks', taskId]                 // Single task
['users']                         // All users
['tags']                          // All tags
['checklists', 'project', id]     // Project checklists
['dashboard', 'stats']            // Dashboard data
```

### Data Flow

1. **User Action** → Component event handler
2. **Mutation** → React Query mutation hook
3. **API Call** → Axios request to backend
4. **Response** → Update React Query cache
5. **Re-render** → Components re-render with new data

### Key Design Patterns

#### Recursive Components
`TaskRow` renders itself for children, enabling unlimited nesting:

```jsx
function TaskRow({ task, depth }) {
  return (
    <>
      <tr>{/* Task content */}</tr>
      {task.children.map(child => (
        <TaskRow task={child} depth={depth + 1} />
      ))}
    </>
  );
}
```

#### Compound Components
Modal + Form pattern for CRUD operations:

```jsx
<Modal isOpen={isOpen} onClose={onClose}>
  <form onSubmit={handleSubmit}>
    {/* Form fields */}
  </form>
</Modal>
```

#### Custom Hooks
Encapsulate API logic and React Query:

```javascript
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });
}
```

## Backend Architecture

### Layered Architecture

```
Routes Layer (Express)
    ↓
Validation Layer (Zod)
    ↓
Business Logic Layer
    ↓
Data Access Layer (Prisma/DynamoDB)
    ↓
Database
```

### Route Organization

Each resource has its own route file:

- `projects.js` - Project CRUD + members
- `tasks.js` - Task CRUD + reordering
- `users.js` - User management
- `tags.js` - Tag management
- `checklists.js` - Checklist CRUD + items
- `dashboard.js` - Analytics queries

### Database Abstraction

The `db.js` config file switches between providers:

```javascript
const provider = process.env.DB_PROVIDER || 'sqlite';

if (provider === 'dynamodb') {
  db = dynamoAdapter;
} else {
  db = prisma;
}
```

This allows seamless switching between SQLite and DynamoDB.

### Tree Building Algorithm

Tasks are stored flat in the database but built into a tree structure:

```javascript
function buildTree(tasks, parentId = null) {
  return tasks
    .filter(t => t.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map(task => ({
      ...task,
      children: buildTree(tasks, task.id)
    }));
}
```

**Time Complexity:** O(n²) worst case, but efficient for typical task counts.

## Database Schema

### Entity Relationship Diagram

```
User ──────┐
           │
           ├─── ProjectMember ─── Project ───┬─── Task (self-referential)
           │                                  │
           └────────────────────────────────┐ ├─── Checklist ─── ChecklistItem
                                            │ │
                                            ▼ ▼
                                            Task ◄─── Tag
```

### Key Relationships

1. **User ↔ Project** (Many-to-Many via ProjectMember)
   - Users can be members of multiple projects
   - Projects can have multiple members
   - Roles: owner, member, viewer

2. **Project → Task** (One-to-Many)
   - Each task belongs to one project
   - Projects can have many tasks

3. **Task → Task** (Self-Referential)
   - Tasks can have a parent task
   - Enables unlimited nesting

4. **Task ↔ Tag** (Many-to-Many)
   - Tasks can have multiple tags
   - Tags can be applied to multiple tasks

5. **Project → Checklist → ChecklistItem** (One-to-Many chains)
   - Projects have checklists
   - Checklists have items

### Indexes

Prisma automatically creates indexes for:
- Primary keys (id fields)
- Foreign keys (relation fields)
- Unique constraints (email, tag names)

For optimal query performance, consider adding:
- Index on `task.parentId` for tree queries
- Index on `task.dueDate` for calendar queries
- Index on `task.status` for dashboard filters

## API Design

### RESTful Principles

- **Resources:** Projects, Tasks, Users, Tags, Checklists
- **HTTP Methods:** GET, POST, PATCH, DELETE
- **Status Codes:** 200, 201, 204, 400, 404, 500
- **JSON:** All requests/responses use JSON

### Response Format

**Success:**
```json
{
  "id": "clx...",
  "name": "Project Name",
  "tasks": [...]
}
```

**Error:**
```json
{
  "error": "Error message",
  "details": [...]  // Optional validation errors
}
```

### Query Optimization

1. **Eager Loading:** Use Prisma `include` to fetch related data
2. **Selective Fields:** Use `select` to fetch only needed fields
3. **Pagination:** Implement for large datasets (future)
4. **Caching:** React Query handles client-side caching

## Performance Considerations

### Frontend

1. **Code Splitting:** Vite automatically splits routes
2. **Lazy Loading:** Components loaded on demand
3. **Memoization:** React.memo for expensive components
4. **Virtual Scrolling:** For large task lists (future)

### Backend

1. **Database Queries:** Minimize N+1 queries with includes
2. **Response Size:** Send only necessary data
3. **Caching:** Add Redis for frequently accessed data (future)
4. **Rate Limiting:** Protect against abuse (future)

### Database

1. **Indexes:** On frequently queried fields
2. **Connection Pooling:** Prisma handles automatically
3. **Query Optimization:** Use explain plans for slow queries

## Security Considerations

### Current Implementation

1. **Input Validation:** Zod schemas validate all inputs
2. **SQL Injection:** Prisma uses parameterized queries
3. **CORS:** Configured for development

### Future Enhancements

1. **Authentication:** JWT tokens
2. **Authorization:** Role-based access control
3. **Rate Limiting:** Prevent abuse
4. **HTTPS:** SSL/TLS in production
5. **Input Sanitization:** XSS prevention
6. **CSRF Protection:** Token-based

## Scalability Path

### Phase 1 (Current)
- SQLite database
- Single server
- ~100 users, ~10,000 tasks

### Phase 2 (Small Team)
- PostgreSQL database
- Single server with load balancer
- ~1,000 users, ~100,000 tasks

### Phase 3 (Enterprise)
- DynamoDB or PostgreSQL with read replicas
- Multiple application servers
- Redis caching
- CDN for static assets
- ~10,000+ users, ~1,000,000+ tasks

## Testing Strategy

### Frontend Testing (Future)
- **Unit Tests:** Component logic with Vitest
- **Integration Tests:** User flows with Testing Library
- **E2E Tests:** Full workflows with Playwright

### Backend Testing (Future)
- **Unit Tests:** Business logic with Jest
- **Integration Tests:** API endpoints with Supertest
- **Database Tests:** Seed data and queries

## Deployment

### Development
```bash
npm run dev  # Both servers with hot reload
```

### Production (Future)

**Frontend:**
```bash
cd client
npm run build
# Serve dist/ with nginx or CDN
```

**Backend:**
```bash
npm run server
# Use PM2 or Docker for process management
```

**Database:**
- SQLite → PostgreSQL or DynamoDB
- Run migrations: `npx prisma migrate deploy`

## Monitoring & Logging

### Current
- Console logging
- Error boundaries in React

### Future
- **Application Monitoring:** Sentry or DataDog
- **Performance Monitoring:** Web Vitals
- **Log Aggregation:** Winston + CloudWatch
- **Metrics:** Prometheus + Grafana

## Technology Choices

### Why React?
- Component-based architecture
- Large ecosystem
- Excellent developer experience
- Virtual DOM for performance

### Why Prisma?
- Type-safe database access
- Automatic migrations
- Excellent TypeScript support
- Database-agnostic

### Why TailwindCSS?
- Utility-first approach
- Consistent design system
- Small bundle size
- Fast development

### Why React Query?
- Automatic caching
- Background refetching
- Optimistic updates
- Excellent developer tools

### Why Zustand?
- Simple API
- No boilerplate
- TypeScript support
- Small bundle size

## Future Improvements

1. **Real-time Collaboration:** WebSockets for live updates
2. **Offline Support:** Service workers and IndexedDB
3. **Mobile Apps:** React Native version
4. **Advanced Analytics:** More charts and insights
5. **AI Features:** Smart task suggestions
6. **Integrations:** Slack, GitHub, Jira
7. **Notifications:** Email and push notifications
8. **File Attachments:** Upload and link files to tasks
9. **Time Tracking:** Log time spent on tasks
10. **Gantt Charts:** Visual project timelines

---

This architecture provides a solid foundation for a scalable, maintainable task management system.


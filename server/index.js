import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import projectsRouter from './routes/projects.js';
import tasksRouter from './routes/tasks.js';
import usersRouter from './routes/users.js';
import tagsRouter from './routes/tags.js';
import checklistsRouter from './routes/checklists.js';
import dashboardRouter from './routes/dashboard.js';
import exportRouter from './routes/export.js';
import authRouter from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireAuth } from './middleware/requireAuth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';

// CORS: allow credentials (cookies) from frontend origin
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Session (must be before auth routes)
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  },
}));

// Public routes (no auth)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/auth', authRouter);

// Protected API routes
app.use('/api/projects', requireAuth, projectsRouter);
app.use('/api/tasks', requireAuth, tasksRouter);
app.use('/api/users', requireAuth, usersRouter);
app.use('/api/tags', requireAuth, tagsRouter);
app.use('/api/checklists', requireAuth, checklistsRouter);
app.use('/api/dashboard', requireAuth, dashboardRouter);
app.use('/api/export', requireAuth, exportRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


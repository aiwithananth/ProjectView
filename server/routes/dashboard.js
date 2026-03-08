import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET /api/dashboard/project-summary - Per-project summary stats
router.get('/project-summary', async (req, res, next) => {
  try {
    const projects = await db.project.findMany({
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
      },
    });

    const summary = projects.map(project => {
      const tasks = project.tasks;
      const total = tasks.length;
      const done = tasks.filter(t => t.status === 'DONE').length;
      const blocked = tasks.filter(t => t.status === 'BLOCKED').length;
      const overdue = tasks.filter(t => t.status === 'OVERDUE').length;
      const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
      const onTrack = tasks.filter(t => t.status === 'ON_TRACK').length;
      const pending = tasks.filter(t => t.status === 'PENDING').length;

      return {
        projectId: project.id,
        projectName: project.name,
        projectColor: project.color,
        total,
        done,
        blocked,
        overdue,
        inProgress,
        onTrack,
        pending,
        completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    });

    res.json(summary);
  } catch (error) {
    next(error);
  }
});

// GET /api/dashboard/day-progress - Last 30 days completion percentage
router.get('/day-progress', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all tasks updated in the last N days
    const tasks = await db.task.findMany({
      where: {
        updatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    // Group by day and calculate completion rate
    const dayMap = new Map();
    
    // Initialize all days with 0
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dayMap.set(dateKey, { date: dateKey, completed: 0, total: 0 });
    }

    // Count tasks by day
    tasks.forEach(task => {
      const dateKey = task.updatedAt.toISOString().split('T')[0];
      if (dayMap.has(dateKey)) {
        const day = dayMap.get(dateKey);
        day.total++;
        if (task.status === 'DONE') {
          day.completed++;
        }
      }
    });

    // Convert to array and calculate percentages
    const progress = Array.from(dayMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(day => ({
        date: day.date,
        completionRate: day.total > 0 ? Math.round((day.completed / day.total) * 100) : 0,
        completed: day.completed,
        total: day.total,
      }));

    res.json(progress);
  } catch (error) {
    next(error);
  }
});

// GET /api/dashboard/blockers - All blocked tasks
router.get('/blockers', async (req, res, next) => {
  try {
    const blockers = await db.task.findMany({
      where: {
        status: 'BLOCKED',
      },
      include: {
        owner: true,
        project: true,
        tags: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    res.json(blockers);
  } catch (error) {
    next(error);
  }
});

// GET /api/dashboard/pending - All pending and overdue tasks
router.get('/pending', async (req, res, next) => {
  try {
    const pending = await db.task.findMany({
      where: {
        OR: [
          { status: 'PENDING' },
          { status: 'OVERDUE' },
        ],
      },
      include: {
        owner: true,
        project: true,
        tags: true,
      },
      orderBy: [
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(pending);
  } catch (error) {
    next(error);
  }
});

// GET /api/dashboard/calendar - Tasks by date range (includes tasks that overlap range for Gantt)
router.get('/calendar', async (req, res, next) => {
  try {
    const from = req.query.from ? new Date(req.query.from) : new Date();
    const to = req.query.to ? new Date(req.query.to) : (() => {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date;
    })();

    const tasks = await db.task.findMany({
      where: {
        dueDate: { not: null, gte: from },
        OR: [
          { startDate: { not: null }, startDate: { lte: to } },
          { startDate: null, createdAt: { lte: to } },
          { startDate: null, dueDate: { lte: to } },
        ],
      },
      include: {
        owner: true,
        project: true,
        tags: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// GET /api/dashboard/stats - Overall statistics
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalProjects,
      totalTasks,
      totalUsers,
      doneTasks,
      blockedTasks,
      overdueTasks,
    ] = await Promise.all([
      db.project.count(),
      db.task.count(),
      db.user.count(),
      db.task.count({ where: { status: 'DONE' } }),
      db.task.count({ where: { status: 'BLOCKED' } }),
      db.task.count({ where: { status: 'OVERDUE' } }),
    ]);

    res.json({
      totalProjects,
      totalTasks,
      totalUsers,
      doneTasks,
      blockedTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
    });
  } catch (error) {
    next(error);
  }
});

export default router;


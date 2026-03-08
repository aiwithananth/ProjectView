import express from 'express';
import db from '../config/db.js';
import { buildTree } from '../lib/taskTree.js';

const router = express.Router();

/**
 * GET /api/export - Full data for CSV export: all projects with nested tasks (owner, tags included).
 */
router.get('/', async (req, res, next) => {
  try {
    const projects = await db.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (projects.length === 0) {
      return res.json({ projects: [] });
    }
    const projectIds = projects.map((p) => p.id);
    const tasks = await db.task.findMany({
      where: { projectId: { in: projectIds } },
      include: {
        owner: true,
        tags: true,
      },
      orderBy: { order: 'asc' },
    });
    const projectsWithTasks = projects.map((p) => {
      const projectTasks = tasks.filter((t) => t.projectId === p.id);
      return {
        ...p,
        tasks: buildTree(projectTasks),
      };
    });
    res.json({ projects: projectsWithTasks });
  } catch (error) {
    next(error);
  }
});

export default router;

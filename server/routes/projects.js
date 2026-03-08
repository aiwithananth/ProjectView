import express from 'express';
import { z } from 'zod';
import db from '../config/db.js';
import { buildTree } from '../lib/taskTree.js';

const router = express.Router();

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().default('#6366f1'),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  collapsed: z.boolean().optional(),
});

// GET /api/projects - List all projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await db.project.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            checklists: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Compute average progress per project
    if (projects.length > 0) {
      const projectIds = projects.map((p) => p.id);
      const taskProgress = await db.task.findMany({
        where: { projectId: { in: projectIds } },
        select: { projectId: true, progress: true },
      });
      const progressByProject = {};
      const countByProject = {};
      taskProgress.forEach((t) => {
        progressByProject[t.projectId] = (progressByProject[t.projectId] || 0) + t.progress;
        countByProject[t.projectId] = (countByProject[t.projectId] || 0) + 1;
      });
      projects.forEach((p) => {
        const total = progressByProject[p.id] || 0;
        const count = countByProject[p.id] || 0;
        p.progressPercent = count > 0 ? Math.round(total / count) : 0;
      });
    }

    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res, next) => {
  try {
    const project = await db.project.findUnique({
      where: { id: req.params.id },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            checklists: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id/tasks - Get project tasks as nested tree
router.get('/:projectId/tasks', async (req, res, next) => {
  try {
    const tasks = await db.task.findMany({
      where: { projectId: req.params.projectId },
      include: {
        owner: true,
        tags: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    const tree = buildTree(tasks);
    res.json(tree);
  } catch (error) {
    next(error);
  }
});

// POST /api/projects - Create project
router.post('/', async (req, res, next) => {
  try {
    const data = createProjectSchema.parse(req.body);
    
    const project = await db.project.create({
      data,
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/projects/:id - Update project
router.patch('/:id', async (req, res, next) => {
  try {
    const data = updateProjectSchema.parse(req.body);
    
    const project = await db.project.update({
      where: { id: req.params.id },
      data,
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res, next) => {
  try {
    await db.project.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:id/members - Add member to project
router.post('/:id/members', async (req, res, next) => {
  try {
    const { userId, role = 'member' } = req.body;
    
    const member = await db.projectMember.create({
      data: {
        projectId: req.params.id,
        userId,
        role,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id/members/:memberId - Remove member
router.delete('/:id/members/:memberId', async (req, res, next) => {
  try {
    await db.projectMember.delete({
      where: { id: req.params.memberId },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;


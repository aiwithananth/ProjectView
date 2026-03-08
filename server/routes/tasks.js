import express from 'express';
import { z } from 'zod';
import db from '../config/db.js';

const router = express.Router();

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.string(),
  parentId: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'ON_TRACK', 'OVERDUE', 'BLOCKED', 'DONE']).default('PENDING'),
  phase: z.enum(['REVIEW', 'DEV', 'TEST']).optional().nullable(),
  progress: z.number().min(0).max(100).default(0),
  depth: z.number().default(0),
  order: z.number().default(0),
  tagIds: z.array(z.string()).optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'ON_TRACK', 'OVERDUE', 'BLOCKED', 'DONE']).optional(),
  phase: z.enum(['REVIEW', 'DEV', 'TEST']).optional().nullable(),
  progress: z.number().min(0).max(100).optional(),
  tagIds: z.array(z.string()).optional(),
});

const reorderTaskSchema = z.object({
  newOrder: z.number(),
  newParentId: z.string().optional().nullable(),
});

const createCommentSchema = z.object({
  body: z.string().min(1),
});

// GET /api/tasks/:taskId/comments - List comments (must be before /:id)
router.get('/:taskId/comments', async (req, res, next) => {
  try {
    const comments = await db.taskComment.findMany({
      where: { taskId: req.params.taskId },
      include: { author: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks/:taskId/comments - Add comment
router.post('/:taskId/comments', async (req, res, next) => {
  try {
    const { body } = createCommentSchema.parse(req.body);
    const taskId = req.params.taskId;
    const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!user) {
      return res.status(400).json({ error: 'No users in system. Create a user first.' });
    }
    const comment = await db.taskComment.create({
      data: {
        body,
        taskId,
        authorId: user.id,
      },
      include: { author: true },
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req, res, next) => {
  try {
    const task = await db.task.findUnique({
      where: { id: req.params.id },
      include: {
        owner: true,
        tags: true,
        project: true,
        parent: true,
        children: {
          include: {
            owner: true,
            tags: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks - Create task
router.post('/', async (req, res, next) => {
  try {
    const { tagIds, ...data } = createTaskSchema.parse(req.body);
    
    // Calculate depth based on parent
    let depth = 0;
    if (data.parentId) {
      const parent = await db.task.findUnique({
        where: { id: data.parentId },
        select: { depth: true },
      });
      depth = (parent?.depth || 0) + 1;
    }

    // Get the max order for siblings
    const siblings = await db.task.findMany({
      where: {
        projectId: data.projectId,
        parentId: data.parentId || null,
      },
      select: { order: true },
      orderBy: { order: 'desc' },
      take: 1,
    });

    const order = siblings.length > 0 ? siblings[0].order + 1 : 0;

    const task = await db.task.create({
      data: {
        ...data,
        depth,
        order,
        startDate: data.startDate ? new Date(data.startDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        tags: tagIds ? {
          connect: tagIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        owner: true,
        tags: true,
        project: true,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/tasks/:id - Update task
router.patch('/:id', async (req, res, next) => {
  try {
    const { tagIds, ...data } = updateTaskSchema.parse(req.body);
    
    const updateData = {
      ...data,
      startDate: data.startDate !== undefined
        ? (data.startDate ? new Date(data.startDate) : null)
        : undefined,
      dueDate: data.dueDate !== undefined 
        ? (data.dueDate ? new Date(data.dueDate) : null)
        : undefined,
    };

    if (tagIds !== undefined) {
      // First, disconnect all existing tags
      await db.task.update({
        where: { id: req.params.id },
        data: {
          tags: {
            set: [],
          },
        },
      });

      // Then connect the new tags
      updateData.tags = {
        connect: tagIds.map(id => ({ id })),
      };
    }

    const task = await db.task.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        owner: true,
        tags: true,
        project: true,
      },
    });

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/tasks/:id/reorder - Reorder task (drag and drop)
router.patch('/:id/reorder', async (req, res, next) => {
  try {
    const { newOrder, newParentId } = reorderTaskSchema.parse(req.body);
    const taskId = req.params.id;

    // Get the task being moved
    const task = await db.task.findUnique({
      where: { id: taskId },
      select: { projectId: true, parentId: true, order: true, depth: true },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Calculate new depth if parent changed
    let newDepth = task.depth;
    if (newParentId !== undefined && newParentId !== task.parentId) {
      if (newParentId) {
        const newParent = await db.task.findUnique({
          where: { id: newParentId },
          select: { depth: true },
        });
        newDepth = (newParent?.depth || 0) + 1;
      } else {
        newDepth = 0;
      }
    }

    // Update the task
    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: {
        order: newOrder,
        parentId: newParentId !== undefined ? newParentId : undefined,
        depth: newDepth,
      },
      include: {
        owner: true,
        tags: true,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id - Delete task (cascade to children)
router.delete('/:id', async (req, res, next) => {
  try {
    await db.task.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;


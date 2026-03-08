import express from 'express';
import { z } from 'zod';
import db from '../config/db.js';

const router = express.Router();

// Validation schemas
const createChecklistSchema = z.object({
  title: z.string().min(1),
  projectId: z.string(),
});

const updateChecklistSchema = z.object({
  title: z.string().min(1).optional(),
});

const createChecklistItemSchema = z.object({
  label: z.string().min(1),
  order: z.number().optional(),
  status: z.enum(['pending', 'in_progress', 'done']).optional(),
});

const updateChecklistItemSchema = z.object({
  label: z.string().min(1).optional(),
  done: z.boolean().optional(),
  status: z.enum(['pending', 'in_progress', 'done']).optional(),
  order: z.number().optional(),
});

const createItemCommentSchema = z.object({
  body: z.string().min(1),
  statusAtChange: z.string().optional(),
});

// GET /api/checklists/:projectId - Get all checklists for a project (items include last comment)
router.get('/project/:projectId', async (req, res, next) => {
  try {
    const checklists = await db.checklist.findMany({
      where: { projectId: req.params.projectId },
      include: {
        items: {
          orderBy: { order: 'asc' },
          include: {
            comments: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: { author: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(checklists);
  } catch (error) {
    next(error);
  }
});

// GET /api/checklists/items/:itemId/comments - List comments (date-wise)
router.get('/items/:itemId/comments', async (req, res, next) => {
  try {
    const comments = await db.checklistItemComment.findMany({
      where: { checklistItemId: req.params.itemId },
      include: { author: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

// POST /api/checklists/items/:itemId/comments - Add comment
router.post('/items/:itemId/comments', async (req, res, next) => {
  try {
    const { body, statusAtChange } = createItemCommentSchema.parse(req.body);
    const itemId = req.params.itemId;
    const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!user) {
      return res.status(400).json({ error: 'No users in system. Create a user first.' });
    }
    const comment = await db.checklistItemComment.create({
      data: {
        body,
        statusAtChange: statusAtChange || null,
        checklistItemId: itemId,
        authorId: user.id,
      },
      include: { author: true },
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

// GET /api/checklists/:id - Get single checklist
router.get('/:id', async (req, res, next) => {
  try {
    const checklist = await db.checklist.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          orderBy: {
            order: 'asc',
          },
        },
        project: true,
      },
    });

    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    res.json(checklist);
  } catch (error) {
    next(error);
  }
});

// POST /api/checklists - Create checklist
router.post('/', async (req, res, next) => {
  try {
    const data = createChecklistSchema.parse(req.body);
    
    const checklist = await db.checklist.create({
      data,
      include: {
        items: true,
      },
    });

    res.status(201).json(checklist);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/checklists/:id - Update checklist
router.patch('/:id', async (req, res, next) => {
  try {
    const data = updateChecklistSchema.parse(req.body);
    
    const checklist = await db.checklist.update({
      where: { id: req.params.id },
      data,
      include: {
        items: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    res.json(checklist);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/checklists/:id - Delete checklist
router.delete('/:id', async (req, res, next) => {
  try {
    await db.checklist.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// POST /api/checklists/:id/items - Add item to checklist
router.post('/:id/items', async (req, res, next) => {
  try {
    const data = createChecklistItemSchema.parse(req.body);
    
    // Get the max order for existing items
    const existingItems = await db.checklistItem.findMany({
      where: { checklistId: req.params.id },
      select: { order: true },
      orderBy: { order: 'desc' },
      take: 1,
    });

    const order = data.order !== undefined 
      ? data.order 
      : (existingItems.length > 0 ? existingItems[0].order + 1 : 0);

    const item = await db.checklistItem.create({
      data: {
        label: data.label,
        order,
        checklistId: req.params.id,
        status: data.status || 'pending',
      },
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/checklists/items/:itemId - Update checklist item (status, done, label, order)
router.patch('/items/:itemId', async (req, res, next) => {
  try {
    const data = updateChecklistItemSchema.parse(req.body);
    const updateData = { ...data };
    if (data.status === 'done') updateData.done = true;
    if (data.status === 'pending' || data.status === 'in_progress') updateData.done = false;
    const item = await db.checklistItem.update({
      where: { id: req.params.itemId },
      data: updateData,
    });

    res.json(item);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/checklists/items/:itemId - Delete checklist item
router.delete('/items/:itemId', async (req, res, next) => {
  try {
    await db.checklistItem.delete({
      where: { id: req.params.itemId },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;


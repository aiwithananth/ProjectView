import express from 'express';
import { z } from 'zod';
import db from '../config/db.js';

const router = express.Router();

// Validation schemas
const createTagSchema = z.object({
  name: z.string().min(1),
  color: z.string().default('#94a3b8'),
});

const updateTagSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().optional(),
});

// GET /api/tags - List all tags
router.get('/', async (req, res, next) => {
  try {
    const tags = await db.tag.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json(tags);
  } catch (error) {
    next(error);
  }
});

// GET /api/tags/:id - Get single tag
router.get('/:id', async (req, res, next) => {
  try {
    const tag = await db.tag.findUnique({
      where: { id: req.params.id },
      include: {
        tasks: {
          include: {
            project: true,
            owner: true,
          },
        },
      },
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    next(error);
  }
});

// POST /api/tags - Create tag
router.post('/', async (req, res, next) => {
  try {
    const data = createTagSchema.parse(req.body);
    
    const tag = await db.tag.create({
      data,
    });

    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/tags/:id - Update tag
router.patch('/:id', async (req, res, next) => {
  try {
    const data = updateTagSchema.parse(req.body);
    
    const tag = await db.tag.update({
      where: { id: req.params.id },
      data,
    });

    res.json(tag);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tags/:id - Delete tag
router.delete('/:id', async (req, res, next) => {
  try {
    await db.tag.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;


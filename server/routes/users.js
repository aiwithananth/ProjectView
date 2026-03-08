import express from 'express';
import { z } from 'zod';
import db from '../config/db.js';

const router = express.Router();

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  avatar: z.string().url().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  avatar: z.string().url().optional().nullable(),
});

// GET /api/users - List all users
router.get('/', async (req, res, next) => {
  try {
    const users = await db.user.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
            projects: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', async (req, res, next) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.params.id },
      include: {
        tasks: {
          include: {
            project: true,
          },
        },
        projects: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST /api/users - Create user
router.post('/', async (req, res, next) => {
  try {
    const data = createUserSchema.parse(req.body);
    
    const user = await db.user.create({
      data,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/:id - Update user
router.patch('/:id', async (req, res, next) => {
  try {
    const data = updateUserSchema.parse(req.body);
    
    const user = await db.user.update({
      where: { id: req.params.id },
      data,
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res, next) => {
  try {
    await db.user.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;


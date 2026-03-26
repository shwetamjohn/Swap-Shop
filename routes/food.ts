import express from 'express';
import { Food } from '../models/Food';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, coordinates, ttlHours } = req.body;
    const expiresAt = new Date(Date.now() + (ttlHours || 24) * 60 * 60 * 1000);
    const food = new Food({
      title,
      description,
      location: {
        type: 'Point',
        coordinates: coordinates, // [lng, lat]
      },
      ownerId: req.user?.id,
      ownerName: req.user?.name,
      expiresAt,
    });
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Error creating food post' });
  }
});

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'Latitude and longitude are required' });

    const foods = await Food.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
          },
          $maxDistance: parseFloat(radius as string || '5000'), // Default 5km
        },
      },
      expiresAt: { $gt: new Date() },
    });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error searching nearby food' });
  }
});

router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({ expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error listing food posts' });
  }
});

router.post('/:id/dibs', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const dibsCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const food = await Food.findOneAndUpdate(
      { _id: req.params.id, claimedBy: null, expiresAt: { $gt: new Date() } },
      { claimedBy: req.user?.id, dibsCode },
      { new: true }
    );

    if (!food) return res.status(400).json({ message: 'Food already claimed or expired' });
    res.json({ message: 'Dibs claimed!', dibsCode });
  } catch (error) {
    res.status(500).json({ message: 'Error claiming dibs' });
  }
});

router.get('/:id/dibs', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (food.claimedBy?.toString() !== req.user?.id) return res.status(403).json({ message: 'Unauthorized' });

    res.json({ dibsCode: food.dibsCode });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dibs code' });
  }
});

router.delete('/:id/dibs', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const food = await Food.findOneAndUpdate(
      { _id: req.params.id, claimedBy: req.user?.id },
      { claimedBy: null, dibsCode: null },
      { new: true }
    );

    if (!food) return res.status(400).json({ message: 'Could not release dibs' });
    res.json({ message: 'Dibs released' });
  } catch (error) {
    res.status(500).json({ message: 'Error releasing dibs' });
  }
});

export default router;

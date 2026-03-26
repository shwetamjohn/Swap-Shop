import express from 'express';
import { User } from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

const router = express.Router();

// POST /users/:id/rate - Rate a user
router.post('/:id/rate', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { score, comment } = req.body;
    const targetUserId = req.params.id;
    const fromUserId = req.user?.id;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: 'Score must be between 1 and 5' });
    }

    if (targetUserId === fromUserId) {
      return res.status(400).json({ message: 'You cannot rate yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already rated (optional but ideal)
    const alreadyRated = targetUser.ratings.some(r => r.fromUser?.toString() === fromUserId);
    if (alreadyRated) {
      return res.status(400).json({ message: 'You have already rated this user' });
    }

    targetUser.ratings.push({
      fromUser: new mongoose.Types.ObjectId(fromUserId),
      fromUserName: req.user?.name || 'Anonymous',
      score,
      comment,
      createdAt: new Date()
    });

    // Recalculate averageRating and totalRatings
    targetUser.totalRatings = targetUser.ratings.length;
    const sum = targetUser.ratings.reduce((acc, r) => acc + (r.score || 0), 0);
    targetUser.averageRating = sum / targetUser.totalRatings;

    await targetUser.save();
    res.json({ message: 'Rating submitted successfully', averageRating: targetUser.averageRating });
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ message: 'Error submitting rating' });
  }
});

// GET /users/:id/ratings - Get all ratings for a user
router.get('/:id/ratings', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('ratings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.ratings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings' });
  }
});

// GET /users/:id/profile - Get public profile
router.get('/:id/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name avatar averageRating totalRatings ratings createdAt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

export default router;

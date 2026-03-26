import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Food } from '../models/Food';
import { Item, SwapRequest } from '../models/Item';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user?.id);

    const dashboard = await User.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: 'ownerId',
          as: 'myProjects',
        },
      },
      {
        $lookup: {
          from: 'foods',
          localField: '_id',
          foreignField: 'ownerId',
          as: 'myFoodPosts',
        },
      },
      {
        $lookup: {
          from: 'foods',
          localField: '_id',
          foreignField: 'claimedBy',
          as: 'myDibs',
        },
      },
      {
        $lookup: {
          from: 'swaprequests',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$requesterId', '$$userId'] },
                    { $eq: ['$ownerId', '$$userId'] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: 'items',
                localField: 'itemId',
                foreignField: '_id',
                as: 'itemDetails',
              },
            },
            { $unwind: '$itemDetails' },
          ],
          as: 'mySwapRequests',
        },
      },
      {
        $project: {
          password: 0,
          __v: 0,
        },
      },
    ]);

    if (!dashboard || dashboard.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(dashboard[0]);
  } catch (error) {
    console.error('Dashboard aggregation error:', error);
    res.status(500).json({ message: 'Error fetching dashboard' });
  }
});

export default router;

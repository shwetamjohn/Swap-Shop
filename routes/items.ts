import express from 'express';
import { Item, SwapRequest } from '../models/Item';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/addItem', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, image, category } = req.body;
    const item = new Item({
      title,
      description,
      image,
      category,
      ownerId: req.user?.id,
      ownerName: req.user?.name,
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item' });
  }
});

router.get('/items', async (req, res) => {
  try {
    const items = await Item.aggregate([
      { $match: { status: 'available' } },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'ownerInfo'
        }
      },
      { $unwind: '$ownerInfo' },
      {
        $project: {
          title: 1,
          description: 1,
          image: 1,
          category: 1,
          ownerId: 1,
          ownerName: 1,
          status: 1,
          createdAt: 1,
          ownerRating: '$ownerInfo.averageRating',
          ownerTotalRatings: '$ownerInfo.totalRatings'
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error listing items' });
  }
});

router.post('/swapRequest', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { itemId, message } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const request = new SwapRequest({
      itemId,
      requesterId: req.user?.id,
      requesterName: req.user?.name,
      ownerId: item.ownerId,
      message,
    });
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error sending swap request' });
  }
});

router.get('/swapRequests', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const requests = await SwapRequest.find({
      $or: [{ requesterId: req.user?.id }, { ownerId: req.user?.id }],
    }).populate('itemId').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching swap requests' });
  }
});

router.put('/swapStatus/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const request = await SwapRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.ownerId.toString() !== req.user?.id) return res.status(403).json({ message: 'Unauthorized' });

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      await Item.findByIdAndUpdate(request.itemId, { status: 'swapped' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error updating swap status' });
  }
});

export default router;

import express from 'express';
import { User } from '../models/User';
import { Project, HandoffRequest, Contract } from '../models/Project';
import { Food } from '../models/Food';
import { Item, SwapRequest } from '../models/Item';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticateToken);
router.use(isAdmin);

const logAdminAction = (req: AuthRequest, action: string) => {
  console.log(`[${new Date().toISOString()}] Admin Action: ${action} by ${req.user?.email}`);
};

// Users
router.get('/users', async (req: AuthRequest, res) => {
  try {
    const users = await User.find().select('name email role createdAt').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.delete('/users/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.params.id;
    
    // Delete user's projects and associated data
    const userProjects = await Project.find({ ownerId: userId });
    for (const project of userProjects) {
      await HandoffRequest.deleteMany({ projectId: project._id });
      await Contract.deleteMany({ projectId: project._id });
    }
    await Project.deleteMany({ ownerId: userId });

    // Delete user's food listings
    await Food.deleteMany({ ownerId: userId });

    // Delete user's items and associated swap requests
    const userItems = await Item.find({ ownerId: userId });
    for (const item of userItems) {
      await SwapRequest.deleteMany({ itemId: item._id });
    }
    await Item.deleteMany({ ownerId: userId });

    // Delete requests made by user
    await HandoffRequest.deleteMany({ requesterId: userId });
    await SwapRequest.deleteMany({ requesterId: userId });

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    logAdminAction(req, `Deleted user ${userId}`);
    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Projects
router.get('/projects', async (req: AuthRequest, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

router.delete('/projects/:id', async (req: AuthRequest, res) => {
  try {
    const projectId = req.params.id;
    await HandoffRequest.deleteMany({ projectId });
    await Contract.deleteMany({ projectId });
    await Project.findByIdAndDelete(projectId);

    logAdminAction(req, `Deleted project ${projectId}`);
    res.json({ message: 'Project and associated handoff data deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

// Food
router.get('/food', async (req: AuthRequest, res) => {
  try {
    // Return all food posts including expired ones (TTL index might have removed them though, but we return what's in DB)
    const food = await Food.find().sort({ createdAt: -1 });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching food listings' });
  }
});

router.delete('/food/:id', async (req: AuthRequest, res) => {
  try {
    const foodId = req.params.id;
    await Food.findByIdAndDelete(foodId);

    logAdminAction(req, `Deleted food listing ${foodId}`);
    res.json({ message: 'Food listing deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting food listing' });
  }
});

// Items & Swaps
router.get('/items', async (req: AuthRequest, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items' });
  }
});

router.delete('/items/:id', async (req: AuthRequest, res) => {
  try {
    const itemId = req.params.id;
    await SwapRequest.deleteMany({ itemId });
    await Item.findByIdAndDelete(itemId);

    logAdminAction(req, `Deleted item ${itemId}`);
    res.json({ message: 'Item and associated swap requests deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
});

router.get('/swaps', async (req: AuthRequest, res) => {
  try {
    const swaps = await SwapRequest.find().sort({ createdAt: -1 });
    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching swap requests' });
  }
});

router.delete('/swaps/:id', async (req: AuthRequest, res) => {
  try {
    const swapId = req.params.id;
    await SwapRequest.findByIdAndDelete(swapId);

    logAdminAction(req, `Deleted swap request ${swapId}`);
    res.json({ message: 'Swap request deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting swap request' });
  }
});

// Dashboard Stats
router.get('/dashboard', async (req: AuthRequest, res) => {
  try {
    const [
      totalUsers,
      totalProjects,
      totalFood,
      totalItems,
      totalSwaps,
      claimedDibs
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Food.countDocuments(),
      Item.countDocuments(),
      SwapRequest.countDocuments(),
      Food.countDocuments({ claimedBy: { $ne: null } })
    ]);

    res.json({
      totalUsers,
      totalProjects,
      totalFood,
      totalItems,
      totalSwaps,
      claimedDibs
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

export default router;

import express from 'express';
import { Project, HandoffRequest, Contract } from '../models/Project';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, type, location, missingLink } = req.body;
    const project = new Project({
      title,
      description,
      type,
      location,
      missingLink,
      ownerId: req.user?.id,
      ownerName: req.user?.name,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { type, search } = req.query;
    let query: any = {};
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error listing projects' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const projects = await Project.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
    } as any).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error searching projects' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project' });
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.ownerId.toString() !== req.user?.id) return res.status(403).json({ message: 'Unauthorized' });

    Object.assign(project, req.body);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.ownerId.toString() !== req.user?.id) return res.status(403).json({ message: 'Unauthorized' });

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

// Handoffs
router.post('/:id/handoff/request', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { message } = req.body;
    const request = new HandoffRequest({
      projectId: req.params.id,
      requesterId: req.user?.id,
      requesterName: req.user?.name,
      message,
    });
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error requesting handoff' });
  }
});

router.get('/:id/handoff/requests', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.ownerId.toString() !== req.user?.id) return res.status(403).json({ message: 'Unauthorized' });

    const requests = await HandoffRequest.find({ projectId: req.params.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching handoff requests' });
  }
});

router.put('/:id/handoff/:requestId/accept', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.ownerId.toString() !== req.user?.id) return res.status(403).json({ message: 'Unauthorized' });

    const request = await HandoffRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'accepted';
    await request.save();

    // Create contract
    const contract = new Contract({
      projectId: project._id,
      ownerId: project.ownerId,
      newOwnerId: request.requesterId,
      contractText: `Digital handoff contract for project "${project.title}". Ownership transferred from ${project.ownerName} to ${request.requesterName}.`,
    });
    await contract.save();

    // Update project owner
    project.ownerId = request.requesterId;
    project.ownerName = request.requesterName;
    await project.save();

    res.json({ message: 'Handoff accepted and contract generated', contract });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting handoff' });
  }
});

router.get('/:id/handoff/contract', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const contract = await Contract.findOne({ projectId: req.params.id }).sort({ createdAt: -1 });
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contract' });
  }
});

export default router;

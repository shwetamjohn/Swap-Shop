import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Durable', 'Temporary', 'Urgent'], required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String, required: true },
  completionPercentage: { type: Number, default: 0 },
  location: { type: String, required: true },
  missingLink: { type: String, required: true },
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);

const handoffRequestSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requesterName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  message: { type: String },
}, { timestamps: true });

export const HandoffRequest = mongoose.model('HandoffRequest', handoffRequestSchema);

const contractSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  newOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contractText: { type: String, required: true },
  signedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Contract = mongoose.model('Contract', contractSchema);

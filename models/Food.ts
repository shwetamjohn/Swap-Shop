import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String, required: true },
  expiryStatus: { type: String, enum: ['fresh', 'approaching', 'urgent'], default: 'fresh' },
  expiresAt: { type: Date, required: true },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  dibsCode: { type: String },
}, { timestamps: true });

// Geospatial index
foodSchema.index({ location: '2dsphere' });

// TTL index
foodSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Food = mongoose.model('Food', foodSchema);

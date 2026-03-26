import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Project } from './models/Project';
import { Food } from './models/Food';
import { Item } from './models/Item';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swapshop';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Food.deleteMany({});
    await Item.deleteMany({});

    // Create users
    const user1 = new User({ name: 'Alice', email: 'alice@example.com', password: 'password123' });
    const user2 = new User({ name: 'Bob', email: 'bob@example.com', password: 'password123' });
    await user1.save();
    await user2.save();

    // Create projects
    await Project.create([
      {
        title: 'CRISPR Data Analysis',
        description: 'Unfinished CRISPR data for gene editing research.',
        type: 'Durable',
        ownerId: user1._id,
        ownerName: user1.name,
        location: 'Germany',
        missingLink: 'Needs Beta Testers',
      },
      {
        title: 'Solar Cell Prototype',
        description: 'Abandoned solar cell prototypes with high efficiency potential.',
        type: 'Urgent',
        ownerId: user2._id,
        ownerName: user2.name,
        location: 'India',
        missingLink: 'Needs Climate Data',
      },
    ]);

    // Create food
    await Food.create([
      {
        title: 'Fresh Pasta',
        description: 'Half-eaten bag of pasta, still fresh.',
        location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
        ownerId: user1._id,
        ownerName: user1.name,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        title: 'Organic Apples',
        description: 'A few apples from my garden.',
        location: { type: 'Point', coordinates: [-122.4167, 37.7833] },
        ownerId: user2._id,
        ownerName: user2.name,
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      },
    ]);

    // Create items
    await Item.create([
      {
        title: 'Vintage Camera',
        description: 'Old film camera, still works.',
        image: 'https://picsum.photos/seed/camera/400/300',
        category: 'Electronics',
        ownerId: user1._id,
        ownerName: user1.name,
      },
      {
        title: 'Biology 101 Textbook',
        description: 'Great condition, barely used.',
        image: 'https://picsum.photos/seed/book/400/300',
        category: 'Books',
        ownerId: user2._id,
        ownerName: user2.name,
      },
    ]);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();

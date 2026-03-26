export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ownerId: string;
  ownerName: string;
  status: 'available' | 'swapped' | 'pending';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  trustScore: number;
  verified: boolean;
  globalImpact: string; // e.g., "Assisting in a project in Germany that is 90% complete"
  localImpact: string;  // e.g., "Saved 4kg of food from landfills this week"
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  completionPercentage: number;
  missingLink: string; // e.g., "Needs Climate Data"
  ownerId: string;
  ownerName: string;
  status: 'active' | 'handed-off' | 'completed';
  createdAt: string;
  location: string;
}

export interface LocalResource {
  id: string;
  title: string;
  description: string;
  expiryStatus: 'fresh' | 'approaching' | 'urgent'; // Green, Yellow, Red
  ownerId: string;
  ownerName: string;
  status: 'available' | 'claimed';
  createdAt: string;
  latitude: number;
  longitude: number;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

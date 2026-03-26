import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://picsum.photos/seed/user/200/200' },
  trustScore: { type: Number, default: 100 },
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

userSchema.pre('save', async function() {
  const user = this as any;
  if (!user.isModified('password')) return;
  user.password = await bcrypt.hash(user.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);

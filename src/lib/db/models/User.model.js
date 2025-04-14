// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  clerkId: {
    type: String,  // Add this field
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  firstName: String,
  lastName: String,
  profileImage: String,
  subscription: {
    type: {
      plan: {
        type: String,
        enum: ['free', 'starter', 'professional', 'enterprise'],
        default: 'free'
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'past_due', 'canceled'],
        default: 'inactive'
      },
      startsAt: Date,
      endsAt: Date,
      razorpaySubscriptionId: String
    },
    default: {}
  },
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Middleware to update the updatedAt field
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
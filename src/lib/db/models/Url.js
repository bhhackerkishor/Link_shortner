import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  timestamp: Date,
  ip: String,
  location: String,
  device: String,
  referrer: String,
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true },
  userId: { type: String, required: true }, // Clerk user ID
  clicks: [clickSchema],
}, { timestamps: true });
// Add to your Mongoose models
urlSchema.index({ userId: 1, createdAt: -1 });
urlSchema.index({ shortId: 1 });
export const Url = mongoose.models.Url || mongoose.model('Url', urlSchema);


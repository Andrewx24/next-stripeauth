import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  image: String,
  stripeCustomerId: String,
  subscriptionStatus: {
    type: String,
    enum: ['active', 'canceled', 'past_due', 'none'],
    default: 'none',
  },
  subscriptionId: String,
});

export default mongoose.models.User || mongoose.model('User', userSchema);
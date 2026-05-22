const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  totalScore: { type: Number, required: true },
  clarity: { type: Number, required: true },
  technical: { type: Number, required: true },
  questionsCount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
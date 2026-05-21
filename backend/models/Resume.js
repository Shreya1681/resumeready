const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  resumeText: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  experience: {
    years: { type: Number, default: 0 },
    level: { type: String, default: 'Junior' },
    companies: { type: [String], default: [] },
  },
  strengths: {
    type: [String],
    default: [],
  },
  improvements: {
    type: [String],
    default: [],
  },
  keywords: {
    type: [String],
    default: [],
  },
  summary: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);

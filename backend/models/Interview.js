const mongoose = require('mongoose');

const QuestionFeedbackSchema = new mongoose.Schema({
  question: { type: String, required: true },
  score: { type: Number, required: true },
  feedback: { type: String, required: true },
  suggestions: { type: String, default: '' },
});

const InterviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  questions: {
    type: [String],
    default: [],
  },
  answers: {
    type: [String],
    default: [],
  },
  overallScore: {
    type: Number,
    required: true,
  },
  technicalScore: {
    type: Number,
    required: true,
  },
  communicationScore: {
    type: Number,
    required: true,
  },
  problemSolvingScore: {
    type: Number,
    required: true,
  },
  strengths: {
    type: [String],
    default: [],
  },
  improvements: {
    type: [String],
    default: [],
  },
  questionFeedback: [QuestionFeedbackSchema],
  overallFeedback: {
    type: String,
    default: '',
  },
  nextSteps: {
    type: [String],
    default: [],
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Interview', InterviewSchema);

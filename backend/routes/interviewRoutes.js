const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.post('/chat', interviewController.handleChatStream);
router.post('/feedback', interviewController.handleFeedbackEvaluation);
router.get('/history', interviewController.getInterviewHistory);

module.exports = router;


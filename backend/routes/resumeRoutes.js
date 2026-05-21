const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

router.post('/analyze', resumeController.analyzeResume);
router.get('/active', resumeController.getActiveResume);

module.exports = router;


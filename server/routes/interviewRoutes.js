const express = require('express');
const router = express.Router();
const { getQuestions, getFeedback, saveSession, getStats } = require('../controllers/interviewController');
const protect = require('../middleware/authMiddleware');

router.get('/questions/:role', getQuestions);
router.post('/feedback', getFeedback);
router.post('/save-session', protect, saveSession);
router.get('/stats', protect, getStats);

module.exports = router;
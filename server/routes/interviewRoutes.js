const express = require('express');
const router = express.Router();
const { getFeedback, getQuestions } = require('../controllers/interviewController');

router.get('/questions/:role', getQuestions);
router.post('/feedback', getFeedback);

module.exports = router;
const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.getQuestions = async (req, res) => {
  try {
    const { role } = req.params;

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a technical interviewer. Respond ONLY in this JSON format with no extra text:
          {
            "questions": [
              {"id": 1, "question": "...", "difficulty": "easy"},
              {"id": 2, "question": "...", "difficulty": "medium"},
              {"id": 3, "question": "...", "difficulty": "hard"}
            ]
          }`
        },
        {
          role: 'user',
          content: `Give me 3 technical interview questions for a ${role} position.`
        }
      ],
    });

    const raw = response.choices[0].message.content;
    const result = JSON.parse(raw);
    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ message: 'Questions fetch error', error: err.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const { question, answer, role } = req.body;

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert technical interviewer for ${role} positions. 
          Evaluate the candidate's answer and respond ONLY in this JSON format with no extra text:
          {
            "score": <number 0-100>,
            "clarity": <number 0-100>,
            "technical": <number 0-100>,
            "feedback": "<2-3 lines of constructive feedback>",
            "keywords_matched": ["keyword1", "keyword2"],
            "improvement": "<one specific tip to improve>"
          }`
        },
        {
          role: 'user',
          content: `Question: ${question}\n\nCandidate's Answer: ${answer}`
        }
      ],
    });

    const raw = response.choices[0].message.content;
    const result = JSON.parse(raw);
    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ message: 'AI feedback error', error: err.message });
  }
};

const Session = require('../models/Session');

exports.saveSession = async (req, res) => {
  try {
    const { role, totalScore, clarity, technical, questionsCount } = req.body;

    const session = await Session.create({
      userId: req.user.id,
      role,
      totalScore,
      clarity,
      technical,
      questionsCount,
    });

    res.status(201).json({ message: 'Session saved', session });
  } catch (err) {
    res.status(500).json({ message: 'Session save error', error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id });

    const totalInterviews = sessions.length;
    const totalQuestions = sessions.reduce((sum, s) => sum + s.questionsCount, 0);
    const avgScore = totalInterviews > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.totalScore, 0) / totalInterviews)
      : 0;

    res.status(200).json({ totalInterviews, totalQuestions, avgScore, sessions });
  } catch (err) {
    res.status(500).json({ message: 'Stats fetch error', error: err.message });
  }
};
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function Interview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [role, setRole] = useState('');
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [sessionScores, setSessionScores] = useState([]);

  const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack'];

  // Fix: location.state dependency add ki
  useEffect(() => {
    if (location.state?.role) {
      startInterview(location.state.role);
    }
  }, [location.state]);

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const startInterview = async (selectedRole) => {
    setRole(selectedRole);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API_URL}/api/interview/questions/${selectedRole}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions(res.data.questions);
      setStarted(true);
      setTimer(60);
      setTimerActive(true);
    } catch (err) {
      alert('Questions load nahi hue. Server check karo.');
    }
    setLoading(false);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tumhara browser voice support nahi karta. Chrome use karo.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setAnswer(prev => prev + ' ' + transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.start();
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert('Pehle answer likho ya bolo!');
      return;
    }
    setLoading(true);
    setTimerActive(false);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/api/interview/feedback`,
        {
          question: questions[currentIndex].question,
          answer,
          role
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback(res.data);
      setSessionScores(prev => [...prev, res.data]);
    } catch (err) {
      alert('Feedback nahi aaya. Dobara try karo.');
    }
    setLoading(false);
  };

  const nextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setAnswer('');
      setFeedback(null);
      setTimer(60);
      setTimerActive(true);
    } else {
      // Fix: feedback null hone par crash nahi hoga
      const allScores = [...sessionScores, ...(feedback ? [feedback] : [])];
      if (allScores.length === 0) {
        navigate('/dashboard');
        return;
      }
      const avgTotal = Math.round(allScores.reduce((s, f) => s + f.score, 0) / allScores.length);
      const avgClarity = Math.round(allScores.reduce((s, f) => s + f.clarity, 0) / allScores.length);
      const avgTechnical = Math.round(allScores.reduce((s, f) => s + f.technical, 0) / allScores.length);

      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/api/interview/save-session`, {
          role,
          totalScore: avgTotal,
          clarity: avgClarity,
          technical: avgTechnical,
          questionsCount: allScores.length,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.log('Session save error:', err);
      }
      navigate('/dashboard');
    }
  };

  if (!started) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Role Select Karo</h2>
        <p style={styles.sub}>Kis role ke liye practice karni hai?</p>
        <div style={styles.rolesGrid}>
          {roles.map(r => (
            <button
              key={r}
              style={styles.roleBtn}
              onClick={() => startInterview(r)}
              disabled={loading}
            >
              {loading ? 'Loading...' : r}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div style={styles.container}><p>Questions load ho rahe hain...</p></div>;
  }

  return (
    <div style={styles.container}>

      <div style={styles.topBar}>
        <span style={styles.roleTag}>{role}</span>
        <span style={styles.progress}>
          Question {currentIndex + 1} / {questions.length}
        </span>
        <span style={{
          ...styles.timerBox,
          background: timer <= 10 ? '#ffe0e0' : '#f0f0f0',
          color: timer <= 10 ? '#cc0000' : '#333'
        }}>
          {timer}s
        </span>
      </div>

      <div style={styles.questionBox}>
        <span style={styles.diffBadge}>
          {questions[currentIndex].difficulty}
        </span>
        <p style={styles.questionText}>{questions[currentIndex].question}</p>
      </div>

      {!feedback && (
        <div style={styles.answerSection}>
          <textarea
            style={styles.textarea}
            placeholder="Apna answer yahan likho ya mic button se bolo..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            rows={5}
          />
          <div style={styles.btnRow}>
            <button
              onClick={startListening}
              style={{
                ...styles.micBtn,
                background: listening ? '#e94560' : '#1a1a2e'
              }}
            >
              {listening ? 'Sun raha hoon...' : 'Mic se Bolo'}
            </button>
            <button
              onClick={submitAnswer}
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'AI soch raha hai...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div style={styles.feedbackBox}>
          <h3 style={styles.feedbackTitle}>AI Feedback</h3>

          <div style={styles.scoresRow}>
            <div style={styles.scoreCard}>
              <p style={styles.scoreNum}>{feedback.score}</p>
              <p style={styles.scoreLabel}>Overall</p>
            </div>
            <div style={styles.scoreCard}>
              <p style={styles.scoreNum}>{feedback.clarity}</p>
              <p style={styles.scoreLabel}>Clarity</p>
            </div>
            <div style={styles.scoreCard}>
              <p style={styles.scoreNum}>{feedback.technical}</p>
              <p style={styles.scoreLabel}>Technical</p>
            </div>
          </div>

          <div style={styles.feedbackText}>
            <p><strong>Feedback:</strong> {feedback.feedback}</p>
            <p><strong>Improvement tip:</strong> {feedback.improvement}</p>
          </div>

          {feedback.keywords_matched?.length > 0 && (
            <div style={styles.keywordsRow}>
              <strong>Keywords matched: </strong>
              {feedback.keywords_matched.map(k => (
                <span key={k} style={styles.keyword}>{k}</span>
              ))}
            </div>
          )}

          <button onClick={nextQuestion} style={styles.nextBtn}>
            {currentIndex + 1 < questions.length ? 'Next Question' : 'Dashboard pe Jao'}
          </button>
        </div>
      )}

    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 20px' },
  title: { fontSize: '28px', color: '#1a1a2e', textAlign: 'center' },
  sub: { color: '#888', textAlign: 'center', marginBottom: '32px' },
  rolesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', maxWidth: '500px', margin: '0 auto' },
  roleBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '20px', borderRadius: '12px', fontSize: '16px', cursor: 'pointer' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  roleTag: { background: '#1a1a2e', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '13px' },
  progress: { color: '#888', fontSize: '14px' },
  timerBox: { padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' },
  questionBox: { background: '#f8f9fa', borderRadius: '12px', padding: '28px', marginBottom: '24px' },
  diffBadge: { background: '#e94560', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' },
  questionText: { fontSize: '20px', color: '#1a1a2e', marginTop: '12px', lineHeight: '1.6' },
  answerSection: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px' },
  textarea: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' },
  btnRow: { display: 'flex', gap: '12px', marginTop: '16px' },
  micBtn: { color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', flex: 1 },
  submitBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', flex: 2 },
  feedbackBox: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '28px' },
  feedbackTitle: { fontSize: '20px', color: '#1a1a2e', marginBottom: '20px' },
  scoresRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' },
  scoreCard: { background: '#f8f9fa', borderRadius: '10px', padding: '16px', textAlign: 'center' },
  scoreNum: { fontSize: '28px', fontWeight: 'bold', color: '#e94560', margin: '0 0 4px' },
  scoreLabel: { fontSize: '12px', color: '#888', margin: 0 },
  feedbackText: { background: '#f8f9fa', borderRadius: '8px', padding: '16px', marginBottom: '16px', lineHeight: '1.7', fontSize: '14px' },
  keywordsRow: { marginBottom: '16px', fontSize: '14px' },
  keyword: { background: '#e8f5e9', color: '#2e7d32', padding: '3px 10px', borderRadius: '20px', marginLeft: '6px', fontSize: '12px' },
  nextBtn: { width: '100%', background: '#1a1a2e', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }
};

export default Interview;
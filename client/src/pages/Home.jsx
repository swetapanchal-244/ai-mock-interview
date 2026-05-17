import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI Mock Interview Platform</h1>
      <p style={styles.sub}>Voice-based interview practice with real-time AI feedback</p>
      <button onClick={() => navigate('/register')} style={styles.btn}>
        Get Started
      </button>
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', marginTop: '100px', padding: '0 20px' },
  title: { fontSize: '42px', color: '#1a1a2e', marginBottom: '16px' },
  sub: { fontSize: '18px', color: '#555', marginBottom: '32px' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '12px 32px', fontSize: '16px', borderRadius: '8px', cursor: 'pointer' }
};

export default Home;
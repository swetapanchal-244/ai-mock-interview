import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div>
          <h2 style={styles.welcome}>Welcome back, {user?.name}!</h2>
          <p style={styles.sub}>Ready for your next interview practice?</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statNum}>0</p>
          <p style={styles.statLabel}>Interviews Done</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNum}>0%</p>
          <p style={styles.statLabel}>Avg Score</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNum}>0</p>
          <p style={styles.statLabel}>Questions Practiced</p>
        </div>
      </div>

      <div style={styles.startSection}>
        <h3 style={styles.startTitle}>Start a New Interview</h3>
        <p style={styles.startSub}>Choose a role and practice with AI feedback</p>

        <div style={styles.rolesRow}>
          {['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack'].map((role) => (
            <button
              key={role}
              style={styles.roleBtn}
              onClick={() => navigate('/interview')}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.historySection}>
        <h3 style={styles.historyTitle}>Recent Sessions</h3>
        <div style={styles.emptyBox}>
          <p style={{ color: '#aaa' }}>Abhi tak koi interview nahi hua. Upar se start karo!</p>
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '32px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  welcome: { fontSize: '26px', color: '#1a1a2e', margin: 0 },
  sub: { color: '#888', marginTop: '4px', fontSize: '14px' },
  logoutBtn: { background: 'transparent', border: '1px solid #e94560', color: '#e94560', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' },
  statCard: { background: '#f8f9fa', borderRadius: '12px', padding: '24px', textAlign: 'center' },
  statNum: { fontSize: '32px', fontWeight: 'bold', color: '#e94560', margin: '0 0 8px' },
  statLabel: { fontSize: '13px', color: '#888', margin: 0 },
  startSection: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '28px', marginBottom: '24px' },
  startTitle: { fontSize: '18px', color: '#1a1a2e', margin: '0 0 8px' },
  startSub: { color: '#888', fontSize: '14px', margin: '0 0 20px' },
  rolesRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  roleBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  historySection: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '28px' },
  historyTitle: { fontSize: '18px', color: '#1a1a2e', margin: '0 0 16px' },
  emptyBox: { textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '8px' }
};

export default Dashboard;
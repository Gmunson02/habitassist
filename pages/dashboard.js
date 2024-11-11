// pages/dashboard.js
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <Layout>
      <div style={styles.container}>
        <h2 style={styles.heading}>Welcome to HabitAssist!</h2>
        
        <Link href="/metrics">
          <a style={{ ...styles.button, backgroundColor: '#3b82f6' }}>View Metrics</a>
        </Link>
        
        <Link href="/metrics/new">
          <a style={{ ...styles.button, backgroundColor: '#10b981' }}>Add New Metric</a>
        </Link>
        
        <div style={styles.message}>
          Track your habits and monitor your progress daily!
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '1rem',
  },
  heading: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  button: {
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    textAlign: 'center',
    width: '100%',
    marginBottom: '0.5rem',
    textDecoration: 'none',
  },
  message: {
    color: '#6b7280',
    marginTop: '1rem',
  },
};

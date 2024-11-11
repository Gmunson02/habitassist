// pages/dashboard.js
import Layout from '../components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference on the client side
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  return (
    <Layout>
      <div style={{ ...styles.container, ...(isDarkMode ? styles.darkContainer : {}) }}>
        <h2 style={styles.heading}>Welcome to HabitAssist!</h2>

        <Link href="/metrics" style={{ ...styles.button, backgroundColor: '#3b82f6' }}>
          View Metrics
        </Link>

        <Link href="/metrics/new" style={{ ...styles.button, backgroundColor: '#10b981' }}>
          Add New Metric
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
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
  },
  darkContainer: {
    backgroundColor: '#181818',
    color: '#f0f0f0',
  },
  heading: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  button: {
    display: 'block',
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

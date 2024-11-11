// pages/metrics/new.js
import Layout from '../../components/Layout';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function NewMetric() {
  const [metricName, setMetricName] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InJlY21ZbGtoWEI2ellCQm1VIiwidXNlcm5hbWUiOiJ0ZXN0dXNlcjIiLCJpYXQiOjE3MzEyODkxMzQsImV4cCI6MTczMTI5MjczNH0.ptT-u_oEj2P8vqV_oVXZHw-fL7tiu9OOHyCcgdwtVaY'; // Replace with actual JWT token for testing

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error messages

    if (!metricName || !unit) {
      setError('Please provide both metric name and unit.');
      return;
    }

    try {
      await axios.post('/api/metrics/addMetric', {
        token,
        metricName,
        unit,
      });
      router.push('/metrics'); // Redirect to the Metrics page on success
    } catch (err) {
      console.error('Error adding metric:', err);
      setError('Failed to add metric. Please try again.');
    }
  };

  return (
    <Layout>
      <h2 style={styles.heading}>Add New Metric</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Metric Name:
          <input
            type="text"
            value={metricName}
            onChange={(e) => setMetricName(e.target.value)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Unit:
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            style={styles.input}
          />
        </label>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Add Metric</button>
      </form>
    </Layout>
  );
}

const styles = {
  heading: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    width: '100%',
    marginBottom: '0.75rem',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    border: '1px solid #d1d5db',
    marginTop: '0.25rem',
  },
  button: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    marginTop: '1rem',
  },
  error: {
    color: '#ef4444',
    marginBottom: '1rem',
  },
};

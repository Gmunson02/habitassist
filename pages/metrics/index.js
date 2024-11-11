// pages/metrics/index.js
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Metrics() {
  const [metrics, setMetrics] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InJlY21ZbGtoWEI2ellCQm1VIiwidXNlcm5hbWUiOiJ0ZXN0dXNlcjIiLCJpYXQiOjE3MzEyODkxMzQsImV4cCI6MTczMTI5MjczNH0.ptT-u_oEj2P8vqV_oVXZHw-fL7tiu9OOHyCcgdwtVaY'; // Replace this with the actual JWT token

  useEffect(() => {
    // Detect dark mode on the client side
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }

    // Fetch metrics
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`/api/metrics/getMetrics?token=${token}`);
        setMetrics(response.data.metrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/metrics/deleteMetric?token=${token}&metricId=${id}`);
      setMetrics(metrics.filter((metric) => metric.id !== id));
    } catch (error) {
      console.error('Error deleting metric:', error);
    }
  };

  return (
    <Layout>
      <h2 style={styles.heading}>Your Metrics</h2>
      <ul style={styles.list}>
        {metrics.map((metric) => (
          <li key={metric.id} style={{ ...styles.metricItem, ...(isDarkMode ? styles.darkMetricItem : {}) }}>
            <span>{metric.metricName}</span>
            <div>
              <Link href={`/metrics/${metric.id}/entries`} style={styles.link}>
                View Entries
              </Link>
              <button style={styles.deleteButton} onClick={() => handleDelete(metric.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Link href="/metrics/new" style={styles.addButton}>Add New Metric</Link>
    </Layout>
  );
}

const styles = {
  heading: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    width: '100%',
  },
  metricItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: '1rem',
    borderRadius: '0.25rem',
    marginBottom: '0.5rem',
  },
  darkMetricItem: {
    backgroundColor: '#2e2e2e',
    color: '#f0f0f0',
  },
  link: {
    color: '#3b82f6',
    marginRight: '0.5rem',
  },
  deleteButton: {
    color: '#ef4444',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  addButton: {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    marginTop: '1rem',
    textDecoration: 'none',
  },
};

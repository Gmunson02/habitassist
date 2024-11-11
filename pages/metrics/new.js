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
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InJlY21ZbGtoWEI2ellCQm1VIiwidXNlcm5hbWUiOiJ0ZXN0dXNlcjIiLCJpYXQiOjE3MzEyODkxMzQsImV4cCI6MTczMTI5MjczNH0.ptT-u_oEj2P8vqV_oVXZHw-fL7tiu9OOHyCcgdwtVaY'; // Replace with actual token

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      router.push('/metrics');
    } catch (err) {
      console.error('Error adding metric:', err);
      setError('Failed to add metric. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="text-xl font-semibold mb-4">Add New Metric</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="flex flex-col">
            Metric Name:
            <input
              type="text"
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              className="p-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
            />
          </label>
          <label className="flex flex-col">
            Unit:
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="p-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
            />
          </label>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Add Metric
          </button>
        </form>
      </div>
    </Layout>
  );
}

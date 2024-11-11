// pages/metrics/new.js

import { useState } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function NewMetric() {
  const [metricName, setMetricName] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Retrieve token from local storage and verify it
    const token = localStorage.getItem('token');
    console.log("Token retrieved from localStorage:", token); // Debugging line

    if (!token) {
      setError("Authorization token is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        '/api/metrics/addMetric',
        { metricName, unit },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the token in the Authorization header
          },
        }
      );
      console.log("Metric successfully added:", response.data);

      // Redirect to the metrics page after successful creation
      router.push('/metrics');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Authorization failed. Please log in again.');
      } else {
        setError('Error adding metric. Please try again.');
      }
      console.error('Error adding metric:', err);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Metric</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block mb-1">Metric Name</label>
          <input
            type="text"
            value={metricName}
            onChange={(e) => setMetricName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Unit (e.g., lbs, hours)</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Metric
        </button>
      </form>
    </Layout>
  );
}

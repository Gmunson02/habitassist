// pages/dailyEntry.js
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function DailyEntry() {
  const [metrics, setMetrics] = useState([]);
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('/api/metrics/getMetrics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(response.data.metrics);
      } catch (error) {
        setError('Error fetching metrics');
      }
    };

    fetchMetrics();
  }, []);

  const handleEntryChange = (metricId, value) => {
    setEntries((prevEntries) => ({
      ...prevEntries,
      [metricId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated');
      return;
    }

    // Prepare entries array from entries state
    const entriesArray = Object.entries(entries).map(([metricId, value]) => ({
      metricId,
      entryDate: date,
      value,
    }));

    try {
      // Send entries array to the backend
      await axios.post(
        '/api/metrics/addEntry',
        { entries: entriesArray },  // Ensure this format matches what the API expects
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Entries added successfully!');
      setEntries({}); // Clear entries after successful submission
      router.push('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      setError('Error adding entries');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-center mb-2">
        Daily Entry - {new Date().toLocaleDateString()}
      </h2>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => router.push('/profile')}
          className="text-blue-500 hover:underline"
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Date</label>
          <input
            type="date"
            value={date}
            readOnly
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {metrics.map((metric) => (
          <div key={metric.id}>
            <label className="block mb-1 font-semibold">{metric.metricName}</label>
            <input
              type="number"
              placeholder={`Enter value for ${metric.metricName}`}
              value={entries[metric.id] || ''}
              onChange={(e) => handleEntryChange(metric.id, e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit Entries
        </button>
      </form>

      <button
        onClick={() => router.push('/dashboard')}
        className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
      >
        Back to Dashboard
      </button>
    </Layout>
  );
}

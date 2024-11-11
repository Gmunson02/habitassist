// pages/metrics/[metricId]/newEntry.js
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function NewEntry() {
  const [metricName, setMetricName] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { metricId } = router.query;

  useEffect(() => {
    const fetchMetricName = async () => {
      if (metricId) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`/api/metrics/getMetricById?metricId=${metricId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMetricName(response.data.metricName || 'Metric');
        } catch (error) {
          console.error("Error fetching metric name:", error);
          setMetricName('Metric'); // Fallback if fetch fails
        }
      }
    };

    fetchMetricName();
  }, [metricId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    try {
      await axios.post(
        '/api/metrics/addEntry',
        { metricId, value, entryDate: date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push(`/metrics/${metricId}/entries`);
    } catch (error) {
      console.error("Error adding entry:", error);
      setError('Error adding entry. Please try again.');
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4 text-center">Add New Entry for {metricName}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block mb-1 dark:text-gray-300">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block mb-1 dark:text-gray-300">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Entry
        </button>
      </form>
    </Layout>
  );
}

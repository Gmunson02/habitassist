// pages/metrics/[metricId]/entries.js
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [metricName, setMetricName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { metricId } = router.query;

  useEffect(() => {
    const fetchEntries = async () => {
      const token = localStorage.getItem('token');

      if (token && metricId) {
        try {
          // Fetch the metric name
          const metricResponse = await axios.get(`/api/metrics/getMetricById?metricId=${metricId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMetricName(metricResponse.data.metricName);

          // Fetch entries
          const response = await axios.get(`/api/metrics/getEntries?metricId=${metricId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEntries(response.data.entries);
        } catch (error) {
          console.error("Error fetching entries:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEntries();
  }, [metricId]);

  const handleDelete = async (entryId) => {
    const token = localStorage.getItem('token');

    try {
      // Pass entryId as a query parameter instead of in data
      await axios.delete(`/api/metrics/deleteEntry?entryId=${entryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(entries.filter((entry) => entry.id !== entryId));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4 text-center">Entries for {metricName}</h2>

      {loading ? (
        <p>Loading entries...</p>
      ) : entries.length > 0 ? (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li key={entry.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <p>
                <span className="font-semibold">Date:</span> {entry.entryDate}
              </p>
              <p>
                <span className="font-semibold">Value:</span> {entry.value} {entry.unit}
              </p>
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete Entry
                </button>
                <Link
                  href={`/metrics/${metricId}/updateEntry?entryId=${entry.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Update Entry
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No entries found for this metric.</p>
      )}

      {/* Navigation Links */}
      <div className="flex flex-col space-y-4 mt-6">
        <Link href="/dashboard" className="block w-full bg-blue-500 text-white py-2 rounded text-center hover:bg-blue-600">
          Back to Dashboard
        </Link>
        <Link href={`/metrics/${metricId}/newEntry`} className="block w-full bg-green-500 text-white py-2 rounded text-center hover:bg-green-600">
          Add New Entry
        </Link>

      </div>
    </Layout>
  );
}

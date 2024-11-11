// pages/metrics/[metricId]/entries.js
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state to manage loading text
  const router = useRouter();
  const { metricId } = router.query;

  useEffect(() => {
    const fetchEntries = async () => {
      const token = localStorage.getItem('token');

      if (token && metricId) {
        try {
          const response = await axios.get(`/api/metrics/getEntries?metricId=${metricId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEntries(response.data.entries);
        } catch (error) {
          console.error("Error fetching entries:", error);
        } finally {
          setLoading(false); // Ensure loading is set to false after the API call
        }
      } else {
        setLoading(false); // Stop loading if there's no token or metricId
      }
    };

    fetchEntries();
  }, [metricId]);

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4 text-center">Entries for Metric</h2>

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
            </li>
          ))}
        </ul>
      ) : (
        <p>No entries found for this metric.</p>
      )}

      {/* Navigation Links */}
      <div className="flex flex-col space-y-4 mt-6">
        <Link href="/metrics" className="block w-full bg-blue-500 text-white py-2 rounded text-center hover:bg-blue-600">
          Back to Metrics
        </Link>
        <Link href={`/metrics/${metricId}/new-entry`} className="block w-full bg-green-500 text-white py-2 rounded text-center hover:bg-green-600">
          Add New Entry
        </Link>
      </div>
    </Layout>
  );
}

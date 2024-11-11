// pages/dashboard.js
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const metricsResponse = await axios.get('/api/metrics/getMetrics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(metricsResponse.data.metrics);

        const entriesResponse = await axios.get('/api/metrics/getEntries', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 5 },
        });
        setRecentEntries(entriesResponse.data.entries);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome to your dashboard</h2>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          {/* Metrics Summary */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold">Your Metrics</h3>
            {metrics.length > 0 ? (
              <ul className="space-y-4">
                {metrics.map((metric) => (
                  <li key={metric.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
                    <span className="font-semibold">{metric.metricName}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400"> ({metric.unit})</span>
                    <Link href={`/metrics/${metric.id}/entries`} className="ml-4 text-blue-500 hover:underline">
                      View Entries
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No metrics found.{' '}
                <Link href="/metrics/new" className="text-blue-500 hover:underline">
                  Add your first metric
                </Link>
              </p>
            )}
          </div>

          {/* Recent Entries */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold">Recent Entries</h3>
            {recentEntries.length > 0 ? (
              <ul className="space-y-4">
                {recentEntries.map((entry) => (
                  <li key={entry.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
                    <p>
                      <span className="font-semibold">{entry.metricName}</span> on {entry.entryDate}: {entry.value} {entry.unit}
                    </p>
                    <Link href={`/metrics/${entry.metricId}/entries`} className="text-blue-500 hover:underline">
                      View All Entries
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No recent entries found.{' '}
                <Link href="/metrics/new" className="text-blue-500 hover:underline">
                  Add an entry
                </Link>
              </p>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-4">
            <Link href="/metrics/new" className="block w-full bg-green-500 text-white py-2 rounded text-center hover:bg-green-600">
              Add New Metric
            </Link>
            <Link href="/metrics" className="block w-full bg-blue-500 text-white py-2 rounded text-center hover:bg-blue-600">
              View All Metrics
            </Link>
          </div>
        </>
      )}
    </Layout>
  );
}

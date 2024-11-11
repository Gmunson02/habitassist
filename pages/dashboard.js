// pages/dashboard.js
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await axios.get('/api/auth/getProfile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileResponse.data.profile);

        // Fetch metrics
        const metricsResponse = await axios.get('/api/metrics/getMetrics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const metricsData = metricsResponse.data.metrics;
        setMetrics(metricsData);

        // Fetch recent entries
        const entriesResponse = await axios.get('/api/metrics/getEntries', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 5 },
        });

        // Enrich entries with metric name and unit
        const enrichedEntries = entriesResponse.data.entries.map((entry) => {
          const metric = metricsData.find((m) => m.id === entry.metricId);
          return {
            ...entry,
            metricName: metric ? metric.metricName : 'Unnamed Metric',
            unit: metric ? metric.unit : '',
          };
        });

        setRecentEntries(enrichedEntries);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [router]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center">
          Welcome {user.firstName} {user.lastName} to Your Habit Assist Dashboard
        </h2>
        <div className="flex justify-center space-x-4 mt-4">
          <Link href="/profile" className="text-blue-500 hover:underline">
            Profile
          </Link>
          <button onClick={handleLogout} className="text-red-500 hover:underline">
            Logout
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold">Your Metrics</h3>
        {metrics.length > 0 ? (
          <ul className="space-y-4">
            {metrics.map((metric) => (
              <li key={metric.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{metric.metricName}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400"> ({metric.unit})</span>
                  </div>
                  <div className="flex space-x-4">
                    <Link href={`/metrics/${metric.id}/entries`} className="text-blue-500 hover:underline">
                      View Entries
                    </Link>
                    <Link href={`/metrics/${metric.id}/newEntry`} className="text-green-500 hover:underline">
                      Add New Entry
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No metrics found. <Link href="/metrics/new" className="text-blue-500 hover:underline">Add a new metric</Link>
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
                <p className="font-semibold">{new Date(entry.entryDate).toLocaleDateString()}</p>
                <p>
                  <span className="font-semibold">{entry.metricName}:</span> {entry.value} {entry.unit}
                </p>
                <Link href={`/metrics/${entry.metricId}/entries`} className="text-blue-500 hover:underline">
                  View All Entries
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No recent entries found.</p>
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
    </Layout>
  );
}

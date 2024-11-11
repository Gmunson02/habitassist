// pages/dashboard.js
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { checkAuth } from '../utils/auth';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("Dashboard useEffect triggered");

    const userIsAuthenticated = checkAuth();
    if (userIsAuthenticated) {
      setIsAuthenticated(true);

      // Fetch metrics data after confirming authentication
      const fetchMetrics = async () => {
        try {
          const token = localStorage.getItem('token'); // Retrieve token
          const response = await axios.get('/api/metrics/getMetrics', {
            headers: { Authorization: `Bearer ${token}` } // Attach token as Bearer
          });
          setMetrics(response.data.metrics); // Assuming response contains a 'metrics' array
          console.log("Fetched metrics data:", response.data);
        } catch (err) {
          console.error("Error fetching metrics:", err);
          setError("Unable to load metrics. Please try again.");
        }
      };

      fetchMetrics();
    } else {
      console.warn("User not authenticated, redirecting to login");
    }
  }, []);

  if (!isAuthenticated) {
    return null; // Render nothing if user is not authenticated
  }

  return (
    <Layout>
      <div className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {metrics.length > 0 ? (
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow"
              >
                <h3 className="text-lg font-semibold">{metric.metricName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unit: {metric.unit}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No metrics to display.
          </p>
        )}
      </div>
    </Layout>
  );
}

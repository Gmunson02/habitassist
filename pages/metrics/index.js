// pages/metrics/index.js
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

export default function Metrics() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axiosInstance.get('/api/metrics/getMetrics');
        setMetrics(response.data.metrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <Layout>
      <div className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="text-xl font-semibold mb-4">Your Metrics</h2>
        <ul className="space-y-4">
          {metrics.map((metric) => (
            <li
              key={metric.id}
              className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
              <span>{metric.metricName}</span>
              <div>
                <Link href={`/metrics/${metric.id}/entries`} className="text-blue-500 hover:text-blue-600 mr-4">
                  View Entries
                </Link>
                <button
                  onClick={() => handleDelete(metric.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/metrics/new" className="block w-full bg-green-500 text-white py-2 mt-4 rounded text-center hover:bg-green-600">
          Add New Metric
        </Link>
      </div>
    </Layout>
  );
}

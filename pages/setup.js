// pages/setup.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Setup() {
  const [metrics, setMetrics] = useState([{ metricName: '', unit: '' }]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleMetricChange = (index, field, value) => {
    setMetrics((prevMetrics) =>
      prevMetrics.map((metric, i) =>
        i === index ? { ...metric, [field]: value } : metric
      )
    );
  };

  const handleAddMetricField = () => {
    setMetrics((prevMetrics) => [...prevMetrics, { metricName: '', unit: '' }]);
  };

  const handleRemoveMetricField = (index) => {
    setMetrics((prevMetrics) => prevMetrics.filter((_, i) => i !== index));
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

    try {
      // Filter out any empty metrics (in case the user added an extra field and left it blank)
      const nonEmptyMetrics = metrics.filter(
        (metric) => metric.metricName && metric.unit
      );

      // Submit all metrics in one API call
      await Promise.all(
        nonEmptyMetrics.map((metric) =>
          axios.post(
            '/api/metrics/addMetric',
            metric,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      setSuccess('Metrics added successfully!');
      setMetrics([{ metricName: '', unit: '' }]); // Reset form fields
      router.push('/dashboard'); // Redirect to the dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding metrics');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-100">Setup Your Metrics</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div>
                <label className="block mb-1 dark:text-gray-300">Metric Name</label>
                <input
                  type="text"
                  value={metric.metricName}
                  onChange={(e) => handleMetricChange(index, 'metricName', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 dark:text-gray-300">Unit</label>
                <input
                  type="text"
                  value={metric.unit}
                  onChange={(e) => handleMetricChange(index, 'unit', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  required
                />
              </div>
              {metrics.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMetricField(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddMetricField}
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 mt-4"
          >
            Add Another Metric
          </button>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-4"
          >
            Save Metrics and Continue
          </button>
        </form>
      </div>
    </div>
  );
}

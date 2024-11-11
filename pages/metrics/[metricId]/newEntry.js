// pages/metrics/[metricId]/new-entry.js
import { useState } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function NewEntry() {
  const router = useRouter();
  const { metricId } = router.query;
  const [entryDate, setEntryDate] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');

    if (!token) {
      setError('You must be logged in to add an entry.');
      return;
    }

    try {
      await axios.post(
        '/api/metrics/addEntry',
        { metricId, entryDate, value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Entry added successfully!');
      setValue('');
      setEntryDate('');
      // Optionally redirect to the entries page for this metric
      setTimeout(() => router.push(`/metrics/${metricId}/entries`), 1000);
    } catch (err) {
      setError('Failed to add entry. Please try again.');
      console.error("Error adding entry:", err);
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4 text-center">Add New Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 dark:text-gray-300">Date</label>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
        </div>
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
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Entry
        </button>
      </form>

      <button
        onClick={() => router.push(`/metrics/${metricId}/entries`)}
        className="w-full bg-gray-500 text-white py-2 mt-4 rounded text-center hover:bg-gray-600"
      >
        Back to Entries
      </button>
    </Layout>
  );
}

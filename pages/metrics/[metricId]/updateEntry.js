// pages/metrics/[metricId]/updateEntry.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import axios from 'axios';

export default function UpdateEntry() {
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { metricId, entryId } = router.query;

  useEffect(() => {
    // Fetch the entry data based on entryId
    const fetchEntryData = async () => {
      if (entryId) {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`/api/metrics/getEntries?entryId=${entryId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const entry = response.data.entries[0]; // Access the first (and only) entry returned
          setDate(entry.entryDate);
          setValue(entry.value);
        } catch (error) {
          console.error("Error fetching entry data:", error);
        }
      }
    };

    fetchEntryData();
  }, [entryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const token = localStorage.getItem('token');
  
    try {
      await axios.put(
        '/api/metrics/updateEntry',
        {
          entryId,
          value: Number(value), // Convert to number to match Airtable's expected data type
          entryDate: date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push(`/metrics/${metricId}/entries`);
    } catch (error) {
      console.error("Error updating entry:", error); // Log full error details
      setError('Error updating entry. Please try again.');
    }
  };
  
  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4 text-center">Update Entry</h2>
      
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
          Update Entry
        </button>
      </form>
    </Layout>
  );
}

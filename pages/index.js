// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const initializeApp = async () => {
      try {
        // Step 1: Check if metrics are set up
        const metricsResponse = await axios.get('/api/metrics/getMetrics', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (metricsResponse.data.metrics.length === 0) {
          // Redirect to setup page if no metrics are set up
          router.push('/setup');
          return;
        }

        // Step 2: Check if a daily entry exists
        const entryResponse = await axios.get(`/api/entries/checkDailyEntry`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (entryResponse.data.hasEntryForToday) {
          router.push('/dashboard');
        } else {
          router.push('/dailyEntry');
        }
      } catch (error) {
        console.error("Error during initialization:", error);
        router.push('/dashboard'); // Default to dashboard if any error occurs
      }
    };

    initializeApp();
  }, [router]);

  return <p>Loading...</p>;
}

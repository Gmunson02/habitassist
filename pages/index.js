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

    const checkDailyEntry = async () => {
      try {
        const response = await axios.get(`/api/entries/checkDailyEntry`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("Daily entry check response:", response.data); // Log API response

        if (response.data.hasEntryForToday) {
          router.push('/dashboard');
        } else {
          router.push('/dailyEntry');
        }
      } catch (error) {
        console.error("Error checking daily entry status:", error);
        router.push('/dashboard');
      }
    };

    checkDailyEntry();
  }, [router]);

  return <p>Loading...</p>;
}

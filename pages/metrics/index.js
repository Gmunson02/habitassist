// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // If token exists, redirect to the dashboard
      router.push('/dashboard');
    } else {
      // Otherwise, redirect to the login page
      router.push('/login');
    }
  }, [router]);

  // Optional loading text while the redirection is in progress
  return <p>Loading...</p>;
}

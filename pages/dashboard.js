import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <Layout>
      <div className="flex flex-col items-center text-center p-4 bg-gray-100 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <h2 className="text-xl font-semibold mb-4">Welcome to HabitAssist!</h2>
        {/* Dashboard Content Here */}
      </div>
    </Layout>
  );
}

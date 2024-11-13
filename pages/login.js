import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log("Starting login process...");

    try {
      // Step 1: Authenticate user and retrieve JWT token
      console.log("Sending login request...");
      const response = await axios.post('/api/auth/login', { username, password });
      const token = response.data.token;
      console.log("Login successful, received token:", token);

      // Store the token in localStorage for future requests
      localStorage.setItem('token', token);

      // Step 2: Check if the user has entered data for today
      console.log("Checking daily entry status...");
      const entryCheckResponse = await axios.get('/api/entries/checkDailyEntry', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { hasEntryForToday } = entryCheckResponse.data;
      console.log("Daily entry status received:", hasEntryForToday);

      // Step 3: Redirect based on whether an entry exists for today
      if (hasEntryForToday) {
        console.log("Redirecting to dashboard...");
        router.push('/dashboard');
      } else {
        console.log("Redirecting to daily entry page...");
        router.push('/dailyEntry');
      }

    } catch (err) {
      console.error("Error during login or daily entry check:", err);
      setError(err.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-100">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 dark:text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block mb-1 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

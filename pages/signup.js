// pages/signup.js
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    age: '',
    sex: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Convert `age` field to a number
    const formattedData = {
      ...formData,
      age: Number(formData.age), // Convert age to a number
    };

    try {
      const response = await axios.post('/api/auth/signup', formattedData);
      const token = response.data.token;

      // Store the token in localStorage and redirect to the dashboard
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating user');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-100">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 dark:text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block mb-1 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block mb-1 dark:text-gray-300">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block mb-1 dark:text-gray-300">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block mb-1 dark:text-gray-300">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block mb-1 dark:text-gray-300">Sex</label>
            <input
              type="text"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline dark:text-blue-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

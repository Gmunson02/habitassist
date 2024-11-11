// pages/profile.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Profile() {
  const [userInfo, setUserInfo] = useState({
    username: '',
    firstName: '',
    lastName: '',
    age: '',
    sex: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get('/api/auth/getProfile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data.profile || {});
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError('Error loading profile information');
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const updatedInfo = { ...userInfo, age: Number(userInfo.age) };

    try {
      const response = await axios.put(
        '/api/auth/updateProfile',
        { userInfo: updatedInfo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (error) {
      console.error("Error updating profile:", error);
      setError('Error updating profile');
      setSuccess('');
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form className="space-y-4">
        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            value={userInfo.username}
            onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            disabled
          />
        </div>
        <div>
          <label className="block mb-1">First Name</label>
          <input
            type="text"
            value={userInfo.firstName || ''}
            onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1">Last Name</label>
          <input
            type="text"
            value={userInfo.lastName || ''}
            onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1">Age</label>
          <input
            type="number"
            value={userInfo.age || ''}
            onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1">Sex</label>
          <select
            value={userInfo.sex || ''}
            onChange={(e) => setUserInfo({ ...userInfo, sex: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="" disabled>Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <button
          type="button"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </form>
      
      {/* Return to Dashboard Button */}
      <button
        type="button"
        className="w-full bg-gray-500 text-white py-2 rounded mt-4 hover:bg-gray-600"
        onClick={() => router.push('/dashboard')}
      >
        Return to Dashboard
      </button>
    </div>
  );
}

// utils/auth.js
import Router from 'next/router';

export const checkAuth = () => {
  console.log("checkAuth function called");

  if (typeof window !== 'undefined') {
    // Retrieve token directly without any parsing
    const token = localStorage.getItem('token');
    console.log("Token from localStorage in checkAuth:", token);

    if (!token) {
      console.warn("Token is missing, redirecting to login");
      Router.push('/login');
      return null;
    }

    console.log("Token format looks correct, token is present");
    return true;
  } else {
    console.warn("Window is undefined (likely server-side render)");
  }
};

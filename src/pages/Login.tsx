import React from "react";

const GOOGLE_AUTH_URL = "/api/auth/google"; // This will be proxied to your backend

const Login: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Sign in to Tamil Catholic Platform
        </h2>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2">
            <g>
              <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 3l6.1-6.1C34.5 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.5-.3-3.5z"/>
              <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c3.1 0 5.9 1.1 8.1 3l6.1-6.1C34.5 5.1 29.6 3 24 3c-7.2 0-13.4 3.6-17.1 9.2l6.4 2.5z"/>
              <path fill="#FBBC05" d="M24 43c5.4 0 10-1.8 13.3-4.9l-6.2-5.1c-2.1 1.4-4.8 2.2-7.1 2.2-5.6 0-10.3-3.8-12-9l-6.6 5.1C8.6 39.4 15.7 43 24 43z"/>
              <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-3.5 5.4-6.3 6.9l6.2 5.1C39.7 39.2 44 33.7 44 24c0-1.3-.1-2.5-.4-3.5z"/>
            </g>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
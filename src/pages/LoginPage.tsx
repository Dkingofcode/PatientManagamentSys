import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import Logo from '../assets/prisms_logo_.png'; // 

function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRoutes = {
        'front-desk': '/front-desk',
        'doctor': '/doctor',
        'lab-technician': '/lab-technician',
        'admin': '/admin',
        'patient': '/patient',
      };
      navigate(roleRoutes[user.role as keyof typeof roleRoutes]);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ identifier, password }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-white">
        <div className="max-w-md w-full mx-auto">

          {/* 🔺 Logo and Heading */}
         <div className="mb-8 flex items-center gap-4">
  <img
    src={Logo}
    alt="PRISMS Healthcare Logo"
    className="h-16 w-auto"
    style={{ objectFit: 'contain' }}
  />
 
</div>


          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                Username, Email, or User ID
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="username, email, or ID"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can use your username, email address, or unique user ID
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* 🔺 Colored Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: 'rgb(128, 0, 163)', color: '#fff' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>


          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact IT Support at{' '}
              <a href="mailto:support@hospital.com" className="text-blue-600 hover:text-blue-800">
                support@hospital.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;

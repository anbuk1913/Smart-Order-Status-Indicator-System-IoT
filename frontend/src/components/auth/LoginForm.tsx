import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login({ username, password });
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-red-600 px-4 sm:px-6 py-8 sm:py-12 pattern-bg animate-fadeIn">
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl xl:text-6xl animate-bounce delay-100">🍳</div>
        <div className="absolute top-40 right-20 text-3xl xl:text-5xl animate-bounce delay-300">👨‍🍳</div>
        <div className="absolute bottom-20 left-20 text-4xl xl:text-6xl animate-bounce delay-500">🍽️</div>
        <div className="absolute bottom-40 right-10 text-3xl xl:text-5xl animate-bounce delay-200">🔥</div>
      </div>

      <div className="card w-[90%] sm:w-full max-w-md mx-auto animate-scaleIn relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-3 sm:mb-4 shadow-lg animate-pulse">
            <span className="text-3xl sm:text-4xl">👨‍🍳</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gradient mb-2">
            Chef Dashboard
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-2">Welcome back! Please login to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Username Field */}
          <div className="form-group">
            <label className="form-label form-label-required">
              👤 Username
            </label>
            <div className="form-input-group">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter your username"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label form-label-required">
              🔐 Password
            </label>
            <div className="form-input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-card animate-shake">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">⚠️</span>
                <span className="text-sm sm:text-base text-red-800 font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary w-full btn-lg btn-ripple ${loading ? 'btn-loading' : ''}`}
          >
            {loading ? '' : '🚀 Login to Dashboard'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
          <p>🔒 Secure Chef Portal</p>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FilmIcon } from 'lucide-react';

type FormMode = 'login' | 'signup';

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { state, login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    } else {
      await signup(email, username, password);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    // Reset form state
    setEmail('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-amber-500 p-3 rounded-full">
              <FilmIcon size={36} className="text-gray-900" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Movie Memo Pad</h1>
          <p className="text-gray-400">Keep track of your movie journey</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          {state.error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {state.error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {mode === 'signup' && (
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={state.isLoading}
              className="w-full bg-amber-500 text-white font-medium py-2 px-4 rounded-md hover:bg-amber-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {state.isLoading
                ? 'Loading...'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-amber-600 hover:text-amber-700 font-medium focus:outline-none"
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>

          {mode === 'login' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => login('demo@example.com', 'password')}
                className="w-full bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-200 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Try Demo Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
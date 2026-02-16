import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-pearl dark:bg-primary flex items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-primary-light rounded-lg shadow-lg p-8 transition-colors">
          <div className="flex justify-center mb-8">
            <div className="bg-primary dark:bg-gold p-3 rounded-lg">
              <Building2 className="w-8 h-8 text-white dark:text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-primary dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Get started with property management
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-primary dark:text-white mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-primary text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold transition-colors"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary dark:text-white mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-primary text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold transition-colors"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary dark:text-white mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-primary text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary dark:bg-gold text-white dark:text-primary font-semibold py-4 px-6 rounded-lg hover:bg-primary-light dark:hover:bg-gold-light transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-gold dark:text-gold-light font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

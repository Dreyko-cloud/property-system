import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmation is disabled in Supabase, user is logged in immediately
    if (data.user && data.session) {
      navigate('/dashboard');
    } else {
      // Email confirmation required
      setSuccess(true);
    }
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
            Get started with your property manager
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-lg">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                Account created! Check your email to confirm your address, then sign in.
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-primary dark:bg-gold text-white dark:text-primary font-semibold py-3 px-6 rounded-lg hover:bg-primary-light transition-colors"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-primary dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Manager"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-primary text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary dark:text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-primary text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary dark:text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-primary text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary dark:text-white mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-primary text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary dark:bg-gold text-white dark:text-primary font-semibold py-4 px-6 rounded-lg hover:bg-primary-light dark:hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {!success && (
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
          )}
        </div>
      </div>
    </div>
  );
}
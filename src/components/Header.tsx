import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-primary-light border-b border-gray-200 dark:border-gray-700 h-16 fixed top-0 right-0 left-64 transition-colors z-10">
      <div className="h-full px-6 flex items-center justify-end gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-primary transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun className="w-5 h-5 text-gray-400" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-primary transition-colors"
          >
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-primary dark:text-white">
              John Doe
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-primary-light border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 transition-colors">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-primary transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

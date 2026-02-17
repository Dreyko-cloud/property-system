import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const name = data.user.user_metadata?.full_name || data.user.email || 'User';
        setUserName(name);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-primary-light border-b border-gray-200 dark:border-gray-700 h-16 fixed top-0 right-0 left-0 md:left-64 transition-colors z-10">
      <div className="h-full px-4 md:px-6 flex items-center justify-between md:justify-end gap-4">

        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-primary transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
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

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-primary transition-colors"
            >
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-primary dark:text-white max-w-[120px] truncate">
                {userName}
              </span>
            </button>

            {showUserMenu && (
              <>
                {/* Backdrop to close menu */}
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-primary-light border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-20">
                  {/* Show name on mobile since it's hidden in button */}
                  {userName && (
                    <div className="sm:hidden px-4 py-2 text-sm font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 mb-1 truncate">
                      {userName}
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
import { useState } from 'react';
import { LayoutDashboard, FileText, Bell, Settings, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full z-10 transition-colors duration-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center ml-2 lg:ml-0">
                <LayoutDashboard className="text-blue-600 dark:text-blue-400" size={28} />
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">PropertyHub</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-16 lg:pt-0 transition-all duration-300`}
        >
          <nav className="mt-5 px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-all duration-200`}
                >
                  <Icon
                    className={`${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                    } mr-3 flex-shrink-0`}
                    size={20}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10 pt-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

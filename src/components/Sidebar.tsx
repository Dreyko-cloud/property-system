import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard,
  FileText, Bell, Settings, X,
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/units',     icon: Building2,       label: 'Units' },
  { path: '/tenants',   icon: Users,           label: 'Tenants' },
  { path: '/payments',  icon: CreditCard,      label: 'Payments' },
  { path: '/reports',   icon: FileText,        label: 'Reports' },
  { path: '/reminders', icon: Bell,            label: 'Reminders' },
  { path: '/settings',  icon: Settings,        label: 'Settings' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen z-30 w-64
        bg-white dark:bg-primary-light
        border-r border-gray-200 dark:border-gray-700
        flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        {/* Logo + close button */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary dark:bg-gold p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-white dark:text-primary" />
            </div>
            <span className="text-lg font-bold text-primary dark:text-white">
              Property Manager
            </span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-primary transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gold/10 text-gold dark:bg-gold/20 dark:text-gold-light font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-primary'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
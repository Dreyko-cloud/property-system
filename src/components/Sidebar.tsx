import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard,
  FileText, Bell, Settings,
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

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-primary-light border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 transition-colors flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary dark:bg-gold p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-white dark:text-primary" />
          </div>
          <span className="text-xl font-bold text-primary dark:text-white">
            Property Manager
          </span>
        </div>

        {/* Nav links */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gold/10 text-gold dark:bg-gold/20 dark:text-gold-light'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-primary'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
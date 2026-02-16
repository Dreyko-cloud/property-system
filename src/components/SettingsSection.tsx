import { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>
        {description && <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>}
      </div>
      {children}
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Image as ImageIcon, Palette } from 'lucide-react';
import { AdminSettingsPage } from './AdminSettingsPage';
import { StatementSettingsTab } from '../../components/admin/tabs/StatementSettingsTab';
import ThemeManager from './ThemeManager';

export function AdminSettingsWrapper() {
  const [activeTab, setActiveTab] = useState<'general' | 'statements' | 'theme'>('general');

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-secondary-100 dark:bg-secondary-800 p-1 rounded-xl w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'general'
              ? 'bg-white dark:bg-secondary-900 text-primary-900 dark:text-white shadow-sm'
              : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" /> General Settings
        </button>
        <button
          onClick={() => setActiveTab('statements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'statements'
              ? 'bg-white dark:bg-secondary-900 text-primary-900 dark:text-white shadow-sm'
              : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-900 dark:hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Statement Branding
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'theme'
              ? 'bg-white dark:bg-secondary-900 text-primary-900 dark:text-white shadow-sm'
              : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-900 dark:hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" /> Theme Manager
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'general' ? (
            <AdminSettingsPage />
          ) : activeTab === 'statements' ? (
            <StatementSettingsTab />
          ) : (
            <ThemeManager />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

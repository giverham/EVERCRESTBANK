import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Wallet, ArrowLeftRight, FileText, CreditCard,
  Bell, Settings, BarChart3, ScrollText, ShieldCheck, Palette, Image,
  Database, Menu, X, LogOut, Moon, Sun, ChevronDown, PanelLeftClose, PanelLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { siteConfig } from '../../config/siteConfig';

const navSections = [
  {
    label: 'Banking',
    items: [
      { label: 'Dashboard', href: '/admin-giver/dashboard', icon: LayoutDashboard },
      { label: 'Customers', href: '/admin-giver/dashboard/customers', icon: Users },
      { label: 'Accounts', href: '/admin-giver/dashboard/accounts', icon: Wallet },
      { label: 'Transactions', href: '/admin-giver/dashboard/transactions', icon: ArrowLeftRight },
      { label: 'Statements', href: '/admin-giver/dashboard/statements', icon: FileText },
      { label: 'Cards', href: '/admin-giver/dashboard/cards', icon: CreditCard },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Website CMS', href: '/admin-giver/dashboard/cms', icon: Database },
      { label: 'Media Library', href: '/admin-giver/dashboard/media', icon: Image },
      { label: 'Theme', href: '/admin-giver/dashboard/theme', icon: Palette },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Notifications', href: '/admin-giver/dashboard/notifications', icon: Bell },
      { label: 'Reports', href: '/admin-giver/dashboard/reports', icon: BarChart3 },
      { label: 'Settings', href: '/admin-giver/dashboard/settings', icon: Settings },
      { label: 'Audit Logs', href: '/admin-giver/dashboard/audit-logs', icon: ScrollText },
      { label: 'Roles', href: '/admin-giver/dashboard/roles', icon: ShieldCheck },
    ],
  },
];

export function AdminDashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarWidth = collapsed ? 'lg:w-20' : 'lg:w-64';
  const mainMargin = collapsed ? 'lg:ml-20' : 'lg:ml-64';

  const renderNav = (onNavigate?: () => void) => (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
      {navSections.map((section) => (
        <div key={section.label}>
          <p className={`px-4 mb-2 text-[10px] font-bold uppercase tracking-wider text-accent-500/70 ${collapsed ? 'lg:hidden' : ''}`}>
            {section.label}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    collapsed ? 'lg:justify-center lg:px-0' : ''
                  } ${
                    isActive
                      ? 'bg-accent-500 text-white shadow-premium'
                      : 'text-secondary-300 hover:bg-primary-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950 flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex ${sidebarWidth} flex-col fixed inset-y-0 left-0 bg-primary-900 dark:bg-primary-950 z-40 transition-all duration-300`}>
        <div className={`p-6 border-b border-primary-800 ${collapsed ? 'lg:px-4' : ''}`}>
          <Link to="/" className="flex items-center gap-3">
            <img src={siteConfig.logoUrl} alt={siteConfig.bankName} className="w-9 h-9 rounded-lg shrink-0" />
            <div className={collapsed ? 'lg:hidden' : ''}>
              <span className="font-serif font-bold text-white text-lg block">{siteConfig.bankName}</span>
              <span className="text-[10px] text-accent-400 uppercase tracking-wider">Admin Console</span>
            </div>
          </Link>
        </div>
        {renderNav()}
        <div className="p-3 border-t border-primary-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary-300 hover:bg-primary-800 hover:text-white transition-colors ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
          >
            {collapsed ? <PanelLeft className="w-5 h-5" /> : <><PanelLeftClose className="w-5 h-5" /> Collapse</>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-64 bg-primary-900 dark:bg-primary-950 z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 border-b border-primary-800 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                  <img src={siteConfig.logoUrl} alt={siteConfig.bankName} className="w-9 h-9 rounded-lg" />
                  <div>
                    <span className="font-serif font-bold text-white block">{siteConfig.bankName}</span>
                    <span className="text-[10px] text-accent-400 uppercase tracking-wider">Admin Console</span>
                  </div>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="text-secondary-300"><X className="w-6 h-6" /></button>
              </div>
              {renderNav(() => setSidebarOpen(false))}
              <div className="p-4 border-t border-primary-800">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary-300 hover:bg-error-500/20">
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 ${mainMargin} flex flex-col min-h-screen transition-all duration-300`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-secondary-200 dark:border-secondary-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <p className="text-xs text-secondary-400 dark:text-secondary-500">Admin Console</p>
                <p className="font-semibold text-primary-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleMode} className="p-2.5 rounded-lg text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors" aria-label="Toggle theme">
                {theme.mode === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} onBlur={() => setTimeout(() => setProfileOpen(false), 150)} className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                  <img src={user?.avatar} alt="" className="w-9 h-9 rounded-lg object-cover" />
                  <ChevronDown className="w-4 h-4 text-secondary-400 hidden sm:block" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-1 w-56 glass-strong rounded-xl shadow-premium p-2 z-50">
                      <div className="px-3 py-2 border-b border-secondary-200 dark:border-secondary-700 mb-1">
                        <p className="text-sm font-semibold text-primary-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-secondary-400">{user?.email}</p>
                      </div>
                      <Link to="/admin-giver/dashboard/settings" className="block px-3 py-2 text-sm rounded-lg text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30">Settings</Link>
                      <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm rounded-lg text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-500/10">Sign Out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

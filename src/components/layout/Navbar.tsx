import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Moon, Sun, Phone, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useTheme } from '../../context/ThemeContext';
import { LinkButton } from '../ui/Button';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { theme, toggleMode } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(null);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong shadow-premium py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={siteConfig.logoUrl} alt={siteConfig.bankName} className="w-10 h-10 rounded-lg" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-primary-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                {siteConfig.bankName}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-accent-600 dark:text-accent-400 font-medium hidden sm:block">
                Trust • Future
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {siteConfig.navigation.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === item.label ? null : item.label)}
                    onBlur={() => setTimeout(() => setDropdownOpen(null), 150)}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-800 dark:hover:text-accent-400 transition-colors"
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === item.label ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-primary-800 dark:text-accent-400'
                          : 'text-secondary-700 dark:text-secondary-300 hover:text-primary-800 dark:hover:text-accent-400'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
                <AnimatePresence>
                  {item.children && dropdownOpen === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-56 glass-strong rounded-xl shadow-premium p-2"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm rounded-lg text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-800 dark:hover:text-accent-400 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMode}
              className="p-2.5 rounded-lg text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme.mode === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <div className="hidden md:flex items-center gap-2">
              <LinkButton to="/login" variant="ghost" size="sm">
                <ShieldCheck className="w-4 h-4" /> Customer Login
              </LinkButton>
              <LinkButton to="/admin/login" variant="primary" size="sm">
                Admin Portal
              </LinkButton>
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-lg text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="mt-4 glass-strong rounded-2xl p-4 space-y-1">
                {siteConfig.navigation.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <>
                        <p className="px-4 py-2 text-xs uppercase tracking-wider text-secondary-400 font-semibold">
                          {item.label}
                        </p>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="block px-4 py-2.5 text-sm rounded-lg text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className="block px-4 py-2.5 text-sm font-medium rounded-lg text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-3 border-t border-secondary-200 dark:border-secondary-700 space-y-2">
                  <LinkButton to="/login" variant="outline" size="sm" className="w-full">
                    Customer Login
                  </LinkButton>
                  <LinkButton to="/admin/login" variant="primary" size="sm" className="w-full">
                    Admin Portal
                  </LinkButton>
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-500 dark:text-secondary-400">
                    <Phone className="w-4 h-4" />
                    {siteConfig.contact.phone}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

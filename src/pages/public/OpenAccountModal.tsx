import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, Clock, Info } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export function OpenAccountModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const msg = siteConfig.openAccountMessage;

  const contactItems = [
    { icon: Phone, label: 'Phone', value: msg.phone, href: `tel:${msg.phone}` },
    { icon: Mail, label: 'Email', value: msg.email, href: `mailto:${msg.email}` },
    { icon: MapPin, label: 'Address', value: msg.address },
    { icon: Clock, label: 'Hours', value: msg.hours },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-primary-950/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg glass-strong rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header bar */}
            <div className="gradient-primary px-8 py-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/15 rounded-full blur-2xl" />
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
                  <Info className="w-6 h-6 text-accent-400" />
                </div>
                <h2 className="text-xl font-bold text-white font-serif pr-8">{msg.title}</h2>
              </div>
            </div>

            {/* Body */}
            <div className="p-8">
              <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-8">
                {msg.body}
              </p>

              <div className="space-y-4">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary-700 dark:text-accent-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary-400 mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a href={item.href} className="text-primary-900 dark:text-white font-medium hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-primary-900 dark:text-white font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="mt-8 w-full px-6 py-3 rounded-xl bg-primary-800 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

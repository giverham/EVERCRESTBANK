import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Building2 } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export function OpenAccountPage() {
  const { openAccountMessage } = siteConfig;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-strong rounded-3xl p-8 sm:p-12 shadow-premium"
        >
          <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mb-8">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary-900 dark:text-white mb-6">
            {openAccountMessage.title}
          </h1>
          
          <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-10 leading-relaxed">
            {openAccountMessage.body}
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary-900 dark:text-white border-b border-secondary-200 dark:border-secondary-800 pb-2">
                Contact Customer Care
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-accent-600 dark:text-accent-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-primary-900 dark:text-white">Phone</p>
                    <p className="text-secondary-600 dark:text-secondary-400">{openAccountMessage.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-accent-600 dark:text-accent-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-primary-900 dark:text-white">Email</p>
                    <p className="text-secondary-600 dark:text-secondary-400">{openAccountMessage.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary-900 dark:text-white border-b border-secondary-200 dark:border-secondary-800 pb-2">
                Visit a Branch
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent-600 dark:text-accent-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-primary-900 dark:text-white">Main Branch Address</p>
                    <p className="text-secondary-600 dark:text-secondary-400">{openAccountMessage.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-accent-600 dark:text-accent-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-primary-900 dark:text-white">Business Hours</p>
                    <p className="text-secondary-600 dark:text-secondary-400 whitespace-pre-line">{openAccountMessage.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Construction, ArrowLeft, Bell } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LinkButton } from '../../components/ui/Button';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

interface AdminPlaceholderPageProps {
  title: string;
}

export function AdminPlaceholderPage({ title }: AdminPlaceholderPageProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div {...fadeUp} className="max-w-lg w-full">
        <Card className="p-8 sm:p-12 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center shadow-premium"
          >
            <Construction className="w-10 h-10 text-accent-400" />
          </motion.div>

          <Badge variant="accent" className="mb-4">
            <Bell className="w-3.5 h-3.5" /> Coming Soon
          </Badge>

          <h1 className="text-3xl font-serif font-bold text-primary-900 dark:text-white mb-3">
            {title}
          </h1>

          <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-2">
            This module is part of the Evercrest Bank admin console and will be available
            in the next development phase.
          </p>
          <p className="text-sm text-secondary-400 dark:text-secondary-500 mb-8">
            Our engineering team is actively building this feature with the same premium
            quality and security standards you expect from Evercrest Bank.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LinkButton to="/admin" variant="primary" size="md">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </LinkButton>
            <LinkButton to="/admin/settings" variant="outline" size="md">
              View Settings
            </LinkButton>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

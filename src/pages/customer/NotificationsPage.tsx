import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle, CheckCheck } from 'lucide-react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { supabaseCustomer as supabase } from '../../lib/supabase';
import type { NotificationItem } from '../../data/demoData';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const typeConfig = {
  info: { icon: Info, bg: 'bg-primary-100 dark:bg-primary-800/40', text: 'text-primary-600 dark:text-primary-300', badge: 'primary' as const },
  warning: { icon: AlertTriangle, bg: 'bg-warning-50 dark:bg-warning-500/15', text: 'text-warning-600 dark:text-warning-500', badge: 'warning' as const },
  success: { icon: CheckCircle, bg: 'bg-success-50 dark:bg-success-500/15', text: 'text-success-600 dark:text-success-500', badge: 'success' as const },
};

export function NotificationsPage() {
  const { data: dbNotifications } = useSupabaseData<NotificationItem>('notifications');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (dbNotifications.length > 0) {
      setNotifications(dbNotifications);
    }
  }, [dbNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      await supabase.from('notifications').update({ read: true }).in('id', unreadIds);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <SectionHeading
          center={false}
          eyebrow="Inbox"
          title="Notifications"
          subtitle={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.` : 'You are all caught up.'}
        />
        <Button variant="outline" onClick={markAllRead} disabled={unreadCount === 0}>
          <CheckCheck className="w-4 h-4" /> Mark all as read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((n, i) => {
          const cfg = typeConfig[n.type];
          const Icon = cfg.icon;
          return (
            <motion.div key={n.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }}>
              <Card className={`p-5 transition-all ${!n.read ? 'border-l-4 border-l-accent-500' : 'opacity-75'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                    <Icon className={`w-5 h-5 ${cfg.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-primary-900 dark:text-white">{n.title}</h3>
                      {!n.read && <Badge variant="accent">New</Badge>}
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-2">{n.date}</p>
                  </div>
                  <Badge variant={cfg.badge} className="capitalize flex-shrink-0">{n.type}</Badge>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Calendar, CreditCard, Shield, Upload, Phone, MapPin } from 'lucide-react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { supabaseCustomer as supabase } from '../../lib/supabase';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500';

// Global image cache for avatars to avoid flashing on component remounts
const avatarCache = new Set<string>();

function PreloadedAvatar({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loading, setLoading] = useState(!avatarCache.has(src) && !!src);
  const [currentSrc, setCurrentSrc] = useState(avatarCache.has(src) ? src : '');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }

    if (avatarCache.has(src)) {
      setCurrentSrc(src);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      avatarCache.add(src);
      setCurrentSrc(src);
      setLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
  }, [src]);

  const initials = alt
    ? alt
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';
  const defaultSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100%" height="100%" fill="%230f172a"/><text x="50" y="58" font-family="sans-serif" font-size="32" font-weight="bold" fill="%23f8fafc" text-anchor="middle">${initials}</text></svg>`;

  if (loading) {
    return (
      <div className={`${className} animate-pulse bg-secondary-200 dark:bg-secondary-800 flex items-center justify-center`} style={{ aspectRatio: '1/1' }}>
        <div className="w-8 h-8 rounded-full bg-secondary-300 dark:bg-secondary-700" />
      </div>
    );
  }

  return (
    <img
      src={error || !currentSrc ? defaultSvg : currentSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    avatar: user?.avatar || '',
    dateOfBirth: '',
    customerId: user?.id || '',
    memberSince: '',
    verificationStatus: 'Verified',
    accountType: 'Premium Checking'
  });

  const fetchProfile = async () => {
    if (!user?.id) return;
    const { data } = await supabase.from('customers').select('*').eq('id', user.id).single();
    if (data) {
      setForm({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        avatar: data.avatar || user?.avatar || '',
        dateOfBirth: data.date_of_birth || '',
        customerId: data.customer_id || data.id,
        memberSince: data.member_since || 'March 2019',
        verificationStatus: data.verification_status || 'Verified',
        accountType: data.account_type || 'Checking'
      });
    }
  };

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        avatar: user.avatar || prev.avatar,
        customerId: user.id || prev.customerId
      }));
    }
    fetchProfile();
  }, [user]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    const { error } = await supabase.from('customers').update({
      phone: form.phone
    }).eq('id', user.id);
    
    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      alert("Profile saved successfully.");
      fetchProfile();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeading center={false} eyebrow="Account" title="My Profile" subtitle="Manage your personal information and account details." />

      {/* Profile Header */}
      <motion.div {...fadeUp}>
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex flex-col items-center gap-2">
              <PreloadedAvatar
                src={form.avatar}
                alt={`${form.firstName} ${form.lastName}`}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-accent-500/20"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-serif text-2xl font-bold text-primary-900 dark:text-white">{form.firstName} {form.lastName}</h2>
              <p className="text-secondary-500 dark:text-secondary-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1"><Mail className="w-4 h-4" />{form.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <Badge variant={form.verificationStatus === 'Verified' ? 'success' : 'warning'}><Shield className="w-3 h-3" /> {form.verificationStatus}</Badge>
                <Badge variant="accent">Premium Customer</Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Account Metadata */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Calendar, label: 'Member Since', value: form.memberSince },
            { icon: CreditCard, label: 'Account Type', value: form.accountType },
            { icon: User, label: 'Customer ID', value: form.customerId },
          ].map((item) => (
            <Card key={item.label} className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-800/40 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary-700 dark:text-primary-300" />
              </div>
              <div><p className="text-xs text-secondary-500 dark:text-secondary-400">{item.label}</p><p className="text-sm font-semibold text-primary-900 dark:text-white">{item.value}</p></div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Editable Form */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
        <Card className="p-6">
          <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">First Name <span className="text-xs text-secondary-400">(Contact support to change)</span></label>
              <input disabled value={form.firstName} className={`${inputClass} opacity-70 cursor-not-allowed`} />
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Last Name <span className="text-xs text-secondary-400">(Contact support to change)</span></label>
              <input disabled value={form.lastName} className={`${inputClass} opacity-70 cursor-not-allowed`} />
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Email <span className="text-xs text-secondary-400">(Contact support to change)</span></label>
              <input disabled value={form.email} className={`${inputClass} opacity-70 cursor-not-allowed`} />
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Phone</label>
              <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Date of Birth <span className="text-xs text-secondary-400">(Contact support to change)</span></label>
              <input type="date" disabled value={form.dateOfBirth} className={`${inputClass} opacity-70 cursor-not-allowed`} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Address <span className="text-xs text-secondary-400">(Contact support to change)</span></label>
              <input disabled value={form.address} className={`${inputClass} opacity-70 cursor-not-allowed`} />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

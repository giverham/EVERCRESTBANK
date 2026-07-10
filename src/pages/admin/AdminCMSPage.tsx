import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Database, Type, Image, Phone, Navigation, Settings2, Check } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { siteConfig } from '../../config/siteConfig';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const fieldClass = 'input-premium';
const labelClass = 'block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5';

export function AdminCMSPage() {
  const [bankName, setBankName] = useState(siteConfig.bankName);
  const [tagline, setTagline] = useState(siteConfig.tagline);
  const [heroTitle, setHeroTitle] = useState(siteConfig.heroBanner.title);
  const [heroSubtitle, setHeroSubtitle] = useState(siteConfig.heroBanner.subtitle);
  const [heroCta, setHeroCta] = useState(siteConfig.heroBanner.ctaPrimary);
  const [phone, setPhone] = useState(siteConfig.contact.phone);
  const [email, setEmail] = useState(siteConfig.contact.email);
  const [address, setAddress] = useState(siteConfig.contact.address);
  const [hours, setHours] = useState(siteConfig.contact.hours);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div {...fadeUp} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Database className="w-7 h-7 text-accent-500" />
            <h1 className="text-3xl font-serif font-bold text-primary-900 dark:text-white">Website CMS</h1>
          </div>
          <p className="text-secondary-500 dark:text-secondary-400">Manage all public-facing website content.</p>
        </div>
        <Button variant="accent" onClick={handleSave}>
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Identity */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">Bank Identity</h3>
            </div>
            <div className="space-y-4">
              <div><label className={labelClass}>Bank Name</label><input className={fieldClass} value={bankName} onChange={(e) => setBankName(e.target.value)} /></div>
              <div><label className={labelClass}>Tagline</label><textarea className={fieldClass} rows={2} value={tagline} onChange={(e) => setTagline(e.target.value)} /></div>
            </div>
          </Card>
        </motion.div>

        {/* Hero Banner */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">Hero Banner</h3>
            </div>
            <div className="space-y-4">
              <div><label className={labelClass}>Title</label><input className={fieldClass} value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} /></div>
              <div><label className={labelClass}>Subtitle</label><input className={fieldClass} value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} /></div>
              <div><label className={labelClass}>CTA Button Text</label><input className={fieldClass} value={heroCta} onChange={(e) => setHeroCta(e.target.value)} /></div>
            </div>
          </Card>
        </motion.div>

        {/* Navigation Items */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">Navigation Menu</h3>
            </div>
            <div className="space-y-2">
              {siteConfig.navigation.map((nav, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary-50 dark:bg-secondary-800/50">
                  <Type className="w-4 h-4 text-secondary-400" />
                  <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex-1">{nav.label}</span>
                  <code className="text-xs text-accent-600 dark:text-accent-400">{nav.href}</code>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">Contact Information</h3>
            </div>
            <div className="space-y-4">
              <div><label className={labelClass}>Phone</label><input className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
              <div><label className={labelClass}>Email</label><input className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div><label className={labelClass}>Address</label><input className={fieldClass} value={address} onChange={(e) => setAddress(e.target.value)} /></div>
              <div><label className={labelClass}>Hours</label><textarea className={fieldClass} rows={3} value={hours} onChange={(e) => setHours(e.target.value)} /></div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Footer Settings */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card className="p-6">
          <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-4">Footer Navigation Sections</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(siteConfig.footerNavigation).map(([key, items]) => (
              <div key={key} className="p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/50">
                <p className="text-xs font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400 mb-2">{key}</p>
                <ul className="space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="text-sm text-secondary-600 dark:text-secondary-400">{item.label}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

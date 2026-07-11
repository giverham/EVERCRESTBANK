import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWebsite } from '../../context/WebsiteContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Globe, Shield, Save, Sliders, Image as ImageIcon, Share2 } from 'lucide-react';
import { ImageUploader } from '../../components/admin/ImageUploader';

const tabs = [
  { id: 'general', label: 'Branding & Info', icon: Sliders },
  { id: 'seo', label: 'SEO & Metadata', icon: Shield },
  { id: 'social', label: 'Social Networks', icon: Share2 },
  { id: 'hero', label: 'Hero Section', icon: ImageIcon },
];

export default function WebsiteSettings() {
  const { settings, updateSettings, updateCMSSection } = useWebsite();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [bankName, setBankName] = useState('');
  const [tagline, setTagline] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [hours, setHours] = useState('');

  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [twitterCard, setTwitterCard] = useState('');

  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedIn] = useState('');
  const [instagram, setInstagram] = useState('');

  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroCta, setHeroCta] = useState('');

  useEffect(() => {
    if (settings) {
      setBankName(settings.bankName || '');
      setTagline(settings.tagline || '');
      setLogoUrl(settings.logoUrl || '');
      setFaviconUrl(settings.faviconUrl || '');

      setPhone(settings.contact?.phone || '');
      setEmail(settings.contact?.email || '');
      setAddress(settings.contact?.address || '');
      setHours(settings.contact?.hours || '');

      setSeoTitle(settings.seo?.title || '');
      setSeoDescription(settings.seo?.description || '');
      setSeoKeywords(settings.seo?.keywords || '');
      setOgImage(settings.seo?.ogImage || '');
      setTwitterCard(settings.seo?.twitterCard || '');

      setFacebook(settings.social?.facebook || '');
      setTwitter(settings.social?.twitter || '');
      setLinkedIn(settings.social?.linkedin || '');
      setInstagram(settings.social?.instagram || '');

      setHeroTitle(settings.heroBanner?.title || '');
      setHeroSubtitle(settings.heroBanner?.subtitle || '');
      setHeroCta(settings.heroBanner?.primaryCtaText || '');
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);

    try {
      // 1. Save global branding, contact, social & SEO settings
      const globalSuccess = await updateSettings({
        bankName,
        tagline,
        logoUrl,
        faviconUrl,
        contact: {
          phone,
          email,
          address,
          hours,
          mapEmbed: settings.contact?.mapEmbed || '',
        },
        social: {
          facebook,
          twitter,
          linkedin,
          instagram,
        },
        seo: {
          title: seoTitle,
          description: seoDescription,
          keywords: seoKeywords,
          ogImage,
          twitterCard,
        }
      });

      // 2. Save homepage_hero section config
      const cmsSuccess = await updateCMSSection('homepage_hero', {
        title: heroTitle,
        subtitle: heroSubtitle,
        primaryCtaText: heroCta,
      });

      if (globalSuccess && cmsSuccess) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Some changes could not be saved to Supabase. Check your connection.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Globe className="w-7 h-7 text-accent-500" />
            <h1 className="text-3xl font-serif font-bold text-primary-900 dark:text-white">Website Settings</h1>
          </div>
          <p className="text-secondary-500 dark:text-secondary-400">Control the global branding, layout and pages of your public website dynamically.</p>
        </div>
        <Button 
          variant="accent" 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 self-start sm:self-center"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-success-500/10 text-success-600 dark:text-success-400 border border-success-500/20 rounded-xl">
          ✓ All settings successfully synchronized with the Supabase master database. Changes are now live!
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 flex-none space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400' 
                    : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form panel */}
        <div className="flex-1">
          <Card className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-primary-900 dark:text-white border-b border-secondary-200 dark:border-secondary-800 pb-3">Branding & Corporate Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Bank Name</label>
                    <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className="input-premium" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Corporate Tagline</label>
                    <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="input-premium" />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <ImageUploader value={logoUrl} onChange={setLogoUrl} label="Corporate Logo" />
                    <ImageUploader value={faviconUrl} onChange={setFaviconUrl} label="Browser Favicon" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-primary-900 dark:text-white border-b border-secondary-200 dark:border-secondary-800 pb-3 pt-4 font-serif">Support & Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Support Hotline</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-premium" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Support Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-premium" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Headquarters Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input-premium" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Business Hours</label>
                    <input type="text" value={hours} onChange={(e) => setHours(e.target.value)} className="input-premium" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-primary-900 dark:text-white border-b border-secondary-200 dark:border-secondary-800 pb-3">Search Engine Optimization (SEO)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Default Browser & Search Title</label>
                    <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="input-premium" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Meta Description</label>
                    <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="input-premium h-24 resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">SEO Keywords (comma separated)</label>
                    <input type="text" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} className="input-premium" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <ImageUploader value={ogImage} onChange={setOgImage} label="OpenGraph Share Image" />
                    <ImageUploader value={twitterCard} onChange={setTwitterCard} label="Twitter Card Image" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-primary-900 dark:text-white border-b border-secondary-200 dark:border-secondary-800 pb-3">Social Media Directories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Facebook Link</label>
                    <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="input-premium" placeholder="https://facebook.com/..." />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Twitter / X Link</label>
                    <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="input-premium" placeholder="https://twitter.com/..." />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">LinkedIn Profile</label>
                    <input type="text" value={linkedin} onChange={(e) => setLinkedIn(e.target.value)} className="input-premium" placeholder="https://linkedin.com/company/..." />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Instagram Profile</label>
                    <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="input-premium" placeholder="https://instagram.com/..." />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-primary-900 dark:text-white border-b border-secondary-200 dark:border-secondary-800 pb-3">Public Hero Section CMS</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Main Hero Headline Title</label>
                    <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="input-premium" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Hero Subtitle Paragraph</label>
                    <textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="input-premium h-24 resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 block mb-1">Primary CTA Button Label</label>
                    <input type="text" value={heroCta} onChange={(e) => setHeroCta(e.target.value)} className="input-premium" />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

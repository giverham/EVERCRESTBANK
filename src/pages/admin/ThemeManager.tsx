import { useState, useEffect } from 'react';
import { useWebsite, ThemeConfig } from '../../context/WebsiteContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Palette, Sparkles, RefreshCcw, Save } from 'lucide-react';

const presetThemes = [
  {
    name: 'Royal Sapphire (Default)',
    colors: {
      primary_color: '#0f172a',
      secondary_color: '#475569',
      accent_color: '#d97706',
      success_color: '#16a34a',
      warning_color: '#ca8a04',
      danger_color: '#dc2626',
      text_color: '#1e293b',
      heading_color: '#0f172a',
      background_color: '#f8fafc',
      card_color: '#ffffff',
      sidebar_color: '#0f172a',
      header_color: '#ffffff',
      footer_color: '#0f172a',
      button_color: '#0f172a',
      link_color: '#d97706',
    }
  },
  {
    name: 'Platinum Onyx (Monochrome Elite)',
    colors: {
      primary_color: '#111111',
      secondary_color: '#666666',
      accent_color: '#888888',
      success_color: '#2e7d32',
      warning_color: '#f57c00',
      danger_color: '#d32f2f',
      text_color: '#222222',
      heading_color: '#111111',
      background_color: '#f5f5f5',
      card_color: '#ffffff',
      sidebar_color: '#111111',
      header_color: '#ffffff',
      footer_color: '#111111',
      button_color: '#111111',
      link_color: '#555555',
    }
  },
  {
    name: 'Emerald Forest (Green Custody)',
    colors: {
      primary_color: '#064e3b',
      secondary_color: '#0f766e',
      accent_color: '#b45309',
      success_color: '#059669',
      warning_color: '#d97706',
      danger_color: '#e11d48',
      text_color: '#0f172a',
      heading_color: '#064e3b',
      background_color: '#f0fdf4',
      card_color: '#ffffff',
      sidebar_color: '#064e3b',
      header_color: '#ffffff',
      footer_color: '#064e3b',
      button_color: '#064e3b',
      link_color: '#0f766e',
    }
  }
];

export default function ThemeManager() {
  const { theme, updateTheme } = useWebsite();
  const [localTheme, setLocalTheme] = useState<ThemeConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (theme) {
      setLocalTheme(theme);
    }
  }, [theme]);

  if (!localTheme) return <div className="py-12 text-center text-secondary-500">Loading dynamic theme configuration...</div>;

  const handleChange = (key: keyof ThemeConfig, val: any) => {
    const updated = { ...localTheme, [key]: val };
    setLocalTheme(updated);
    
    // Apply style preview in real-time immediately!
    const styleEl = document.getElementById('dynamic-theme-css');
    if (styleEl) {
      styleEl.innerHTML = styleEl.innerHTML.replace(
        new RegExp(`--color-${key.replace('_color', '')}:\\s*#[a-fA-F0-9]{3,6}`, 'g'),
        `--color-${key.replace('_color', '')}: ${val}`
      );
    }
  };

  const handleApplyPreset = (presetColors: any) => {
    setLocalTheme({
      ...localTheme,
      ...presetColors
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    const ok = await updateTheme(localTheme);
    if (ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert('Failed to save theme variables to Supabase.');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Palette className="w-7 h-7 text-accent-500" />
            <h1 className="text-3xl font-serif font-bold text-primary-900 dark:text-white">Theme & Design Manager</h1>
          </div>
          <p className="text-secondary-500 dark:text-secondary-400">Design the exact custom branding interface guidelines for public visitors, customers, and administrators.</p>
        </div>
        <Button variant="accent" onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Publish Theme'}
        </Button>
      </div>

      {success && (
        <div className="p-4 bg-success-500/10 text-success-600 dark:text-success-400 border border-success-500/20 rounded-xl">
          ✓ Design guidelines published successfully. Updates propagated immediately across all views!
        </div>
      )}

      {/* Preset configurations */}
      <Card className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-500 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-500" /> Premium Color Presets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presetThemes.map((preset, idx) => (
            <Card 
              key={idx} 
              onClick={() => handleApplyPreset(preset.colors)}
              className="p-4 cursor-pointer hover:border-accent-500 hover:scale-[1.01] transition-all bg-secondary-50 dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800"
            >
              <h4 className="font-semibold text-sm mb-3 text-primary-900 dark:text-white">{preset.name}</h4>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: preset.colors.primary_color }} />
                <span className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: preset.colors.secondary_color }} />
                <span className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: preset.colors.accent_color }} />
                <span className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: preset.colors.background_color }} />
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core System Brandings */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-serif font-bold text-primary-900 dark:text-white border-b border-secondary-200 dark:border-secondary-800 pb-2">Corporate Brand Colors</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">Primary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={localTheme.primary_color} onChange={(e) => handleChange('primary_color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <input type="text" value={localTheme.primary_color} onChange={(e) => handleChange('primary_color', e.target.value)} className="input-premium w-24 text-xs font-mono" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={localTheme.secondary_color} onChange={(e) => handleChange('secondary_color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <input type="text" value={localTheme.secondary_color} onChange={(e) => handleChange('secondary_color', e.target.value)} className="input-premium w-24 text-xs font-mono" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">Accent Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={localTheme.accent_color} onChange={(e) => handleChange('accent_color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <input type="text" value={localTheme.accent_color} onChange={(e) => handleChange('accent_color', e.target.value)} className="input-premium w-24 text-xs font-mono" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">Success Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={localTheme.success_color} onChange={(e) => handleChange('success_color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <input type="text" value={localTheme.success_color} onChange={(e) => handleChange('success_color', e.target.value)} className="input-premium w-24 text-xs font-mono" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">Warning Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={localTheme.warning_color} onChange={(e) => handleChange('warning_color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <input type="text" value={localTheme.warning_color} onChange={(e) => handleChange('warning_color', e.target.value)} className="input-premium w-24 text-xs font-mono" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">Danger Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={localTheme.danger_color} onChange={(e) => handleChange('danger_color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <input type="text" value={localTheme.danger_color} onChange={(e) => handleChange('danger_color', e.target.value)} className="input-premium w-24 text-xs font-mono" />
              </div>
            </div>
          </div>
        </Card>

        {/* Component & Platform Layout elements */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-serif font-bold text-primary-900 dark:text-white border-b border-secondary-200 dark:border-secondary-800 pb-2">Layout & Text Elements</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">Background Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={localTheme.background_color} onChange={(e) => handleChange('background_color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <input type="text" value={localTheme.background_color} onChange={(e) => handleChange('background_color', e.target.value)} className="input-premium w-24 text-xs font-mono" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">Card Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={localTheme.card_color} onChange={(e) => handleChange('card_color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <input type="text" value={localTheme.card_color} onChange={(e) => handleChange('card_color', e.target.value)} className="input-premium w-24 text-xs font-mono" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">Sidebar Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={localTheme.sidebar_color} onChange={(e) => handleChange('sidebar_color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <input type="text" value={localTheme.sidebar_color} onChange={(e) => handleChange('sidebar_color', e.target.value)} className="input-premium w-24 text-xs font-mono" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">Border Radius</label>
              <select 
                value={localTheme.border_radius} 
                onChange={(e) => handleChange('border_radius', e.target.value)} 
                className="input-premium w-36 text-xs font-medium"
              >
                <option value="0px">Sharp (0px)</option>
                <option value="0.375rem">Sleek (6px)</option>
                <option value="0.5rem">Standard (8px)</option>
                <option value="0.75rem">Modern (12px)</option>
                <option value="1rem">Soft (16px)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">Heading Typography</label>
              <select 
                value={localTheme.font_family} 
                onChange={(e) => handleChange('font_family', e.target.value)} 
                className="input-premium w-48 text-xs font-medium"
              >
                <option value="Inter, sans-serif">Inter (Modern Sans)</option>
                <option value="'Outfit', sans-serif">Outfit (Premium Rounded)</option>
                <option value="Georgia, serif">Georgia (Traditional Corporate)</option>
                <option value="system-ui, sans-serif">System Default</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

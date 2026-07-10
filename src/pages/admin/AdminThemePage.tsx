import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette, Type, Square, Moon, Sun, Image, Save, Check, Eye,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../context/ThemeContext';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const labelClass = 'block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5';

export function AdminThemePage() {
  const { theme, updateTheme, setMode } = useTheme();
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
            <Palette className="w-7 h-7 text-accent-500" />
            <h1 className="text-3xl font-serif font-bold text-primary-900 dark:text-white">Theme Settings</h1>
          </div>
          <p className="text-secondary-500 dark:text-secondary-400">Customize the visual identity of your banking platform.</p>
        </div>
        <Button variant="accent" onClick={handleSave}>
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colors */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}>
          <Card className="p-6">
            <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-4">Brand Colors</h3>
            <div className="space-y-4">
              {[
                { key: 'primary', label: 'Primary Color', value: theme.colors.primary },
                { key: 'primaryLight', label: 'Primary Light', value: theme.colors.primaryLight },
                { key: 'primaryDark', label: 'Primary Dark', value: theme.colors.primaryDark },
                { key: 'accent', label: 'Accent (Gold)', value: theme.colors.accent },
                { key: 'accentLight', label: 'Accent Light', value: theme.colors.accentLight },
                { key: 'accentDark', label: 'Accent Dark', value: theme.colors.accentDark },
              ].map((c) => (
                <div key={c.key} className="flex items-center gap-3">
                  <input
                    type="color" value={c.value}
                    onChange={(e) => updateTheme({ colors: { ...theme.colors, [c.key]: e.target.value } })}
                    className="w-12 h-12 rounded-lg border-2 border-secondary-200 dark:border-secondary-700 cursor-pointer"
                  />
                  <div className="flex-1">
                    <label className={labelClass}>{c.label}</label>
                    <input
                      type="text" value={c.value}
                      onChange={(e) => updateTheme({ colors: { ...theme.colors, [c.key]: e.target.value } })}
                      className="input-premium font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="space-y-6">
          {/* Typography */}
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Type className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold text-primary-900 dark:text-white">Typography</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Heading Font</label>
                  <select
                    value={theme.typography.headingFont}
                    onChange={(e) => updateTheme({ typography: { ...theme.typography, headingFont: e.target.value } })}
                    className="input-premium cursor-pointer"
                  >
                    <option value="Playfair Display, serif">Playfair Display</option>
                    <option value="Cormorant Garamond, serif">Cormorant Garamond</option>
                    <option value="Merriweather, serif">Merriweather</option>
                    <option value="Georgia, serif">Georgia</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Body Font</label>
                  <select
                    value={theme.typography.bodyFont}
                    onChange={(e) => updateTheme({ typography: { ...theme.typography, bodyFont: e.target.value } })}
                    className="input-premium cursor-pointer"
                  >
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                    <option value="Source Sans Pro, sans-serif">Source Sans Pro</option>
                    <option value="Lato, sans-serif">Lato</option>
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Radius & Mode */}
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Square className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold text-primary-900 dark:text-white">Layout & Mode</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Border Radius: <span className="text-accent-600 font-mono">{theme.borderRadius}</span></label>
                  <input
                    type="range" min="0" max="2" step="0.125" value={parseFloat(theme.borderRadius)}
                    onChange={(e) => updateTheme({ borderRadius: `${e.target.value}rem` })}
                    className="w-full accent-primary-700"
                  />
                </div>
                <div>
                  <label className={labelClass}>Display Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setMode('light')} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors ${theme.mode === 'light' ? 'bg-primary-800 text-white' : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600'}`}>
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button onClick={() => setMode('dark')} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors ${theme.mode === 'dark' ? 'bg-primary-800 text-white' : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600'}`}>
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Logo & Favicon */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-primary-900 dark:text-white">Brand Assets</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Logo', 'Favicon'].map((asset) => (
              <div key={asset} className="border-2 border-dashed border-secondary-300 dark:border-secondary-700 rounded-xl p-6 text-center hover:border-accent-400 transition-colors cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
                  <Image className="w-8 h-8 text-secondary-400" />
                </div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Upload {asset}</p>
                <p className="text-xs text-secondary-400 mt-1">SVG, PNG up to 1MB</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Live Preview */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-accent-500" />
            <h3 className="text-lg font-bold text-primary-900 dark:text-white">Live Preview</h3>
            <Badge variant="accent" className="ml-auto">Real-time</Badge>
          </div>
          <div className="rounded-2xl p-8" style={{ backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius }}>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: theme.colors.accent }}>Evercrest Bank</p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#fff', fontFamily: theme.typography.headingFont }}>
              Banking Built on Trust
            </h2>
            <p className="mb-5" style={{ color: '#ffffffaa', fontFamily: theme.typography.bodyFont }}>
              Experience premium banking with personalized service.
            </p>
            <button className="px-6 py-3 font-semibold text-white" style={{ backgroundColor: theme.colors.accent, borderRadius: theme.borderRadius }}>
              Get Started
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

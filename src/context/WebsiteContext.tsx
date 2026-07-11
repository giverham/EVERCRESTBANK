import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseCustomer, supabaseAdmin } from '../lib/supabase';
import { siteConfig, SiteConfig } from '../config/siteConfig';

const supabase = supabaseCustomer;

export interface ThemeConfig {
  id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  success_color: string;
  warning_color: string;
  danger_color: string;
  text_color: string;
  heading_color: string;
  background_color: string;
  card_color: string;
  sidebar_color: string;
  header_color: string;
  footer_color: string;
  button_color: string;
  link_color: string;
  border_radius: string;
  font_family: string;
  font_size: string;
  spacing: string;
  shadow: string;
  dark_mode_enabled: boolean;
}

const defaultTheme: ThemeConfig = {
  id: 'active_theme',
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
  border_radius: '0.75rem',
  font_family: 'Inter, sans-serif',
  font_size: '1rem',
  spacing: '1rem',
  shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  dark_mode_enabled: false
};

interface WebsiteContextType {
  settings: SiteConfig;
  theme: ThemeConfig;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteConfig>) => Promise<boolean>;
  updateCMSSection: (sectionId: string, content: any) => Promise<boolean>;
  updateTheme: (newTheme: Partial<ThemeConfig>) => Promise<boolean>;
}

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export function WebsiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteConfig>(siteConfig);
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [loading, setLoading] = useState(true);

  const injectThemeStyles = (themeObj: ThemeConfig) => {
    let styleEl = document.getElementById('dynamic-theme-css');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-theme-css';
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = `
      :root {
        --color-primary-50: #f8fafc;
        --color-primary-100: #f1f5f9;
        --color-primary-500: ${themeObj.primary_color};
        --color-primary-600: ${themeObj.primary_color};
        --color-primary-700: ${themeObj.primary_color};
        --color-primary-800: ${themeObj.primary_color};
        --color-primary-900: ${themeObj.primary_color};
        
        --color-secondary-500: ${themeObj.secondary_color};
        
        --color-accent-500: ${themeObj.accent_color};
        --color-accent-600: ${themeObj.accent_color};
        
        --color-success-500: ${themeObj.success_color};
        --color-warning-500: ${themeObj.warning_color};
        --color-danger-500: ${themeObj.danger_color};
        
        --text-color: ${themeObj.text_color};
        --heading-color: ${themeObj.heading_color};
        --background-color: ${themeObj.background_color};
        --card-color: ${themeObj.card_color};
        --sidebar-color: ${themeObj.sidebar_color};
        --header-color: ${themeObj.header_color};
        --footer-color: ${themeObj.footer_color};
        --button-color: ${themeObj.button_color};
        --link-color: ${themeObj.link_color};
        
        --border-radius: ${themeObj.border_radius};
        --font-family: ${themeObj.font_family};
        --font-size: ${themeObj.font_size};
        --spacing: ${themeObj.spacing};
        --shadow: ${themeObj.shadow};
      }
      body {
        font-family: var(--font-family);
        background-color: var(--background-color);
        color: var(--text-color);
      }
    `;
  };

  const fetchSettingsAndTheme = async () => {
    try {
      // 1. Fetch website_settings row
      const { data: dbSettings } = await supabase
        .from('website_settings')
        .select('*')
        .eq('id', 'global')
        .maybeSingle();

      // 2. Fetch all cms_sections rows
      const { data: dbSections } = await supabase
        .from('cms_sections')
        .select('*');

      // 3. Fetch active theme row
      const { data: dbTheme } = await supabase
        .from('website_theme')
        .select('*')
        .eq('id', 'active_theme')
        .maybeSingle();

      let updatedConfig = { ...siteConfig };

      if (dbSettings) {
        updatedConfig.bankName = dbSettings.website_name || updatedConfig.bankName;
        updatedConfig.tagline = dbSettings.tagline || updatedConfig.tagline;
        if (dbSettings.logo_url) updatedConfig.logoUrl = dbSettings.logo_url;
        if (dbSettings.favicon_url) updatedConfig.faviconUrl = dbSettings.favicon_url;
        
        // Merge contacts
        updatedConfig.contact = {
          phone: dbSettings.phone_number || updatedConfig.contact.phone,
          email: dbSettings.support_email || updatedConfig.contact.email,
          address: dbSettings.address || updatedConfig.contact.address,
          hours: dbSettings.business_hours || updatedConfig.contact.hours,
          mapEmbed: updatedConfig.contact.mapEmbed,
        };

        // Merge social links
        updatedConfig.social = {
          facebook: dbSettings.social_facebook || updatedConfig.social.facebook,
          twitter: dbSettings.social_twitter || updatedConfig.social.twitter,
          linkedin: dbSettings.social_linkedin || updatedConfig.social.linkedin,
          instagram: dbSettings.social_instagram || updatedConfig.social.instagram,
        };

        // Merge SEO settings
        updatedConfig.seo = {
          title: dbSettings.seo_title || updatedConfig.seo.title,
          description: dbSettings.seo_description || updatedConfig.seo.description,
          keywords: dbSettings.seo_keywords || updatedConfig.seo.keywords,
          ogImage: dbSettings.og_image_url || updatedConfig.seo.ogImage,
          twitterCard: dbSettings.twitter_image_url || updatedConfig.seo.twitterCard,
        };
      }

      // Merge sections from cms_sections if present
      if (dbSections) {
        dbSections.forEach((section) => {
          if (section.id === 'homepage_hero' && section.content) {
            updatedConfig.heroBanner = {
              ...updatedConfig.heroBanner,
              ...section.content,
            };
          }
          if (section.id === 'homepage_stats' && section.content?.stats) {
            updatedConfig.stats = section.content.stats;
          }
          if (section.id === 'homepage_testimonials' && section.content?.testimonials) {
            updatedConfig.testimonials = section.content.testimonials;
          }
          if (section.id === 'homepage_features' && section.content?.features) {
            updatedConfig.features = section.content.features;
          }
        });
      }

      // Dynamic document titles & favicon overrides
      document.title = dbSettings?.browser_title || updatedConfig.seo.title || updatedConfig.bankName;
      const faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (faviconLink && dbSettings?.favicon_url) {
        faviconLink.href = dbSettings.favicon_url;
      }

      if (dbTheme) {
        setTheme(dbTheme);
        injectThemeStyles(dbTheme);
      } else {
        injectThemeStyles(defaultTheme);
      }

      setSettings(updatedConfig);
    } catch (err) {
      console.error('Error loading dynamic website settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndTheme();
  }, []);

  const updateSettings = async (newFields: Partial<SiteConfig>): Promise<boolean> => {
    try {
      const dbFields: any = {};
      if (newFields.bankName) dbFields.website_name = newFields.bankName;
      if (newFields.tagline) dbFields.tagline = newFields.tagline;
      if (newFields.logoUrl) dbFields.logo_url = newFields.logoUrl;
      if (newFields.faviconUrl) dbFields.favicon_url = newFields.faviconUrl;

      if (newFields.contact) {
        if (newFields.contact.phone) dbFields.phone_number = newFields.contact.phone;
        if (newFields.contact.email) dbFields.support_email = newFields.contact.email;
        if (newFields.contact.address) dbFields.address = newFields.contact.address;
        if (newFields.contact.hours) dbFields.business_hours = newFields.contact.hours;
      }

      if (newFields.social) {
        if (newFields.social.facebook) dbFields.social_facebook = newFields.social.facebook;
        if (newFields.social.twitter) dbFields.social_twitter = newFields.social.twitter;
        if (newFields.social.linkedin) dbFields.social_linkedin = newFields.social.linkedin;
        if (newFields.social.instagram) dbFields.social_instagram = newFields.social.instagram;
      }

      if (newFields.seo) {
        if (newFields.seo.title) dbFields.seo_title = newFields.seo.title;
        if (newFields.seo.description) dbFields.seo_description = newFields.seo.description;
        if (newFields.seo.keywords) dbFields.seo_keywords = newFields.seo.keywords;
        if (newFields.seo.ogImage) dbFields.og_image_url = newFields.seo.ogImage;
        if (newFields.seo.twitterCard) dbFields.twitter_image_url = newFields.seo.twitterCard;
      }

      const { error } = await supabaseAdmin
        .from('website_settings')
        .update(dbFields)
        .eq('id', 'global');

      if (error) throw error;
      await fetchSettingsAndTheme();
      return true;
    } catch (err) {
      console.error('Error saving website settings:', err);
      return false;
    }
  };

  const updateCMSSection = async (sectionId: string, content: any): Promise<boolean> => {
    try {
      const { error } = await supabaseAdmin
        .from('cms_sections')
        .upsert({ id: sectionId, content, updated_at: new Date().toISOString() });

      if (error) throw error;
      await fetchSettingsAndTheme();
      return true;
    } catch (err) {
      console.error(`Error saving CMS section ${sectionId}:`, err);
      return false;
    }
  };

  const updateTheme = async (newThemeFields: Partial<ThemeConfig>): Promise<boolean> => {
    try {
      const { error } = await supabaseAdmin
        .from('website_theme')
        .update({ ...newThemeFields, updated_at: new Date().toISOString() })
        .eq('id', 'active_theme');

      if (error) throw error;
      await fetchSettingsAndTheme();
      return true;
    } catch (err) {
      console.error('Error saving theme properties:', err);
      return false;
    }
  };

  return (
    <WebsiteContext.Provider value={{ settings, theme, loading, refreshSettings: fetchSettingsAndTheme, updateSettings, updateCMSSection, updateTheme }}>
      {children}
    </WebsiteContext.Provider>
  );
}

export function useWebsite() {
  const context = useContext(WebsiteContext);
  if (context === undefined) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
}

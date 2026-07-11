import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';

export function Footer() {
  const { settings: siteConfig } = useWebsite();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 dark:bg-primary-950 text-secondary-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={siteConfig.logoUrl} alt={siteConfig.bankName} className="w-10 h-10 rounded-lg" />
              <span className="font-serif font-bold text-xl text-white">{siteConfig.bankName}</span>
            </Link>
            <p className="text-sm leading-relaxed text-secondary-400 mb-6 max-w-sm">
              {siteConfig.tagline}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-400" />
                <span>{siteConfig.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-400" />
                <span>{siteConfig.contact.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent-400 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-accent-400 mt-0.5" />
                <span className="whitespace-pre-line">{siteConfig.contact.hours}</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Products</h4>
            <ul className="space-y-2.5">
              {siteConfig.footerNavigation.products.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-sm text-secondary-400 hover:text-accent-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {siteConfig.footerNavigation.company.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-secondary-400 hover:text-accent-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold text-white mb-4 mt-6 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {siteConfig.footerNavigation.support.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-secondary-400 hover:text-accent-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              {siteConfig.footerNavigation.legal.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-secondary-400 hover:text-accent-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 mt-6">
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-primary-800 hover:bg-accent-600 flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-primary-800 hover:bg-accent-600 flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-primary-800 hover:bg-accent-600 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-primary-800 hover:bg-accent-600 flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary-500">
            © {year} {siteConfig.bankName}. All rights reserved. Member FDIC. This is a fictional demo platform.
          </p>
          <p className="text-xs text-secondary-500">
            Deposits insured up to the maximum allowable amount.
          </p>
        </div>
      </div>
    </footer>
  );
}

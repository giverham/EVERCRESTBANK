import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Lock, Share2, Cookie, UserCheck, Mail } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { LinkButton } from '../../components/ui/Button';
import { siteConfig } from '../../config/siteConfig';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const sections = [
  { id: 'collect', label: 'Information We Collect', icon: FileText },
  { id: 'use', label: 'How We Use Information', icon: ShieldCheck },
  { id: 'sharing', label: 'Information Sharing', icon: Share2 },
  { id: 'security', label: 'Data Security', icon: Lock },
  { id: 'cookies', label: 'Cookie Policy', icon: Cookie },
  { id: 'rights', label: 'Your Rights', icon: UserCheck },
  { id: 'contact', label: 'Contact Us', icon: Mail },
];

const content: Record<string, { intro: string; points: string[] }> = {
  collect: {
    intro: 'We collect information that you provide directly to us when you open an account, apply for a product, or communicate with us. This may include:',
    points: [
      'Personal identification data: name, date of birth, Social Security number, government-issued ID.',
      'Contact information: address, phone number, email address.',
      'Financial information: income, employment details, account balances, and transaction history.',
      'Device and usage data: IP address, browser type, pages visited, and interaction patterns.',
      'Information from third parties such as credit bureaus and identity verification services.',
    ],
  },
  use: {
    intro: 'We use the information we collect to provide, maintain, and improve our banking services, including:',
    points: [
      'Processing account applications, transactions, and loan requests.',
      'Verifying your identity and preventing fraud and unauthorized access.',
      'Communicating with you about your accounts, products, and service updates.',
      'Complying with legal, regulatory, and tax obligations.',
      'Analyzing usage patterns to enhance security and develop new features.',
    ],
  },
  sharing: {
    intro: 'We do not sell your personal information. We may share your data in limited circumstances:',
    points: [
      'With service providers who perform functions on our behalf under strict confidentiality agreements.',
      'With regulatory authorities and law enforcement when required by law.',
      'In connection with a merger, acquisition, or sale of assets, subject to continued protection.',
      'With your explicit consent or at your direction.',
    ],
  },
  security: {
    intro: 'Protecting your information is our highest priority. We implement industry-leading safeguards:',
    points: [
      '256-bit SSL encryption for all data transmitted between your device and our servers.',
      'Multi-factor authentication and biometric login options for account access.',
      'Continuous fraud monitoring with automated detection of suspicious activity.',
      'Regular security audits and penetration testing by independent firms.',
      'Employee training programs and strict access controls based on the principle of least privilege.',
    ],
  },
  cookies: {
    intro: 'We use cookies and similar technologies to operate and improve our website. We use the following categories:',
    points: [
      'Essential cookies: required for core site functionality and secure login.',
      'Performance cookies: help us understand how visitors use our site to improve the experience.',
      'Functional cookies: remember your preferences and personalize content.',
      'You can manage cookie preferences through your browser settings at any time.',
    ],
  },
  rights: {
    intro: 'Depending on your location, you may have the following rights regarding your personal data:',
    points: [
      'Access: request a copy of the personal information we hold about you.',
      'Correction: request that we correct inaccurate or incomplete information.',
      'Deletion: request deletion of your data, subject to legal retention requirements.',
      'Opt-out: unsubscribe from marketing communications at any time.',
      'Data portability: receive your data in a structured, machine-readable format.',
    ],
  },
  contact: {
    intro: 'If you have questions about this Privacy Policy or how we handle your data, please contact us:',
    points: [
      `Phone: ${siteConfig.contact.phone}`,
      `Email: ${siteConfig.contact.email}`,
      `Address: ${siteConfig.contact.address}`,
      `Hours: ${siteConfig.contact.hours.split('\n')[0]}`,
    ],
  },
};

export function PrivacyPolicyPage() {
  const [activeId, setActiveId] = useState('collect');

  const scrollTo = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="Your privacy is paramount. Learn how we collect, use, and protect your personal information."
        breadcrumb="Home / Privacy Policy"
      />

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar TOC */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <Card className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400 mb-4">Contents</p>
                <nav className="space-y-1">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                        activeId === s.id
                          ? 'bg-primary-800 text-white'
                          : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                      }`}
                    >
                      <s.icon className="w-4 h-4 flex-shrink-0" />
                      {s.label}
                    </button>
                  ))}
                </nav>
                <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-800">
                  <p className="text-xs text-secondary-400 mb-3">Last updated: January 2025</p>
                  <LinkButton to="/contact" variant="outline" size="sm" className="w-full">
                    Contact Us
                  </LinkButton>
                </div>
              </Card>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-12">
            <motion.div {...fadeUp}>
              <Card className="p-8 md:p-10">
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-2">
                  {siteConfig.bankName} ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our banking services and website. Please read this policy carefully to understand our practices regarding your data.
                </p>
              </Card>
            </motion.div>

            {sections.map((s) => (
              <motion.div key={s.id} id={s.id} {...fadeUp} className="scroll-mt-8">
                <Card className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                      <s.icon className="w-5 h-5 text-accent-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-900 dark:text-white font-serif">{s.label}</h2>
                  </div>
                  <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-5">{content[s.id].intro}</p>
                  <ul className="space-y-3">
                    {content[s.id].points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2.5 flex-shrink-0" />
                        <span className="text-secondary-700 dark:text-secondary-300 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, UserPlus, Shield, Scale, AlertTriangle, Gavel, RefreshCw, Mail } from 'lucide-react';
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
  { id: 'acceptance', label: 'Acceptance of Terms', icon: CheckCircle },
  { id: 'use', label: 'Use of Services', icon: FileText },
  { id: 'account', label: 'Account Registration', icon: UserPlus },
  { id: 'ip', label: 'Intellectual Property', icon: Shield },
  { id: 'liability', label: 'Limitation of Liability', icon: Scale },
  { id: 'disclaimer', label: 'Disclaimer', icon: AlertTriangle },
  { id: 'governing', label: 'Governing Law', icon: Gavel },
  { id: 'changes', label: 'Changes to Terms', icon: RefreshCw },
  { id: 'contact', label: 'Contact', icon: Mail },
];

const content: Record<string, { intro: string; points: string[] }> = {
  acceptance: {
    intro: 'By accessing or using the services provided by Evercrest Bank (the "Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use our Services.',
    points: [
      'These Terms constitute a legally binding agreement between you and Evercrest Bank.',
      'By using our Services, you affirm that you are at least 18 years of age and legally capable of entering into binding contracts.',
      'Additional terms may apply to specific products and services, which are incorporated by reference.',
    ],
  },
  use: {
    intro: 'You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree not to:',
    points: [
      'Use our Services to violate any law, regulation, or third-party rights.',
      'Attempt to gain unauthorized access to any part of our system, accounts, or data.',
      'Interfere with or disrupt the security or operation of our Services.',
      'Use our Services to transmit viruses, malware, or any malicious code.',
      'Reproduce, duplicate, or resell any portion of our Services without authorization.',
    ],
  },
  account: {
    intro: 'To access certain features, you must register for an account. You are responsible for maintaining the security of your account:',
    points: [
      'Provide accurate, current, and complete information during registration.',
      'Keep your login credentials confidential and never share them with others.',
      'Notify us immediately of any unauthorized use or security breach.',
      'You are responsible for all activities that occur under your account.',
      'Accounts are non-transferable and may not be sold or assigned to another party.',
    ],
  },
  ip: {
    intro: 'All content and materials provided through our Services, including text, graphics, logos, and software, are the property of Evercrest Bank or its licensors and are protected by intellectual property laws:',
    points: [
      'The Evercrest Bank name, logo, and brand elements are registered trademarks.',
      'You may not use, copy, or distribute our content without prior written consent.',
      'User-generated content remains the property of the user, subject to a limited license granted to us for service operation.',
      'Unauthorized use of any intellectual property may result in legal action.',
    ],
  },
  liability: {
    intro: 'To the fullest extent permitted by law, Evercrest Bank shall not be liable for any indirect, incidental, or consequential damages arising from your use of our Services:',
    points: [
      'We are not liable for loss of profits, data, or goodwill resulting from service use.',
      'Our total liability shall not exceed the fees paid by you in the preceding twelve months.',
      'We are not responsible for the actions or content of third-party service providers.',
      'Some jurisdictions do not allow certain liability limitations, so these may not apply to you.',
    ],
  },
  disclaimer: {
    intro: 'Our Services are provided on an "as is" and "as available" basis. We make the following disclaimers:',
    points: [
      'We do not warrant that our Services will be uninterrupted, secure, or error-free.',
      'We do not guarantee the accuracy, completeness, or reliability of any information provided.',
      'Any reliance on our Services is at your own risk.',
      'Financial advice provided through our Services does not constitute a guarantee of performance.',
    ],
  },
  governing: {
    intro: 'These Terms and any disputes arising from them shall be governed by and construed in accordance with the following:',
    points: [
      'The laws of the State of New York, without regard to conflict-of-law principles.',
      'Any disputes shall be resolved in the courts located in New York County, New York.',
      'You and Evercrest Bank agree to submit to the personal jurisdiction of such courts.',
    ],
  },
  changes: {
    intro: 'We reserve the right to modify these Terms at any time. When we do, we will update this page and revise the date below:',
    points: [
      'Continued use of our Services after changes constitutes acceptance of the updated Terms.',
      'We will notify you of significant changes through your registered email or a notice on our website.',
      'We encourage you to review these Terms periodically to stay informed.',
    ],
  },
  contact: {
    intro: 'If you have any questions or concerns about these Terms of Service, please reach out to us:',
    points: [
      `Phone: ${siteConfig.contact.phone}`,
      `Email: ${siteConfig.contact.email}`,
      `Address: ${siteConfig.contact.address}`,
    ],
  },
};

export function TermsPage() {
  const [activeId, setActiveId] = useState('acceptance');

  const scrollTo = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <PageHeader
        title="Terms of Service"
        subtitle="The terms and conditions that govern your use of Evercrest Bank services."
        breadcrumb="Home / Terms"
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
                  Welcome to {siteConfig.bankName}. These Terms of Service govern your access to and use of our website, mobile applications, and banking services. Please read them carefully before using our Services.
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

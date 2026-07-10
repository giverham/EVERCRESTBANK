import { motion } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Lock, Fingerprint, Eye, KeyRound,
  AlertTriangle, CheckCircle2, Bell, Smartphone, Server, FileCheck,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, SectionHeading } from '../../components/ui/Card';
import { LinkButton } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const features = [
  { icon: Lock, title: '256-bit Encryption', desc: 'All sensitive data is encrypted end-to-end using AES-256, the same standard used by the U.S. government.' },
  { icon: KeyRound, title: 'Multi-Factor Authentication', desc: 'A second verification step — via app, SMS, or email — keeps your account secure even if your password is compromised.' },
  { icon: Fingerprint, title: 'Biometric Login', desc: 'Use Face ID or fingerprint recognition for fast, secure access on our mobile app without typing a password.' },
  { icon: Eye, title: 'Real-Time Fraud Monitoring', desc: 'AI-powered systems analyze transactions 24/7, flagging and blocking suspicious activity instantly.' },
];

const safetyTips = [
  { icon: KeyRound, text: 'Use unique, strong passwords — never reuse them across sites.' },
  { icon: Smartphone, text: 'Enable biometric login and MFA on all your financial accounts.' },
  { icon: Bell, text: 'Set up transaction alerts so you know instantly when money moves.' },
  { icon: AlertTriangle, text: 'Never share OTPs or verification codes with anyone — including us.' },
  { icon: Eye, text: 'Review your account statements regularly for unfamiliar charges.' },
  { icon: Lock, text: 'Only access banking on private, trusted networks — never public Wi-Fi.' },
];

export function SecurityPage() {
  return (
    <>
      <PageHeader
        title="Security & Protection"
        subtitle="Your trust is the foundation of our bank. We protect your money and data with industry-leading security."
        breadcrumb="Home / Security"
      />

      {/* Security Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Protection"
          title="Multi-Layered Security Architecture"
          subtitle="We combine cutting-edge technology with proven security practices to safeguard what matters most."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {features.map((feature, i) => (
            <motion.div key={feature.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 h-full flex gap-5 items-start">
                <div className="w-14 h-14 rounded-2xl bg-success-500/15 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-7 h-7 text-success-600 dark:text-success-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">{feature.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FDIC Insurance */}
      <section className="py-20 bg-secondary-100 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <Badge variant="success" className="mb-4"><ShieldCheck className="w-3.5 h-3.5" /> FDIC Insured</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white mb-6 font-serif">
                Your Deposits Are Protected
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-8">
                Evercrest Bank is a member of the FDIC. All deposits are insured up to $250,000 per depositor, per ownership category. In the unlikely event of a bank failure, your money is backed by the full faith and credit of the United States government.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white dark:bg-secondary-800 shadow-premium">
                  <p className="text-3xl font-bold text-success-600 dark:text-success-500 font-serif">$250K</p>
                  <p className="text-sm text-secondary-500 mt-1">Per Depositor Coverage</p>
                </div>
                <div className="p-5 rounded-xl bg-white dark:bg-secondary-800 shadow-premium">
                  <p className="text-3xl font-bold text-success-600 dark:text-success-500 font-serif">100%</p>
                  <p className="text-sm text-secondary-500 mt-1">U.S. Government Backed</p>
                </div>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <Card className="p-10 gradient-primary text-white text-center">
                <ShieldCheck className="w-20 h-20 text-accent-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-3 font-serif">Member FDIC</h3>
                <p className="text-secondary-200 leading-relaxed mb-6">
                  Evercrest Bank has been FDIC-insured since 1987, protecting depositors for over 35 years.
                </p>
                <div className="flex justify-center gap-3">
                  <Badge variant="accent"><FileCheck className="w-3.5 h-3.5" /> Since 1987</Badge>
                  <Badge variant="accent"><Server className="w-3.5 h-3.5" /> SOC 2 Certified</Badge>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Stay Safe"
          title="Your Role in Security"
          subtitle="Security is a partnership. Follow these best practices to keep your accounts safe."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {safetyTips.map((tip, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}>
              <Card hover className="p-6 h-full flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                  <tip.icon className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                </div>
                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed pt-2">{tip.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Fraud Reporting */}
      <section className="py-20 bg-secondary-100 dark:bg-secondary-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <Card className="p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 rounded-2xl bg-error-500/15 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-10 h-10 text-error-500" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-primary-900 dark:text-white mb-2 font-serif">Suspect Fraud?</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Our fraud team is available 24/7. Contact us immediately if you notice any suspicious activity on your account.
                </p>
              </div>
              <LinkButton to="/contact" variant="danger" size="lg">
                Report Now <ArrowRight className="w-5 h-5" />
              </LinkButton>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <Card className="p-12 md:p-16 gradient-primary text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <CheckCircle2 className="w-12 h-12 text-accent-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Bank with Confidence</h2>
                <p className="text-secondary-200 mb-8 max-w-xl mx-auto">
                  Your security is built into everything we do. Experience banking that puts your safety first.
                </p>
                <LinkButton to="/contact" variant="accent" size="lg">
                  Get in Touch <ArrowRight className="w-5 h-5" />
                </LinkButton>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}

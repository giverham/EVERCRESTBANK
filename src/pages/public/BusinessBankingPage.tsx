import { motion } from 'framer-motion';
import {
  ArrowRight, Building2, Briefcase, CreditCard, Users, Landmark,
  TrendingUp, ShieldCheck, BarChart3, Wallet, Store,
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

const accounts = [
  {
    icon: Store,
    name: 'Small Business Checking',
    tag: 'For Startups',
    desc: 'No monthly fees for businesses with under $5,000 in monthly transactions.',
    features: ['500 free transactions/mo', 'No minimum balance', 'Free online banking', 'Mobile deposit included'],
  },
  {
    icon: Briefcase,
    name: 'Business Premium Checking',
    tag: 'Most Popular',
    desc: 'Comprehensive account with wire transfers, treasury tools, and dedicated support.',
    features: ['Unlimited transactions', 'Free wire transfers', 'Treasury management', 'Dedicated banker'],
  },
  {
    icon: Landmark,
    name: 'Commercial Savings',
    tag: 'Earn Interest',
    desc: 'Grow your business reserves with competitive interest and flexible access.',
    features: ['Tiered interest rates', 'No monthly fees', 'FDIC insured', 'Online transfers'],
  },
];

const services = [
  { icon: CreditCard, title: 'Merchant Services', desc: 'Accept payments in-store and online with competitive processing rates and next-day funding.' },
  { icon: Users, title: 'Payroll Services', desc: 'Streamline payroll processing with automated tax filings, direct deposit, and employee self-service.' },
  { icon: BarChart3, title: 'Treasury Management', desc: 'Optimize cash flow with fraud protection, ACH services, and real-time reporting tools.' },
  { icon: Wallet, title: 'Business Credit Cards', desc: 'Earn rewards on business spending with cards designed for companies of every size.' },
];

const benefits = [
  { icon: ShieldCheck, title: 'FDIC Insured', desc: 'Business deposits protected up to the maximum allowable limit.' },
  { icon: TrendingUp, title: 'Growth Tools', desc: 'Analytics and insights to help your business scale with confidence.' },
  { icon: Users, title: 'Dedicated Banker', desc: 'A single point of contact who understands your business needs.' },
  { icon: BarChart3, title: 'Real-Time Reporting', desc: 'Track cash flow and transactions with detailed dashboards.' },
];

export function BusinessBankingPage() {
  return (
    <>
      <PageHeader
        title="Business Banking"
        subtitle="Comprehensive financial solutions for businesses of every size. From startups to enterprises, we help you grow with confidence."
        breadcrumb="Home / Business Banking"
      />

      {/* Account Types */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Business Accounts"
          title="Accounts Built for Business"
          subtitle="Choose the right account to manage your cash flow, payroll, and everyday operations efficiently."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {accounts.map((account, i) => (
            <motion.div key={account.name} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                    <account.icon className="w-7 h-7 text-accent-400" />
                  </div>
                  <Badge variant="accent">{account.tag}</Badge>
                </div>
                <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-3">{account.name}</h3>
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-5">{account.desc}</p>
                <ul className="space-y-2 mb-6">
                  {account.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-secondary-700 dark:text-secondary-300">
                      <ShieldCheck className="w-4 h-4 text-success-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <LinkButton to="/contact" variant="outline" size="md" className="mt-auto self-start">
                  Learn More <ArrowRight className="w-4 h-4" />
                </LinkButton>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-primary-900 dark:bg-primary-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Business Services"
            title="Everything Your Business Needs"
            subtitle="Beyond banking, we provide the tools and services to help your business operate efficiently and grow sustainably."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {services.map((service, i) => (
              <motion.div key={service.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 h-full flex gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-7 h-7 text-accent-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-sm text-secondary-400 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="A Banking Partner You Can Trust"
          subtitle="We understand business. Our solutions are designed to help you focus on what matters most: growing your company."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {benefits.map((benefit, i) => (
            <motion.div key={benefit.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 text-center h-full">
                <div className="w-16 h-16 rounded-2xl bg-accent-500/15 flex items-center justify-center mx-auto mb-5">
                  <benefit.icon className="w-8 h-8 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{benefit.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <Card className="p-12 md:p-16 gradient-primary text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <Building2 className="w-10 h-10 text-accent-400 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Let's Grow Your Business Together</h2>
                <p className="text-secondary-200 mb-8 max-w-xl mx-auto">
                  Speak with our business banking specialists to find the right financial solutions for your company.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <LinkButton to="/contact" variant="accent" size="lg">
                    Contact Us <ArrowRight className="w-5 h-5" />
                  </LinkButton>
                  <LinkButton to="/loans" variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                    Explore Business Loans
                  </LinkButton>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}

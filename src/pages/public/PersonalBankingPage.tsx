import { motion } from 'framer-motion';
import {
  ArrowRight, Wallet, PiggyBank, Clock, TrendingUp, ShieldCheck,
  Smartphone, Headphones, Gift, Landmark,
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
    icon: Wallet,
    name: 'Everyday Checking',
    tag: 'Most Popular',
    desc: 'No monthly fees, unlimited transactions, and free access to 340+ branches nationwide.',
    features: ['No minimum balance', 'Free debit card', 'Mobile check deposit', 'Bill pay included'],
  },
  {
    icon: PiggyBank,
    name: 'High-Yield Savings',
    tag: '4.50% APY',
    desc: 'Earn one of the highest rates in the nation with no monthly maintenance fees.',
    features: ['4.50% APY guaranteed', 'No minimum balance', 'FDIC insured', 'Daily compounding interest'],
  },
  {
    icon: Landmark,
    name: 'Certificate of Deposit',
    tag: 'Fixed Returns',
    desc: 'Lock in competitive rates with flexible terms from 6 months to 5 years.',
    features: ['Terms 6–60 months', 'Fixed interest rate', 'No maintenance fees', 'FDIC insured up to limits'],
  },
  {
    icon: TrendingUp,
    name: 'Money Market Account',
    tag: 'Premium Access',
    desc: 'Higher yields with check-writing privileges and tiered interest rates.',
    features: ['Tiered interest rates', 'Check-writing access', 'Debit card included', 'Unlimited transfers'],
  },
];

const benefits = [
  { icon: Smartphone, title: 'Mobile Banking', desc: 'Deposit checks, pay bills, and transfer funds from anywhere.' },
  { icon: ShieldCheck, title: 'FDIC Insured', desc: 'Deposits protected up to the maximum allowable limit.' },
  { icon: Clock, title: '24/7 Access', desc: 'Manage your accounts anytime with our digital platform.' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'Real people ready to help whenever you need assistance.' },
  { icon: Gift, title: 'Rewards Program', desc: 'Earn points on debit card purchases and redeem for cash.' },
  { icon: TrendingUp, title: 'Financial Tools', desc: 'Budgeting, spending insights, and savings goals built in.' },
];

export function PersonalBankingPage() {
  return (
    <>
      <PageHeader
        title="Personal Banking"
        subtitle="Banking solutions designed around your life. From everyday checking to high-yield savings, we have the right account for you."
        breadcrumb="Home / Personal Banking"
      />

      {/* Account Types */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Account Options"
          title="Find the Right Account for You"
          subtitle="Whether you're saving for the future or managing daily expenses, our accounts offer premium features and competitive rates."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
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

      {/* Benefits */}
      <section className="py-20 bg-primary-900 dark:bg-primary-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Bank With Us"
            title="Banking That Works for You"
            subtitle="Experience the perfect blend of personal service and modern technology."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {benefits.map((benefit, i) => (
              <motion.div key={benefit.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 h-full">
                  <div className="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-secondary-400 leading-relaxed">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Ready to Open an Account?</h2>
                <p className="text-secondary-200 mb-8 max-w-xl mx-auto">
                  Contact our team today to find the perfect personal banking solution for your financial goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <LinkButton to="/contact" variant="accent" size="lg">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </LinkButton>
                  <LinkButton to="/savings" variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                    Compare Savings
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

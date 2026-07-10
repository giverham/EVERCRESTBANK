import { motion } from 'framer-motion';
import {
  ArrowRight, Wallet, Award, TrendingUp, ShieldCheck, Smartphone,
  Gift, Clock, Check, X, Headphones, CreditCard,
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

const tiers = [
  { icon: Wallet, name: 'Basic Checking', tag: 'No Frills', desc: 'A straightforward checking account with no monthly fees and everything you need for everyday banking.', features: ['No monthly maintenance fee', 'Free debit card', 'Unlimited transactions', 'Mobile banking app'] },
  { icon: Award, name: 'Premium Checking', tag: 'Most Popular', desc: 'Enhanced benefits including rewards, priority support, and waived fees on premium services.', features: ['1% cashback on debit', 'Free wire transfers', 'Priority customer support', 'No ATM fees nationwide'] },
  { icon: TrendingUp, name: 'Interest-Bearing Checking', tag: 'Earn Interest', desc: 'Earn competitive interest on your checking balance with all the features of a premium account.', features: ['0.50% APY on balances', 'No minimum balance', 'All premium benefits', 'Free overdraft protection'] },
];

const featureComparison = [
  { feature: 'Monthly Maintenance Fee', basic: '$0', premium: '$0', interest: '$0' },
  { feature: 'Minimum Balance', basic: 'None', premium: 'None', interest: 'None' },
  { feature: 'Debit Card', basic: true, premium: true, interest: true },
  { feature: 'Mobile Banking', basic: true, premium: true, interest: true },
  { feature: 'Cashback Rewards', basic: false, premium: true, interest: true },
  { feature: 'Free Wire Transfers', basic: false, premium: true, interest: true },
  { feature: 'Interest on Balance', basic: false, premium: false, interest: true },
  { feature: 'Overdraft Protection', basic: false, premium: true, interest: true },
  { feature: 'Priority Support', basic: false, premium: true, interest: true },
  { feature: 'ATM Fee Reimbursement', basic: false, premium: true, interest: true },
];

const benefits = [
  { icon: Smartphone, title: 'Mobile Banking', desc: 'Deposit checks, pay bills, and transfer funds from your phone.' },
  { icon: ShieldCheck, title: 'FDIC Insured', desc: 'Your deposits are protected up to the maximum allowable limit.' },
  { icon: Gift, title: 'Rewards Program', desc: 'Earn points and cashback on everyday debit card purchases.' },
  { icon: Clock, title: '24/7 Access', desc: 'Bank anytime, anywhere with our digital platform and ATM network.' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'Real people ready to help with any banking need, day or night.' },
  { icon: CreditCard, title: 'Free Debit Card', desc: 'Instant-issue debit card with contactless pay and zero liability.' },
];

export function CheckingPage() {
  return (
    <>
      <PageHeader
        title="Checking Accounts"
        subtitle="Checking accounts designed for how you live. No hidden fees, premium features, and the flexibility to bank your way."
        breadcrumb="Home / Checking Accounts"
      />

      {/* Account Tiers */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Account Tiers" title="Choose Your Checking Account" subtitle="From basic to premium, every account comes with no monthly fees and full digital banking access." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {tiers.map((tier, i) => (
            <motion.div key={tier.name} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                    <tier.icon className="w-7 h-7 text-accent-400" />
                  </div>
                  <Badge variant="accent">{tier.tag}</Badge>
                </div>
                <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-3">{tier.name}</h3>
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-5">{tier.desc}</p>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
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

      {/* Feature Comparison Table */}
      <section className="py-20 bg-secondary-100 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Compare Features" title="Checking Account Comparison" subtitle="See exactly what each checking tier includes to find the perfect match for your banking needs." />
          <motion.div {...fadeUp} className="mt-12">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary-800 dark:bg-primary-900">
                      <th className="p-5 text-left text-white font-semibold text-sm">Feature</th>
                      <th className="p-5 text-center text-white font-semibold text-sm">Basic</th>
                      <th className="p-5 text-center text-white font-semibold text-sm">Premium</th>
                      <th className="p-5 text-center text-white font-semibold text-sm">Interest-Bearing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureComparison.map((row, i) => (
                      <tr key={row.feature} className={i % 2 === 0 ? 'bg-white dark:bg-secondary-900' : 'bg-secondary-50 dark:bg-secondary-800/50'}>
                        <td className="p-5 font-semibold text-primary-900 dark:text-white text-sm">{row.feature}</td>
                        {(['basic', 'premium', 'interest'] as const).map((key) => (
                          <td key={key} className="p-5 text-center text-sm text-secondary-700 dark:text-secondary-300">
                            {typeof row[key] === 'boolean' ? (
                              row[key] ? <Check className="w-5 h-5 text-success-500 mx-auto" /> : <X className="w-5 h-5 text-secondary-400 mx-auto" />
                            ) : (
                              row[key]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Why Choose Us" title="Checking That Fits Your Life" subtitle="Every Evercrest checking account comes packed with features designed to make banking effortless." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {benefits.map((benefit, i) => (
            <motion.div key={benefit.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center mb-5">
                  <benefit.icon className="w-6 h-6 text-accent-600 dark:text-accent-400" />
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
                <Wallet className="w-10 h-10 text-accent-400 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Open Your Checking Account Today</h2>
                <p className="text-secondary-200 mb-8 max-w-xl mx-auto">
                  Experience fee-free checking with premium features. Contact our team to get started in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <LinkButton to="/contact" variant="accent" size="lg">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </LinkButton>
                  <LinkButton to="/savings" variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                    Explore Savings
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

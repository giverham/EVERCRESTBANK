import { motion } from 'framer-motion';
import {
  ArrowRight, PiggyBank, TrendingUp, Landmark, Clock, ShieldCheck,
  Percent, Calendar, Check, X,
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

const products = [
  { icon: TrendingUp, name: 'High-Yield Savings', rate: '4.50%', apy: 'APY', tag: 'Best Rate', desc: 'Earn one of the highest savings rates in the nation with no minimum balance and no monthly fees.', features: ['No minimum balance', 'No monthly fees', 'Daily compounding', 'FDIC insured'] },
  { icon: PiggyBank, name: 'Regular Savings', rate: '0.45%', apy: 'APY', tag: 'Flexible', desc: 'A simple, accessible savings account perfect for building an emergency fund or saving for goals.', features: ['$100 minimum balance', 'No monthly fees', 'Unlimited deposits', 'FDIC insured'] },
  { icon: Landmark, name: 'Certificate of Deposit', rate: '4.75%', apy: 'APY', tag: 'Fixed Returns', desc: 'Lock in a guaranteed rate with terms from 6 months to 5 years. Your principal is always protected.', features: ['Terms 6–60 months', 'Guaranteed rate', 'No maintenance fees', 'FDIC insured'] },
  { icon: Clock, name: 'Money Market Account', rate: '3.25%', apy: 'APY', tag: 'Premium Access', desc: 'Combine higher yields with the flexibility of check-writing and debit card access to your funds.', features: ['Tiered interest rates', 'Check-writing access', 'Debit card included', 'FDIC insured'] },
];

const rateComparison = [
  { feature: 'Interest Rate (APY)', high: '4.50%', regular: '0.45%', cd: '4.75%', mm: '3.25%' },
  { feature: 'Minimum Balance', high: '$0', regular: '$100', cd: '$1,000', mm: '$2,500' },
  { feature: 'Monthly Fees', high: 'None', regular: 'None', cd: 'None', mm: 'None' },
  { feature: 'Check Writing', high: false, regular: false, cd: false, mm: true },
  { feature: 'Debit Card Access', high: false, regular: false, cd: false, mm: true },
  { feature: 'Fixed Rate Term', high: false, regular: false, cd: true, mm: false },
  { feature: 'FDIC Insured', high: true, regular: true, cd: true, mm: true },
];

const benefits = [
  { icon: ShieldCheck, title: 'FDIC Insured', desc: 'Your deposits are protected up to the maximum allowable limit.' },
  { icon: Percent, title: 'Competitive Rates', desc: 'Some of the best rates in the industry, guaranteed to help you grow.' },
  { icon: Calendar, title: 'Flexible Terms', desc: 'Choose the savings product that matches your timeline and goals.' },
  { icon: TrendingUp, title: 'Compound Growth', desc: 'Daily compounding interest maximizes your earnings over time.' },
];

export function SavingsPage() {
  return (
    <>
      <PageHeader
        title="Savings Accounts"
        subtitle="Grow your money with confidence. Choose from a range of savings products with competitive rates and flexible terms."
        breadcrumb="Home / Savings Accounts"
      />

      {/* Savings Products */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Savings Products" title="Find Your Perfect Savings Account" subtitle="Whether you want maximum yield, fixed returns, or flexible access, we have a savings solution for you." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {products.map((product, i) => (
            <motion.div key={product.name} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                    <product.icon className="w-7 h-7 text-accent-400" />
                  </div>
                  <Badge variant="accent">{product.tag}</Badge>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary-800 dark:text-accent-400 font-serif">{product.rate}</span>
                  <span className="text-sm text-secondary-500 dark:text-secondary-400 font-semibold">{product.apy}</span>
                </div>
                <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-3">{product.name}</h3>
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-5">{product.desc}</p>
                <ul className="space-y-2 mb-6">
                  {product.features.map((f) => (
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

      {/* Rate Comparison Table */}
      <section className="py-20 bg-secondary-100 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Compare Accounts" title="Savings Account Comparison" subtitle="Compare our savings products side by side to find the best fit for your financial goals." />
          <motion.div {...fadeUp} className="mt-12">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary-800 dark:bg-primary-900">
                      <th className="p-5 text-left text-white font-semibold text-sm">Feature</th>
                      <th className="p-5 text-center text-white font-semibold text-sm">High-Yield</th>
                      <th className="p-5 text-center text-white font-semibold text-sm">Regular</th>
                      <th className="p-5 text-center text-white font-semibold text-sm">CD</th>
                      <th className="p-5 text-center text-white font-semibold text-sm">Money Market</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateComparison.map((row, i) => (
                      <tr key={row.feature} className={i % 2 === 0 ? 'bg-white dark:bg-secondary-900' : 'bg-secondary-50 dark:bg-secondary-800/50'}>
                        <td className="p-5 font-semibold text-primary-900 dark:text-white text-sm">{row.feature}</td>
                        {(['high', 'regular', 'cd', 'mm'] as const).map((key) => (
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
        <SectionHeading eyebrow="Why Save With Us" title="Your Savings, Protected and Growing" subtitle="We make saving simple, secure, and rewarding with industry-leading rates and service." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {benefits.map((benefit, i) => (
            <motion.div key={benefit.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 text-center h-full">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5">
                  <benefit.icon className="w-8 h-8 text-accent-400" />
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
                <PiggyBank className="w-10 h-10 text-accent-400 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Start Growing Your Savings Today</h2>
                <p className="text-secondary-200 mb-8 max-w-xl mx-auto">
                  Open a savings account with Evercrest Bank and watch your money grow with competitive rates and zero hassle.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <LinkButton to="/contact" variant="accent" size="lg">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </LinkButton>
                  <LinkButton to="/checking" variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                    Explore Checking
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

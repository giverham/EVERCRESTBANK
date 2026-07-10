import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  ArrowRight, Landmark, Car, Home, Wallet, ChevronDown,
  CheckCircle2, FileText, ShieldCheck, Clock, Calculator,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, SectionHeading } from '../../components/ui/Card';
import { LinkButton } from '../../components/ui/Button';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const loanTypes = [
  { icon: Wallet, title: 'Personal Loans', rate: '8.99%', desc: 'Consolidate debt or fund major purchases with flexible terms up to 60 months.', amount: '$1,000 – $50,000' },
  { icon: Car, title: 'Auto Loans', rate: '6.49%', desc: 'Finance a new or used vehicle with competitive rates and fast approval.', amount: '$5,000 – $100,000' },
  { icon: Home, title: 'Home / Mortgage', rate: '6.25%', desc: 'Purchase or refinance your home with fixed and adjustable rate options.', amount: '$50,000 – $2M+' },
  { icon: Landmark, title: 'Home Equity', rate: '7.49%', desc: 'Tap into your home equity for renovations, education, or major expenses.', amount: '$10,000 – $500,000' },
];

const rates = [
  { type: 'Personal Loan', term: '12–60 months', apr: '8.99% – 15.99%' },
  { type: 'Auto Loan (New)', term: '36–72 months', apr: '6.49% – 9.99%' },
  { type: 'Auto Loan (Used)', term: '36–60 months', apr: '7.49% – 11.49%' },
  { type: 'Mortgage (30-yr Fixed)', term: '30 years', apr: '6.25% – 7.50%' },
  { type: 'Mortgage (15-yr Fixed)', term: '15 years', apr: '5.75% – 6.75%' },
  { type: 'Home Equity Line', term: '10–20 years', apr: '7.49% – 9.99%' },
];

const steps = [
  { icon: FileText, title: 'Apply Online', desc: 'Complete a simple application in minutes with no obligation.' },
  { icon: Calculator, title: 'Get Your Rate', desc: 'Receive a personalized rate quote based on your credit profile.' },
  { icon: ShieldCheck, title: 'Verify & Approve', desc: 'Submit documents securely and get approved within 24–48 hours.' },
  { icon: CheckCircle2, title: 'Receive Funds', desc: 'Funds deposited directly into your account upon final approval.' },
];

const faqs = [
  { q: 'What credit score do I need to qualify?', a: 'Most loan products require a minimum credit score of 660. However, we evaluate the full financial picture including income, debt-to-income ratio, and payment history.' },
  { q: 'Are there prepayment penalties?', a: 'No. Evercrest Bank does not charge prepayment penalties on any of our loan products. You can pay off your loan early without any fees.' },
  { q: 'How long does the approval process take?', a: 'Most personal and auto loan applications receive a decision within 24–48 hours. Mortgage applications typically take 2–4 weeks from application to closing.' },
  { q: 'Can I apply with a co-signer?', a: 'Yes. A co-signer can help you qualify for better rates or higher loan amounts. Both applicants are subject to credit review.' },
];

export function LoansPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <PageHeader
        title="Loans & Lending"
        subtitle="Competitive rates, transparent terms, and a seamless application process for every stage of life."
        breadcrumb="Home / Loans"
      />

      {/* Loan Types */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Loan Products"
          title="Find the Right Loan for You"
          subtitle="From personal expenses to your dream home, we offer flexible financing with competitive rates."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {loanTypes.map((loan, i) => (
            <motion.div key={loan.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-5">
                  <loan.icon className="w-7 h-7 text-accent-400" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2">{loan.title}</h3>
                <p className="text-2xl font-bold text-accent-600 dark:text-accent-400 font-serif mb-3">
                  {loan.rate}<span className="text-sm font-normal text-secondary-500"> APR*</span>
                </p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed mb-4 flex-1">{loan.desc}</p>
                <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 border-t border-secondary-200 dark:border-secondary-800 pt-3">
                  {loan.amount}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rates Table */}
      <section className="py-20 bg-secondary-100 dark:bg-secondary-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Current Rates"
            title="Transparent. Competitive. Clear."
            subtitle="Our rates are updated regularly. Your actual rate depends on creditworthiness and loan terms."
          />
          <motion.div {...fadeUp} className="mt-12">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="gradient-primary text-white text-left">
                      <th className="px-6 py-4 font-semibold">Loan Type</th>
                      <th className="px-6 py-4 font-semibold">Term</th>
                      <th className="px-6 py-4 font-semibold">APR Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((r, i) => (
                      <tr key={r.type} className={i % 2 === 0 ? 'bg-white dark:bg-secondary-900' : 'bg-secondary-50 dark:bg-secondary-800/50'}>
                        <td className="px-6 py-4 font-semibold text-primary-900 dark:text-white">{r.type}</td>
                        <td className="px-6 py-4 text-secondary-600 dark:text-secondary-400">{r.term}</td>
                        <td className="px-6 py-4 font-bold text-accent-600 dark:text-accent-400">{r.apr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <p className="text-xs text-secondary-400 mt-4 text-center">*Rates shown are starting APRs. Actual rates may vary based on credit profile and loan terms.</p>
          </motion.div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="A Simple, Streamlined Process"
          subtitle="Get from application to funded in four easy steps."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {steps.map((step, i) => (
            <motion.div key={step.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card className="p-8 h-full text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full gradient-primary text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-accent-500/15 flex items-center justify-center mx-auto mb-5 mt-2">
                  <step.icon className="w-7 h-7 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="font-bold text-primary-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{step.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-secondary-100 dark:bg-secondary-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Loan Questions Answered" subtitle="Everything you need to know about borrowing with Evercrest." />
          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 glass-strong rounded-xl text-left"
                >
                  <span className="font-semibold text-primary-900 dark:text-white">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-accent-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="p-5 text-secondary-600 dark:text-secondary-400 leading-relaxed">{faq.a}</p>
                </motion.div>
              </div>
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
              <div className="relative z-10">
                <Clock className="w-12 h-12 text-accent-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Ready to Get Started?</h2>
                <p className="text-secondary-200 mb-8 max-w-xl mx-auto">
                  Speak with a lending specialist or start your application today. No obligation, no hidden fees.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <LinkButton to="/contact" variant="accent" size="lg">
                    Speak to a Specialist <ArrowRight className="w-5 h-5" />
                  </LinkButton>
                  <LinkButton to="/login" variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                    Apply Online
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

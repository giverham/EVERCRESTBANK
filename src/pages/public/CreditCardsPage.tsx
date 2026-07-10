import { motion } from 'framer-motion';
import {
  ArrowRight, Check, Star, Plane, Gift, Shield,
  Coffee, ShoppingBag, Gem, Crown,
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

const cards = [
  {
    name: 'Evercrest Classic',
    tier: 'Classic',
    annualFee: '$0',
    apr: '15.99% – 22.99%',
    gradient: 'from-secondary-200 to-secondary-400',
    accent: 'text-primary-800',
    rewards: '1% cashback on all purchases',
    perks: [
      { icon: ShoppingBag, text: '1% unlimited cashback' },
      { icon: Shield, text: 'Zero liability fraud protection' },
      { icon: Coffee, text: 'No annual fee, ever' },
    ],
  },
  {
    name: 'Evercrest Gold',
    tier: 'Gold',
    annualFee: '$95',
    apr: '14.99% – 21.99%',
    gradient: 'from-accent-400 via-accent-500 to-accent-600',
    accent: 'text-accent-700',
    featured: true,
    rewards: '2x points on dining & travel',
    perks: [
      { icon: Plane, text: '2x points on travel & dining' },
      { icon: Gift, text: 'Welcome bonus: 40,000 points' },
      { icon: Star, text: 'No foreign transaction fees' },
    ],
  },
  {
    name: 'Evercrest Black',
    tier: 'Black',
    annualFee: '$495',
    apr: '13.99% – 20.99%',
    gradient: 'from-primary-800 via-primary-900 to-black',
    accent: 'text-accent-400',
    rewards: '3x points on all premium spend',
    perks: [
      { icon: Crown, text: '24/7 personal concierge service' },
      { icon: Gem, text: '3x points + airport lounge access' },
      { icon: Plane, text: 'Annual $300 travel credit' },
    ],
  },
];

const comparison = [
  { feature: 'Annual Fee', classic: '$0', gold: '$95', black: '$495' },
  { feature: 'Cashback / Points', classic: '1% flat', gold: '2x dining & travel', black: '3x all premium' },
  { feature: 'Welcome Bonus', classic: '—', gold: '40,000 pts', black: '75,000 pts' },
  { feature: 'Foreign Transaction Fee', classic: '3%', gold: '0%', black: '0%' },
  { feature: 'Airport Lounge Access', classic: '—', gold: '—', black: 'Unlimited' },
  { feature: 'Concierge Service', classic: '—', gold: '—', black: '24/7' },
  { feature: 'Travel Credit', classic: '—', gold: '—', black: '$300/yr' },
];

export function CreditCardsPage() {
  return (
    <>
      <PageHeader
        title="Credit Cards"
        subtitle="Premium cards designed for your lifestyle. Earn rewards, travel smarter, and enjoy exclusive benefits."
        breadcrumb="Home / Credit Cards"
      />

      {/* Card Tiers */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Cards"
          title="Choose Your Tier"
          subtitle="From everyday spending to luxury travel — there's an Evercrest card for you."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 items-start">
          {cards.map((card, i) => (
            <motion.div key={card.name} {...fadeUp} transition={{ delay: i * 0.15 }} className="flex flex-col">
              {/* Visual Card */}
              <div className={`relative h-52 rounded-2xl bg-gradient-to-br ${card.gradient} p-6 shadow-premium flex flex-col justify-between mb-6 overflow-hidden ${card.featured ? 'ring-2 ring-accent-500' : ''}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl" />
                <div className="relative z-10 flex justify-between items-start">
                  <div className="w-10 h-8 rounded-md bg-gradient-to-br from-accent-300 to-accent-600 shadow-lg" />
                  <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{card.tier}</span>
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-7 rounded-md border-2 border-white/30 mb-3 flex items-center justify-center">
                    <div className="w-6 h-4 rounded-sm bg-white/20" />
                  </div>
                  <p className="text-white font-serif text-lg font-bold">{card.name}</p>
                  <p className="text-white/70 text-xs mt-1">Member FDIC</p>
                </div>
              </div>

              {/* Card Details */}
              <Card className={`p-8 flex-1 flex flex-col ${card.featured ? 'ring-2 ring-accent-500' : ''}`}>
                {card.featured && (
                  <Badge variant="accent" className="mb-4 self-start">Most Popular</Badge>
                )}
                <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-1">{card.name}</h3>
                <p className="text-sm text-accent-600 dark:text-accent-400 font-semibold mb-6">{card.rewards}</p>
                <div className="flex justify-between mb-6 pb-6 border-b border-secondary-200 dark:border-secondary-800">
                  <div>
                    <p className="text-xs text-secondary-400">Annual Fee</p>
                    <p className="text-lg font-bold text-primary-900 dark:text-white">{card.annualFee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-secondary-400">APR</p>
                    <p className="text-sm font-bold text-primary-900 dark:text-white">{card.apr}</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {card.perks.map((perk) => (
                    <li key={perk.text} className="flex items-start gap-3">
                      <perk.icon className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">{perk.text}</span>
                    </li>
                  ))}
                </ul>
                <LinkButton to="/contact" variant={card.featured ? 'accent' : 'primary'} size="md" className="w-full">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </LinkButton>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-secondary-100 dark:bg-secondary-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Compare"
            title="Benefits at a Glance"
            subtitle="See how our card tiers compare side by side."
          />
          <motion.div {...fadeUp} className="mt-12">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="gradient-primary text-white text-left">
                      <th className="px-6 py-4 font-semibold">Feature</th>
                      <th className="px-6 py-4 font-semibold">Classic</th>
                      <th className="px-6 py-4 font-semibold text-accent-400">Gold</th>
                      <th className="px-6 py-4 font-semibold">Black</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row, i) => (
                      <tr key={row.feature} className={i % 2 === 0 ? 'bg-white dark:bg-secondary-900' : 'bg-secondary-50 dark:bg-secondary-800/50'}>
                        <td className="px-6 py-4 font-semibold text-primary-900 dark:text-white">{row.feature}</td>
                        <td className="px-6 py-4 text-secondary-600 dark:text-secondary-400">{row.classic}</td>
                        <td className="px-6 py-4 text-secondary-600 dark:text-secondary-400">{row.gold}</td>
                        <td className="px-6 py-4 text-secondary-600 dark:text-secondary-400">{row.black}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Rewards Spotlight */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Plane, title: 'Travel Rewards', desc: 'Redeem points for flights, hotels, and car rentals with no blackout dates.' },
            { icon: Gift, title: 'Cashback & Gifts', desc: 'Convert points to cashback, gift cards, or statement credits anytime.' },
            { icon: Crown, title: 'Exclusive Experiences', desc: 'VIP access to events, dining, and lifestyle perks for Black cardholders.' },
          ].map((item, i) => (
            <motion.div key={item.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 text-center h-full">
                <div className="w-16 h-16 rounded-2xl bg-accent-500/15 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-8 h-8 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{item.desc}</p>
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
              <div className="relative z-10">
                <Check className="w-12 h-12 text-accent-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Find Your Perfect Card</h2>
                <p className="text-secondary-200 mb-8 max-w-xl mx-auto">
                  Get a decision in minutes. No impact to your credit score to check eligibility.
                </p>
                <LinkButton to="/contact" variant="accent" size="lg">
                  Check Eligibility <ArrowRight className="w-5 h-5" />
                </LinkButton>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}

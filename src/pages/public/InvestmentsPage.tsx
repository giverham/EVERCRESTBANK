import { motion } from 'framer-motion';
import {
  ArrowRight, TrendingUp, Briefcase, PiggyBank, LineChart,
  Users, Target, BarChart3, PieChart, Award, Percent,
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

const services = [
  { icon: Briefcase, title: 'Wealth Management', desc: 'Personalized portfolio management for high-net-worth individuals and families.' },
  { icon: PiggyBank, title: 'Retirement Planning', desc: '401(k) rollovers, IRAs, and retirement income strategies tailored to you.' },
  { icon: LineChart, title: 'Brokerage Services', desc: 'Self-directed trading with low commissions and powerful research tools.' },
  { icon: Users, title: 'Financial Advisory', desc: 'Certified financial planners guiding you through every life milestone.' },
];

const portfolios = [
  { name: 'Conservative', risk: 'Low', return: '4–6%', stocks: 20, bonds: 70, cash: 10, color: 'from-success-400 to-success-600' },
  { name: 'Balanced', risk: 'Moderate', return: '6–8%', stocks: 50, bonds: 40, cash: 10, color: 'from-primary-400 to-primary-600' },
  { name: 'Growth', risk: 'High', return: '8–12%', stocks: 80, bonds: 15, cash: 5, color: 'from-accent-400 to-accent-600' },
];

const stats = [
  { icon: Award, value: '$48B+', label: 'Assets Under Management' },
  { icon: Users, value: '340+', label: 'Dedicated Advisors' },
  { icon: TrendingUp, value: '12.4%', label: '10-Year Avg. Return' },
  { icon: Percent, value: '0.25%', label: 'Advisory Fee (Lowest)' },
];

export function InvestmentsPage() {
  return (
    <>
      <PageHeader
        title="Investments & Wealth"
        subtitle="Expert guidance and powerful tools to grow, protect, and manage your wealth for generations."
        breadcrumb="Home / Investments"
      />

      {/* Stats */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card className="p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <p className="text-3xl font-bold text-primary-800 dark:text-accent-400 font-serif">{stat.value}</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Investment Services */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title="Comprehensive Wealth Solutions"
          subtitle="From retirement planning to active trading, our advisors help you build a strategy that fits."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {services.map((service, i) => (
            <motion.div key={service.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 h-full flex gap-5 items-start">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <service.icon className="w-7 h-7 text-accent-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">{service.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Portfolio Options */}
      <section className="py-20 bg-secondary-100 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Portfolio Options"
            title="Choose Your Investment Strategy"
            subtitle="Three diversified portfolios designed for different risk tolerances and financial goals."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {portfolios.map((p, i) => (
              <motion.div key={p.name} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Card hover className="p-8 h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-primary-900 dark:text-white">{p.name}</h3>
                      <Badge variant={p.risk === 'Low' ? 'success' : p.risk === 'Moderate' ? 'primary' : 'accent'} className="mt-2">
                        {p.risk} Risk
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent-600 dark:text-accent-400 font-serif">{p.return}</p>
                      <p className="text-xs text-secondary-400">Est. Annual</p>
                    </div>
                  </div>

                  {/* Bar Chart Visual */}
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-secondary-500">Stocks</span>
                        <span className="font-semibold text-primary-700 dark:text-primary-300">{p.stocks}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.stocks}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} className={`h-full rounded-full bg-gradient-to-r ${p.color}`} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-secondary-500">Bonds</span>
                        <span className="font-semibold text-primary-700 dark:text-primary-300">{p.bonds}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.bonds}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-secondary-500">Cash</span>
                        <span className="font-semibold text-primary-700 dark:text-primary-300">{p.cash}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.cash}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} className="h-full rounded-full bg-gradient-to-r from-secondary-400 to-secondary-500" />
                      </div>
                    </div>
                  </div>

                  <LinkButton to="/contact" variant="outline" size="sm" className="w-full">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </LinkButton>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Performance Visual */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <Badge variant="accent" className="mb-4"><Target className="w-3.5 h-3.5" /> Proven Performance</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white mb-6 font-serif">
              A Track Record You Can Trust
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-8">
              Our investment strategies have consistently outperformed market benchmarks over the past decade. With a disciplined approach and active management, we help you navigate market volatility with confidence.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-success-50 dark:bg-success-500/10">
                <BarChart3 className="w-6 h-6 text-success-600 dark:text-success-500 mb-2" />
                <p className="text-2xl font-bold text-primary-900 dark:text-white font-serif">12.4%</p>
                <p className="text-xs text-secondary-500">10-Year Avg Return</p>
              </div>
              <div className="p-5 rounded-xl bg-accent-50 dark:bg-accent-500/10">
                <PieChart className="w-6 h-6 text-accent-600 dark:text-accent-400 mb-2" />
                <p className="text-2xl font-bold text-primary-900 dark:text-white font-serif">2.1M+</p>
                <p className="text-xs text-secondary-500">Active Investors</p>
              </div>
            </div>
          </motion.div>

          {/* Chart Visual */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-secondary-500">Portfolio Growth</p>
                  <p className="text-2xl font-bold text-primary-900 dark:text-white font-serif">$100K → $278K</p>
                </div>
                <Badge variant="success"><TrendingUp className="w-3.5 h-3.5" /> +178%</Badge>
              </div>
              <div className="relative h-48 flex items-end gap-2">
                {[20, 28, 25, 35, 42, 38, 50, 58, 55, 68, 75, 90, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-primary-700 to-accent-500"
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-secondary-400 mt-3">
                <span>2015</span><span>2020</span><span>2025</span>
              </div>
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
                <TrendingUp className="w-12 h-12 text-accent-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Start Building Your Legacy</h2>
                <p className="text-secondary-200 mb-8 max-w-xl mx-auto">
                  Schedule a free consultation with one of our certified financial advisors today.
                </p>
                <LinkButton to="/contact" variant="accent" size="lg">
                  Schedule a Consultation <ArrowRight className="w-5 h-5" />
                </LinkButton>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}

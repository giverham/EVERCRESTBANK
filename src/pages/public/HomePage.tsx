import { motion } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Clock, Headphones, Award, Star,
  TrendingUp, Wallet, Building2, PiggyBank, CreditCard, Landmark,
  Quote, ChevronDown, Lock, Users, BarChart3, GraduationCap,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';
import { Card, SectionHeading } from '../../components/ui/Card';
import { LinkButton } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const iconMap: Record<string, typeof Wallet> = {
  Wallet, Building2, PiggyBank, CreditCard, Landmark, TrendingUp,
  ShieldCheck, Clock, Headphones, Award, Lock, Users, BarChart3, GraduationCap,
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

export function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const allFaqs = siteConfig.faqs.flatMap((c) => c.items).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={siteConfig.heroBanner.backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-900/85 to-primary-800/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <Badge variant="accent" className="mb-6">
              <ShieldCheck className="w-3.5 h-3.5" /> Member FDIC • Since 1987
            </Badge>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              {siteConfig.heroBanner.title}
              <span className="block text-gradient-gold mt-2">{siteConfig.heroBanner.subtitle}</span>
            </h1>
            <p className="text-lg text-secondary-200 mb-8 max-w-xl leading-relaxed">
              Experience premium banking with personalized service, cutting-edge digital tools, and the security of a trusted financial partner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <LinkButton to="/personal-banking" variant="accent" size="lg">
                {siteConfig.heroBanner.ctaPrimary} <ArrowRight className="w-5 h-5" />
              </LinkButton>
              <LinkButton to="/about" variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                {siteConfig.heroBanner.ctaSecondary}
              </LinkButton>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-secondary-50 dark:from-secondary-950 to-transparent z-10" />
      </section>

      {/* Stats */}
      <section className="relative -mt-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp}>
          <Card className="grid grid-cols-2 lg:grid-cols-4 gap-0 overflow-hidden">
            {siteConfig.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`p-8 text-center ${i < 3 ? 'border-r border-secondary-200 dark:border-secondary-800' : ''} ${i < 2 ? 'border-b lg:border-b-0' : ''} ${i === 2 ? 'border-b lg:border-b-0' : ''}`}
              >
                <p className="text-4xl font-bold text-primary-800 dark:text-accent-400 font-serif">
                  {stat.value}<span className="text-accent-500">{stat.suffix}</span>
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </Card>
        </motion.div>
      </section>

      {/* Featured Services */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title="Banking Solutions for Every Need"
          subtitle="From everyday checking to sophisticated wealth management, we have the right financial products for you."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {siteConfig.services.map((service, i) => {
            const Icon = iconMap[service.icon] || Wallet;
            return (
              <motion.div key={service.title} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <Card hover className="p-8 h-full">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-accent-400" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-5 leading-relaxed">{service.description}</p>
                  <Link to={service.href} className="inline-flex items-center gap-2 text-accent-600 dark:text-accent-400 font-semibold text-sm hover:gap-3 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-primary-900 dark:bg-primary-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Evercrest"
            title="Built on Trust. Designed for You."
            subtitle="We combine the security of a traditional bank with the innovation of modern fintech."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {siteConfig.features.map((feature, i) => {
              const Icon = iconMap[feature.icon] || Award;
              return (
                <motion.div key={feature.title} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent-500/15 flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-8 h-8 text-accent-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-secondary-400 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Financial Products CTA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div {...fadeUp}>
            <Card className="p-10 gradient-primary text-white h-full flex flex-col justify-between min-h-[320px]">
              <div>
                <CreditCard className="w-12 h-12 text-accent-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4 font-serif">Evercrest Black Card</h3>
                <p className="text-secondary-200 leading-relaxed mb-6">
                  Premium credit card with concierge service, travel rewards, and exclusive benefits. No foreign transaction fees.
                </p>
              </div>
              <LinkButton to="/credit-cards" variant="accent" size="md">
                Explore Cards <ArrowRight className="w-4 h-4" />
              </LinkButton>
            </Card>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <Card className="p-10 bg-white dark:bg-secondary-900 h-full flex flex-col justify-between min-h-[320px]">
              <div>
                <TrendingUp className="w-12 h-12 text-primary-600 dark:text-accent-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-primary-900 dark:text-white font-serif">Wealth Management</h3>
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-6">
                  Expert advisory services and investment strategies tailored to your financial goals and risk profile.
                </p>
              </div>
              <LinkButton to="/investments" variant="primary" size="md">
                Learn More <ArrowRight className="w-4 h-4" />
              </LinkButton>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gradient-to-b from-secondary-100 to-secondary-50 dark:from-secondary-900 dark:to-secondary-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <Badge variant="success" className="mb-4">
                <Lock className="w-3.5 h-3.5" /> Bank-Grade Security
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white mb-6 font-serif">
                Your Security Is Our Foundation
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-8">
                We employ multiple layers of protection to keep your money and data safe. From 256-bit encryption to biometric authentication and continuous fraud monitoring, security is built into everything we do.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Lock, title: '256-bit Encryption', desc: 'All data encrypted end-to-end' },
                  { icon: ShieldCheck, title: 'Multi-Factor Authentication', desc: 'Additional layer of account protection' },
                  { icon: Clock, title: '24/7 Fraud Monitoring', desc: 'Real-time detection of suspicious activity' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-success-500/15 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-success-600 dark:text-success-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="relative">
              <img
                src="https://images.pexels.com/photos/60548/drone-photography-photographer-aerial-60548.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Security"
                className="rounded-3xl shadow-premium w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 glass-strong rounded-2xl p-6 shadow-premium max-w-[200px]">
                <p className="text-3xl font-bold text-primary-800 dark:text-accent-400 font-serif">99.9%</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Uptime Guarantee</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Customers Say"
          subtitle="Join millions of satisfied customers who trust Evercrest Bank with their financial future."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {siteConfig.testimonials.map((t, i) => (
            <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card className="p-8 h-full flex flex-col">
                <Quote className="w-10 h-10 text-accent-400 mb-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent-400 text-accent-400" />
                  ))}
                </div>
                <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-6 flex-1 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-secondary-200 dark:border-secondary-800">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-primary-900 dark:text-white">{t.name}</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-secondary-100 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Newsroom"
            title="Latest News & Updates"
            subtitle="Stay informed about the latest developments at Evercrest Bank."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {siteConfig.news.map((article, i) => (
              <motion.div key={article.id} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Card hover className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    <Badge variant="accent" className="absolute top-3 left-3">{article.category}</Badge>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-xs text-secondary-400 mb-2">
                      {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h3 className="font-bold text-primary-900 dark:text-white mb-2 leading-snug">{article.title}</h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed flex-1">{article.excerpt}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Education */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Financial Education"
          title="Learn. Grow. Thrive."
          subtitle="Knowledge is your greatest financial asset. Explore our educational resources."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: GraduationCap, title: 'Budgeting 101', desc: 'Master the fundamentals of personal budgeting and saving.' },
            { icon: BarChart3, title: 'Investment Basics', desc: 'Understand stocks, bonds, and portfolio diversification.' },
            { icon: Users, title: 'Family Finance', desc: 'Plan for college, retirement, and generational wealth.' },
          ].map((item, i) => (
            <motion.div key={item.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent-500/15 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-8 h-8 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-secondary-100 dark:bg-secondary-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Find answers to common questions about our services." />
          <div className="mt-10 space-y-3">
            {allFaqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 glass-strong rounded-xl text-left"
                >
                  <span className="font-semibold text-primary-900 dark:text-white">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-accent-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="p-5 text-secondary-600 dark:text-secondary-400 leading-relaxed">{faq.answer}</p>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <LinkButton to="/faq" variant="outline" size="md">
              View All FAQs <ArrowRight className="w-4 h-4" />
            </LinkButton>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Ready to Experience Premium Banking?</h2>
                <p className="text-secondary-200 mb-8 max-w-xl mx-auto">
                  Contact our team today to learn how Evercrest Bank can help you achieve your financial goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <LinkButton to="/contact" variant="accent" size="lg">
                    Contact Us <ArrowRight className="w-5 h-5" />
                  </LinkButton>
                  <LinkButton to="/login" variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                    Customer Login
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

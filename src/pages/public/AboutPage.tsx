import { motion } from 'framer-motion';
import {
  ArrowRight, Target, Eye, Heart, Lightbulb, Users, Award,
  ShieldCheck, Building2,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, SectionHeading } from '../../components/ui/Card';
import { LinkButton } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { siteConfig } from '../../config/siteConfig';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const values = [
  { icon: ShieldCheck, title: 'Integrity', desc: 'We uphold the highest ethical standards in every decision and transaction.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'We embrace technology to deliver modern, seamless banking experiences.' },
  { icon: Users, title: 'Community', desc: 'We invest in the communities we serve through partnerships and outreach.' },
  { icon: Award, title: 'Excellence', desc: 'We pursue perfection in service, products, and customer care every day.' },
];

const leaders = [
  { name: 'Jonathan Pierce', role: 'Chief Executive Officer', img: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Diane Whitfield', role: 'Chief Financial Officer', img: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Marcus Chen', role: 'Chief Technology Officer', img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Aisha Bello', role: 'Chief Risk Officer', img: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Evercrest Bank"
        subtitle="For over three decades, we have built banking on a foundation of trust, innovation, and unwavering commitment to our customers."
        breadcrumb="Home / About"
      />

      {/* Company Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp} className="relative">
            <img
              src="https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Evercrest Bank headquarters"
              className="rounded-3xl shadow-premium w-full h-[420px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 glass-strong rounded-2xl p-6 shadow-premium">
              <p className="text-3xl font-bold text-primary-800 dark:text-accent-400 font-serif">Since 1987</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Serving with trust</p>
            </div>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <Badge variant="accent" className="mb-4"><Building2 className="w-3.5 h-3.5" /> Our Story</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white mb-6 font-serif">
              A Legacy of Trust and Innovation
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-4">
              Founded in 1987 in New York City, Evercrest Bank began as a small community bank with a big vision: to provide premium financial services with a personal touch. Over three decades, we have grown into a national institution with over 340 branches and $48 billion in assets under management.
            </p>
            <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-6">
              Today, we serve more than 2.4 million customers across the country, combining the security and stability of a traditional bank with the speed and convenience of modern digital banking. Our mission remains unchanged: to help individuals and businesses achieve financial success.
            </p>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold text-primary-800 dark:text-accent-400 font-serif">38+</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Years of Service</p>
              </div>
              <div className="w-px h-12 bg-secondary-200 dark:bg-secondary-700" />
              <div>
                <p className="text-2xl font-bold text-primary-800 dark:text-accent-400 font-serif">340+</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Branches Nationwide</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-secondary-100 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div {...fadeUp}>
            <Card className="p-10 h-full">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-accent-400" />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 dark:text-white mb-4 font-serif">Our Mission</h3>
              <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                To empower our customers to achieve financial success by delivering innovative, secure, and personalized banking services. We are committed to building lasting relationships founded on trust, transparency, and exceptional service.
              </p>
            </Card>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <Card className="p-10 h-full">
              <div className="w-14 h-14 rounded-2xl bg-accent-500/15 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 dark:text-white mb-4 font-serif">Our Vision</h3>
              <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                To be America's most trusted bank, recognized for innovation, integrity, and impact. We envision a future where banking is effortless, accessible to all, and a catalyst for prosperity in every community we serve.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our Values" title="The Principles That Guide Us" subtitle="These core values shape every decision we make and every relationship we build." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {values.map((value, i) => (
            <motion.div key={value.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 text-center h-full">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5">
                  <value.icon className="w-8 h-8 text-accent-400" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{value.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-primary-900 dark:bg-primary-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Leadership" title="Meet Our Leadership Team" subtitle="Experienced leaders dedicated to guiding Evercrest Bank and our customers toward a prosperous future." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {leaders.map((leader, i) => (
              <motion.div key={leader.name} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Card className="overflow-hidden h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img src={leader.img} alt={leader.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 to-transparent" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-white">{leader.name}</h3>
                    <p className="text-sm text-accent-400 font-semibold mt-1">{leader.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.stats.map((stat, i) => (
            <motion.div key={stat.label} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card className="p-8 text-center">
                <p className="text-4xl font-bold text-primary-800 dark:text-accent-400 font-serif">
                  {stat.value}<span className="text-accent-500">{stat.suffix}</span>
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2">{stat.label}</p>
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
                <Heart className="w-10 h-10 text-accent-400 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Join the Evercrest Family</h2>
                <p className="text-secondary-200 mb-8 max-w-xl mx-auto">
                  Experience banking built on trust. Contact our team to discover how we can support your financial journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <LinkButton to="/contact" variant="accent" size="lg">
                    Contact Us <ArrowRight className="w-5 h-5" />
                  </LinkButton>
                  <LinkButton to="/personal-banking" variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                    Explore Banking
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

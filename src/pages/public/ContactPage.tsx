import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { siteConfig } from '../../config/siteConfig';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const contactCards = [
  { icon: Phone, label: 'Phone', value: siteConfig.contact.phone, sub: '24/7 Customer Support' },
  { icon: Mail, label: 'Email', value: siteConfig.contact.email, sub: 'We reply within 24 hours' },
  { icon: MapPin, label: 'Address', value: siteConfig.contact.address, sub: 'New York, NY' },
];

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="We're here to help. Reach out with any questions — our team is ready to assist you."
        breadcrumb="Home / Contact"
      />

      {/* Contact Info Cards */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((card, i) => (
            <motion.div key={card.label} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card hover className="p-8 text-center h-full">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5">
                  <card.icon className="w-7 h-7 text-accent-400" />
                </div>
                <p className="text-sm font-semibold text-accent-600 dark:text-accent-400 uppercase tracking-wider mb-2">{card.label}</p>
                <p className="text-lg font-bold text-primary-900 dark:text-white mb-1">{card.value}</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">{card.sub}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + Hours */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div {...fadeUp}>
            <Card className="p-8 md:p-10">
              <h3 className="text-2xl font-bold text-primary-900 dark:text-white mb-2 font-serif">Send a Message</h3>
              <p className="text-secondary-500 dark:text-secondary-400 mb-6">Fill out the form and we'll get back to you shortly.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-premium"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-premium"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input-premium"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-premium resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                <Button type="submit" variant="primary" size="md" className="w-full" disabled={submitted}>
                  {submitted ? (
                    <><CheckCircle2 className="w-5 h-5" /> Message Sent!</>
                  ) : (
                    <>Send Message <Send className="w-4 h-4" /></>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Hours & Map */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="flex flex-col gap-8">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 dark:text-white">Business Hours</h3>
              </div>
              <div className="space-y-2">
                {siteConfig.contact.hours.split('\n').map((line, i) => (
                  <p key={i} className="text-secondary-700 dark:text-secondary-300 leading-relaxed">{line}</p>
                ))}
              </div>
            </Card>

            <Card className="p-8 flex-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 dark:text-white">Need Immediate Help?</h3>
              </div>
              <p className="text-secondary-600 dark:text-secondary-400 mb-4 leading-relaxed">
                Our customer care team is available around the clock for urgent matters.
              </p>
              <div className="flex items-center gap-2 text-primary-700 dark:text-accent-400 font-semibold">
                <Phone className="w-5 h-5" /> {siteConfig.contact.phone}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp}>
          <Card className="overflow-hidden p-0">
            <iframe
              title="Evercrest Bank Location"
              src={siteConfig.contact.mapEmbed}
              className="w-full h-[400px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Card>
        </motion.div>
      </section>

      {/* Branch Locations */}
      <section className="py-20 bg-secondary-100 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Branches"
            title="Visit Us in Person"
            subtitle="Find an Evercrest Bank branch near you. Our team is ready to serve you face-to-face."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {siteConfig.branches.map((branch, i) => (
              <motion.div key={branch.name} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Card hover className="p-8 h-full">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-5">
                    <MapPin className="w-6 h-6 text-accent-400" />
                  </div>
                  <Badge variant="primary" className="mb-3">Branch</Badge>
                  <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-3">{branch.name}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-secondary-600 dark:text-secondary-400 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" /> {branch.address}
                    </p>
                    <p className="text-secondary-600 dark:text-secondary-400 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-accent-500" /> {branch.phone}
                    </p>
                    <p className="text-secondary-600 dark:text-secondary-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent-500" /> {branch.hours}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

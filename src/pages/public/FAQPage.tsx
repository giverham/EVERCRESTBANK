import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, Phone, Mail, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { LinkButton } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useWebsite } from '../../context/WebsiteContext';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

export function FAQPage() {
  const { settings: siteConfig } = useWebsite();
  const [openId, setOpenId] = useState<string | null>('Accounts-0');

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <>
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our accounts, services, and security."
        breadcrumb="Home / FAQ"
      />

      {/* FAQ Categories */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {siteConfig.faqs.map((cat, ci) => (
          <motion.div key={cat.category} {...fadeUp} transition={{ duration: 0.5, delay: ci * 0.05 }} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-accent-400" />
              </div>
              <h2 className="text-2xl font-bold text-primary-900 dark:text-white font-serif">{cat.category}</h2>
              <Badge variant="neutral">{cat.items.length}</Badge>
            </div>

            <div className="space-y-3">
              {cat.items.map((item, ii) => {
                const id = `${cat.category}-${ii}`;
                const isOpen = openId === id;
                return (
                  <div key={id}>
                    <button
                      onClick={() => toggle(id)}
                      className="w-full flex items-center justify-between gap-4 p-5 glass-strong rounded-xl text-left"
                    >
                      <span className="font-semibold text-primary-900 dark:text-white">{item.question}</span>
                      <ChevronDown className={`w-5 h-5 text-accent-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="p-5 text-secondary-600 dark:text-secondary-400 leading-relaxed">{item.answer}</p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <Card className="p-12 md:p-16 gradient-primary text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Still Have Questions?</h2>
                <p className="text-secondary-200 mb-8 max-w-xl mx-auto">
                  Our customer care team is ready to help. Reach out and we will provide the answers you need.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <a href={`tel:${siteConfig.contact.phone}`} className="inline-flex items-center justify-center gap-2 text-secondary-200 hover:text-accent-400 transition-colors">
                    <Phone className="w-5 h-5" /> {siteConfig.contact.phone}
                  </a>
                  <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex items-center justify-center gap-2 text-secondary-200 hover:text-accent-400 transition-colors">
                    <Mail className="w-5 h-5" /> {siteConfig.contact.email}
                  </a>
                </div>
                <LinkButton to="/contact" variant="accent" size="lg">
                  Contact Us <ArrowRight className="w-5 h-5" />
                </LinkButton>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}

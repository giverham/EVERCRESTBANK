import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Snowflake, Eye, EyeOff, AlertTriangle, Plus, CreditCard as CardIcon } from 'lucide-react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, type CardInfo } from '../../data/demoData';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { supabaseCustomer as supabase } from '../../lib/supabase';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const variantStyles: Record<string, string> = {
  black: 'bg-gradient-to-br from-secondary-900 via-secondary-800 to-black',
  gold: 'bg-gradient-to-br from-accent-600 via-accent-500 to-accent-400',
  classic: 'bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600',
};

export function CardsPage() {
  const { data: dbCards } = useSupabaseData<CardInfo>('cards');
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [showCvv, setShowCvv] = useState<Record<string, boolean>>({});
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    if (dbCards.length > 0) {
      setCards(dbCards);
    }
  }, [dbCards]);

  const toggleFreeze = async (id: string) => {
    const card = cards.find(c => c.id === id);
    if (!card) return;
    const newStatus = card.status === 'active' ? 'frozen' : 'active';
    
    // Update local state optimistically
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    
    // Update DB
    await supabase.from('cards').update({ status: newStatus }).eq('id', id);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <SectionHeading center={false} eyebrow="Cards" title="Your Cards" subtitle="Manage your credit and debit cards." />
        <Button variant="accent"><Plus className="w-4 h-4" /> Request New Card</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {cards.map((card, i) => {
          const limit = card.limit || card.card_limit || 0;
          const spent = card.spent || 0;
          const available = limit - spent;
          const isFrozen = card.status === 'frozen';
          return (
            <motion.div key={card.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}>
              <div className="space-y-4">
                {/* Visual Card */}
                <div className={`relative rounded-2xl p-6 text-white shadow-premium aspect-[1.6/1] flex flex-col justify-between ${variantStyles[card.variant]} ${isFrozen ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-80">{card.type} Card</p>
                      <h3 className="font-serif text-lg font-bold mt-1">{card.name}</h3>
                    </div>
                    <div className="w-10 h-8 rounded-md bg-white/20 backdrop-blur-sm" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="w-10 h-7 rounded-md bg-gradient-to-br from-accent-300 to-accent-500" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowCvv(p => ({ ...p, [card.id]: !p[card.id] })) }} 
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        {showCvv[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="font-mono text-lg tracking-wider">
                      {showCvv[card.id] ? card.number : `•••• •••• •••• ${card.number.slice(-4)}`}
                    </p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider opacity-70">Card Holder</p>
                      <p className="text-sm font-medium">{card.holder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider opacity-70">Expires</p>
                      <p className="text-sm font-medium">{card.expiry}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider opacity-70">CVV</p>
                      <p className="text-sm font-mono font-medium">
                        {showCvv[card.id] ? card.cvv : '•••'}
                      </p>
                    </div>
                  </div>
                  {isFrozen && (
                    <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-primary-950/40 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-white font-semibold"><Snowflake className="w-6 h-6" /> Card Frozen</div>
                    </div>
                  )}
                </div>

                {/* Card Details & Actions */}
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={isFrozen ? 'warning' : 'success'}>{card.status}</Badge>
                    <Badge variant="accent">{card.variant.toUpperCase()}</Badge>
                  </div>

                  {card.type === 'Credit' && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm"><span className="text-secondary-500 dark:text-secondary-400">Credit Limit</span><span className="font-semibold text-primary-900 dark:text-white">{formatCurrency(limit)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-secondary-500 dark:text-secondary-400">Amount Spent</span><span className="font-semibold text-primary-900 dark:text-white">{formatCurrency(spent)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-secondary-500 dark:text-secondary-400">Available Credit</span><span className="font-semibold text-success-600 dark:text-success-500">{formatCurrency(available)}</span></div>
                      <div className="h-2 rounded-full bg-secondary-100 dark:bg-secondary-800 overflow-hidden">
                        <div className="h-full rounded-full gradient-accent" style={{ width: `${limit > 0 ? (spent / limit) * 100 : 0}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <Button variant={isFrozen ? 'primary' : 'outline'} size="sm" onClick={() => toggleFreeze(card.id)}>
                      <Snowflake className="w-3.5 h-3.5" /> {isFrozen ? 'Unfreeze' : 'Freeze'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => alert('Report Card: Please contact support to report a lost or stolen card.')}><AlertTriangle className="w-3.5 h-3.5" /> Report</Button>
                    <Button variant="outline" size="sm" onClick={() => setShowDetails(showDetails === card.id ? null : card.id)}><Eye className="w-3.5 h-3.5" /> Details</Button>
                  </div>
                  {showDetails === card.id && (
                    <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-800 text-sm">
                      <p className="mb-2"><span className="text-secondary-500">Card Name:</span> <span className="font-semibold text-primary-900 dark:text-white">{card.name}</span></p>
                      <p className="mb-2"><span className="text-secondary-500">Billing Zip:</span> <span className="font-semibold text-primary-900 dark:text-white">90210</span></p>
                      <p><span className="text-secondary-500">APR:</span> <span className="font-semibold text-primary-900 dark:text-white">14.99%</span></p>
                    </div>
                  )}
                </Card>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Card className="p-6 flex items-center gap-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
        <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-800/40 flex items-center justify-center">
          <CardIcon className="w-6 h-6 text-primary-700 dark:text-primary-300" />
        </div>
        <p className="text-sm text-primary-700 dark:text-primary-300">Lost or stolen card? Freeze it instantly above and report it to Evercrest Bank at 1-800-EVERCREST for immediate assistance.</p>
      </Card>
    </div>
  );
}

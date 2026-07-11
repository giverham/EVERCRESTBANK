import { useEffect, useState } from "react";
import { supabaseAdmin as supabase } from "../../../lib/supabase";
import { Card } from "../../ui/Card";

export function AnalyticsTab({ customerId }: { customerId: string }) {
  const [loading, setLoading] = useState(true);
  const [totalDebits, setTotalDebits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [categories, setCategories] = useState<{ name: string; amount: number; percentage: number }[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const { data: accounts } = await supabase
          .from("accounts")
          .select("id")
          .eq("customer_id", customerId);

        if (!accounts || accounts.length === 0) {
          setLoading(false);
          return;
        }

        const accountIds = accounts.map(a => a.id);
        const { data: txs } = await supabase
          .from("transactions")
          .select("*")
          .in("account_id", accountIds);

        if (txs) {
          let debits = 0;
          let credits = 0;
          const catMap: { [key: string]: number } = {};

          txs.forEach((t) => {
            const amount = Math.abs(t.amount);
            if (t.type === "debit") {
              debits += amount;
              const cat = t.category || "General";
              catMap[cat] = (catMap[cat] || 0) + amount;
            } else {
              credits += amount;
            }
          });

          const totalCategorySpending = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;
          const catList = Object.entries(catMap).map(([name, amount]) => ({
            name,
            amount,
            percentage: Math.round((amount / totalCategorySpending) * 100),
          })).sort((a, b) => b.amount - a.amount);

          setTotalDebits(debits);
          setTotalCredits(credits);
          setCategories(catList);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [customerId]);

  if (loading) return <div className="text-center text-sm text-secondary-500 py-8">Calculating real-time analytics...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-primary-900 dark:text-white mb-2 font-serif">
          Customer Ledger Analytics
        </h2>
        <p className="text-sm text-secondary-500 mb-6">
          Aggregated automatically from active transaction history.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 rounded-xl bg-success-500/5 border border-success-500/10">
            <span className="text-xs font-bold uppercase tracking-wider text-success-600 dark:text-success-400">Total Credits (Deposits)</span>
            <p className="text-2xl font-bold text-success-700 dark:text-success-500 mt-1">${totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="p-4 rounded-xl bg-error-500/5 border border-error-500/10">
            <span className="text-xs font-bold uppercase tracking-wider text-error-600 dark:text-error-400">Total Debits (Withdrawals)</span>
            <p className="text-2xl font-bold text-error-700 dark:text-error-500 mt-1">${totalDebits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-500 mb-4">Category Expense Breakdown</h3>
        {categories.length === 0 ? (
          <p className="text-sm text-secondary-400 italic">No expense data found for this customer.</p>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-secondary-700 dark:text-secondary-300">{cat.name}</span>
                  <span className="font-bold text-primary-900 dark:text-white">${cat.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-500 rounded-full" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

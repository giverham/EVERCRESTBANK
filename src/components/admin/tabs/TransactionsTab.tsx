import { useState, useEffect } from "react";
import { supabaseAdmin as supabase } from "../../../lib/supabase";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Plus, Check, Loader2 } from "lucide-react";
import { formatCurrency, formatTransactionDate } from "../../../data/demoData";

export function TransactionsTab({ customerId }: { customerId: string }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTx, setEditingTx] = useState<any>(null);

  const fetchData = async () => {
    const [{ data: txData }, { data: accData }] = await Promise.all([
      supabase.from("transactions").select("*").eq("customer_id", customerId).order("date", { ascending: false }),
      supabase.from("accounts").select("*").eq("customer_id", customerId)
    ]);
    if (txData) setTransactions(txData);
    if (accData) setAccounts(accData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [customerId]);

  const triggerNotification = async (title: string, message: string, type: 'info' | 'warning' | 'success') => {
    try {
      await supabase.from('notifications').insert([{
        customer_id: customerId,
        title,
        message,
        type,
        read: false,
        date: new Date().toISOString().split('T')[0]
      }]);
    } catch (err) {
      console.error('Failed to trigger automatic notification:', err);
    }
  };

  const handleSave = async () => {
    if (!editingTx) return;
    if (!editingTx.account_id) {
      alert("Please select an account.");
      return;
    }

    const payload = { ...editingTx };
    if (!payload.date) payload.date = new Date().toISOString();
    
    // Convert time if edited separately
    if (payload._dateInput || payload._timeInput) {
      const d = new Date(`${payload._dateInput || payload.date.split('T')[0]}T${payload._timeInput || '00:00'}:00.000Z`);
      payload.date = d.toISOString();
    }
    
    delete payload._dateInput;
    delete payload._timeInput;

    if (!payload.reference_number) {
      payload.reference_number = `REF-${Math.floor(10000000 + Math.random() * 90000000)}`;
    }

    if (payload.id) {
      const { data: oldTx } = await supabase.from("transactions").select("*").eq("id", payload.id).single();
      const { error } = await supabase.from("transactions").update(payload).eq("id", payload.id);
      if (!error) {
        if (oldTx) {
          const { data: acc } = await supabase.from("accounts").select("current_balance").eq("id", payload.account_id).single();
          if (acc) {
            let oldAccBal = acc.current_balance;
            if (oldTx.account_id !== payload.account_id) {
              const { data: oldAcc } = await supabase.from("accounts").select("current_balance").eq("id", oldTx.account_id).single();
              if (oldAcc) {
                const revBal = oldTx.type === 'credit' ? oldAcc.current_balance - oldTx.amount : oldAcc.current_balance + oldTx.amount;
                await supabase.from("accounts").update({ current_balance: revBal, available_balance: revBal }).eq("id", oldTx.account_id);
              }
            } else {
              oldAccBal = oldTx.type === 'credit' ? acc.current_balance - oldTx.amount : acc.current_balance + oldTx.amount;
            }
            const finalBal = payload.type === 'credit' ? oldAccBal + payload.amount : oldAccBal - payload.amount;
            await supabase.from("accounts").update({ current_balance: finalBal, available_balance: finalBal }).eq("id", payload.account_id);
          }
        }
        await triggerNotification(
          "Transaction Modified",
          `Your transaction of $${payload.amount} at ${payload.merchant || payload.description} was adjusted.`,
          "info"
        );
        setEditingTx(null);
        fetchData();
      } else {
        alert("Error: " + error.message);
      }
    } else {
      payload.id = `tx-${Date.now()}`;
      payload.customer_id = customerId;
      if (!payload.description) payload.description = payload.merchant || 'Manual Transaction';
      
      const { error } = await supabase.from("transactions").insert([payload]);
      if (!error) {
        const { data: acc } = await supabase.from("accounts").select("current_balance").eq("id", payload.account_id).single();
        if (acc) {
          const finalBal = payload.type === 'credit' ? acc.current_balance + payload.amount : acc.current_balance - payload.amount;
          await supabase.from("accounts").update({ current_balance: finalBal, available_balance: finalBal }).eq("id", payload.account_id);
        }
        
        // Trigger specific professional banking notifications based on type & category
        const isCredit = payload.type === 'credit';
        let notifTitle = isCredit ? "Deposit Received" : "Withdrawal Successful";
        if (payload.category === 'Transfer') {
          notifTitle = isCredit ? "Transfer Received" : "Transfer Sent";
        } else if (payload.category === 'Salary') {
          notifTitle = "Salary Credited";
        } else if (payload.category === 'Loan') {
          notifTitle = "Loan Approved";
        } else if (payload.category === 'Card') {
          notifTitle = "Card Payment";
        }

        await triggerNotification(
          notifTitle,
          `A ${payload.type} of $${payload.amount.toLocaleString()} was posted to your account for ${payload.merchant || payload.description}.`,
          "success"
        );

        setEditingTx(null);
        fetchData();
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      const { data: oldTx } = await supabase.from("transactions").select("*").eq("id", id).single();
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (!error) {
        if (oldTx) {
          const { data: acc } = await supabase.from("accounts").select("current_balance").eq("id", oldTx.account_id).single();
          if (acc) {
            const revBal = oldTx.type === 'credit' ? acc.current_balance - oldTx.amount : acc.current_balance + oldTx.amount;
            await supabase.from("accounts").update({ current_balance: revBal, available_balance: revBal }).eq("id", oldTx.account_id);
          }
          await triggerNotification(
            "Transaction Reversed",
            `A transaction of $${oldTx.amount} was removed or reversed on your statement ledger.`,
            "warning"
          );
        }
        fetchData();
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary-900 dark:text-white font-serif">
          Ledger Transaction Management
        </h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            setEditingTx({
              type: "debit",
              status: "Completed",
              amount: 0,
              merchant: "",
              description: "",
              category: "Other",
              running_balance: 0,
              reference_number: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
              _dateInput: new Date().toLocaleDateString('sv-SE'),
              _timeInput: new Date().toTimeString().slice(0, 5),
              account_id: accounts.length > 0 ? accounts[0].id : ""
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Add Transaction
        </Button>
      </div>

      {editingTx ? (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 font-serif text-primary-900 dark:text-white">
            {editingTx.id ? "Edit Transaction Details" : "New Transaction Entry"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold block mb-1">Account Selector</label>
              <select
                value={editingTx.account_id || ""}
                onChange={(e) => setEditingTx({ ...editingTx, account_id: e.target.value })}
                className="input-premium"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name} (...{acc.number.slice(-4)})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Merchant / Recipient Name</label>
              <input
                type="text"
                value={editingTx.merchant || ""}
                onChange={(e) => setEditingTx({ ...editingTx, merchant: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Transaction Description</label>
              <input
                type="text"
                value={editingTx.description || ""}
                onChange={(e) => setEditingTx({ ...editingTx, description: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Transaction Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={editingTx.amount || 0}
                onChange={(e) => setEditingTx({ ...editingTx, amount: parseFloat(e.target.value) })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Date</label>
              <input
                type="date"
                value={editingTx._dateInput || (editingTx.date ? editingTx.date.split("T")[0] : "")}
                onChange={(e) => setEditingTx({ ...editingTx, _dateInput: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Time</label>
              <input
                type="time"
                value={editingTx._timeInput || (editingTx.date && editingTx.date.includes("T") ? editingTx.date.split("T")[1].slice(0,5) : "")}
                onChange={(e) => setEditingTx({ ...editingTx, _timeInput: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Credit / Debit Ledger Rule</label>
              <select
                value={editingTx.type || "debit"}
                onChange={(e) => setEditingTx({ ...editingTx, type: e.target.value })}
                className="input-premium"
              >
                <option value="debit">debit (Withdrawal/Charge)</option>
                <option value="credit">credit (Deposit/Salary)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Category Group</label>
              <input
                type="text"
                value={editingTx.category || "Other"}
                onChange={(e) => setEditingTx({ ...editingTx, category: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Reference Number</label>
              <input
                type="text"
                value={editingTx.reference_number || ""}
                onChange={(e) => setEditingTx({ ...editingTx, reference_number: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Balance After Transaction ($)</label>
              <input
                type="number"
                step="0.01"
                value={editingTx.running_balance || 0}
                onChange={(e) => setEditingTx({ ...editingTx, running_balance: parseFloat(e.target.value) })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Posting Status</label>
              <select
                value={editingTx.status || "Completed"}
                onChange={(e) => setEditingTx({ ...editingTx, status: e.target.value })}
                className="input-premium"
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditingTx(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Transaction Entry
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-50 dark:bg-primary-900/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500 uppercase">Posting Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500 uppercase">Account</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500 uppercase">Merchant</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500 uppercase">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500 uppercase">Balance After</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-secondary-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800">
                {transactions.map((tx) => {
                  const acc = accounts.find(a => a.id === tx.account_id);
                  return (
                    <tr key={tx.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/30">
                      <td className="px-4 py-3 text-sm">{formatTransactionDate(tx.date)}</td>
                      <td className="px-4 py-3 text-sm font-semibold">{acc ? acc.name : tx.account_id}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-semibold block text-primary-900 dark:text-white">{tx.merchant}</span>
                        <span className="text-xs text-secondary-400 block">{tx.description}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-xs text-secondary-500">{tx.reference_number || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm font-bold text-primary-900 dark:text-white">${tx.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm uppercase">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.type === "credit" ? "bg-success-100 text-success-700" : "bg-error-100 text-error-700"}`}>{tx.type}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-secondary-600">${(tx.running_balance || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.status?.toLowerCase() === "completed" ? "bg-primary-100 text-primary-700" : "bg-warning-100 text-warning-700"}`}>{tx.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button variant="secondary" size="sm" onClick={() => setEditingTx(tx)}>Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(tx.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {transactions.length === 0 && (
            <div className="p-8 text-center text-secondary-500 font-medium">No transactions found in database. Add entry above or run ledger backfill.</div>
          )}
        </Card>
      )}
    </div>
  );
}

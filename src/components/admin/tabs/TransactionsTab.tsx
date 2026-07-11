import { useState, useEffect } from "react";
import { supabaseAdmin as supabase } from "../../../lib/supabase";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Plus } from "lucide-react";

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
        <h2 className="text-xl font-bold text-primary-900 dark:text-white">
          Transactions
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
              category: "Other",
              _dateInput: new Date().toISOString().split("T")[0],
              _timeInput: new Date().toISOString().split("T")[1].slice(0,5),
              account_id: accounts.length > 0 ? accounts[0].id : ""
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Add Transaction
        </Button>
      </div>

      {editingTx ? (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">
            {editingTx.id ? "Edit Transaction" : "New Transaction"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm block mb-1">Account</label>
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
              <label className="text-sm block mb-1">Merchant / Description</label>
              <input
                type="text"
                value={editingTx.merchant || editingTx.description || ""}
                onChange={(e) => setEditingTx({ ...editingTx, merchant: e.target.value, description: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Date</label>
              <input
                type="date"
                value={editingTx._dateInput || (editingTx.date ? editingTx.date.split("T")[0] : "")}
                onChange={(e) => setEditingTx({ ...editingTx, _dateInput: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Time</label>
              <input
                type="time"
                value={editingTx._timeInput || (editingTx.date && editingTx.date.includes("T") ? editingTx.date.split("T")[1].slice(0,5) : "")}
                onChange={(e) => setEditingTx({ ...editingTx, _timeInput: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={editingTx.amount || 0}
                onChange={(e) => setEditingTx({ ...editingTx, amount: parseFloat(e.target.value) })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Type</label>
              <select
                value={editingTx.type || "debit"}
                onChange={(e) => setEditingTx({ ...editingTx, type: e.target.value })}
                className="input-premium"
              >
                <option value="debit">debit</option>
                <option value="credit">credit</option>
              </select>
            </div>
            <div>
              <label className="text-sm block mb-1">Category</label>
              <input
                type="text"
                value={editingTx.category || ""}
                onChange={(e) => setEditingTx({ ...editingTx, category: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Status</label>
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
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditingTx(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Transaction
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-primary-50 dark:bg-primary-900/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500">Account</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500">Merchant</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-secondary-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800">
              {transactions.map((tx) => {
                const acc = accounts.find(a => a.id === tx.account_id);
                return (
                  <tr key={tx.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/30">
                    <td className="px-4 py-3 text-sm">{tx.date?.split("T")[0]}</td>
                    <td className="px-4 py-3 text-sm">{acc ? acc.name : tx.account_id}</td>
                    <td className="px-4 py-3 text-sm">{tx.merchant || tx.description}</td>
                    <td className="px-4 py-3 text-sm font-bold">${tx.amount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={tx.type === "credit" ? "text-success-600" : "text-secondary-600"}>{tx.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{tx.status}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="secondary" size="sm" onClick={() => setEditingTx(tx)} className="mr-2">Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(tx.id)}>Delete</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="p-4 text-center text-secondary-500">No transactions found.</div>
          )}
        </Card>
      )}
    </div>
  );
}

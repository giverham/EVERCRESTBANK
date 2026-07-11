import { useState, useEffect } from "react";
import { supabaseAdmin as supabase } from "../../../lib/supabase";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Wallet, Plus } from "lucide-react";
export function AccountsTab({ customerId }: { customerId: string }) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const fetchAccounts = async () => {
    const { data } = await supabase
      .from("accounts")
      .select("*")
      .eq("customer_id", customerId);
    if (data) setAccounts(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchAccounts();
  }, [customerId]);
  const handleSave = async () => {
    if (!editingAccount) return;
    if (editingAccount.id) {
      /* Update existing */ const { error } = await supabase
        .from("accounts")
        .update(editingAccount)
        .eq("id", editingAccount.id);
      if (!error) {
        setEditingAccount(null);
        fetchAccounts();
      } else {
        alert("Error: " + error.message);
      }
    } else {
      /* Insert new */ const { error } = await supabase
        .from("accounts")
        .insert([{ ...editingAccount, customer_id: customerId }]);
      if (!error) {
        setEditingAccount(null);
        fetchAccounts();
      } else {
        alert("Error: " + error.message);
      }
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      await supabase.from("accounts").delete().eq("id", id);
      fetchAccounts();
    }
  };
  if (loading) return <div>Loading accounts...</div>;
  return (
    <div className="space-y-6">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <h2 className="text-xl font-bold text-primary-900 dark:text-white">
          Bank Accounts
        </h2>{" "}
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            setEditingAccount({
              type: "Checking",
              currency: "USD",
              current_balance: 0,
              available_balance: 0,
            })
          }
        >
          {" "}
          <Plus className="w-4 h-4 mr-2" /> Add Account{" "}
        </Button>{" "}
      </div>{" "}
      {editingAccount ? (
        <Card className="p-6">
          {" "}
          <h3 className="text-lg font-bold mb-4">
            {editingAccount.id ? "Edit Account" : "New Account"}
          </h3>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {" "}
            <div>
              <label className="text-sm block mb-1">Account Name</label>
              <input
                type="text"
                value={editingAccount.name || ""}
                onChange={(e) =>
                  setEditingAccount({ ...editingAccount, name: e.target.value })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Account Type</label>
              <select
                value={editingAccount.type || "Checking"}
                onChange={(e) =>
                  setEditingAccount({ ...editingAccount, type: e.target.value })
                }
                className="input-premium"
              >
                <option>Checking</option>
                <option>Savings</option>
                <option>Investment</option>
              </select>
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Account Number</label>
              <input
                type="text"
                value={editingAccount.number || ""}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    number: e.target.value,
                  })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Routing Number</label>
              <input
                type="text"
                value={editingAccount.routing || ""}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    routing: e.target.value,
                  })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">ACH Routing Number</label>
              <input
                type="text"
                value={editingAccount.ach_routing || ""}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    ach_routing: e.target.value,
                  })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Wire Routing Number</label>
              <input
                type="text"
                value={editingAccount.wire_routing || ""}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    wire_routing: e.target.value,
                  })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Bank Name</label>
              <input
                type="text"
                value={editingAccount.bank_name || ""}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    bank_name: e.target.value,
                  })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Bank Address</label>
              <input
                type="text"
                value={editingAccount.bank_address || ""}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    bank_address: e.target.value,
                  })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">SWIFT Code</label>
              <input
                type="text"
                value={editingAccount.swift_code || ""}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    swift_code: e.target.value,
                  })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Beneficiary</label>
              <input
                type="text"
                value={editingAccount.beneficiary || ""}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    beneficiary: e.target.value,
                  })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Account Balance ($)</label>
              <input
                type="number"
                step="0.01"
                value={editingAccount.current_balance ?? 0}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setEditingAccount({
                    ...editingAccount,
                    current_balance: val,
                    available_balance: val,
                  });
                }}
                className="input-premium"
              />
            </div>
          </div>{" "}
          <div className="mt-4 flex justify-end gap-2">
            {" "}
            <Button variant="secondary" onClick={() => setEditingAccount(null)}>
              Cancel
            </Button>{" "}
            <Button variant="primary" onClick={handleSave}>
              Save Account
            </Button>{" "}
          </div>{" "}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          {accounts.map((acc) => (
            <Card key={acc.id} className="p-4 flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-2">
                  {" "}
                  <div className="flex items-center gap-2">
                    {" "}
                    <Wallet className="w-5 h-5 text-accent-500" />{" "}
                    <span className="font-bold text-primary-900 dark:text-white">
                      {acc.name || acc.type}
                    </span>{" "}
                  </div>{" "}
                  <span className="text-lg font-bold text-primary-900 dark:text-white">
                    ${acc.current_balance?.toLocaleString()}
                  </span>{" "}
                </div>{" "}
                <p className="text-sm text-secondary-500 mb-1">
                  Account: {acc.number}
                </p>{" "}
                <p className="text-sm text-secondary-500">
                  Routing: {acc.routing}
                </p>{" "}
              </div>{" "}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-800">
                {" "}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingAccount(acc)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(acc.id)}
                >
                  Delete
                </Button>{" "}
              </div>{" "}
            </Card>
          ))}{" "}
          {accounts.length === 0 && (
            <p className="text-secondary-500">No accounts found.</p>
          )}{" "}
        </div>
      )}{" "}
    </div>
  );
}

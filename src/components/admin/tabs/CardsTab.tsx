import { useState, useEffect } from "react";
import { supabaseAdmin as supabase } from "../../../lib/supabase";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { CreditCard, Plus } from "lucide-react";
export function CardsTab({ customerId }: { customerId: string }) {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<any>(null);
  const fetchCards = async () => {
    const { data } = await supabase
      .from("cards")
      .select("*")
      .eq("customer_id", customerId);
    if (data) setCards(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchCards();
  }, [customerId]);
  const handleSave = async () => {
    if (!editingCard) return;
    if (editingCard.id) {
      const { error } = await supabase
        .from("cards")
        .update(editingCard)
        .eq("id", editingCard.id);
      if (!error) {
        setEditingCard(null);
        fetchCards();
      } else {
        alert("Error: " + error.message);
      }
    } else {
      const { error } = await supabase
        .from("cards")
        .insert([{ ...editingCard, customer_id: customerId }]);
      if (!error) {
        setEditingCard(null);
        fetchCards();
      } else {
        alert("Error: " + error.message);
      }
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      await supabase.from("cards").delete().eq("id", id);
      fetchCards();
    }
  };
  if (loading) return <div>Loading cards...</div>;
  return (
    <div className="space-y-6">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <h2 className="text-xl font-bold text-primary-900 dark:text-white">
          Cards
        </h2>{" "}
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            setEditingCard({
              type: "Credit",
              status: "Active",
              color: "accent",
            })
          }
        >
          {" "}
          <Plus className="w-4 h-4 mr-2" /> Add Card{" "}
        </Button>{" "}
      </div>{" "}
      {editingCard ? (
        <Card className="p-6">
          {" "}
          <h3 className="text-lg font-bold mb-4">
            {editingCard.id ? "Edit Card" : "New Card"}
          </h3>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {" "}
            <div>
              <label className="text-sm block mb-1">Card Holder Name</label>
              <input
                type="text"
                value={editingCard.cardholder_name || ""}
                onChange={(e) =>
                  setEditingCard({
                    ...editingCard,
                    cardholder_name: e.target.value,
                  })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Card Number</label>
              <input
                type="text"
                value={editingCard.number || ""}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, number: e.target.value })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={editingCard.expiry || ""}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, expiry: e.target.value })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">CVV</label>
              <input
                type="text"
                value={editingCard.cvv || ""}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, cvv: e.target.value })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Card Type</label>
              <select
                value={editingCard.type || "Credit"}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, type: e.target.value })
                }
                className="input-premium"
              >
                <option>Credit</option>
                <option>Debit</option>
              </select>
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Card Color Theme</label>
              <select
                value={editingCard.color || "primary"}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, color: e.target.value })
                }
                className="input-premium"
              >
                <option>primary</option>
                <option>accent</option>
                <option>secondary</option>
              </select>
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Credit Limit</label>
              <input
                type="number"
                step="0.01"
                value={editingCard.credit_limit || 0}
                onChange={(e) =>
                  setEditingCard({
                    ...editingCard,
                    credit_limit: parseFloat(e.target.value),
                  })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Spent Amount</label>
              <input
                type="number"
                step="0.01"
                value={editingCard.spent_amount || 0}
                onChange={(e) =>
                  setEditingCard({
                    ...editingCard,
                    spent_amount: parseFloat(e.target.value),
                  })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Status</label>
              <select
                value={editingCard.status || "Active"}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, status: e.target.value })
                }
                className="input-premium"
              >
                <option>Active</option>
                <option>Frozen</option>
              </select>
            </div>{" "}
          </div>{" "}
          <div className="mt-4 flex justify-end gap-2">
            {" "}
            <Button variant="secondary" onClick={() => setEditingCard(null)}>
              Cancel
            </Button>{" "}
            <Button variant="primary" onClick={handleSave}>
              Save Card
            </Button>{" "}
          </div>{" "}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          {cards.map((card) => (
            <Card key={card.id} className="p-4">
              {" "}
              <div className="flex items-center justify-between mb-2">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <CreditCard className="w-5 h-5 text-accent-500" />{" "}
                  <span className="font-bold text-primary-900 dark:text-white">
                    {card.type} Card
                  </span>{" "}
                </div>{" "}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${card.status === "Frozen" ? "bg-error-100 text-error-700" : "bg-success-100 text-success-700"}`}
                >
                  {" "}
                  {card.status}{" "}
                </span>{" "}
              </div>{" "}
              <p className="text-sm text-secondary-500 mb-1">
                Number: **** **** **** {card.number?.slice(-4)}
              </p>{" "}
              <p className="text-sm text-secondary-500 mb-4">
                Limit: ${card.credit_limit?.toLocaleString()}
              </p>{" "}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-800">
                {" "}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingCard(card)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(card.id)}
                >
                  Delete
                </Button>{" "}
              </div>{" "}
            </Card>
          ))}{" "}
          {cards.length === 0 && (
            <p className="text-secondary-500">No cards found.</p>
          )}{" "}
        </div>
      )}{" "}
    </div>
  );
}

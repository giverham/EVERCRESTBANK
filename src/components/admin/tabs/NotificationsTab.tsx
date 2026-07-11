import { useState, useEffect } from "react";
import { supabaseAdmin as supabase } from "../../../lib/supabase";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Bell, Plus } from "lucide-react";
export function NotificationsTab({ customerId }: { customerId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotif, setEditingNotif] = useState<any>(null);
  const fetchNotifications = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("customer_id", customerId)
      .order("date", { ascending: false });
    if (data) setNotifications(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchNotifications();
  }, [customerId]);
  const handleSave = async () => {
    if (!editingNotif) return;
    if (editingNotif.id) {
      const { error } = await supabase
        .from("notifications")
        .update(editingNotif)
        .eq("id", editingNotif.id);
      if (!error) {
        setEditingNotif(null);
        fetchNotifications();
      } else alert(error.message);
    } else {
      const { error } = await supabase
        .from("notifications")
        .insert([{ ...editingNotif, customer_id: customerId }]);
      if (!error) {
        setEditingNotif(null);
        fetchNotifications();
      } else alert(error.message);
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm("Delete notification?")) {
      await supabase.from("notifications").delete().eq("id", id);
      fetchNotifications();
    }
  };
  if (loading) return <div>Loading notifications...</div>;
  return (
    <div className="space-y-6">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <h2 className="text-xl font-bold text-primary-900 dark:text-white">
          Notifications
        </h2>{" "}
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            setEditingNotif({
              type: "security",
              is_read: false,
              date: new Date().toISOString(),
            })
          }
        >
          {" "}
          <Plus className="w-4 h-4 mr-2" /> Add Notification{" "}
        </Button>{" "}
      </div>{" "}
      {editingNotif ? (
        <Card className="p-6">
          {" "}
          <h3 className="text-lg font-bold mb-4">
            {editingNotif.id ? "Edit Notification" : "New Notification"}
          </h3>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {" "}
            <div className="md:col-span-2">
              <label className="text-sm block mb-1">Title</label>
              <input
                type="text"
                value={editingNotif.title || ""}
                onChange={(e) =>
                  setEditingNotif({ ...editingNotif, title: e.target.value })
                }
                className="input-premium"
              />
            </div>{" "}
            <div className="md:col-span-2">
              <label className="text-sm block mb-1">Message</label>
              <textarea
                value={editingNotif.message || ""}
                onChange={(e) =>
                  setEditingNotif({ ...editingNotif, message: e.target.value })
                }
                className="input-premium"
                rows={3}
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Type</label>
              <select
                value={editingNotif.type || "system"}
                onChange={(e) =>
                  setEditingNotif({ ...editingNotif, type: e.target.value })
                }
                className="input-premium"
              >
                <option>system</option>
                <option>security</option>
                <option>transaction</option>
              </select>
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Date/Time</label>
              <input
                type="text"
                value={editingNotif.date || ""}
                onChange={(e) =>
                  setEditingNotif({ ...editingNotif, date: e.target.value })
                }
                className="input-premium"
              />
            </div>{" "}
            <div>
              <label className="text-sm block mb-1">Is Read?</label>
              <input
                type="checkbox"
                checked={editingNotif.is_read || false}
                onChange={(e) =>
                  setEditingNotif({
                    ...editingNotif,
                    is_read: e.target.checked,
                  })
                }
              />
            </div>{" "}
          </div>{" "}
          <div className="mt-4 flex justify-end gap-2">
            {" "}
            <Button variant="secondary" onClick={() => setEditingNotif(null)}>
              Cancel
            </Button>{" "}
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>{" "}
          </div>{" "}
        </Card>
      ) : (
        <div className="space-y-4">
          {" "}
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 ${!notif.is_read ? "border-l-4 border-l-accent-500" : ""}`}
            >
              {" "}
              <div className="flex items-start justify-between">
                {" "}
                <div className="flex gap-3">
                  {" "}
                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center shrink-0">
                    {" "}
                    <Bell className="w-5 h-5 text-secondary-600" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h4 className="font-bold text-primary-900 dark:text-white">
                      {notif.title}
                    </h4>{" "}
                    <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-1">
                      {notif.message}
                    </p>{" "}
                    <p className="text-xs text-secondary-400 mt-2">
                      {new Date(notif.date).toLocaleString()}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingNotif(notif)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(notif.id)}
                  >
                    Delete
                  </Button>{" "}
                </div>{" "}
              </div>{" "}
            </Card>
          ))}{" "}
          {notifications.length === 0 && (
            <p className="text-secondary-500">No notifications found.</p>
          )}{" "}
        </div>
      )}{" "}
    </div>
  );
}

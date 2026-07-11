import React, { useState } from "react";
import { supabaseAdmin as supabase } from "../../../lib/supabase";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";

export function ExtendedProfileTab({
  customer,
  onUpdate,
}: {
  customer: any;
  onUpdate: () => void;
}) {
  const [formData, setFormData] = useState(customer);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("customers")
      .update(formData)
      .eq("id", customer.id);

    setSaving(false);
    if (error) alert("Error updating profile: " + error.message);
    else onUpdate();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-lg font-bold text-primary-900 dark:text-white mb-6">
          Extended Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Profile Photo URL
            </label>
            <input
              type="text"
              name="avatar"
              value={formData.avatar || ""}
              onChange={handleChange}
              className="input-premium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Customer ID
            </label>
            <input
              type="text"
              name="customer_id"
              value={formData.customer_id || ""}
              onChange={handleChange}
              className="input-premium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Member Since
            </label>
            <input
              type="date"
              name="member_since"
              value={formData.member_since || ""}
              onChange={handleChange}
              className="input-premium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Account Type Label
            </label>
            <input
              type="text"
              name="account_type"
              value={formData.account_type || ""}
              onChange={handleChange}
              className="input-premium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Verification Status
            </label>
            <select
              name="verification_status"
              value={formData.verification_status || "Verified"}
              onChange={handleChange}
              className="input-premium"
            >
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Unverified">Unverified</option>
            </select>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Extended Profile"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

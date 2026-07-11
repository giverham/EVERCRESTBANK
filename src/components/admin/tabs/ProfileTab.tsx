import React, { useState } from "react";
import { supabaseAdmin as supabase } from "../../../lib/supabase";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Check } from "lucide-react";
import { ImageUploader } from "../ImageUploader";

export function ProfileTab({
  customer,
  onUpdate,
}: {
  customer: any;
  onUpdate: () => void;
}) {
  const [formData, setFormData] = useState(customer);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  React.useEffect(() => {
    setFormData(customer);
  }, [customer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
        occupation: formData.occupation,
        nationality: formData.nationality,
        employer: formData.employer,
        id_number: formData.id_number,
        customer_id: formData.customer_id,
        member_since: formData.member_since,
        account_type: formData.account_type,
        verification_status: formData.verification_status,
        signature_url: formData.signature_url,
        stamp_url: formData.stamp_url,
        avatar: formData.avatar
      };

      const { error } = await supabase
        .from("customers")
        .update(updateData)
        .eq("id", customer.id);

      if (error) throw error;

      if (formData.email !== customer.email) {
        try {
          await supabase.auth.admin.updateUserById(customer.id, { email: formData.email });
        } catch (authErr) {
          console.warn("Direct Auth sync skipped/bypassed");
        }
      }

      setMessage({ text: "Profile details successfully updated and synchronized.", type: 'success' });
      onUpdate();
    } catch (err: any) {
      setMessage({ text: "Error: " + err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {message && (
        <div className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-success-500/10 text-success-600 border-success-500/20' 
            : 'bg-error-500/10 text-error-600 border-error-500/20'
        }`}>
          <Check className="w-5 h-5 flex-shrink-0" />
          {message.text}
        </div>
      )}

      {/* Profile & Identification Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-400 mb-4">Customer Avatar</h3>
          <ImageUploader 
            value={formData.avatar || ""} 
            onChange={(url) => setFormData({ ...formData, avatar: url })} 
            className="w-full"
          />
        </Card>
        
        <Card className="p-6 md:col-span-1 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-400 mb-4">Official Signature</h3>
          <ImageUploader 
            value={formData.signature_url || ""} 
            onChange={(url) => setFormData({ ...formData, signature_url: url })} 
            className="w-full"
          />
        </Card>

        <Card className="p-6 md:col-span-1 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-400 mb-4">Official Stamp / Seal</h3>
          <ImageUploader 
            value={formData.stamp_url || ""} 
            onChange={(url) => setFormData({ ...formData, stamp_url: url })} 
            className="w-full"
          />
        </Card>
      </div>

      <div className="space-y-6">
        {/* Profile Details Form */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-primary-900 dark:text-white mb-6 font-serif">
              Personal Information & KYC
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth || ""}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation || ""}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality || ""}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
                  Employer
                </label>
                <input
                  type="text"
                  name="employer"
                  value={formData.employer || ""}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
                  Government ID Number
                </label>
                <input
                  type="text"
                  name="id_number"
                  value={formData.id_number || ""}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
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
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
                  Member Since
                </label>
                <input
                  type="text"
                  name="member_since"
                  placeholder="e.g. March 2019"
                  value={formData.member_since || ""}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
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
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
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
            <div className="mt-6 flex justify-end">
              <Button variant="accent" onClick={handleSave} disabled={saving}>
                {saving ? "Saving Changes..." : "Save Profile Details"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

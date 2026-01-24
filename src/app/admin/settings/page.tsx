"use client";

import { useState } from "react";
import { Save, Store, Bell, Lock, Palette } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "KRYPTIC",
    storeEmail: "support@krypticlab.com",
    storePhone: "+234 909 0615 225",
    storeAddress: "Lokoja, Kogi State / Lagos, Nigeria",
    currency: "NGN",
    taxRate: "0",
    shippingDefault: "4500",
    shippingLagos: "2500",
    shippingAbuja: "3500",
    orderNotifications: true,
    lowStockAlerts: true,
    lowStockThreshold: "10",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // TODO: Save to Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
  };

  const tabs = [
    { id: "general", name: "General", icon: Store },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "shipping", name: "Shipping", icon: Store },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Manage your store settings
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <div className="md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeTab === tab.id
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)]"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            {activeTab === "general" && (
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg space-y-6">
                <h2 className="text-xl font-bold">General Settings</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Store Email</label>
                  <input
                    type="email"
                    name="storeEmail"
                    value={settings.storeEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Store Phone</label>
                  <input
                    type="text"
                    name="storePhone"
                    value={settings.storePhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Store Address</label>
                  <input
                    type="text"
                    name="storeAddress"
                    value={settings.storeAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <select
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                    >
                      <option value="NGN">Nigerian Naira (₦)</option>
                      <option value="USD">US Dollar ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      name="taxRate"
                      value={settings.taxRate}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg space-y-6">
                <h2 className="text-xl font-bold">Notification Settings</h2>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="orderNotifications"
                    checked={settings.orderNotifications}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-[var(--border-color)] text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  <div>
                    <p className="font-medium">Order Notifications</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Receive email notifications for new orders
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="lowStockAlerts"
                    checked={settings.lowStockAlerts}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-[var(--border-color)] text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  <div>
                    <p className="font-medium">Low Stock Alerts</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Get notified when products are running low
                    </p>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-medium mb-2">Low Stock Threshold</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={settings.lowStockThreshold}
                    onChange={handleChange}
                    min="1"
                    className="w-full max-w-xs px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg space-y-6">
                <h2 className="text-xl font-bold">Shipping Settings</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Default Shipping Rate (₦)</label>
                  <input
                    type="number"
                    name="shippingDefault"
                    value={settings.shippingDefault}
                    onChange={handleChange}
                    min="0"
                    className="w-full max-w-xs px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                  />
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Applied to all states not specified below
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Lagos Shipping Rate (₦)</label>
                  <input
                    type="number"
                    name="shippingLagos"
                    value={settings.shippingLagos}
                    onChange={handleChange}
                    min="0"
                    className="w-full max-w-xs px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Abuja (FCT) Shipping Rate (₦)</label>
                  <input
                    type="number"
                    name="shippingAbuja"
                    value={settings.shippingAbuja}
                    onChange={handleChange}
                    min="0"
                    className="w-full max-w-xs px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

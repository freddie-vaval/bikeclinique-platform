'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Truck, Calendar, FileText, Users, ChevronRight } from 'lucide-react';

interface BusinessSettings {
  id: string;
  business_name: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
  vat_number: string;
  currency: string;
}

export default function SettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<Partial<BusinessSettings>>({
    business_name: '',
    address: '',
    phone: '',
    email: '',
    logo_url: '',
    vat_number: '',
    currency: 'GBP',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase
      .from('business_settings')
      .select('*')
      .limit(1)
      .single();
    if (data) setSettings(data);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const { data: existing } = await supabase
        .from('business_settings')
        .select('id')
        .limit(1)
        .single();

      if (existing) {
        await supabase
          .from('business_settings')
          .update(settings)
          .eq('id', existing.id);
      } else {
        await supabase
          .from('business_settings')
          .insert([settings]);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save settings');
    }
    setSaving(false);
  }

  function handleChange(field: keyof BusinessSettings, value: string) {
    setSettings(prev => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  const settingsLinks = [
    { href: '/dashboard/settings/invoices', icon: FileText, label: 'Invoice Settings', desc: 'Prefix, numbering, VAT rate' },
    { href: '/dashboard/settings/booking', icon: Calendar, label: 'Booking Settings', desc: 'Availability, slot duration' },
    { href: '/dashboard/settings/leave', icon: Users, label: 'Technician Leave', desc: 'Manage team availability' },
    { href: '/dashboard/settings/delivery-slots', icon: Truck, label: 'Delivery Slots', desc: 'Set delivery windows' },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Business Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Update your business details and contact information</p>
      </div>

      {/* Settings Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {settingsLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-orange-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                <link.icon className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{link.label}</h3>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{link.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Name */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Business Details</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                value={settings.business_name || ''}
                onChange={e => handleChange('business_name', e.target.value)}
                placeholder="Bike Clinique LTD"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={settings.address || ''}
                onChange={e => handleChange('address', e.target.value)}
                placeholder="123 Bike Street&#10;London&#10;SW1A 1AA"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={settings.phone || ''}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="+44 20 7946 0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="hello@bikeclinique.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* VAT & Finance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Finance & Tax</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
              <input
                type="text"
                value={settings.vat_number || ''}
                onChange={e => handleChange('vat_number', e.target.value)}
                placeholder="GB123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={settings.currency || 'GBP'}
                onChange={e => handleChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              >
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
        )}
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700 flex items-center gap-2">
            <span>✅</span> Settings saved successfully
          </div>
        )}

        {/* Save */}
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

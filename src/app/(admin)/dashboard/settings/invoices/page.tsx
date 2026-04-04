'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function InvoiceSettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState({
    prefix: '#INV-',
    starting_number: 1,
    tax_rate: 20,
    tax_inclusive: false,
    footer_text: 'Thank you for your business. Payment due within 14 days.',
    custom_address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase
      .from('invoice_settings')
      .select('*')
      .limit(1)
      .single();
    if (data) {
      setSettings({
        prefix: data.prefix || '#INV-',
        starting_number: data.starting_number || 1,
        tax_rate: data.tax_rate || 20,
        tax_inclusive: data.tax_inclusive || false,
        footer_text: data.footer_text || '',
        custom_address: data.custom_address || '',
      });
    }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const { data: existing } = await supabase
        .from('invoice_settings')
        .select('id')
        .limit(1)
        .single();
      if (existing) {
        await supabase.from('invoice_settings').update(settings).eq('id', existing.id);
      } else {
        await supabase.from('invoice_settings').insert([settings]);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  }

  function previewInvoiceNumber() {
    return `${settings.prefix}${String(settings.starting_number).padStart(4, '0')}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoice Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure how your invoices look and are numbered</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Invoice Numbering */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Invoice Numbering</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Prefix</label>
              <input
                type="text"
                value={settings.prefix}
                onChange={e => setSettings(s => ({ ...s, prefix: e.target.value }))}
                placeholder="#INV-"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">e.g. #INV-, #BC-, INV-</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Starting Number</label>
              <input
                type="number"
                value={settings.starting_number}
                onChange={e => setSettings(s => ({ ...s, starting_number: parseInt(e.target.value) || 1 }))}
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Next invoice: {previewInvoiceNumber()}</p>
            </div>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Tax Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.tax_rate}
                  onChange={e => setSettings(s => ({ ...s, tax_rate: parseFloat(e.target.value) || 0 }))}
                  min={0}
                  max={100}
                  step={0.1}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prices Include VAT?</label>
              <div className="flex items-center gap-3 h-[42px]">
                <button
                  type="button"
                  onClick={() => setSettings(s => ({ ...s, tax_inclusive: false }))}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                    !settings.tax_inclusive
                      ? 'bg-orange-50 border-orange-300 text-orange-700 font-medium'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Ex. VAT
                </button>
                <button
                  type="button"
                  onClick={() => setSettings(s => ({ ...s, tax_inclusive: true }))}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                    settings.tax_inclusive
                      ? 'bg-orange-50 border-orange-300 text-orange-700 font-medium'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Inc. VAT
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {settings.tax_inclusive ? 'Customers pay the price shown (VAT added at checkout)' : 'VAT added on top of prices shown'}
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Address & Footer */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Invoice Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Address (shown on invoice)</label>
              <textarea
                value={settings.custom_address}
                onChange={e => setSettings(s => ({ ...s, custom_address: e.target.value }))}
                placeholder="Bike Clinique LTD&#10;123 Your Street&#10;London&#10;SW1A 1AA&#10;VAT: GB123456789"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Footer Text</label>
              <textarea
                value={settings.footer_text}
                onChange={e => setSettings(s => ({ ...s, footer_text: e.target.value }))}
                placeholder="Thank you for your business. Payment due within 14 days."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700 flex items-center gap-2">
            ✅ Invoice settings saved
          </div>
        )}
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Invoice Settings'}
        </button>
      </form>
    </div>
  );
}

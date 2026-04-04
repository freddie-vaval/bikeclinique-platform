'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface BrandingSettings {
  business_name: string;
  logo_url: string;
  accent_color: string;
  phone: string;
  address: string;
}

const COLORS = [
  { name: 'Orange', value: '#FF6B35' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Purple', value: '#9333EA' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Teal', value: '#0D9488' },
  { name: 'Pink', value: '#DB2777' },
  { name: 'Black', value: '#111827' },
];

export default function BrandingPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<BrandingSettings>({
    business_name: '',
    logo_url: '',
    accent_color: '#FF6B35',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase
      .from('business_settings')
      .select('business_name, logo_url, accent_color, phone, address')
      .limit(1)
      .single();
    if (data) setForm(data);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const { data: existing } = await supabase
      .from('business_settings')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      await supabase
        .from('business_settings')
        .update(form)
        .eq('id', existing.id);
    } else {
      await supabase.from('business_settings').insert([form]);
    }

    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleColorChange(color: string) {
    setForm(f => ({ ...f, accent_color: color }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Branding</h1>
        <p className="text-sm text-gray-500 mt-1">Customize how your booking widget looks to customers</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo Preview */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Widget Preview</h2>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              {form.logo_url ? (
                <img src={form.logo_url} alt="logo" className="h-8 object-contain" />
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: form.accent_color }}>
                    🔧
                  </div>
                  <span className="font-bold text-gray-900">{form.business_name || 'Your Shop'}</span>
                </>
              )}
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex gap-2">
                {['Select', 'Details', 'Book'].map((s, i) => (
                  <div
                    key={s}
                    className="h-6 rounded-full px-3 flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: i === 0 ? form.accent_color : '#f3f4f6', color: i === 0 ? 'white' : '#9ca3af' }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">This is how your booking widget looks to customers</p>
        </div>

        {/* Shop Name */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Shop Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                value={form.business_name}
                onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))}
                placeholder="South London Cycles"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none"
                style={{ '--tw-ring-color': form.accent_color } as any}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+44 20 7946 0000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none"
                style={{ '--tw-ring-color': form.accent_color } as any}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="123 High Street&#10;London&#10;SW9 0JA"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none resize-none"
                style={{ '--tw-ring-color': form.accent_color } as any}
              />
            </div>
          </div>
        </div>

        {/* Logo URL */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Logo</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              type="url"
              value={form.logo_url}
              onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))}
              placeholder="https://your-shop.com/logo.png"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none"
              style={{ '--tw-ring-color': form.accent_color } as any}
            />
          </div>
          {form.logo_url && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
              <img src={form.logo_url} alt="logo preview" className="h-8 object-contain" />
              <span className="text-xs text-gray-500">Logo preview</span>
            </div>
          )}
        </div>

        {/* Accent Color */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Accent Color</h2>
          <p className="text-xs text-gray-500 mb-4">Choose the color that appears on buttons and highlights in your booking widget</p>
          <div className="flex flex-wrap gap-3">
            {COLORS.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorChange(color.value)}
                className="w-10 h-10 rounded-xl transition-all flex items-center justify-center"
                style={{ backgroundColor: color.value }}
              >
                {form.accent_color === color.value && (
                  <span className="text-white text-sm font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-500">Custom:</span>
            <input
              type="color"
              value={form.accent_color}
              onChange={e => setForm(f => ({ ...f, accent_color: e.target.value }))}
              className="w-10 h-10 rounded-xl border-0 cursor-pointer"
            />
            <span className="text-sm font-mono text-gray-600">{form.accent_color}</span>
          </div>
        </div>

        {/* Embed Code */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Embed Code</h2>
          <p className="text-xs text-gray-500 mb-4">Paste this on your website to show the booking widget</p>
          <div className="bg-gray-900 rounded-xl p-4">
            <code className="text-orange-400 text-xs break-all">
              {`<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/portal?shop=${typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('shopId') || '' : ''}" width="100%" height="900" style="border:none;border-radius:16px;"></iframe>`}
            </code>
          </div>
        </div>

        {/* Save */}
        {saved && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            ✓ Branding saved
          </div>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
          style={{ backgroundColor: form.accent_color }}
        >
          {saving ? 'Saving...' : 'Save Branding'}
        </button>
      </form>
    </div>
  );
}

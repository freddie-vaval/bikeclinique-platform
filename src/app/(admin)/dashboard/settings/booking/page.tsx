'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const SOURCES = [
  'Google',
  'Instagram',
  'Facebook',
  'Word of mouth',
  'Yelp',
  'Trustpilot',
  'Bike shop referral',
  'Racing team',
  'Other',
];

export default function BookingSettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState({
    advance_days: 14,
    default_duration_minutes: 60,
    default_mechanic_id: '',
    auto_accept: false,
    require_terms: true,
    terms_url: '',
    privacy_url: '',
    show_make: true,
    show_model: true,
    show_serial: false,
    show_year: false,
    show_bike_type: false,
    require_source: false,
    source_options: SOURCES,
  });
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [settingsRes, techRes] = await Promise.all([
      supabase.from('booking_settings').select('*').limit(1).single(),
      supabase.from('profiles').select('id, full_name').order('full_name'),
    ]);
    if (settingsRes.data) {
      setSettings(prev => ({
        ...prev,
        advance_days: settingsRes.data.advance_days ?? 14,
        default_duration_minutes: settingsRes.data.default_duration_minutes ?? 60,
        default_mechanic_id: settingsRes.data.default_mechanic_id ?? '',
        auto_accept: settingsRes.data.auto_accept ?? false,
        require_terms: settingsRes.data.require_terms ?? true,
        terms_url: settingsRes.data.terms_url ?? '',
        privacy_url: settingsRes.data.privacy_url ?? '',
        show_make: settingsRes.data.show_make ?? true,
        show_model: settingsRes.data.show_model ?? true,
        show_serial: settingsRes.data.show_serial ?? false,
        show_year: settingsRes.data.show_year ?? false,
        show_bike_type: settingsRes.data.show_bike_type ?? false,
        require_source: settingsRes.data.require_source ?? false,
      }));
    }
    if (techRes.data) setTechnicians(techRes.data);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('booking_settings')
        .select('id')
        .limit(1)
        .single();
      const payload = { ...settings };
      if (existing) {
        await supabase.from('booking_settings').update(payload).eq('id', existing.id);
      } else {
        await supabase.from('booking_settings').insert([payload]);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  }

  function toggleSource(source: string) {
    setSettings(prev => {
      const opts = prev.source_options.includes(source)
        ? prev.source_options.filter(s => s !== source)
        : [...prev.source_options, source];
      return { ...prev, source_options: opts };
    });
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
        <h1 className="text-2xl font-bold text-gray-900">Booking Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure how online bookings work for your customers</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Availability */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Availability</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Advance Booking (days)</label>
              <input
                type="number"
                value={settings.advance_days}
                onChange={e => setSettings(s => ({ ...s, advance_days: parseInt(e.target.value) || 14 }))}
                min={1}
                max={365}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">How far ahead customers can book (1-365 days)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Job Duration (minutes)</label>
              <input
                type="number"
                value={settings.default_duration_minutes}
                onChange={e => setSettings(s => ({ ...s, default_duration_minutes: parseInt(e.target.value) || 60 }))}
                min={15}
                max={480}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Default time slot length when creating jobs</p>
            </div>
          </div>
        </div>

        {/* Mechanic Assignment */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Default Mechanic</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Auto-assign mechanic for online bookings</label>
            <select
              value={settings.default_mechanic_id}
              onChange={e => setSettings(s => ({ ...s, default_mechanic_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            >
              <option value="">— No default —</option>
              {technicians.map(t => (
                <option key={t.id} value={t.id}>{t.full_name || 'Unknown'}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">New online bookings will be assigned to this mechanic automatically</p>
          </div>
        </div>

        {/* Auto Accept */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Booking Confirmation</h2>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.auto_accept}
              onChange={e => setSettings(s => ({ ...s, auto_accept: e.target.checked }))}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Auto-accept bookings</span>
              <p className="text-xs text-gray-500 mt-0.5">When enabled, new online bookings are confirmed automatically. When disabled, you'll need to approve them manually.</p>
            </div>
          </label>
        </div>

        {/* Customer Form Fields */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Booking Form — Bike Fields</h2>
          <p className="text-xs text-gray-500 mb-4">Choose which fields appear on the online booking form</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'show_make', label: 'Make (e.g. Trek, Specialized)' },
              { key: 'show_model', label: 'Model' },
              { key: 'show_serial', label: 'Serial Number' },
              { key: 'show_year', label: 'Year' },
              { key: 'show_bike_type', label: 'Bike Type (road/mtb/hybrid)' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(settings as any)[key]}
                  onChange={e => setSettings(s => ({ ...s, [key]: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Customer Source Tracking */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Customer Source Tracking</h2>
          <p className="text-xs text-gray-500 mb-4">Track how customers found you. Shown on the booking form.</p>
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={settings.require_source}
              onChange={e => setSettings(s => ({ ...s, require_source: e.target.checked }))}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Require source selection</span>
              <p className="text-xs text-gray-500 mt-0.5">If enabled, customers must select how they found you before booking</p>
            </div>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {settings.source_options.map(source => (
              <label key={source} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                {source}
              </label>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Legal & Terms</h2>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.require_terms}
                onChange={e => setSettings(s => ({ ...s, require_terms: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Require terms acceptance</span>
                <p className="text-xs text-gray-500 mt-0.5">Customers must accept terms before completing booking</p>
              </div>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions URL</label>
              <input
                type="url"
                value={settings.terms_url}
                onChange={e => setSettings(s => ({ ...s, terms_url: e.target.value }))}
                placeholder="https://bikeclinique.co.uk/terms"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Policy URL</label>
              <input
                type="url"
                value={settings.privacy_url}
                onChange={e => setSettings(s => ({ ...s, privacy_url: e.target.value }))}
                placeholder="https://bikeclinique.co.uk/privacy"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
            ✅ Booking settings saved
          </div>
        )}
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Booking Settings'}
        </button>
      </form>
    </div>
  );
}

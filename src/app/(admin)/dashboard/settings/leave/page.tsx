'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { format, addDays, startOfWeek, parseISO } from 'date-fns';

interface Technician {
  id: string;
  full_name: string;
  technician_color: string;
}

interface LeaveEntry {
  id: string;
  technician_id: string;
  date: string;
  start_time: string;
  end_time: string;
  type: 'leave' | 'lunch';
  notes: string;
  technicians?: Technician;
}

export default function LeavePage() {
  const supabase = createClient();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [leave, setLeave] = useState<LeaveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ technician_id: '', date: '', type: 'leave' as 'leave' | 'lunch', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [techRes, leaveRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name, technician_color').order('full_name'),
      supabase.from('technician_leave').select('*, technicians:technician_id(id, full_name, technician_color)').order('date', { ascending: false }),
    ]);
    if (techRes.data) setTechnicians(techRes.data);
    if (leaveRes.data) setLeave(leaveRes.data);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.technician_id || !form.date) return;
    setSaving(true);
    const { error } = await supabase.from('technician_leave').insert({
      technician_id: form.technician_id,
      date: form.date,
      type: form.type,
      start_time: form.type === 'lunch' ? '12:00' : '09:00',
      end_time: form.type === 'lunch' ? '13:00' : '17:00',
      notes: form.notes,
    });
    if (!error) {
      setForm({ technician_id: '', date: '', type: 'leave', notes: '' });
      setShowAdd(false);
      fetchData();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this leave entry?')) return;
    await supabase.from('technician_leave').delete().eq('id', id);
    setLeave(prev => prev.filter(l => l.id !== id));
  }

  // Group upcoming leave by technician
  const today = new Date().toISOString().split('T')[0];
  const upcomingLeave = leave.filter(l => l.date >= today);
  const pastLeave = leave.filter(l => l.date < today);

  function getTech(id: string) {
    return technicians.find(t => t.id === id) || { full_name: 'Unknown', technician_color: '#6B7280' };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Technician Leave</h1>
          <p className="text-sm text-gray-500 mt-1">Manage leave and lunch blocks for your team</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          + Add Leave
        </button>
      </div>

      {/* Add Leave Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Leave</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
                <select
                  value={form.technician_id}
                  onChange={e => setForm(f => ({ ...f, technician_id: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="">Select technician</option>
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.full_name || 'Unknown'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required
                  min={today}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: 'leave' }))}
                    className={`flex-1 px-4 py-2 text-sm rounded-lg border transition-all ${
                      form.type === 'leave'
                        ? 'bg-red-50 border-red-200 text-red-700 font-medium'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    🏖️ Full Day Leave
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: 'lunch' }))}
                    className={`flex-1 px-4 py-2 text-sm rounded-lg border transition-all ${
                      form.type === 'lunch'
                        ? 'bg-gray-100 border-gray-300 text-gray-700 font-medium'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    🍽️ Lunch Block
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Holiday, appointment, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAdd(false); setForm({ technician_id: '', date: '', type: 'leave', notes: '' }); }}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add Leave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upcoming Leave */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Upcoming Leave</h2>
        </div>
        {upcomingLeave.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No upcoming leave scheduled</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Technician</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Type</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Notes</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcomingLeave.map(entry => {
                const tech = getTech(entry.technician_id);
                return (
                  <tr key={entry.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tech.technician_color || '#6B7280' }} />
                        <span className="text-sm font-medium text-gray-900">{tech.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {format(parseISO(entry.date), 'EEE d MMM yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        entry.type === 'leave' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {entry.type === 'leave' ? '🏖️ Leave' : '🍽️ Lunch'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{entry.notes || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Past Leave (collapsed) */}
      {pastLeave.length > 0 && (
        <div className="mt-4">
          <details className="bg-white rounded-xl border border-gray-200">
            <summary className="px-6 py-4 text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">
              Past leave ({pastLeave.length} entries)
            </summary>
            <div className="border-t">
              {pastLeave.slice(0, 10).map(entry => {
                const tech = getTech(entry.technician_id);
                return (
                  <div key={entry.id} className="flex items-center gap-4 px-6 py-3 border-b last:border-0">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <span className="text-sm text-gray-700">{tech.full_name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{format(parseISO(entry.date), 'd MMM yyyy')}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      entry.type === 'leave' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {entry.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface DeliverySlot {
  id: string;
  profile_id: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
  status: string;
  notes: string;
  profiles?: { full_name: string };
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

export default function DeliverySlotsPage() {
  const supabase = createClient();
  const [slots, setSlots] = useState<DeliverySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    date: '',
    start_time: '09:00',
    end_time: '17:00',
    capacity: 1,
    notes: '',
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  async function fetchSlots() {
    const { data } = await supabase
      .from('delivery_slots')
      .select('*, profiles(full_name)')
      .order('date', { ascending: true });
    if (data) setSlots(data);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date) return;
    
    const { error } = await supabase.from('delivery_slots').insert({
      date: form.date,
      start_time: form.start_time,
      end_time: form.end_time,
      capacity: form.capacity,
      notes: form.notes,
      status: 'available',
      booked_count: 0,
    });
    
    if (!error) {
      setShowAdd(false);
      setForm({ date: '', start_time: '09:00', end_time: '17:00', capacity: 1, notes: '' });
      fetchSlots();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this delivery slot?')) return;
    await supabase.from('delivery_slots').delete().eq('id', id);
    setSlots(prev => prev.filter(s => s.id !== id));
  }

  async function handleToggleStatus(slot: DeliverySlot) {
    const newStatus = slot.status === 'available' ? 'disabled' : 'available';
    await supabase.from('delivery_slots').update({ status: newStatus }).eq('id', slot.id);
    setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, status: newStatus } : s));
  }

  async function generateWeek() {
    setGenerating(true);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // tomorrow
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    const inserts = dates.map(date => ({
      date,
      start_time: '09:00',
      end_time: '17:00',
      capacity: 2,
      notes: 'Auto-generated',
      status: 'available',
      booked_count: 0,
    }));

    for (const slot of inserts) {
      await supabase.from('delivery_slots').insert(slot);
    }
    
    setGenerating(false);
    fetchSlots();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short',
    });
  }

  // Group slots by date
  const grouped = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, DeliverySlot[]>);

  const upcomingDates = Object.keys(grouped).filter(d => d >= new Date().toISOString().split('T')[0]);
  const pastDates = Object.keys(grouped).filter(d => d < new Date().toISOString().split('T')[0]);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Slots</h1>
          <p className="text-sm text-gray-500 mt-1">Set your delivery windows. Customers choose after paying.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateWeek}
            disabled={generating}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {generating ? 'Generating...' : '📅 Generate Next 7 Days'}
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            + Add Slot
          </button>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Delivery Slot</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <select
                    value={form.start_time}
                    onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <select
                    value={form.end_time}
                    onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (max deliveries per slot)</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={e => setForm(f => ({ ...f, capacity: parseInt(e.target.value) || 1 }))}
                  min={1}
                  max={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="e.g. No deliveries on main road"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upcoming Slots */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : upcomingDates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">🚚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No delivery slots set</h3>
          <p className="text-sm text-gray-600">Add delivery slots so customers can book after paying</p>
          <button
            onClick={generateWeek}
            className="mt-4 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600"
          >
            Generate Next 7 Days
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingDates.map(date => (
            <div key={date} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  {formatDate(date)}
                </h2>
                <span className="text-xs text-gray-500">
                  {grouped[date].length} slot{grouped[date].length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="divide-y">
                {grouped[date].map(slot => (
                  <div key={slot.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{slot.start_time} – {slot.end_time}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          slot.status === 'available'
                            ? 'bg-green-100 text-green-700'
                            : slot.status === 'full'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {slot.status === 'available' ? `${slot.capacity - slot.booked_count} available` : slot.status}
                        </span>
                      </div>
                      {slot.notes && <p className="text-xs text-gray-500 mt-0.5">{slot.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(slot)}
                        className={`text-xs px-2 py-1 rounded border ${
                          slot.status === 'available'
                            ? 'border-gray-300 text-gray-500 hover:bg-gray-50'
                            : 'border-green-200 text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {slot.status === 'available' ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDelete(slot.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Past Slots */}
      {pastDates.length > 0 && (
        <div className="mt-8">
          <details className="bg-white rounded-xl border border-gray-200">
            <summary className="px-6 py-4 text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">
              Past slots ({pastDates.length} days)
            </summary>
            <div className="border-t px-6 py-4 space-y-4">
              {pastDates.slice(0, 14).map(date => (
                <div key={date} className="text-sm text-gray-500">
                  <span className="font-medium">{formatDate(date)}</span>: {grouped[date].length} slots
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

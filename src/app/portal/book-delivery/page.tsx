'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface DeliverySlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
}

interface Job {
  id: string;
  job_number: string;
  status: string;
  customers?: { name: string; phone: string };
}

function BookDeliveryContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('job_id');
  const paymentId = searchParams.get('payment_id');

  const supabase = createClient();
  const [job, setJob] = useState<Job | null>(null);
  const [slots, setSlots] = useState<DeliverySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (jobId) fetchData();
  }, [jobId]);

  async function fetchData() {
    if (!jobId) return;

    const [jobRes, slotsRes] = await Promise.all([
      supabase
        .from('jobs')
        .select('*, customers(name, phone)')
        .eq('id', jobId)
        .single(),
      supabase
        .from('delivery_slots')
        .select('*')
        .eq('status', 'available')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date')
        .order('start_time'),
    ]);

    if (jobRes.data) setJob(jobRes.data);
    if (slotsRes.data) setSlots(slotsRes.data);
    setLoading(false);
  }

  async function handleBook() {
    if (!selectedSlot || !jobId) return;
    setBooking(true);
    setError('');

    const { error } = await supabase
      .from('jobs')
      .update({
        delivery_slot_id: selectedSlot,
        delivery_status: 'booked',
      })
      .eq('id', jobId);

    if (error) {
      setError('Failed to book slot. Please try again.');
      setBooking(false);
    } else {
      setBooked(true);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
  }

  const grouped = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, DeliverySlot[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (booked) {
    const slot = slots.find(s => s.id === selectedSlot);
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Booked!</h1>
        <p className="text-gray-600 mb-4">Your bike will be delivered on:</p>
        <div className="bg-orange-50 rounded-xl p-4 mb-4">
          <div className="text-lg font-bold text-orange-700">
            {slot ? formatDate(slot.date) : ''}
          </div>
          <div className="text-orange-600 font-medium">
            {slot ? `${slot.start_time} – ${slot.end_time}` : ''}
          </div>
        </div>
        {job?.job_number && <p className="text-sm text-gray-500">Job ref: {job.job_number}</p>}
        <p className="text-sm text-gray-500 mt-4">We'll send you a confirmation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No slots available</h3>
          <p className="text-sm text-gray-600">Please check back soon or contact us</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, daySlots]) => (
          <div key={date} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-900">{formatDate(date)}</h2>
            </div>
            <div className="divide-y">
              {daySlots.map(slot => {
                const available = slot.capacity - slot.booked_count;
                const isAvailable = available > 0;
                return (
                  <button
                    key={slot.id}
                    onClick={() => isAvailable && setSelectedSlot(slot.id)}
                    disabled={!isAvailable}
                    className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all ${
                      selectedSlot === slot.id
                        ? 'bg-orange-50 border border-orange-300'
                        : isAvailable ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed bg-gray-50'
                    }`}
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {slot.start_time} – {slot.end_time}
                      </span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {isAvailable ? `${available} left` : 'Full'}
                      </span>
                    </div>
                    {selectedSlot === slot.id && <span className="text-orange-500 text-lg">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}

      {selectedSlot && (
        <div className="mt-4">
          <button
            onClick={handleBook}
            disabled={booking}
            className="w-full py-4 bg-orange-500 text-white font-bold text-lg rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {booking ? 'Booking...' : 'Confirm Delivery Slot'}
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">You'll receive a confirmation via SMS</p>
        </div>
      )}
    </div>
  );
}

export default function BookDeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-6 text-center">
        <div className="text-3xl mb-2">🚚</div>
        <h1 className="text-xl font-bold text-gray-900">Book Your Delivery</h1>
        <p className="text-sm text-gray-500 mt-1">Choose your delivery slot below</p>
      </div>

      <div className="max-w-lg mx-auto p-4">
        <Suspense fallback={
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        }>
          <BookDeliveryContent />
        </Suspense>
      </div>
    </div>
  );
}

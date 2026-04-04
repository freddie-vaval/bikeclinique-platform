'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const invoiceId = searchParams.get('invoice_id');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (invoiceId) {
      // Ensure invoice is marked paid in our DB (webhook may have already done this)
      supabase
        .from('invoices')
        .update({ status: 'paid', paid_date: new Date().toISOString().split('T')[0] })
        .eq('id', invoiceId)
        .then(({ error }) => {
          if (error) console.error('Error marking invoice paid:', error);
        });
    }
  }, [invoiceId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-2">Thank you for your payment.</p>
        <p className="text-sm text-gray-500 mb-6">
          Your bike is being prepared for collection/delivery.
        </p>
        
        {invoiceId && (
          <button
            onClick={() => router.push(`/portal/book-delivery?job_id=${invoiceId.replace('-all', '')}`)}
            className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors mb-3"
          >
            📅 Book Delivery Slot
          </button>
        )}
        
        <button
          onClick={() => router.push('/portal')}
          className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Back to Portal
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

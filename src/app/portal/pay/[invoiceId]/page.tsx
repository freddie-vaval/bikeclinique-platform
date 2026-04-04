'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Invoice {
  id: string;
  invoice_number: string;
  subtotal: number;
  vat_amount: number;
  total: number;
  status: string;
  issue_date: string;
  due_date: string;
  jobs?: { job_number: string };
  customers?: { name: string; email: string; phone: string };
}

export default function PayInvoicePage() {
  const params = useParams();
  const supabase = createClient();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.invoiceId) fetchInvoice();
  }, [params.invoiceId]);

  async function fetchInvoice() {
    const { data } = await supabase
      .from('invoices')
      .select('*, jobs(job_number), customers(*)')
      .eq('id', params.invoiceId)
      .single();
    
    if (data) {
      setInvoice(data);
      if (data.status === 'paid') setPaid(true);
    }
    setLoading(false);
  }

  async function handlePay() {
    if (!invoice) return;
    setPaying(true);
    setError('');

    try {
      // Create Stripe Checkout Session
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });

      const data = await res.json();
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setError('Payment link generation failed. Please try again.');
        setPaying(false);
      }
    } catch {
      setError('Payment failed. Please try again.');
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
          <p className="text-gray-600">This invoice doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (paid || invoice.status === 'paid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Paid</h1>
          <p className="text-gray-600 mb-4">
            Invoice <span className="font-mono font-semibold">{invoice.invoice_number}</span> has already been paid.
          </p>
          <p className="text-sm text-gray-500">Thank you!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-6 text-center">
        <div className="text-3xl mb-2">🔧</div>
        <h1 className="text-xl font-bold text-gray-900">Bike Service Invoice</h1>
        <p className="text-sm text-gray-500 mt-1">{invoice.invoice_number}</p>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {/* Invoice Details */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
          {/* Customer */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Bill To</p>
            <p className="font-semibold text-gray-900">{invoice.customers?.name || 'Customer'}</p>
            {invoice.customers?.email && (
              <p className="text-sm text-gray-600">{invoice.customers.email}</p>
            )}
          </div>

          {/* Line Items - Placeholder */}
          <div className="px-6 py-4 border-b">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Items</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Bike Service</span>
                <span className="text-gray-900">£{invoice.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>VAT (20%)</span>
                <span>£{invoice.vat_amount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="px-6 py-4 bg-orange-50">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900 text-lg">Total Due</span>
              <span className="font-bold text-orange-600 text-2xl">£{invoice.total?.toFixed(2)}</span>
            </div>
          </div>

          {/* Dates */}
          <div className="px-6 py-3 border-t bg-gray-50 flex justify-between text-xs text-gray-500">
            <span>Issued: {invoice.issue_date}</span>
            <span>Due: {invoice.due_date}</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={paying}
          className="w-full py-4 bg-orange-500 text-white font-bold text-lg rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {paying ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Redirecting to payment...
            </>
          ) : (
            <>
              💳 Pay £{invoice.total?.toFixed(2)} with Stripe
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-3">
          Secure payment powered by Stripe
        </p>

        {/* Job Ref */}
        {invoice.jobs?.job_number && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Job: {invoice.jobs.job_number}
          </p>
        )}
      </div>
    </div>
  );
}

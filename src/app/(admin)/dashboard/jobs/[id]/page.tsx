'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Job, Customer, Technician, KANBAN_COLUMNS, DEFAULT_CHECKLIST, JobStatus } from '@/types/jobs';
import { 
  ArrowLeft, 
  User, 
  Bike, 
  Wrench, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle,
  Save,
  Upload,
  MessageSquare,
  Package,
  Printer,
  Mail,
  Trash2,
  Flag
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [job, setJob] = useState<Job | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  
  // Checklist state
  const [checklist, setChecklist] = useState<Record<string, { label: string; completed: boolean }>>({});
  const [savingChecklist, setSavingChecklist] = useState(false);

  useEffect(() => {
    if (params.id) fetchJob();
  }, [params.id]);

  const fetchJob = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const jobRes = await fetch(`${supabaseUrl}/rest/v1/jobs?id=eq.${params.id}`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    });
    const jobsData: Job[] = await jobRes.json();
    
    if (jobsData && jobsData.length > 0) {
      const jobData = jobsData[0];
      setJob(jobData);
      setNotes(jobData.notes || '');
      
      // Initialize checklist
      if (jobData.checklist && Object.keys(jobData.checklist).length > 0) {
        // Convert from simple Record<string, boolean> to full checklist format
        const dbChecklist = jobData.checklist as Record<string, any>;
        const convertedChecklist: Record<string, { label: string; completed: boolean }> = {};
        
        // First copy all defaults
        (Object.keys(DEFAULT_CHECKLIST) as Array<keyof typeof DEFAULT_CHECKLIST>).forEach(key => {
          convertedChecklist[key] = { ...DEFAULT_CHECKLIST[key] };
        });
        
        // Then override with stored values
        Object.entries(dbChecklist).forEach(([key, value]) => {
          if (convertedChecklist[key]) {
            convertedChecklist[key].completed = typeof value === 'boolean' ? value : (value?.completed || false);
          } else {
            convertedChecklist[key] = {
              label: key,
              completed: typeof value === 'boolean' ? value : (value?.completed || false)
            };
          }
        });
        setChecklist(convertedChecklist);
      } else {
        setChecklist(DEFAULT_CHECKLIST);
      }
      
      // Fetch customer
      if (jobData.customer_id) {
        const custRes = await fetch(`${supabaseUrl}/rest/v1/customers?id=eq.${jobData.customer_id}`, {
          headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
        });
        const custData: Customer[] = await custRes.json();
        if (custData && custData.length > 0) {
          setCustomer(custData[0]);
        }
      }
      
      // Fetch technician
      if (jobData.technician_id) {
        const techRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${jobData.technician_id}`, {
          headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
        });
        const techData: Technician[] = await techRes.json();
        if (techData && techData.length > 0) {
          setTechnician(techData[0]);
        }
      }
    }
    setLoading(false);
  };

  const updateStatus = async (newStatus: JobStatus) => {
    setUpdating(true);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const updates: Partial<Job> = {
      status: newStatus,
    };

    if (newStatus === 'working_on' && !job?.started_at) {
      updates.started_at = new Date().toISOString();
    }
    if (newStatus === 'bike_ready' && !job?.completed_at) {
      updates.completed_at = new Date().toISOString();
    }

    await fetch(`${supabaseUrl}/rest/v1/jobs?id=eq.${params.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(updates)
    });
    
    setJob(prev => prev ? { ...prev, ...updates } : null);
    setUpdating(false);
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await fetch(`${supabaseUrl}/rest/v1/jobs?id=eq.${params.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ notes })
    });
    setSavingNotes(false);
  };

  const handleComplete = async () => {
    if (!job?.id || !confirm('Mark this job as complete and send payment link to customer?')) return;
    setCompleting(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ send_sms: true }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentLink(data.paymentLink || '');
        setSmsSent(data.smsSent || false);
        if (data.jobStatus) {
          setJob(prev => prev ? { ...prev, status: data.jobStatus } : null);
        }
      } else {
        alert('Failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error completing job');
    }
    setCompleting(false);
  };

  const toggleChecklistItem = async (key: string) => {
    const newChecklist = {
      ...checklist,
      [key]: {
        ...checklist[key],
        completed: !checklist[key].completed
      }
    };
    setChecklist(newChecklist);
    
    // Auto-save checklist
    setSavingChecklist(true);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await fetch(`${supabaseUrl}/rest/v1/jobs?id=eq.${params.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ checklist: newChecklist })
    });
    setSavingChecklist(false);
  };

  const getCompletedCount = () => {
    return Object.values(checklist).filter(item => item.completed).length;
  };

  const priorityColors = {
    urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    normal: 'bg-[#262626] text-[#A3A3A3] border-[#333333]',
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-[#1A1A1A] rounded w-1/4"></div>
        <div className="h-64 bg-[#1A1A1A] rounded"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-[#737373] mb-4">Job not found</p>
        <button 
          onClick={() => router.push('/dashboard/jobs')} 
          className="text-[#FF6B35] hover:underline"
        >
          ← Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard/jobs')} 
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#A3A3A3]" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white font-mono">
                {job.job_number || `#${job.id.slice(0, 8)}`}
              </h1>
              {job.priority && job.priority !== 'normal' && (
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${priorityColors[job.priority]}`}>
                  <Flag className="w-3 h-3" />
                  {job.priority.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-sm text-[#737373]">
              {job.service_type || 'Service'} • Created {new Date(job.created_at).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="col-span-2 space-y-6">
          {/* Status Actions - HubTiger Style */}
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4">
            <h2 className="text-sm font-semibold text-[#A3A3A3] mb-3 uppercase tracking-wide">Status</h2>
            <div className="grid grid-cols-7 gap-2">
              {KANBAN_COLUMNS.map((column) => (
                <button
                  key={column.id}
                  onClick={() => updateStatus(column.id)}
                  disabled={updating || job.status === column.id}
                  className={`px-2 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                    job.status === column.id
                      ? 'border-[#FF6B35] bg-[#FF6B35]/20 text-[#FF6B35]'
                      : 'border-[#333333] bg-[#262626] text-[#A3A3A3] hover:border-[#FF6B35] hover:text-white'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: column.color }} />
                  {column.title.split(' - ')[0].split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Service Checklist */}
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Service Checklist</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#737373]">
                  {getCompletedCount()}/{Object.keys(checklist).length}
                </span>
                {savingChecklist && (
                  <div className="w-4 h-4 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-[#262626] rounded-full mb-4 overflow-hidden">
              <div 
                className="h-full bg-[#FF6B35] transition-all duration-300"
                style={{ 
                  width: `${(getCompletedCount() / Object.keys(checklist).length) * 100}%` 
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(checklist).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => toggleChecklistItem(key)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    item.completed
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-[#262626] border-[#333333] hover:border-[#FF6B35]'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#737373] flex-shrink-0" />
                  )}
                  <span className={`text-sm ${item.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#FF6B35]" />
                Notes
              </h2>
              <button 
                onClick={saveNotes}
                disabled={savingNotes}
                className="flex items-center gap-2 text-sm bg-[#FF6B35] text-white px-3 py-1.5 rounded hover:bg-[#FF8255] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingNotes ? 'Saving...' : 'Save'}
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this job..."
              className="w-full p-3 bg-[#262626] border border-[#333333] rounded-lg text-white placeholder-[#737373] focus:outline-none focus:border-[#FF6B35] resize-none"
              rows={4}
            />
          </div>

          {/* Photo Upload */}
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-[#FF6B35]" />
              Photos
            </h2>
            <div className="border-2 border-dashed border-[#333333] rounded-lg p-8 text-center hover:border-[#FF6B35] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-[#737373] mx-auto mb-2" />
              <p className="text-sm text-[#737373]">
                Click to upload photos
              </p>
              <p className="text-xs text-[#525252] mt-1">
                PNG, JPG up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#A3A3A3] mb-3 uppercase tracking-wide">Customer</h2>
            {customer ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{customer.name}</p>
                    {customer.email && (
                      <p className="text-xs text-[#737373]">{customer.email}</p>
                    )}
                  </div>
                </div>
                {customer.phone && (
                  <p className="text-sm text-[#A3A3A3]">📞 {customer.phone}</p>
                )}
              </div>
            ) : (
              <p className="text-[#737373]">No customer linked</p>
            )}
          </div>

          {/* Bike */}
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#A3A3A3] mb-3 uppercase tracking-wide">Bike</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-[#FF6B35]" />
                <span className="text-white">{job.bike_model || 'Not specified'}</span>
              </div>
              {job.service_type && (
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#A3A3A3]" />
                  <span className="text-[#A3A3A3]">{job.service_type}</span>
                </div>
              )}
            </div>
          </div>

          {/* Technician */}
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#A3A3A3] mb-3 uppercase tracking-wide">Technician</h2>
            {technician ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#262626] rounded-full flex items-center justify-center text-[#FF6B35] font-bold">
                  {technician.name.charAt(0)}
                </div>
                <span className="font-medium text-white">{technician.name}</span>
              </div>
            ) : (
              <p className="text-[#737373] flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Unassigned
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#A3A3A3] mb-3 uppercase tracking-wide">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#737373] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Booked
                </span>
                <span className="text-white">
                  {job.scheduled_date 
                    ? new Date(job.scheduled_date).toLocaleDateString('en-GB')
                    : job.booked_at 
                      ? new Date(job.booked_at).toLocaleDateString('en-GB')
                      : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Started
                </span>
                <span className="text-white">
                  {job.started_at 
                    ? new Date(job.started_at).toLocaleDateString('en-GB')
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </span>
                <span className="text-white">
                  {job.completed_at 
                    ? new Date(job.completed_at).toLocaleDateString('en-GB')
                    : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#A3A3A3] mb-3 uppercase tracking-wide">Actions</h2>

            {/* Payment Link Result */}
            {paymentLink && (
              <div className="mb-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-xs font-medium mb-1">✅ Job Complete — Payment Link Sent</p>
                {smsSent && <p className="text-green-400/70 text-xs">📱 SMS sent to customer</p>}
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-xs text-orange-400 hover:text-orange-300 underline break-all"
                >
                  {paymentLink}
                </a>
              </div>
            )}

            {/* Mark Complete - only show if not already bike_ready/collected */}
            {job?.status !== 'bike_ready' && job?.status !== 'collected' && (
              <button
                onClick={handleComplete}
                disabled={completing}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 mb-2"
              >
                {completing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Complete & Send Payment Link
                  </>
                )}
              </button>
            )}

            {/* Job already complete */}
            {(job?.status === 'bike_ready' || job?.status === 'collected') && paymentLink && (
              <div className="mb-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                <span className="text-green-400 text-sm font-medium">✅ Complete — Payment Sent</span>
              </div>
            )}

            <div className="space-y-2">
              <button className="w-full py-2.5 border border-[#333333] rounded-lg text-[#A3A3A3] hover:bg-[#262626] hover:text-white transition-colors flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />
                Print Invoice
              </button>
              <button className="w-full py-2.5 border border-[#333333] rounded-lg text-[#A3A3A3] hover:bg-[#262626] hover:text-white transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Send Email
              </button>
              <button className="w-full py-2.5 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Technician {
  id: string;
  full_name?: string;
  name?: string;
  technician_color: string;
  technician_role: string;
  hourly_goal: number;
}

interface Job {
  id: string;
  job_number: string;
  booking_date: string;
  booking_time: string;
  status: string;
  assigned_to?: string;
  duration_hours?: number;
  job_color?: string;
  service?: {
    name: string;
    color?: string;
    duration_minutes?: number;
  };
  customer?: {
    full_name?: string;
    name?: string;
  };
  bike?: {
    model?: string;
  };
}

interface Leave {
  id: string;
  technician_id: string;
  date: string;
  start_time: string;
  end_time: string;
  type: 'leave' | 'lunch';
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7);
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const JOB_STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  booked_in: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
  waiting_for_work: { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-700' },
  working_on: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' },
  waiting_parts: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700' },
  waiting_approval: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700' },
  bike_ready: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700' },
  collected: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-600' },
  cancelled: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-500' },
};

const STATUS_LABELS: Record<string, string> = {
  booked_in: 'Booked In',
  waiting_for_work: 'Waiting Work',
  working_on: 'Working On',
  waiting_parts: 'Waiting Parts',
  waiting_approval: 'Waiting Approval',
  bike_ready: 'Ready',
  collected: 'Collected',
  cancelled: 'Cancelled',
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function getJobTop(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return Math.max(((h - 7) * 60 + m) * (60 / 60), 0);
}

function getJobHeight(durationMinutes: number): number {
  return Math.max(durationMinutes * (60 / 60), 40);
}

export default function CalendarPage() {
  const supabase = createClient();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [leave, setLeave] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'week' | '2week' | 'month'>('week');
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [dragJob, setDragJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchData();
  }, [weekStart, view]);

  async function fetchData() {
    setLoading(true);
    const start = weekStart.toISOString().split('T')[0];
    const end = new Date(weekStart);
    end.setDate(end.getDate() + (view === 'month' ? 30 : view === '2week' ? 13 : 6));
    const endStr = end.toISOString().split('T')[0];

    const [techRes, jobsRes, leaveRes] = await Promise.all([
      // Technicians = profiles where they have mechanic-related data or are assigned to jobs
      supabase
        .from('profiles')
        .select('*')
        .order('full_name'),
      supabase
        .from('jobs')
        .select(`
          *,
          service:job_services(services(name, color, duration_minutes)),
          customer:customer_id(full_name),
          bike:bike_id(model)
        `)
        .gte('booking_date', start)
        .lte('booking_date', endStr)
        .neq('status', 'cancelled')
        .not('booking_date', 'is', null),
      supabase
        .from('technician_leave')
        .select('*')
        .gte('date', start)
        .lte('date', endStr),
    ]);

    if (techRes.data) setTechnicians(techRes.data.filter(t => t.full_name));
    if (jobsRes.data) {
      const mapped: Job[] = (jobsRes.data as any[]).map(j => ({
        ...j,
        service: Array.isArray(j.service) ? j.service?.[0] : j.service,
      }));
      setJobs(mapped);
    }
    if (leaveRes.data) setLeave(leaveRes.data);
    setLoading(false);
  }

  function getDates(): Date[] {
    return Array.from({ length: view === 'month' ? 30 : view === '2week' ? 14 : 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }

  function getJobsForTechAndDate(techId: string, date: Date): Job[] {
    const dateStr = date.toISOString().split('T')[0];
    return jobs.filter(j => j.assigned_to === techId && j.booking_date === dateStr);
  }

  function getLeaveForTechAndDate(techId: string, date: Date): Leave[] {
    const dateStr = date.toISOString().split('T')[0];
    return leave.filter(l => l.technician_id === techId && l.date === dateStr);
  }

  function navigateWeek(dir: number) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + dir * (view === '2week' ? 14 : 7));
    setWeekStart(d);
  }

  function goToday() {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    setWeekStart(d);
  }

  function formatWeekRange(): string {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + (view === '2week' ? 13 : 6));
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${weekStart.toLocaleDateString('en-GB', opts)} – ${end.toLocaleDateString('en-GB', opts)}`;
  }

  const dates = getDates();
  const isToday = (d: Date) => d.toDateString() === new Date().toDateString();

  function getTechCapacity(techId: string, date: Date): { hours: number; goal: number; pct: number } {
    const dateStr = date.toISOString().split('T')[0];
    const techJobs = getJobsForTechAndDate(techId, date);
    const hours = techJobs.reduce((sum, j) => {
      if (j.duration_hours) return sum + j.duration_hours;
      if (j.service?.duration_minutes) return sum + j.service.duration_minutes / 60;
      return sum + 1;
    }, 0);
    const goal = 8;
    return { hours, goal, pct: Math.min((hours / goal) * 100, 100) };
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(['week', '2week', 'month'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 text-sm rounded-md transition-all ${
                  view === v ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {v === 'week' ? '1W' : v === '2week' ? '2W' : 'Month'}
              </button>
            ))}
          </div>
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigateWeek(-1)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-bold">
            ←
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[180px] text-center">
            {formatWeekRange()}
          </span>
          <button onClick={() => navigateWeek(1)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-bold">
            →
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 px-6 py-2 bg-white border-b overflow-x-auto">
        <span className="text-xs text-gray-500 font-medium flex-shrink-0">STATUS:</span>
        {Object.entries(STATUS_LABELS).map(([k, v]) => {
          const c = JOB_STATUS_COLORS[k] || { bg: 'bg-gray-50', text: 'text-gray-700' };
          return (
            <span key={k} className={`flex items-center gap-1 text-xs ${c.text} flex-shrink-0`}>
              <span className="w-2 h-2 rounded-full bg-current opacity-60" />
              {v}
            </span>
          );
        })}
        <span className="ml-4 text-xs text-gray-400 flex-shrink-0">🟦 Job block</span>
        <span className="text-xs text-gray-400 flex-shrink-0">⬜ Lunch</span>
        <span className="text-xs text-gray-400 flex-shrink-0">🔴 Leave</span>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
          </div>
        ) : (
          <div className="min-w-[900px]">
            {/* Date header row */}
            <div className="flex border-b bg-white sticky top-0 z-20">
              <div className="w-36 flex-shrink-0 border-r px-4 py-3 bg-gray-50">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Technician</span>
              </div>
              {dates.map((date, i) => (
                <div
                  key={i}
                  className={`flex-1 border-r px-2 py-3 text-center ${isToday(date) ? 'bg-orange-50' : ''}`}
                >
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                  </div>
                  <div className={`text-lg font-bold mt-0.5 ${isToday(date) ? 'text-orange-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </div>
                  {isToday(date) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mx-auto mt-0.5" />
                  )}
                </div>
              ))}
            </div>

            {/* Technician rows */}
            {technicians.map((tech) => (
              <div key={tech.id} className="flex border-b min-h-[160px]">
                {/* Technician name + capacity */}
                <div className="w-36 flex-shrink-0 border-r px-3 py-3 bg-white">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tech.technician_color || '#6B7280' }}
                    />
                    <div className="font-semibold text-gray-900 text-sm truncate">
                      {tech.full_name || tech.name || 'Unknown'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 capitalize">{tech.technician_role || 'mechanic'}</div>
                  <div className="mt-3 space-y-1">
                    {dates.slice(0, 7).map((date, i) => {
                      const cap = getTechCapacity(tech.id, date);
                      return (
                        <div key={i} className="space-y-0.5">
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span>{cap.hours.toFixed(1)}h</span>
                            <span>{cap.goal}h</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full transition-all ${
                                cap.pct > 100 ? 'bg-red-500' : cap.pct > 80 ? 'bg-amber-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(cap.pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Day cells */}
                {dates.map((date, dayIdx) => {
                  const dayJobs = getJobsForTechAndDate(tech.id, date);
                  const dayLeave = getLeaveForTechAndDate(tech.id, date);
                  return (
                    <div
                      key={dayIdx}
                      className={`flex-1 border-r px-1 py-1 relative ${isToday(date) ? 'bg-orange-50/30' : 'bg-white'}`}
                    >
                      {/* Hour grid lines */}
                      <div className="absolute inset-0 pointer-events-none">
                        {HOURS.slice(0, -1).map((_, hi) => (
                          <div
                            key={hi}
                            className="absolute w-full border-t border-dashed border-gray-100"
                            style={{ top: `${(hi + 1) * (60 / 60)}px` }}
                          />
                        ))}
                      </div>

                      {/* Lunch blocks */}
                      {dayLeave
                        .filter(lb => lb.type === 'lunch')
                        .map(lb => (
                          <div
                            key={lb.id}
                            className="absolute left-1 right-1 bg-gray-100 border border-gray-200 rounded text-[10px] text-gray-500 flex items-center justify-center z-10"
                            style={{
                              top: `${getJobTop(lb.start_time)}px`,
                              height: `${getJobHeight(60)}px`,
                            }}
                          >
                            Lunch
                          </div>
                        ))}

                      {/* Leave blocks */}
                      {dayLeave
                        .filter(lb => lb.type === 'leave')
                        .map(lb => (
                          <div
                            key={lb.id}
                            className="absolute left-1 right-1 bg-red-50 border border-red-200 rounded text-[10px] text-red-600 flex items-center justify-center z-10"
                            style={{
                              top: `${getJobTop(lb.start_time)}px`,
                              height: `${getJobHeight(120)}px`,
                            }}
                          >
                            Leave
                          </div>
                        ))}

                      {/* Job blocks */}
                      {dayJobs.map(job => {
                        const colors = JOB_STATUS_COLORS[job.status] || { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
                        const durationMin = job.service?.duration_minutes || (job.duration_hours ? job.duration_hours * 60 : 60);
                        const customerName = (job.customer as any)?.full_name || (job.customer as any)?.name || job.customer?.full_name || '—';
                        const bikeModel = (job.bike as any)?.model || job.bike?.model || job.service?.name || '';
                        return (
                          <div
                            key={job.id}
                            className={`absolute left-1 right-1 ${colors.bg} border ${colors.border} rounded px-1.5 py-1 cursor-pointer hover:shadow-md transition-shadow z-10 overflow-hidden`}
                            style={{
                              top: `${getJobTop(job.booking_time)}px`,
                              height: `${getJobHeight(durationMin)}px`,
                              minHeight: '38px',
                            }}
                            title={`${customerName} | ${bikeModel} | ${job.booking_time} | ${formatDuration(durationMin)}`}
                          >
                            <div className={`text-[10px] font-semibold truncate ${colors.text}`}>
                              {job.booking_time}
                            </div>
                            <div className="text-[10px] font-medium text-gray-800 truncate">
                              {customerName}
                            </div>
                            <div className="text-[9px] text-gray-500 truncate">
                              {bikeModel}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Empty state */}
            {technicians.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No technicians found</h3>
                <p className="text-sm text-gray-600">Add team members in Settings to see them on the calendar</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Stats */}
      <div className="border-t bg-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">{jobs.length}</span> jobs this period
          </span>
          <span className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">{technicians.length}</span> technicians
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>🟦 Job</span>
          <span>⬜ Lunch</span>
          <span>🔴 Leave</span>
          <span className="ml-2">Drag to reschedule (coming soon)</span>
        </div>
      </div>
    </div>
  );
}

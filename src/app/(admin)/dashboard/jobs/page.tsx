'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Job, Customer, Technician, KANBAN_COLUMNS, JobStatus } from '@/types/jobs';
import JobCard from '@/components/jobs/JobCard';
import AddJobModal from '@/components/jobs/AddJobModal';
import JobsListView from '@/components/jobs/JobsListView';
import { Plus, GripVertical, Package, Download, List, LayoutGrid, Filter } from 'lucide-react';

export default function JobsKanbanPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [creatingJob, setCreatingJob] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  
  // Drag state
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const [jobsRes, customersRes, techRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/jobs?select=*&order=created_at.desc`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      }),
      fetch(`${supabaseUrl}/rest/v1/customers?select=id,name,email,phone`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      }),
      fetch(`${supabaseUrl}/rest/v1/profiles?role=eq.mechanic&select=id,name,role`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      }),
    ]);

    setJobs(await jobsRes.json() || []);
    setCustomers(await customersRes.json() || []);
    setTechnicians(await techRes.json() || []);
    setLoading(false);
  };

  const getJobsByStatus = useCallback((status: JobStatus) => {
    return jobs.filter(job => {
      const matchesStatus = job.status === status;
      // Filter by technician if selected
      if (statusFilter === 'all') return matchesStatus;
      if (statusFilter === 'unassigned') return matchesStatus && !job.technician_id;
      return matchesStatus && job.technician_id === statusFilter;
    });
  }, [jobs, statusFilter]);

  const getCustomer = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  const getTechnician = (techId: string) => {
    return technicians.find(t => t.id === techId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeJob = jobs.find(j => j.id === active.id);
    if (!activeJob) return;

    // Determine the target status
    let newStatus: JobStatus;
    
    // Check if dropped on a column (the column header is the droppable)
    const columnId = over.id as JobStatus;
    if (KANBAN_COLUMNS.some(col => col.id === columnId)) {
      newStatus = columnId;
    } else {
      // Dropped on another job - find that job's status
      const overJob = jobs.find(j => j.id === over.id);
      newStatus = overJob?.status || activeJob.status;
    }

    if (activeJob.status !== newStatus) {
      // Update the job status in the database
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const updates: Partial<Job> = {
        status: newStatus,
        ...(newStatus === 'working_on' && { started_at: new Date().toISOString() }),
        ...(newStatus === 'bike_ready' && { completed_at: new Date().toISOString() }),
      };

      await fetch(`${supabaseUrl}/rest/v1/jobs?id=eq.${activeJob.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(updates)
      });

      // Update local state
      setJobs(prev => prev.map(job => 
        job.id === activeJob.id ? { ...job, ...updates } : job
      ));
    }
  };

  const handleCreateJob = async (jobData: any) => {
    setCreatingJob(true);
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const jobNumber = `#${Date.now().toString().slice(-6)}`;

    await fetch(`${supabaseUrl}/rest/v1/jobs`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        ...jobData,
        job_number: jobNumber,
      })
    });

    setShowAddModal(false);
    setCreatingJob(false);
    fetchData();
  };

  // Export jobs to CSV
  const handleExportCSV = () => {
    const headers = ['Job ID', 'Status', 'Customer ID', 'Technician', 'Booked At', 'Started At', 'Completed At', 'Notes', 'Created'];
    const rows = jobs.map(job => [
      job.id,
      job.status,
      job.customer_id,
      getTechnician(job.technician_id || '')?.name || 'Unassigned',
      job.booked_at ? new Date(job.booked_at).toLocaleString() : '',
      job.started_at ? new Date(job.started_at).toLocaleString() : '',
      job.completed_at ? new Date(job.completed_at).toLocaleString() : '',
      (job.notes || '').replace(/"/g, '""'),
      job.created_at ? new Date(job.created_at).toLocaleString() : '',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jobs-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const activeJob = activeId ? jobs.find(j => j.id === activeId) : null;

  // Calculate totals
  const totalJobs = jobs.length;
  const urgentJobs = jobs.filter(j => j.priority === 'urgent').length;
  const inProgressJobs = jobs.filter(j => j.status === 'working_on').length;
  const readyJobs = jobs.filter(j => j.status === 'bike_ready').length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Jobs</h1>
            <p className="text-sm text-[#737373]">
              {totalJobs} jobs • {urgentJobs} urgent • {inProgressJobs} in progress
            </p>
          </div>
          
          {/* Filter by Technician */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-[#333333] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF6B35]"
          >
            <option value="all">All Technicians</option>
            <option value="unassigned">Unassigned</option>
            {technicians.map(tech => (
              <option key={tech.id} value={tech.id}>{tech.name}</option>
            ))}
          </select>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 mr-6">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-2">
            <div className="text-2xl font-bold text-white font-mono">{totalJobs}</div>
            <div className="text-xs text-[#737373]">Total</div>
          </div>
          <div className="bg-[#1A1A1A] border border-red-500/30 rounded-lg px-4 py-2">
            <div className="text-2xl font-bold text-red-400 font-mono">{urgentJobs}</div>
            <div className="text-xs text-[#737373]">Urgent</div>
          </div>
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-2">
            <div className="text-2xl font-bold text-blue-400 font-mono">{inProgressJobs}</div>
            <div className="text-xs text-[#737373]">In Progress</div>
          </div>
          <div className="bg-[#1A1A1A] border border-green-500/30 rounded-lg px-4 py-2">
            <div className="text-2xl font-bold text-green-400 font-mono">{readyJobs}</div>
            <div className="text-xs text-[#737373]">Ready</div>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg hover:bg-[#262626] transition-colors font-medium"
        >
          <Download className="w-5 h-5" />
          Export
        </button>

        {/* View Toggle */}
        <div className="flex items-center bg-[#1A1A1A] border border-[#333333] rounded-lg p-1">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              viewMode === 'kanban' 
                ? 'bg-[#FF6B35] text-white' 
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-[#FF6B35] text-white' 
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF8255] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Job
        </button>
      </div>

      {/* Board/List View */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full" />
        </div>
      ) : viewMode === 'kanban' ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map((column) => {
              const columnJobs = getJobsByStatus(column.id);
              
              return (
                <div
                  key={column.id}
                  className="flex-shrink-0 w-72 flex flex-col bg-[#0D0D0D] rounded-xl"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between p-3 border-b border-[#333333]">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: column.color }}
                      />
                      <h3 className="font-semibold text-white text-sm">{column.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#A3A3A3] bg-[#262626] px-2 py-0.5 rounded-full">
                        {columnJobs.length}
                      </span>
                      <GripVertical className="w-4 h-4 text-[#333333]" />
                    </div>
                  </div>

                  {/* Jobs List */}
                  <div className="flex-1 p-2 overflow-y-auto space-y-2 min-h-[200px]">
                    <SortableContext
                      items={columnJobs.map(j => j.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {columnJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          customer={getCustomer(job.customer_id)}
                          technician={getTechnician(job.technician_id || '')}
                          onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                        />
                      ))}
                    </SortableContext>
                    
                    {columnJobs.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-[#737373]">
                        <Package className="w-8 h-8 mb-2 opacity-30" />
                        <span className="text-xs">No jobs</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeJob ? (
              <div className="opacity-90 rotate-3 scale-105">
                <JobCard
                  job={activeJob}
                  customer={getCustomer(activeJob.customer_id)}
                  technician={getTechnician(activeJob.technician_id || '')}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <JobsListView 
          jobs={jobs} 
          customers={customers} 
          technicians={technicians} 
        />
      )}

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateJob}
        customers={customers}
        technicians={technicians}
        loading={creatingJob}
      />
    </div>
  );
}

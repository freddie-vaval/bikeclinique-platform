'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Job, Customer, Technician, KANBAN_COLUMNS, JobStatus } from '@/types/jobs';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Calendar,
  Bike,
  User,
  Wrench,
  ArrowUpDown
} from 'lucide-react';

interface JobsListViewProps {
  jobs: Job[];
  customers: Customer[];
  technicians: Technician[];
}

type SortField = 'created_at' | 'job_number' | 'status' | 'service_type' | 'bike_model';
type SortDirection = 'asc' | 'desc';

export default function JobsListView({ jobs, customers, technicians }: JobsListViewProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [techFilter, setTechFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const getCustomer = (customerId: string) => customers.find(c => c.id === customerId);
  const getTechnician = (techId: string | undefined | null) => techId ? technicians.find(t => t.id === techId) : null;
  const getStatusInfo = (status: JobStatus) => KANBAN_COLUMNS.find(c => c.id === status);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(job => {
        const customer = getCustomer(job.customer_id);
        return (
          job.job_number?.toLowerCase().includes(searchLower) ||
          job.service_type?.toLowerCase().includes(searchLower) ||
          job.bike_model?.toLowerCase().includes(searchLower) ||
          customer?.name.toLowerCase().includes(searchLower)
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(job => job.status === statusFilter);
    }

    // Technician filter
    if (techFilter !== 'all') {
      if (techFilter === 'unassigned') {
        result = result.filter(job => !job.technician_id);
      } else {
        result = result.filter(job => job.technician_id === techFilter);
      }
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'created_at':
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        case 'job_number':
          comparison = (a.job_number || '').localeCompare(b.job_number || '');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'service_type':
          comparison = (a.service_type || '').localeCompare(b.service_type || '');
          break;
        case 'bike_model':
          comparison = (a.bike_model || '').localeCompare(b.bike_model || '');
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [jobs, search, statusFilter, techFilter, sortField, sortDirection, customers, technicians]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Job #', 'Status', 'Customer', 'Phone', 'Bike', 'Service', 'Technician', 'Scheduled', 'Created'];
    const rows = filteredJobs.map(job => {
      const customer = getCustomer(job.customer_id);
      const tech = getTechnician(job.technician_id);
      return [
        job.job_number || job.id.slice(0, 8),
        getStatusInfo(job.status)?.title || job.status,
        customer?.name || '',
        customer?.phone || '',
        job.bike_model || '',
        job.service_type || '',
        tech?.name || 'Unassigned',
        job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString('en-GB') : '',
        new Date(job.created_at).toLocaleDateString('en-GB'),
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jobs-list-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-[#525252]" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#FF6B35]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#FF6B35]" />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
          <input
            type="text"
            placeholder="Search jobs, customers, bikes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white placeholder-[#737373] focus:outline-none focus:border-[#FF6B35]"
          />
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg transition-colors ${
              showFilters ? 'bg-[#FF6B35] border-[#FF6B35] text-white' : 'bg-[#1A1A1A] border-[#333333] text-[#A3A3A3] hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2.5 bg-[#1A1A1A] border border-[#333333] text-[#A3A3A3] rounded-lg hover:text-white hover:border-[#FF6B35] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="flex items-center gap-4 mb-4 p-4 bg-[#1A1A1A] border border-[#333333] rounded-lg">
          <div>
            <label className="block text-xs text-[#737373] mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#262626] border border-[#333333] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF6B35]"
            >
              <option value="all">All Statuses</option>
              {KANBAN_COLUMNS.map(col => (
                <option key={col.id} value={col.id}>{col.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#737373] mb-1">Technician</label>
            <select
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="bg-[#262626] border border-[#333333] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF6B35]"
            >
              <option value="all">All Technicians</option>
              <option value="unassigned">Unassigned</option>
              {technicians.map(tech => (
                <option key={tech.id} value={tech.id}>{tech.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#737373] text-right">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#262626] border-b border-[#333333]">
              <tr>
                <th 
                  className="text-left text-xs font-semibold text-[#A3A3A3] uppercase tracking-wide px-4 py-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('job_number')}
                >
                  <div className="flex items-center gap-1">
                    Job # <SortIcon field="job_number" />
                  </div>
                </th>
                <th 
                  className="text-left text-xs font-semibold text-[#A3A3A3] uppercase tracking-wide px-4 py-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status <SortIcon field="status" />
                  </div>
                </th>
                <th className="text-left text-xs font-semibold text-[#A3A3A3] uppercase tracking-wide px-4 py-3">
                  <div className="flex items-center gap-1">
                    Customer <User className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th 
                  className="text-left text-xs font-semibold text-[#A3A3A3] uppercase tracking-wide px-4 py-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('bike_model')}
                >
                  <div className="flex items-center gap-1">
                    Bike <SortIcon field="bike_model" />
                  </div>
                </th>
                <th 
                  className="text-left text-xs font-semibold text-[#A3A3A3] uppercase tracking-wide px-4 py-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('service_type')}
                >
                  <div className="flex items-center gap-1">
                    Service <SortIcon field="service_type" />
                  </div>
                </th>
                <th className="text-left text-xs font-semibold text-[#A3A3A3] uppercase tracking-wide px-4 py-3">
                  Tech
                </th>
                <th 
                  className="text-left text-xs font-semibold text-[#A3A3A3] uppercase tracking-wide px-4 py-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-1">
                    Created <SortIcon field="created_at" />
                  </div>
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]">
              {filteredJobs.map((job) => {
                const customer = getCustomer(job.customer_id);
                const tech = getTechnician(job.technician_id);
                const statusInfo = getStatusInfo(job.status);
                
                return (
                  <tr 
                    key={job.id}
                    onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                    className="cursor-pointer hover:bg-[#262626] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-white font-medium">
                        {job.job_number || `#${job.id.slice(0, 8)}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span 
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border"
                        style={{ 
                          backgroundColor: `${statusInfo?.color}15`,
                          borderColor: `${statusInfo?.color}30`,
                          color: statusInfo?.color 
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusInfo?.color }} />
                        {statusInfo?.title || job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{customer?.name || 'Unknown'}</p>
                        {customer?.phone && (
                          <p className="text-xs text-[#737373]">{customer.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bike className="w-4 h-4 text-[#737373]" />
                        <span className="text-white">{job.bike_model || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-[#737373]" />
                        <span className="text-[#A3A3A3]">{job.service_type || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {tech ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {tech.name.charAt(0)}
                          </div>
                          <span className="text-white text-sm">{tech.name}</span>
                        </div>
                      ) : (
                        <span className="text-[#737373] text-sm">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-[#737373]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-sm">
                          {job.scheduled_date 
                            ? new Date(job.scheduled_date).toLocaleDateString('en-GB')
                            : new Date(job.created_at).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1 hover:bg-[#333333] rounded transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-[#737373]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-[#737373]">
              <p>No jobs found</p>
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="mt-2 text-[#FF6B35] hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

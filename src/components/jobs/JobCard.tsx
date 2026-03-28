'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Job, Customer, Technician, PRIORITY_COLORS } from '@/types/jobs';
import { Wrench, User, Bike, Clock } from 'lucide-react';

interface JobCardProps {
  job: Job;
  customer?: Customer;
  technician?: Technician;
  onClick?: () => void;
}

export default function JobCard({ job, customer, technician, onClick }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColor = PRIORITY_COLORS[job.priority || 'normal'];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="group bg-[#1A1A1A] border border-[#333333] rounded-lg p-3 cursor-pointer hover:border-[#FF6B35] transition-all touch-manipulation"
    >
      {/* Priority indicator */}
      <div 
        className="w-full h-1 rounded-full mb-3"
        style={{ backgroundColor: priorityColor }}
      />

      {/* Job Number */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-white font-mono">
          {job.job_number || `#${job.id.slice(0, 6)}`}
        </span>
        {job.service_type && (
          <span className="text-xs px-2 py-0.5 bg-[#262626] text-[#A3A3A3] rounded">
            {job.service_type}
          </span>
        )}
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2 mb-2">
        <User className="w-3.5 h-3.5 text-[#FF6B35]" />
        <span className="text-sm text-white truncate">
          {customer?.name || 'Unknown Customer'}
        </span>
      </div>

      {/* Bike */}
      <div className="flex items-center gap-2 mb-2">
        <Bike className="w-3.5 h-3.5 text-[#A3A3A3]" />
        <span className="text-sm text-[#A3A3A3] truncate">
          {job.bike_model || customer?.name ? 'Bike' : 'No bike details'}
        </span>
      </div>

      {/* Technician & Time */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#333333]">
        <div className="flex items-center gap-1.5">
          {technician ? (
            <>
              <div className="w-5 h-5 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-xs font-medium">
                {technician.name.charAt(0)}
              </div>
              <span className="text-xs text-[#737373]">{technician.name}</span>
            </>
          ) : (
            <span className="text-xs text-[#737373] flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              Unassigned
            </span>
          )}
        </div>
        
        {job.scheduled_date && (
          <div className="flex items-center gap-1 text-xs text-[#737373]">
            <Clock className="w-3 h-3" />
            {new Date(job.scheduled_date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
            })}
          </div>
        )}
      </div>
    </div>
  );
}

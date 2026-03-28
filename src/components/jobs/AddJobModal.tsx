'use client';

import { useState, useEffect } from 'react';
import { Customer, Technician, SERVICE_TYPES, JobPriority } from '@/types/jobs';
import { X, Search, User, Bike, Calendar, Wrench, Flag } from 'lucide-react';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: any) => void;
  customers: Customer[];
  technicians: Technician[];
  loading?: boolean;
}

export default function AddJobModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  customers, 
  technicians,
  loading 
}: AddJobModalProps) {
  const [formData, setFormData] = useState({
    customer_id: '',
    bike_model: '',
    service_type: '',
    technician_id: '',
    scheduled_date: '',
    scheduled_time: '',
    priority: 'normal' as JobPriority,
    notes: '',
  });

  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const selectedCustomer = customers.find(c => c.id === formData.customer_id);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        customer_id: '',
        bike_model: '',
        service_type: '',
        technician_id: '',
        scheduled_date: '',
        scheduled_time: '',
        priority: 'normal',
        notes: '',
      });
      setCustomerSearch('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const scheduledDateTime = formData.scheduled_date && formData.scheduled_time
      ? `${formData.scheduled_date}T${formData.scheduled_time}:00`
      : null;

    onSubmit({
      customer_id: formData.customer_id,
      bike_model: formData.bike_model,
      service_type: formData.service_type,
      technician_id: formData.technician_id || null,
      scheduled_date: scheduledDateTime,
      priority: formData.priority,
      notes: formData.notes,
      status: 'booked_in',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333333]">
          <h2 className="text-xl font-bold text-white">New Job</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#262626] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#A3A3A3]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Customer Search/Select */}
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
              Customer *
            </label>
            <div className="relative">
              {selectedCustomer ? (
                <div className="flex items-center justify-between p-3 bg-[#262626] rounded-lg border border-[#333333]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FF6B35]" />
                    <span className="text-white">{selectedCustomer.name}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, customer_id: ''})}
                    className="text-[#737373] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setShowCustomerDropdown(true);
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#262626] border border-[#333333] rounded-lg text-white placeholder-[#737373] focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                  {showCustomerDropdown && customerSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-[#262626] border border-[#333333] rounded-lg max-h-48 overflow-y-auto">
                      {filteredCustomers.length === 0 ? (
                        <div className="p-3 text-[#737373] text-sm">No customers found</div>
                      ) : (
                        filteredCustomers.map(customer => (
                          <button
                            key={customer.id}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, customer_id: customer.id});
                              setCustomerSearch(customer.name);
                              setShowCustomerDropdown(false);
                            }}
                            className="w-full p-3 text-left hover:bg-[#333333] transition-colors"
                          >
                            <span className="text-white">{customer.name}</span>
                            {customer.email && (
                              <span className="block text-xs text-[#737373]">{customer.email}</span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bike Model */}
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
              <Bike className="w-4 h-4 inline mr-1" />
              Bike Model
            </label>
            <input
              type="text"
              placeholder="e.g. Trek Domane, Canyon Endurace..."
              value={formData.bike_model}
              onChange={(e) => setFormData({...formData, bike_model: e.target.value})}
              className="w-full px-4 py-2.5 bg-[#262626] border border-[#333333] rounded-lg text-white placeholder-[#737373] focus:outline-none focus:border-[#FF6B35]"
            />
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
              Service Type *
            </label>
            <select
              required
              value={formData.service_type}
              onChange={(e) => setFormData({...formData, service_type: e.target.value})}
              className="w-full px-4 py-2.5 bg-[#262626] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
            >
              <option value="">Select service...</option>
              {SERVICE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Technician */}
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
              <Wrench className="w-4 h-4 inline mr-1" />
              Technician
            </label>
            <select
              value={formData.technician_id}
              onChange={(e) => setFormData({...formData, technician_id: e.target.value})}
              className="w-full px-4 py-2.5 bg-[#262626] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
            >
              <option value="">Unassigned</option>
              {technicians.map(tech => (
                <option key={tech.id} value={tech.id}>{tech.name}</option>
              ))}
            </select>
          </div>

          {/* Scheduled Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#262626] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
                Time
              </label>
              <input
                type="time"
                value={formData.scheduled_time}
                onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#262626] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
              <Flag className="w-4 h-4 inline mr-1" />
              Priority
            </label>
            <div className="flex gap-2">
              {(['urgent', 'high', 'normal'] as JobPriority[]).map(priority => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({...formData, priority})}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    formData.priority === priority
                      ? priority === 'urgent' 
                        ? 'bg-red-500/20 border-red-500 text-red-400'
                        : priority === 'high'
                          ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                          : 'bg-[#FF6B35]/20 border-[#FF6B35] text-[#FF6B35]'
                      : 'bg-[#262626] border-[#333333] text-[#A3A3A3] hover:border-[#FF6B35]'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Customer requests, special instructions..."
              rows={3}
              className="w-full px-4 py-2.5 bg-[#262626] border border-[#333333] rounded-lg text-white placeholder-[#737373] focus:outline-none focus:border-[#FF6B35] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#333333] text-[#A3A3A3] rounded-lg hover:bg-[#262626] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.customer_id || !formData.service_type}
              className="flex-1 py-3 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#FF8255] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

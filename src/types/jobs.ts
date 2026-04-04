// Job Types for BikeClinique Kanban Board

export type JobStatus = 
  | 'booked_in' 
  | 'waiting_for_work' 
  | 'waiting_client' 
  | 'waiting_parts' 
  | 'working_on' 
  | 'bike_ready' 
  | 'collected';

export type JobPriority = 'urgent' | 'high' | 'normal';

export interface Job {
  id: string;
  job_number: string;
  shop_id?: string;
  customer_id: string;
  bike_id?: string;
  technician_id?: string;
  status: JobStatus;
  priority: JobPriority;
  service_type?: string;
  bike_model?: string;
  booked_at?: string;
  scheduled_date?: string;
  started_at?: string;
  completed_at?: string;
  notes?: string;
  checklist?: Record<string, boolean>;
  ai_summary?: string;
  payment_status?: string;
  paid_at?: string;
  delivery_slot_id?: string;
  delivery_status?: string;
  invoice_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface Bike {
  id: string;
  customer_id: string;
  make: string;
  model: string;
  frame_number?: string;
  bike_type?: string;
  year?: number;
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
}

export interface JobService {
  id: string;
  job_id: string;
  service_id: string;
  service_name?: string;
  price: number;
  notes?: string;
}

// HubTiger-style column definitions
export const KANBAN_COLUMNS: { id: JobStatus; title: string; color: string }[] = [
  { id: 'booked_in', title: 'Booked In', color: '#6B7280' },
  { id: 'waiting_for_work', title: 'Waiting for Work', color: '#F59E0B' },
  { id: 'waiting_client', title: 'Waiting - Client', color: '#8B5CF6' },
  { id: 'waiting_parts', title: 'Waiting - Parts', color: '#EC4899' },
  { id: 'working_on', title: 'Working On', color: '#3B82F6' },
  { id: 'bike_ready', title: 'Bike Ready', color: '#22C55E' },
  { id: 'collected', title: 'Collected', color: '#14B8A6' },
];

// Service types from HubTiger
export const SERVICE_TYPES = [
  'Minimum Service',
  'Full Service', 
  'Advanced Service',
  'Bike Overhaul',
  'Wheel True',
  'Puncture/Fit Tyre',
  'Brake Service',
  'Gear Tune',
  'Chain Replacement',
  'Safety Check',
  'Custom Repair',
];

// Priority colors
export const PRIORITY_COLORS: Record<JobPriority, string> = {
  urgent: '#EF4444',
  high: '#FF6B35',
  normal: '#6B7280',
};

// Checklist items from spec
export const DEFAULT_CHECKLIST = {
  frame_fork: { label: 'Frame & Fork', completed: false },
  wheels_tyres: { label: 'Wheels & Tyres', completed: false },
  brakes: { label: 'Brakes', completed: false },
  drivetrain: { label: 'Drivetrain', completed: false },
  gears: { label: 'Gears & Shifters', completed: false },
  handlebars: { label: 'Handlebars & Stem', completed: false },
  saddle: { label: 'Saddle & Seatpost', completed: false },
  bolts: { label: 'Bolts & Fasteners', completed: false },
  final_test: { label: 'Final Test Ride', completed: false },
};

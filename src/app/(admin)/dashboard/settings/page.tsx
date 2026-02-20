'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('shop')

  const tabs = [
    { id: 'shop', label: 'Shop Details' },
    { id: 'technicians', label: 'Technicians' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'notifications', label: 'Notifications' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#FF6B35] text-[#FF6B35]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'shop' && (
        <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">Shop Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
              <input
                type="text"
                defaultValue="Bike Clinique LTD"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                defaultValue="123 Bike Street, London, SW1A 1AA"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  defaultValue="+44 20 7946 0000"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue="hello@bikeclinique.co.uk"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center">
                    <p className="text-xs text-gray-500 mb-1">{day}</p>
                    <input
                      type="text"
                      defaultValue={day === 'Sun' ? 'Closed' : '9-6'}
                      className="w-full px-2 py-1 text-center text-sm rounded border border-gray-200"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4">
              <button className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'technicians' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Technicians</h2>
            <button className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b]">
              + Add
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Freddie Vaval', role: 'Lead Mechanic', color: '#FF6B35' },
              { name: 'Lucio Vaval', role: 'Mechanic', color: '#16C79A' },
            ].map((tech, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: tech.color }}>
                    {tech.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-sm text-gray-500">{tech.role}</p>
                  </div>
                </div>
                <button className="text-sm text-gray-500 hover:text-[#FF6B35]">Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">Connected Services</h2>
          <div className="space-y-4">
            {[
              { name: 'Stripe', status: 'Connected', icon: '💳' },
              { name: 'Shopify', status: 'Not connected', icon: '🛒' },
              { name: 'Twilio (SMS)', status: 'Not connected', icon: '📱' },
              { name: 'WhatsApp Business', status: 'Not connected', icon: '💬' },
              { name: 'Resend (Email)', status: 'Not connected', icon: '📧' },
            ].map((service, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{service.icon}</span>
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className={`text-sm ${service.status === 'Connected' ? 'text-green-600' : 'text-gray-500'}`}>
                      {service.status}
                    </p>
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-lg text-sm ${
                  service.status === 'Connected' 
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-[#FF6B35] text-white hover:bg-[#e55a2b]'
                }`}>
                  {service.status === 'Connected' ? 'Configure' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { label: 'New job booked', description: 'Get notified when a new job is booked online' },
              { label: 'Job status updates', description: 'Notify customer when job status changes' },
              { label: 'Collection ready', description: 'Send notification when bike is ready for collection' },
              { label: 'Payment received', description: 'Notify when payment is processed' },
              { label: 'Low stock alerts', description: 'Alert when stock falls below threshold' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

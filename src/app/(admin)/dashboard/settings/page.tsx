'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import for map (client-side only)
const DeliveryZoneMap = dynamic(() => import('@/components/DeliveryZoneMap'), { ssr: false })

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('shop')
  const [shop, setShop] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    opening_hours: ''
  })

  useEffect(() => {
    fetchShop()
  }, [])

  const fetchShop = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const res = await fetch(`${supabaseUrl}/rest/v1/shops?select=*&limit=1`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    })
    const data = await res.json()
    if (data && data.length > 0) {
      setShop(data[0])
      setFormData({
        name: data[0].name || '',
        email: data[0].email || '',
        phone: data[0].phone || '',
        address: data[0].address || '',
        opening_hours: typeof data[0].opening_hours === 'string' ? data[0].opening_hours : JSON.stringify(data[0].opening_hours || {})
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (shop?.id) {
      await fetch(`${supabaseUrl}/rest/v1/shops?id=eq.${shop.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(formData)
      })
    } else {
      await fetch(`${supabaseUrl}/rest/v1/shops`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ ...formData, slug: formData.name.toLowerCase().replace(/\s+/g, '-') })
      })
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'shop', label: 'Shop Details' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'integrations', label: 'Integrations' },
  ]

  const [deliverySettings, setDeliverySettings] = useState({
    enable_delivery: true,
    delivery_start_time: '16:00',
    delivery_end_time: '19:00',
    delivery_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    delivery_fee: 15,
    zone_center_lat: 51.409,
    zone_center_lng: -0.192,
    zone_radius_km: 10,
    zone_polygon: [] as [number, number][]
  })

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

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

      {loading ? (
        <div className="bg-white rounded-xl p-6 max-w-2xl animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : activeTab === 'shop' && (
        <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">Shop Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-8 mb-4">Booking Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Online Bookings</p>
                <p className="text-sm text-gray-500">Allow customers to book online</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Payment Required</p>
                <p className="text-sm text-gray-500">Require deposit for bookings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'delivery' && (
        <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">🚴 Delivery Settings</h2>
          <p className="text-sm text-gray-500 mb-6">
            Configure delivery options for customers to have their bike returned after service.
            Customers can schedule delivery when paying for completed work.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Enable Delivery</p>
                <p className="text-sm text-gray-500">Allow customers to book delivery after service</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={deliverySettings.enable_delivery}
                  onChange={e => setDeliverySettings({...deliverySettings, enable_delivery: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Window</label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={deliverySettings.delivery_start_time}
                  onChange={e => setDeliverySettings({...deliverySettings, delivery_start_time: e.target.value})}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={deliverySettings.delivery_end_time}
                  onChange={e => setDeliverySettings({...deliverySettings, delivery_end_time: e.target.value})}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Customers can select a time slot within this window</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Days</label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map(day => (
                  <button
                    key={day}
                    onClick={() => {
                      const days = deliverySettings.delivery_days.includes(day)
                        ? deliverySettings.delivery_days.filter(d => d !== day)
                        : [...deliverySettings.delivery_days, day]
                      setDeliverySettings({...deliverySettings, delivery_days: days})
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
                      deliverySettings.delivery_days.includes(day)
                        ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                        : 'border-gray-200 text-gray-600 hover:border-[#FF6B35]'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee (£)</label>
              <input
                type="number"
                min="0"
                value={deliverySettings.delivery_fee}
                onChange={e => setDeliverySettings({...deliverySettings, delivery_fee: parseInt(e.target.value) || 0})}
                className="w-32 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
              <p className="text-xs text-gray-500 mt-1">Set to 0 for free delivery</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Coverage Area</label>
              <p className="text-xs text-gray-500 mb-3">Draw your delivery area on the map. Customers outside this area won't see delivery option.</p>
              <DeliveryZoneMap 
                zone={{
                  center_lat: deliverySettings.zone_center_lat,
                  center_lng: deliverySettings.zone_center_lng,
                  radius_km: deliverySettings.zone_radius_km,
                  polygon: deliverySettings.zone_polygon
                }}
                onChange={(newZone) => setDeliverySettings({
                  ...deliverySettings,
                  zone_center_lat: newZone.center_lat,
                  zone_center_lng: newZone.center_lng,
                  zone_radius_km: newZone.radius_km,
                  zone_polygon: newZone.polygon || []
                })}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { label: 'New Booking', desc: 'Get notified when a customer books online' },
              { label: 'Job Status Update', desc: 'Notify when job status changes' },
              { label: 'Collection Reminder', desc: 'Send reminders before collections' },
              { label: 'Low Stock Alert', desc: 'Alert when stock is running low' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
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

      {activeTab === 'integrations' && (
        <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">Connected Services</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#635BFF] rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <div>
                  <p className="font-medium">Stripe</p>
                  <p className="text-sm text-gray-500">Payment processing</p>
                </div>
              </div>
              <button className="text-sm text-gray-500 hover:text-[#FF6B35]">Connect →</button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white font-bold">R</div>
                <div>
                  <p className="font-medium">Resend</p>
                  <p className="text-sm text-gray-500">Email notifications</p>
                </div>
              </div>
              <button className="text-sm text-gray-500 hover:text-[#FF6B35]">Connect →</button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#F22F46] rounded-lg flex items-center justify-center text-white font-bold">T</div>
                <div>
                  <p className="font-medium">Twilio</p>
                  <p className="text-sm text-gray-500">SMS & WhatsApp</p>
                </div>
              </div>
              <button className="text-sm text-gray-500 hover:text-[#FF6B35]">Connect →</button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#96BF48] rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <div>
                  <p className="font-medium">Shopify</p>
                  <p className="text-sm text-gray-500">E-commerce integration</p>
                </div>
              </div>
              <button className="text-sm text-gray-500 hover:text-[#FF6B35]">Connect →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

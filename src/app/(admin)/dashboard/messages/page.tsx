'use client'

import { useState } from 'react'

interface Message {
  id: string
  customer_name: string
  channel: string
  message: string
  time: string
  type: 'inbound' | 'outbound'
}

const mockMessages: Message[] = [
  { id: '1', customer_name: 'John Keighley', channel: 'whatsapp', message: '5-6pm is the only time. Please drop back on Monday', time: '2 hours ago', type: 'inbound' },
  { id: '2', customer_name: 'Steve Brookes', channel: 'sms', message: 'Thanks for the update. See you tomorrow!', time: 'Yesterday', type: 'inbound' },
  { id: '3', customer_name: 'Mark Gleeson', channel: 'email', message: 'Re: Bike Service - Just confirming my appointment', time: '2 days ago', type: 'inbound' },
]

const channelIcons: Record<string, string> = {
  whatsapp: '💬',
  sms: '📱',
  email: '📧',
}

export default function MessagesPage() {
  const [selected, setSelected] = useState(mockMessages[0])
  const [reply, setReply] = useState('')
  const [showNew, setShowNew] = useState(false)

  const handleSend = () => {
    if (!reply.trim()) return
    alert('Message sent! (Integration ready for Twilio/Resend)')
    setReply('')
  }

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Message List */}
      <div className="w-80 bg-white border-r flex flex-col rounded-l-xl overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-[#1A1A2E]">Messages</h2>
            <button 
              onClick={() => setShowNew(true)}
              className="text-[#FF6B35] hover:bg-orange-50 px-2 py-1 rounded text-sm"
            >
              + New
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockMessages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelected(msg)}
              className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${
                selected?.id === msg.id ? 'bg-orange-50 border-l-4 border-l-[#FF6B35]' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-[#1A1A2E]">{msg.customer_name}</span>
                <span className="text-xs text-gray-400">{msg.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{channelIcons[msg.channel]}</span>
                <span className="text-sm text-gray-500 truncate">{msg.message}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-r-xl flex flex-col">
        {selected ? (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#1A1A2E]">{selected.customer_name}</h3>
                  <p className="text-sm text-gray-500">{channelIcons[selected.channel]} {selected.channel}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="mb-4">
                <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                  <p className="text-sm">{selected.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{selected.time}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b]"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                💡 Connect Twilio for WhatsApp/SMS or Resend for email
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <p>Select a conversation or start a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">New Message</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-200">
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <input type="text" placeholder="Customer name or phone" className="w-full px-4 py-2 rounded-lg border border-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={4} placeholder="Type your message..." className="w-full px-4 py-2 rounded-lg border border-gray-200" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowNew(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={() => { alert('Ready for Twilio integration!'); setShowNew(false); }} className="flex-1 px-4 py-2 bg-[#FF6B35] text-white rounded-lg">Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'

interface Message {
  id: string
  customer: string
  channel: 'whatsapp' | 'sms' | 'email'
  preview: string
  time: string
  unread: boolean
}

const mockMessages: Message[] = [
  { id: '1', customer: 'John Keighley', channel: 'whatsapp', preview: '5-6pm is the only time. Please drop back on Monday', time: '19 hours ago', unread: true },
  { id: '2', customer: 'Steve Brookes', channel: 'sms', preview: 'Thanks for the update. See you tomorrow!', time: 'Yesterday', unread: false },
  { id: '3', customer: 'Mark Gleeson', channel: 'email', preview: 'Re: Bike Service - Just confirming my appointment', time: '2 days ago', unread: false },
  { id: '4', customer: 'Sarah Smith', channel: 'whatsapp', preview: 'Can I change my collection time to 5pm?', time: '3 days ago', unread: false },
]

const channelIcons = {
  whatsapp: '💬',
  sms: '📱',
  email: '📧',
}

export default function MessagesPage() {
  const [selected, setSelected] = useState(mockMessages[0])
  const [reply, setReply] = useState('')

  return (
    <div className="flex h-[calc(100vh-140px)]">
      {/* Message List */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-[#1A1A2E]">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockMessages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelected(msg)}
              className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${
                selected.id === msg.id ? 'bg-blue-50 border-l-4 border-l-[#FF6B35]' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{channelIcons[msg.channel]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${msg.unread ? 'text-[#1A1A2E]' : 'text-gray-600'}`}>
                      {msg.customer}
                    </span>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{msg.preview}</p>
                </div>
                {msg.unread && (
                  <span className="w-2 h-2 bg-[#FF6B35] rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{channelIcons[selected.channel]}</span>
            <div>
              <h3 className="font-semibold">{selected.customer}</h3>
              <p className="text-xs text-gray-500 capitalize">{selected.channel}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
              📞 Call
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="flex justify-center">
            <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full">Today</span>
          </div>
          
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 max-w-md shadow-sm">
              <p className="text-sm">{selected.preview}</p>
              <p className="text-xs text-gray-400 mt-1">{selected.time}</p>
            </div>
          </div>
        </div>

        {/* Reply */}
        <div className="bg-white p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
            <button className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

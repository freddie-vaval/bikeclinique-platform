import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

interface ReminderData {
  customerName: string
  customerPhone: string
  service: string
  date: string
  time: string
  shopName: string
  shopPhone: string
  type: 'sms' | 'whatsapp'
}

// Send SMS reminder
async function sendSMS(data: ReminderData) {
  if (!twilioClient) {
    return { success: false, error: 'Twilio not configured' }
  }
  try {
    const message = await twilioClient.messages.create({
      body: `Hi ${data.customerName}, this is a reminder about your ${data.service} appointment at ${data.shopName} on ${data.date} at ${data.time}. Reply YES to confirm or call ${data.shopPhone} to reschedule.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: data.customerPhone,
    })

    return { success: true, messageId: message.sid }
  } catch (error) {
    console.error('SMS sending failed:', error)
    return { success: false, error }
  }
}

// Send WhatsApp reminder
async function sendWhatsApp(data: ReminderData) {
  if (!twilioClient) {
    return { success: false, error: 'Twilio not configured' }
  }
  try {
    const message = await twilioClient.messages.create({
      body: `🚴 *Appointment Reminder*\n\nHi ${data.customerName}!\n\nThis is a reminder about your ${data.service} appointment:\n📅 ${data.date} at ${data.time}\n\n*${data.shopName}*\n\nReply YES to confirm or call us to reschedule.`,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${data.customerPhone}`,
    })

    return { success: true, messageId: message.sid }
  } catch (error) {
    console.error('WhatsApp sending failed:', error)
    return { success: false, error }
  }
}

// POST /api/reminders/send
// Send a reminder manually or scheduled
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerPhone, service, date, time, shopName, shopPhone, type = 'sms' } = body

    if (!customerName || !customerPhone || !service || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const data: ReminderData = {
      customerName,
      customerPhone,
      service,
      date,
      time,
      shopName: shopName || 'Bike Clinique',
      shopPhone: shopPhone || '+44 20 7946 0000',
      type,
    }

    let result
    if (type === 'whatsapp') {
      result = await sendWhatsApp(data)
    } else {
      result = await sendSMS(data)
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        type,
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send reminder', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Reminder API error:', error)
    return NextResponse.json(
      { error: 'Failed to send reminder' },
      { status: 500 }
    )
  }
}

// GET /api/reminders/schedule
// Check scheduled reminders (would integrate with cron in production)
export async function GET() {
  // In production, this would:
  // 1. Query bookings needing reminders (24h, 2h before)
  // 2. Return list of pending reminders
  // 3. Cron job would trigger this endpoint

  return NextResponse.json({
    message: 'Reminder scheduling endpoint',
    note: 'This would be called by a cron job to send scheduled reminders',
    exampleReminders: [
      {
        bookingId: 'BK123',
        customerName: 'John Smith',
        customerPhone: '+447123456789',
        service: 'Full Service',
        date: '2026-02-21',
        time: '10:00',
        reminderTime: '2026-02-20T10:00:00Z', // 24h before
      },
    ],
  })
}

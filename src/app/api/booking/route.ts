import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface BookingEmailData {
  customerName: string
  customerEmail: string
  service: string
  date: string
  time: string
  collection: boolean
  shopName: string
  shopEmail: string
  shopPhone: string
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  if (!resend) {
    console.log('Resend not configured, skipping email')
    return { success: true, skipped: true }
  }

  try {
    // Send to customer
    await resend.emails.send({
      from: 'BikeClinique <bookings@bikeclinique.co.uk>',
      to: data.customerEmail,
      subject: `Booking Confirmed - ${data.service} on ${data.date}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1A1A2E; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6B35, #e55a2b); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .label { color: #666; }
            .value { font-weight: 600; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🚴 Booking Confirmed!</h1>
              <p style="margin: 10px 0 0 0;">${data.shopName}</p>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>Your booking has been confirmed! Here are the details:</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="label">Service</span>
                  <span class="value">${data.service}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date</span>
                  <span class="value">${data.date}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Time</span>
                  <span class="value">${data.time}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Collection/Delivery</span>
                  <span class="value">${data.collection ? 'Yes - we will collect your bike' : 'No - please bring your bike to the shop'}</span>
                </div>
              </div>
              
              <p>Need to make changes? Just reply to this email or call us on ${data.shopPhone}.</p>
              
              <p style="margin-top: 30px;">See you soon!</p>
              <p><strong>${data.shopName}</strong></p>
              
              <div class="footer">
                <p>${data.shopName} | ${data.shopPhone}</p>
                <p>This email was sent because you made a booking on our website.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    // Also send notification to shop
    await resend.emails.send({
      from: 'BikeClinique <bookings@bikeclinique.co.uk>',
      to: data.shopEmail,
      subject: `New Booking - ${data.customerName} - ${data.service}`,
      html: `
        <h2>New Booking Received</h2>
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Collection:</strong> ${data.collection ? 'Yes' : 'No'}</p>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error }
  }
}

// POST /api/booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { service, serviceName, date, time, collection, name, email, phone, bike, notes } = body
    
    // Validate required fields
    if (!service || !date || !time || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // In production, save to Supabase:
    // const { data, error } = await supabase
    //   .from('bookings')
    //   .insert({ service, date, time, collection, name, email, phone, bike, notes })
    
    // Simulate booking creation
    const bookingId = `BK${Date.now().toString(36).toUpperCase()}`
    
    // Send confirmation email
    if (process.env.RESEND_API_KEY) {
      await sendBookingConfirmation({
        customerName: name,
        customerEmail: email,
        service: serviceName || service,
        date,
        time,
        collection,
        shopName: 'Bike Clinique LTD',
        shopEmail: 'hello@bikeclinique.co.uk',
        shopPhone: '+44 20 7946 0000',
      })
    }
    
    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Booking confirmed',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// GET /api/booking/slots
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  
  // In production, query Supabase for existing bookings
  const allSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ]
  
  // Simulate some booked slots
  const bookedSlots = date === '2026-02-21' ? ['09:00', '10:30', '14:00'] : []
  
  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot))
  
  return NextResponse.json({ slots: availableSlots })
}

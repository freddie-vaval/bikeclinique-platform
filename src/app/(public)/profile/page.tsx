export default function PublicProfilePage() {
  const shop = {
    name: 'Bike Clinique LTD',
    rating: 4.8,
    reviews: 127,
    location: 'London, SW18',
    distance: '2.3 miles',
    phone: '+44 20 7946 0000',
    email: 'hello@bikeclinique.co.uk',
    openingHours: {
      Mon: '9:00 - 18:00',
      Tue: '9:00 - 18:00',
      Wed: '9:00 - 18:00',
      Thu: '9:00 - 18:00',
      Fri: '9:00 - 18:00',
      Sat: '9:00 - 14:00',
      Sun: 'Closed',
    },
    services: [
      { name: 'Full Service', price: 'From £150', icon: '🔧' },
      { name: 'Gear Tune', price: 'From £45', icon: '⚙️' },
      { name: 'Brake Service', price: 'From £55', icon: '🛑' },
      { name: 'Tyre Change', price: 'From £15', icon: '🛞' },
      { name: 'Chain Replace', price: 'From £25', icon: '⛓️' },
      { name: 'Puncture Repair', price: 'From £12', icon: '🔩' },
    ],
    features: [
      '✅ Expert Mechanics',
      '✅ Same Day Service',
      '✅ Collection & Delivery',
      '✅ Warranty on Work',
    ],
    recentReviews: [
      { name: 'Sarah M.', rating: 5, text: 'Absolutely brilliant service! My gears have never worked better.', date: '2 weeks ago' },
      { name: 'James L.', rating: 5, text: 'Quick, professional, and fair pricing. Highly recommend!', date: '1 month ago' },
      { name: 'Emma W.', rating: 4, text: 'Great bike shop. Friendly staff and good advice.', date: '1 month ago' },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#FF6B35] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            🚴
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{shop.name}</h1>
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <span>📍 {shop.location}</span>
            <span>⭐ {shop.rating} ({shop.reviews} reviews)</span>
          </div>
          <a
            href="/book"
            className="inline-block mt-6 px-8 py-3 bg-[#FF6B35] text-white rounded-lg font-medium hover:bg-[#e55a2b] transition-colors"
          >
            Book Now
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-2xl font-bold text-[#FF6B35]">2.3mi</p>
            <p className="text-sm text-gray-500">Away</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-2xl font-bold text-[#FF6B35]">4.8</p>
            <p className="text-sm text-gray-500">Rating</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-2xl font-bold text-[#FF6B35]">127</p>
            <p className="text-sm text-gray-500">Reviews</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-2xl font-bold text-[#FF6B35]">✅</p>
            <p className="text-sm text-gray-500">Verified</p>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Our Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {shop.services.map((service, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl mb-2 block">{service.icon}</span>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-[#FF6B35]">{service.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Why Choose Us</h2>
          <div className="grid grid-cols-2 gap-3">
            {shop.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>{feature.replace('✅ ', '')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
          <div className="space-y-4">
            {shop.recentReviews.map((review, i) => (
              <div key={i} className="p-4 border-b last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{review.name}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span key={j} className={j < review.rating ? 'text-yellow-400' : 'text-gray-300'}>⭐</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{review.date}</span>
                </div>
                <p className="text-gray-600">{review.text}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border rounded-lg hover:bg-gray-50">
            View All Reviews
          </button>
        </div>

        {/* Opening Hours */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Opening Hours</h2>
          <div className="space-y-2">
            {Object.entries(shop.openingHours).map(([day, hours]) => (
              <div key={day} className="flex justify-between py-2 border-b last:border-0">
                <span className="font-medium">{day}</span>
                <span className={hours === 'Closed' ? 'text-red-500' : 'text-gray-600'}>{hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Contact</h2>
          <div className="space-y-3">
            <a href="tel:+442079460000" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span>📞</span>
              <span>{shop.phone}</span>
            </a>
            <a href="mailto:hello@bikeclinique.co.uk" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span>📧</span>
              <span>{shop.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex gap-4">
          <a
            href="tel:+442079460000"
            className="flex-1 py-3 text-center border rounded-lg hover:bg-gray-50"
          >
            📞 Call
          </a>
          <a
            href="/book"
            className="flex-1 py-3 text-center bg-[#FF6B35] text-white rounded-lg font-medium hover:bg-[#e55a2b]"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  )
}

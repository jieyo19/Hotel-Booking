import React from 'react'
import Title from '../components/Title'

const bookingsData = [
  {
    id: 1,
    hotel: 'Urbanza Suites',
    roomType: 'Double Bed',
    address: 'Main Road 123 Street , 23 Colony',
    guests: 1,
    total: 299,
    checkIn: 'Wed Apr 30 2025',
    checkOut: 'Thu May 01 2025',
    status: 'Paid',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    hotel: 'Urbanza Suites',
    roomType: 'Double Bed',
    address: 'Main Road 123 Street , 23 Colony',
    guests: 1,
    total: 399,
    checkIn: 'Sun Apr 27 2025',
    checkOut: 'Mon Apr 28 2025',
    status: 'Unpaid',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    hotel: 'Urbanza Suites',
    roomType: 'Single Bed',
    address: 'Main Road 123 Street , 23 Colony',
    guests: 1,
    total: 199,
    checkIn: 'Fri Apr 11 2025',
    checkOut: 'Sat Apr 12 2025',
    status: 'Unpaid',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&h=200&fit=crop'
  }
]

const MyBookings = () => {
  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>

      <Title title='My Bookings' subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' align='left' />

      <div className='max-w-6xl mt-8 w-full text-gray-800'>

        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
          <div>Hotels</div>
          <div>Date & Timings</div>
          <div>Payment</div>
        </div>

        {bookingsData.map((booking) => (
          <div key={booking.id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 gap-4 items-center'>
            
            {/* Hotel Info */}
            <div className='flex flex-col md:flex-row gap-4'>
              <img 
                src={booking.image} 
                alt={booking.hotel} 
                className='w-full md:w-36 h-24 object-cover rounded shadow'
              />
              <div className='flex flex-col gap-1'>
                <p className='text-xl font-playfair'>
                  {booking.hotel} <span className='text-sm text-gray-500'>({booking.roomType})</span>
                </p>
                <p className='text-sm text-gray-500 flex items-center gap-1'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {booking.address}
                </p>
                <p className='text-sm text-gray-500 flex items-center gap-1'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Guests: {booking.guests}
                </p>
                <p className='font-medium'>Total: ${booking.total}</p>
              </div>
            </div>

            {/* Date & Timings */}
            <div className='flex gap-8 items-start'>
              <div>
                <p className='text-gray-500 text-sm'>Check-In:</p>
                <p className='text-gray-800'>{booking.checkIn}</p>
              </div>
              <div>
                <p className='text-gray-500 text-sm'>Check-Out:</p>
                <p className='text-gray-800'>{booking.checkOut}</p>
              </div>
            </div>

            {/* Payment Status */}
            <div className='flex flex-col items-start md:items-center gap-2'>
              <div className='flex items-center gap-2'>
                <span className={`w-2.5 h-2.5 rounded-full ${booking.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={booking.status === 'Paid' ? 'text-green-600' : 'text-red-500'}>
                  {booking.status}
                </span>
              </div>
              {booking.status === 'Unpaid' && (
                <button className='px-4 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors'>
                  Pay Now
                </button>
              )}
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default MyBookings
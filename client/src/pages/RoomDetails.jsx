import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { roomsDummyData } from '../assets/assets'
import StarRating from '../components/StarRating'
import { assets } from '../assets/assets'

const RoomDetails = () => {
  const {id} = useParams()
  const [room, setRoom] = useState(null)
  const [mainImage, setMainImage] = useState(null)

  useEffect(() => {
    const room = roomsDummyData.find(room => room._id === id)
    room && setRoom(room)
    room && setMainImage(room.images[0])
  }, [id])

  if (!room) {
    return (
      <div className='px-4 md:px-16 lg:px-24 xl:px-32 pt-20 md:pt-28 pb-16'>
        <p className='text-center text-gray-500'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='px-4 md:px-16 lg:px-24 xl:px-32 pt-20 md:pt-28 pb-16'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-4'>
          <h1 className='font-playfair text-4xl md:text-5xl text-gray-900'>{room.hotel.name}</h1>
          <span className='text-sm px-3 py-1 rounded-full bg-gray-200 text-gray-700'>
            (Double Bed)
          </span>
          <span className='text-sm px-3 py-1 rounded-full bg-orange-500 text-white'>
            20% OFF
          </span>
        </div>
        
        <div className='flex items-center gap-3 mb-3'>
          <StarRating />
          <span className='text-gray-600 text-sm'>200+ reviews</span>
        </div>
        
        <div className='flex items-center gap-2 text-gray-500 text-sm'>
          <img src={assets.locationIcon} alt="location" className='w-4 h-4 opacity-60' />
          <span>{room.hotel.address}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12'>
        {/* Large Main Image - Takes 2 columns */}
        <div className='lg:col-span-2'>
          <img 
            src={mainImage} 
            alt="Main room view" 
            className='w-full h-[480px] object-cover rounded-2xl'
          />
        </div>
        
        {/* Smaller Images Grid - Takes 1 column with 2x2 grid */}
        <div className='grid grid-cols-2 gap-4'>
          {room.images.slice(1, 5).map((image, index) => (
            <div key={index} className='cursor-pointer' onClick={() => setMainImage(image)}>
              <img
                src={image}
                alt={`Room view ${index + 2}`}
                className='w-full h-[234px] object-cover rounded-2xl hover:opacity-90 transition-opacity'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Room Information */}
      <div className='max-w-5xl'>
        {/* Experience Section */}
        <div className='mb-12'>
          <div className='flex items-start justify-between mb-8'>
            <h2 className='text-4xl font-serif text-gray-900 max-w-2xl'>Experience Luxury Like Never Before</h2>
            <p className='text-4xl font-bold text-gray-900'>${room.pricePerNight}/ day</p>
          </div>
          
          {/* Quick Amenities */}
          <div className='flex gap-4 mb-12'>
            <div className='flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-xl'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' />
              </svg>
              <span className='text-sm font-medium text-gray-700'>free wifi</span>
            </div>
            <div className='flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-xl'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span className='text-sm font-medium text-gray-700'>free breakfast</span>
            </div>
            <div className='flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-xl'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
              </svg>
              <span className='text-sm font-medium text-gray-700'>room service</span>
            </div>
          </div>

          {/* Booking Form */}
          <div className='bg-white border border-gray-200 rounded-2xl p-8 mb-12 shadow-sm'>
            <div className='grid grid-cols-4 gap-6'>
              <div className='col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-3'>Check-In</label>
                <input 
                  type='date' 
                  className='w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-500 text-sm'
                />
              </div>
              
              <div className='col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-3'>Check-Out</label>
                <input 
                  type='date' 
                  className='w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-500 text-sm'
                />
              </div>

              <div className='col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-3'>Guests</label>
                <input 
                  type='number' 
                  value='0'
                  className='w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-500 text-sm'
                />
              </div>

              <div className='col-span-1 flex items-end'>
                <button className='w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
                  Check Availability
                </button>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className='space-y-6 mb-12'>
            <div className='flex items-start gap-4'>
              <div className='flex-shrink-0'>
                <svg className='w-6 h-6 text-gray-700' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 text-base mb-1'>Clean & Safe Stay</h3>
                <p className='text-gray-500 text-sm leading-relaxed'>A well-maintained and hygienic space just for you.</p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='flex-shrink-0'>
                <svg className='w-6 h-6 text-gray-700' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 text-base mb-1'>Enhanced Cleaning</h3>
                <p className='text-gray-500 text-sm leading-relaxed'>This host follows Staybnb's strict cleaning standards.</p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='flex-shrink-0'>
                <svg className='w-6 h-6 text-gray-700' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 text-base mb-1'>Excellent Location</h3>
                <p className='text-gray-500 text-sm leading-relaxed'>90% of guests rated the location 5 stars.</p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='flex-shrink-0'>
                <svg className='w-6 h-6 text-gray-700' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 text-base mb-1'>Smooth Check-In</h3>
                <p className='text-gray-500 text-sm leading-relaxed'>100% of guests gave check-in a 5-star rating.</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className='border-t border-gray-200 pt-8 pb-12'>
            <p className='text-gray-600 leading-relaxed text-base'>
              Guests will be allocated a private bedroom with either a king size bed or a twin room in the three bedroom apartment has a true city feeling. 
              The price quoted is for two guests in one room only. For families and groups, we would quote the exact price for groups. The Guests will be 
              allocated ground floor and first floor and all rooms has apartment has a true city feeling.
            </p>
          </div>

          {/* Hosted By Section */}
          <div className='border-t border-gray-200 pt-12 pb-8'>
            <div className='flex items-center gap-4 mb-8'>
              <div className='w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0'>
                <svg className='w-8 h-8 text-cyan-400' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z' />
                </svg>
              </div>
              <div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>Hosted by {room.hotel.name}</h3>
                <div className='flex items-center gap-2'>
                  <StarRating />
                  <span className='text-gray-600 text-sm'>200+ reviews</span>
                </div>
              </div>
            </div>

            <button className='bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
              Contact Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetails
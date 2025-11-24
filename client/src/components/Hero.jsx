import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets, cities } from '../assets/assets'

const Hero = () => {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  const handleSearch = (e) => {
    e.preventDefault()
    
    // Validate dates if provided
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (checkInDate < today) {
        alert('Check-in date cannot be in the past')
        return
      }

      if (checkOutDate <= checkInDate) {
        alert('Check-out date must be after check-in date')
        return
      }
    }

    // Build search parameters
    const searchParams = new URLSearchParams()
    if (destination) searchParams.set('destination', destination)
    if (checkIn) searchParams.set('checkIn', checkIn)
    if (checkOut) searchParams.set('checkOut', checkOut)
    if (guests) searchParams.set('guests', guests)

    // Navigate to rooms page with search parameters
    navigate(`/rooms?${searchParams.toString()}`)
  }

  return (
    <div className='flex flex-col items-start justify-center px-6
    md:px-16 lg:px-24 xl:px-32
    text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>
        <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>The Ultimate Hotel Experience</p>
        <h1 className='font-playfair text-2x1 md:text-5x1 md text-[56px] md:leading=[56px] font-bold md:font-extrabold max-w-xl mt-4'>Discover Your Perfect Gateway Destination</h1>
        <p className='max-w-130 mt-2 text-sm md:text-base'>Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today</p>
        <form onSubmit={handleSearch} className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

            <div>
                <div className='flex items-center gap-2'>
                   <img src={assets.calenderIcon}alt="" className='h-4'/>
                    <label htmlFor="destinationInput">Destination</label>
                </div>
                <input 
                  list='destinations' 
                  id="destinationInput" 
                  type="text" 
                  className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" 
                  placeholder="Type here" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
                <datalist id='destinations'>
                    {cities.map((city, index)=>(
                        <option value={city} key={index}/>
                    ))}
                </datalist>
            </div>

            <div>
                <div className='flex items-center gap-2'>
                     <img src={assets.calenderIcon}alt="" className='h-4'/>
                    <label htmlFor="checkIn">Check in</label>
                </div>
                <input 
                  id="checkIn" 
                  type="date" 
                  className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div>
                <div className='flex items-center gap-2'>
                     <img src={assets.calenderIcon}alt="" className='h-4'/>
                    <label htmlFor="checkOut">Check out</label>
                </div>
                <input 
                  id="checkOut" 
                  type="date" 
                  className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                <label htmlFor="guests">Guests</label>
                <input 
                  min={1} 
                  max={4} 
                  id="guests" 
                  type="number" 
                  className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" 
                  placeholder="0" 
                  value={guests}
                  onChange={(e) => setGuests(Math.max(1, Math.min(4, Number(e.target.value) || 1)))}
                />
            </div>

            <button 
              type="submit"
              className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1 hover:bg-gray-800 transition-colors' 
            >
                 <img src={assets.searchIcon}alt="searchIcon" className='h-7'/>
                <span>Search</span>
            </button>
        </form>
    </div>
  )
}

export default Hero
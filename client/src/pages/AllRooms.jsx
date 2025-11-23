import React from 'react'
import { useNavigate } from 'react-router-dom'
import { roomsDummyData, facilityIcons } from '../assets/assets'
import { assets } from '../assets/assets'
import StarRating from '../components/StarRating'

const CheckBox = ({label, selected = false, onChange = () => {}}) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input 
        type="checkbox" 
        checked={selected} 
        onChange={() => onChange(label)}
      />
      <span className='font-light select-none text-gray-600'>{label}</span>
    </label>
  )
}

const RadioButton = ({label, selected = false, onChange = () => {}}) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input 
        type="radio" 
        name="sortOption" 
        checked={selected} 
        onChange={() => onChange(label)}
      />
      <span className='font-light select-none text-gray-600'>{label}</span>
    </label>
  )
}

const AllRooms = () => {
  const navigate = useNavigate()
  const [openFilters, setOpenFilters] = React.useState(false)
  const [selectedRoomTypes, setSelectedRoomTypes] = React.useState([])
  const [selectedPriceRanges, setSelectedPriceRanges] = React.useState([])
  const [selectedSortOption, setSelectedSortOption] = React.useState(null)

  const roomTypes = [
    "Single Bed",
    "Double Bed",
    "Luxury Room",
    "Family Suite",
  ]

  const priceRanges = [
    '0 to 500',
    '500 to 1000',
    '1000 to 2000',
    '2000 to 3000',
  ]

  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First"
  ]

  const handleRoomTypeChange = (label) => {
    if (selectedRoomTypes.includes(label)) {
      setSelectedRoomTypes(selectedRoomTypes.filter(type => type !== label))
    } else {
      setSelectedRoomTypes([...selectedRoomTypes, label])
    }
  }

  const handlePriceRangeChange = (label) => {
    if (selectedPriceRanges.includes(label)) {
      setSelectedPriceRanges(selectedPriceRanges.filter(range => range !== label))
    } else {
      setSelectedPriceRanges([...selectedPriceRanges, label])
    }
  }

  const handleSortChange = (label) => {
    setSelectedSortOption(label)
  }

  const clearFilters = () => {
    setSelectedRoomTypes([])
    setSelectedPriceRanges([])
    setSelectedSortOption(null)
  }

  const handleRoomClick = (roomId) => {
    navigate(`/rooms/${roomId}`)
    window.scrollTo(0, 0)
  }
  
  return (
    <div className='px-4 md:px-16 lg:px-24 xl:px-32 pt-20 md:pt-28 pb-16'>
      {/* Header Section */}
      <div className='mb-10'>
        <h1 className='font-playfair text-5xl md:text-6xl mb-6 text-gray-900'>Hotel Rooms</h1>
        <p className='text-gray-400 text-base md:text-lg max-w-3xl leading-relaxed'>
          Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
        </p>
      </div>

      {/* Main Content - Rooms List and Filters */}
      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Rooms List */}
        <div className='flex-1 flex flex-col gap-16'>
          {roomsDummyData.map((room) => (
            <div 
              key={room._id} 
              className='flex flex-col md:flex-row items-start gap-6 border-b border-gray-200 pb-16 last:border-0 cursor-pointer group'
              onClick={() => handleRoomClick(room._id)}
            >
              {/* Room Image */}
              <div className='relative overflow-hidden rounded-3xl shadow-md flex-shrink-0'>
                <img 
                  src={room.images[0]} 
                  alt="hotel room" 
                  className='w-full md:w-96 h-72 object-cover transition-transform duration-500 group-hover:scale-105'
                />
              </div>

              {/* Room Info */}
              <div className='flex flex-col gap-3 flex-1'>
                <p className='text-gray-400 text-sm'>{room.hotel.city}</p>
                
                <h2 className='font-playfair text-3xl md:text-4xl text-gray-900 group-hover:text-gray-700 transition-colors leading-tight'>
                  {room.hotel.name}
                </h2>
                
                <div className='flex items-center gap-3 mt-1'>
                  <StarRating />
                  <span className='text-gray-600 text-sm'>200+ reviews</span>
                </div>
                
                <div className='flex items-center gap-2 text-gray-400 text-sm mt-1'>
                  <img src={assets.locationIcon} alt="location" className='w-4 h-4 opacity-60' />
                  <span>{room.hotel.address}</span>
                </div>

                {/* Room Amenities */}
                <div className='flex flex-wrap items-center mt-3 gap-3'>
                  {room.amenities.slice(0, 3).map((item, index) => (
                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200'>
                      <img src={facilityIcons[item]} alt={item} className='w-4 h-4' />
                      <p className='text-xs text-gray-600'>{item}</p>
                    </div>
                  ))}
                </div>

                {/* Room Price per Night */}
                <p className='text-2xl font-semibold text-gray-900 mt-4'>
                  ${room.pricePerNight} <span className='text-base font-normal text-gray-500'>/night</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Sidebar */}
        <div className='lg:w-80 flex-shrink-0'>
          <div className='bg-white border border-gray-200 rounded-lg lg:sticky lg:top-24'>
            {/* Filters Header */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
              <p className='text-base font-semibold text-gray-900'>FILTERS</p>
              <div className='flex items-center gap-3'>
                <button 
                  onClick={() => setOpenFilters(!openFilters)} 
                  className='text-xs text-gray-500 hover:text-gray-900 cursor-pointer uppercase lg:hidden'
                >
                  {openFilters ? 'HIDE' : 'SHOW'}
                </button>
                <button 
                  onClick={clearFilters} 
                  className='text-xs text-gray-500 hover:text-gray-900 cursor-pointer uppercase'
                >
                  CLEAR
                </button>
              </div>
            </div>
            
            {/* Filters Content */}
            <div className={`${openFilters ? 'block' : 'hidden lg:block'} px-6 py-5 transition-all duration-300`}>
              {/* Popular filters */}
              <div className='mb-6'>
                <p className='font-semibold text-gray-900 pb-3 text-base'>Popular filters</p>
                {roomTypes.map((room, index) => (
                  <CheckBox 
                    key={index} 
                    label={room}
                    selected={selectedRoomTypes.includes(room)}
                    onChange={handleRoomTypeChange}
                  />
                ))}
              </div>

              {/* Price Range */}
              <div className='mb-6'>
                <p className='font-semibold text-gray-900 pb-3 text-base'>Price Range</p>
                {priceRanges.map((range, index) => (
                  <CheckBox 
                    key={index} 
                    label={`$ ${range}`}
                    selected={selectedPriceRanges.includes(`$ ${range}`)}
                    onChange={handlePriceRangeChange}
                  />
                ))}
              </div>

              {/* Sort By */}
              <div className='mb-2'>
                <p className='font-semibold text-gray-900 pb-3 text-base'>Sort By</p>
                {sortOptions.map((option, index) => (
                  <RadioButton 
                    key={index} 
                    label={option}
                    selected={selectedSortOption === option}
                    onChange={handleSortChange}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllRooms
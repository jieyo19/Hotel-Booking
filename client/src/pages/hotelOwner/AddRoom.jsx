import React, { useMemo, useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { toast } from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'
import { useAuth } from '@clerk/clerk-react'

const initialImages = {
  1: null,
  2: null,
  3: null,
  4: null
}

const defaultAmenities = {
  'Free WiFi': false,
  'Free Breakfast': false,
  'Room Service': false,
  'Mountain View': false,
  'Pool Access': false
}

const AddRoom = () => {
  const { axios } = useAppContext()
  const { getToken } = useAuth()

  const [images, setImages] = useState(() => ({ ...initialImages }))
  const [inputs, setInputs] = useState(() => ({
    roomType: '',
    pricePerNight: '',
    amenities: { ...defaultAmenities }
  }))
  const [submitting, setSubmitting] = useState(false)

  const selectedAmenities = useMemo(() => (
    Object.entries(inputs.amenities)
      .filter(([, isSelected]) => isSelected)
      .map(([label]) => label)
  ), [inputs.amenities])

  const handleImageChange = (key, file) => {
    setImages((prev) => ({
      ...prev,
      [key]: file || null
    }))
  }

  const resetForm = () => {
    setImages({ ...initialImages })
    setInputs({
      roomType: '',
      pricePerNight: '',
      amenities: { ...defaultAmenities }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!inputs.roomType.trim()) {
      toast.error('Please select a room type')
      return
    }
    if (!inputs.pricePerNight || Number(inputs.pricePerNight) <= 0) {
      toast.error('Please provide a valid price per night')
      return
    }
    const files = Object.values(images).filter(Boolean)
    if (!files.length) {
      toast.error('Please upload at least one room image')
      return
    }

    const formData = new FormData()
    formData.append('roomType', inputs.roomType)
    formData.append('pricePerNight', inputs.pricePerNight)
    formData.append('amenities', JSON.stringify(selectedAmenities))
    files.forEach((file) => formData.append('images', file))

    setSubmitting(true)
    try {
      const token = await getToken()
      const response = await axios.post('/api/rooms', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to add room')
      }

      toast.success(response.data.message || 'Room added successfully!')
      resetForm()
    } catch (error) {
      console.error('Add room error:', error)
      toast.error(error.response?.data?.message || error.message || 'Failed to add room')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Title
          align='left'
          font='outfit'
          title='Add Room'
          subTitle='Fill in the details carefully - precise room information and amenities improve the booking experience.'
        />
        
        {/* Upload Area For Images */}
        <p className='text-gray-800 mt-10'>Images</p>
        <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
          {Object.keys(images).map((key) => (
            <label htmlFor={`roomImage${key}`} key={key} className='relative inline-block'>
              {images[key] && (
                <button
                  type='button'
                  className='absolute -top-2 -right-2 bg-black/60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'
                  onClick={() => handleImageChange(key, null)}
                >
                  ×
                </button>
              )}
              <img
                className='max-h-32 cursor-pointer rounded-md border border-dashed border-gray-300 object-cover'
                src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
                alt={`room-slot-${key}`}
              />
              <input
                type="file"
                accept='image/*'
                id={`roomImage${key}`}
                hidden
                onChange={(e) => handleImageChange(key, e.target.files?.[0] || null)}
              />
            </label>
          ))}
        </div>

        <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
          <div className='flex-1 max-w-48'>
            <p className='text-gray-800 mt-4'>Room Type</p>
            <select
              value={inputs.roomType}
              onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
              className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'
            >
              <option value="">Select Room Type</option>
              <option value="Single Bed">Single Bed</option>
              <option value="Double Bed">Double Bed</option>
              <option value="Luxury Room">Luxury Room</option>
              <option value="Family Suite">Family Suite</option>
            </select>
          </div>

          <div>
            <p className='mt-4 text-gray-800'>
              Price <span className='text-xs'>/night</span>
            </p>
            <input
              type="number"
              placeholder='0'
              className='border border-gray-300 mt-1 rounded p-2 w-28'
              value={inputs.pricePerNight}
              min={0}
              onChange={(e) => setInputs({ ...inputs, pricePerNight: e.target.value })}
            />
          </div>
        </div>

        <p className='text-gray-800 mt-4'>Amenities</p>
        <div className='flex flex-col flex-wrap mt-1 text-gray-600 gap-2 max-w-sm'>
          {Object.keys(inputs.amenities).map((amenity, index) => (
            <label key={amenity} className='inline-flex items-center gap-2 text-sm cursor-pointer'>
              <input
                type="checkbox"
                id={`amenities${index+1}`}
                checked={inputs.amenities[amenity]}
                onChange={() => setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity]
                  }
                })}
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>

        <button
          type='submit'
          disabled={submitting}
          className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer disabled:opacity-60'
        >
          {submitting ? 'Adding...' : 'Add Room'}
        </button>
      </form>
    </div>
  )
}

export default AddRoom
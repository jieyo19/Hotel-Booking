import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'

const HotelReg = () => {
  const { setShowHotelReg, axios, setIsOwner } = useAppContext()
  const { getToken } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    city: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Hotel name is required'
    }
    
    if (!formData.contact.trim()) {
      newErrors.contact = 'Phone number is required'
    } else if (!/^[+]?[\d\s-()]+$/.test(formData.contact)) {
      newErrors.contact = 'Invalid phone number format'
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    
    if (!formData.city) {
      newErrors.city = 'Please select a city'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix all errors')
      return
    }
    
    setLoading(true)
    
    try {
      const token = await getToken()
      
      console.log('Submitting hotel registration:', formData)
      console.log('Token:', token ? 'Token received' : 'No token')
      
      // FIXED: Use relative path and include formData as second parameter
      const response = await axios.post(
        '/api/hotels/register',
        formData,  // THIS IS IMPORTANT - the data to send!
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      console.log('Full Response:', response)
      console.log('Response Data:', response.data)
      console.log('Response Status:', response.status)
      
      // Success handling
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Hotel registered successfully!')
        setIsOwner(true)
        setShowHotelReg(false)
        
        // Reset form
        setFormData({
          name: '',
          contact: '',
          address: '',
          city: ''
        })
      } else {
        console.error('Unexpected response format:', response.data)
        toast.error(response.data?.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error response:', error.response)
      
      // Better error handling
      if (error.response) {
        const status = error.response.status
        const message = error.response.data?.message || 'Registration failed'
        
        if (status === 400) {
          toast.error(message)
        } else if (status === 401) {
          toast.error('Authentication failed. Please login again.')
        } else if (status === 404) {
          toast.error('API endpoint not found. Please check your backend.')
        } else {
          toast.error(message)
        }
      } else if (error.request) {
        console.error('No response received:', error.request)
        toast.error('Cannot connect to server. Please check if the backend is running.')
      } else {
        console.error('Error:', error.message)
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle close
  const handleClose = () => {
    if (loading) return
    setShowHotelReg(false)
  }

  return (
    <div 
      className='fixed top-0 bottom-0 left-0 right-0 z-[100] flex items-center justify-center bg-black/70 p-4'
      onClick={handleClose}
    >
      <form 
        onSubmit={handleSubmit} 
        onClick={(e) => e.stopPropagation()}
        className='flex bg-white rounded-xl max-w-4xl w-full max-md:mx-2 overflow-hidden'
      >
        {/* Left Side - Image */}
        <img 
          src={assets.regImage} 
          alt="reg-image" 
          className='w-1/2 rounded-l-xl hidden md:block object-cover'
        />

        {/* Right Side - Form */}
        <div className='relative flex flex-col md:w-1/2 w-full p-8 md:p-10 overflow-y-auto max-h-[90vh]'>
          {/* Close Button */}
          <img 
            src={assets.closeIcon} 
            alt="close-icon" 
            className='absolute top-4 right-4 h-4 w-4 cursor-pointer hover:opacity-70 transition-opacity' 
            onClick={handleClose}
          />
          
          {/* Title */}
          <p className='text-2xl font-semibold mt-6 mb-6'>Register Your Hotel</p>

          {/* Hotel Name */}
          <div className='w-full mb-4'>
            <label className='text-gray-600 text-sm mb-2 block'>Hotel Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Urbanza Suites" 
              className={`w-full border rounded-lg py-3 px-4 outline-none transition-colors text-gray-700 ${
                errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
              disabled={loading}
            />
            {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
          </div>

          {/* Phone */}
          <div className='w-full mb-4'>
            <label className='text-gray-600 text-sm mb-2 block'>Phone</label>
            <input 
              type="text" 
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="+0123456789" 
              className={`w-full border rounded-lg py-3 px-4 outline-none transition-colors text-gray-700 ${
                errors.contact ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
              disabled={loading}
            />
            {errors.contact && <p className='text-red-500 text-xs mt-1'>{errors.contact}</p>}
          </div>

          {/* Address */}
          <div className='w-full mb-4'>
            <label className='text-gray-600 text-sm mb-2 block'>Address</label>
            <input 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Main Road 123 Street , 23 Colony" 
              className={`w-full border rounded-lg py-3 px-4 outline-none transition-colors text-gray-700 ${
                errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
              disabled={loading}
            />
            {errors.address && <p className='text-red-500 text-xs mt-1'>{errors.address}</p>}
          </div>

          {/* City */}
          <div className='w-full mb-6'>
            <label className='text-gray-600 text-sm mb-2 block'>City</label>
            <select 
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full border rounded-lg py-3 px-4 outline-none transition-colors ${
                errors.city ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              } ${!formData.city ? 'text-gray-400' : 'text-gray-700'}`}
              disabled={loading}
            >
              <option value="">Select City</option>
              <option value="Dubai">Dubai</option>
              <option value="Singapore">Singapore</option>
              <option value="New York">New York</option>
              <option value="London">London</option>
            </select>
            {errors.city && <p className='text-red-500 text-xs mt-1'>{errors.city}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className='w-full bg-indigo-600 text-white py-3.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-sm'
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>

          <p className='text-xs text-gray-400 mt-4 text-center'>
            By registering, you agree to our terms and conditions
          </p>
        </div>
      </form>
    </div>
  )
}

export default HotelReg
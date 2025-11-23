import React from 'react'
import { assets } from '../assets/assets'

const HotelReg = () => {
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70'>
      <form className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'>
        <img src={assets.regImage} alt="reg-image" className='w-1/2 rounded-xl hidden md:block'/>

        <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
          <img src={assets.closeIcon} alt="close-icon" className='absolute top-4 right-4 h-4 w-4 cursor-pointer'/>
          <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>

          <div className='w-full mt-6'>
            <label className='text-gray-600'>Hotel Name</label>
            <input 
              type="text" 
              placeholder="Type here" 
              className='w-full border border-gray-300 rounded py-2.5 px-4 mt-1 outline-none focus:border-blue-500'
            />
          </div>

          <div className='w-full mt-4'>
            <label className='text-gray-600'>Phone</label>
            <input 
              type="text" 
              placeholder="Type here" 
              className='w-full border border-gray-300 rounded py-2.5 px-4 mt-1 outline-none focus:border-blue-500'
            />
          </div>

          <div className='w-full mt-4'>
            <label className='text-gray-600'>Address</label>
            <input 
              type="text" 
              placeholder="Type here" 
              className='w-full border border-gray-300 rounded py-2.5 px-4 mt-1 outline-none focus:border-blue-500'
            />
          </div>

          <div className='w-full mt-4'>
            <label className='text-gray-600'>City</label>
            <select className='w-full border border-gray-300 rounded py-2.5 px-4 mt-1 outline-none focus:border-blue-500 text-gray-500'>
              <option value="">Select City</option>
              <option value="dubai">Dubai</option>
              <option value="singapore">Singapore</option>
              <option value="new-york">New York</option>
              <option value="london">London</option>
            </select>
          </div>

          <button 
            type="submit" 
            className='w-full bg-blue-500 text-white py-3 rounded mt-6 hover:bg-blue-600 transition-colors'
          >
            Register
          </button>

        </div>

      </form>
    </div>
  )
}

export default HotelReg
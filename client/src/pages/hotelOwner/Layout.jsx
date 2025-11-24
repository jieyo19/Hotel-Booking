import React, { useEffect, useState } from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { useAuth } from '@clerk/clerk-react'

const Layout = () => {
  const { axios, setShowHotelReg, setIsOwner } = useAppContext()
  const { getToken } = useAuth()

  const [loading, setLoading] = useState(true)
  const [hotelExists, setHotelExists] = useState(false)
  const [error, setError] = useState('')

  const verifyHotel = async () => {
    setLoading(true)
    setError('')
    try {
      const token = await getToken()
      const response = await axios.get('/api/hotels/my-hotel', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      if (response.data?.success) {
        setHotelExists(true)
        setIsOwner?.(true)
      } else {
        setHotelExists(false)
        setIsOwner?.(false)
        setError(response.data?.message || 'Unable to verify hotel registration')
      }
    } catch (err) {
      const status = err.response?.status
      if (status === 404) {
        setHotelExists(false)
        setIsOwner?.(false)
        setError('')
      } else if (status === 401) {
        setError('Please sign in again to manage your hotel.')
        setHotelExists(false)
        setIsOwner?.(false)
      } else {
        setError(err.response?.data?.message || err.message || 'Unable to verify hotel registration')
        setHotelExists(false)
        setIsOwner?.(false)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyHotel()
  }, [])

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <Navbar/>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <div className='flex-1 p-4 pt-10 md:px-10 overflow-auto bg-white'>
          {loading ? (
            <p className='text-gray-500 text-sm'>Checking your hotel registration...</p>
          ) : hotelExists ? (
            <Outlet/>
          ) : (
            <div className='flex flex-col items-start gap-4'>
              <p className='text-gray-700'>
                {error || 'You have not registered a hotel yet. Please register your property to access the owner dashboard.'}
              </p>
              <div className='flex gap-3 flex-wrap'>
                <button
                  onClick={() => setShowHotelReg(true)}
                  className='bg-primary text-white px-5 py-2 rounded-md hover:opacity-90 transition-colors'
                >
                  Register Hotel
                </button>
                <button
                  onClick={verifyHotel}
                  className='px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors'
                >
                  Re-check Status
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Layout
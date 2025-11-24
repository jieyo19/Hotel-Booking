import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { assets, dashboardDummyData } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'

const Dashboard = () => {
  const { axios } = useAppContext()
  const { getToken } = useAuth()

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboardData = async () => {
    setLoading(true)
    setError('')
    try {
      const token = await getToken()
      const response = await axios.get('/api/bookings/hotel', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to load dashboard data')
      }

      setDashboardData(response.data.dashboardData)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      // Fallback to dummy data if API fails
      console.log('Using dummy data for dashboard')
      setDashboardData(dashboardDummyData)
      // Don't show error toast when using dummy data
      // const message = err.response?.data?.message || err.message || 'Failed to load dashboard data'
      // toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const totalBookings = dashboardData?.totalBookings ?? 0
  const totalRevenue = dashboardData?.totalRevenue ?? 0
  const bookings = dashboardData?.bookings ?? []

  return (
    <div>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <Title
          align='left'
          font='outfit'
          title='Dashboard'
          subTitle='Monitor room listings, track bookings, and analyze revenue—all in one place.'
        />
        <button
          onClick={fetchDashboardData}
          className='text-sm bg-gray-100 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200 transition-colors'
        >
          Refresh
        </button>
      </div>

      <div className='flex gap-4 my-8 flex-wrap'>
        {/* ---- ---Total Bookings-- */}
        <div className='bg-primary/5 border border-primary/10 rounded flex p-4 pr-8 min-w-[220px]'>
          <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10'/>
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Bookings</p>
            <p className='text-neutral-800 text-2xl'>{loading ? '—' : totalBookings}</p>
          </div>
        </div>
        {/* ---- ---Total Revenue-- */}
        <div className='bg-primary/5 border border-primary/10 rounded flex p-4 pr-8 min-w-[220px]'>
          <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10'/>
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Revenue</p>
            <p className='text-neutral-800 text-2xl'>
              {loading ? '—' : `$ ${totalRevenue.toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>

      {/* ------- Recent Bookings ---------- */}
      <h2 className='text-lg text-gray-500 font-normal mb-4'>Recent Bookings</h2>

      {loading ? (
        <p className='text-sm text-gray-500'>Loading dashboard data...</p>
      ) : error ? (
        <p className='text-sm text-red-500'>{error}</p>
      ) : bookings.length === 0 ? (
        <p className='text-sm text-gray-500'>No bookings yet.</p>
      ) : (
        <div className='w-full max-w-4xl text-left border border-gray-200 rounded-xl max-h-80 overflow-y-auto bg-white shadow-sm'>
          <table className='w-full'>
            <thead className='bg-gray-50/50 sticky top-0'>
              <tr className='border-b border-gray-200'>
                <th className='py-3 px-5 text-left text-gray-700 font-semibold text-sm'>User Name</th>
                <th className='py-3 px-5 text-left text-gray-700 font-semibold text-sm max-sm:hidden'>Room Name</th>
                <th className='py-3 px-5 text-left text-gray-700 font-semibold text-sm'>Total Amount</th>
                <th className='py-3 px-5 text-left text-gray-700 font-semibold text-sm'>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className='border-b border-gray-100 last:border-0'>
                  <td className='py-4 px-5 text-gray-600 text-sm'>{booking.user?.username || '—'}</td>
                  <td className='py-4 px-5 text-gray-600 text-sm max-sm:hidden'>{booking.room?.roomType || '—'}</td>
                  <td className='py-4 px-5 text-gray-600 text-sm'>$ {booking.totalPrice ?? 0}</td>
                  <td className='py-4 px-5'>
                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-medium ${
                      booking.isPaid 
                        ? 'bg-green-200/80 text-green-700' 
                        : 'bg-yellow-200/80 text-yellow-700'
                    }`}>
                      {booking.isPaid ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Dashboard

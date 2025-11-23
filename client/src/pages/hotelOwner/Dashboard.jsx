import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets, dashboardDummyData } from '../../assets/assets'

const Dashboard = () => {

  const [dashboardData, setDashboardData] = useState(dashboardDummyData)

  return (
    <div>
      <Title align='left' font='outfit' title='Dashboard' subTitle='Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations.'/>

      <div className='flex gap-4 my-8'>
        {/* ---- ---Total Bookings-- */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
          <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10'/>
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Bookings</p>
            <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
          </div>
        </div>
        {/* ---- ---Total Revenue-- */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
          <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10'/>
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Revenue</p>
            <p className='text-neutral-400 text-base'>$ {dashboardData.totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* ------- Recent Bookings ---------- */}
      <h2 className='text-lg text-gray-500 font-normal mb-4'>Recent Bookings</h2>

      <div className='w-full max-w-4xl text-left border border-gray-200 rounded-xl max-h-80 overflow-y-scroll bg-white shadow-sm'>

        <table className='w-full'>
          <thead className='bg-gray-50/50'>
            <tr className='border-b border-gray-200'>
              <th className='py-3 px-5 text-left text-gray-700 font-semibold text-sm'>User Name</th>
              <th className='py-3 px-5 text-left text-gray-700 font-semibold text-sm max-sm:hidden'>Room Name</th>
              <th className='py-3 px-5 text-left text-gray-700 font-semibold text-sm'>Total Amount</th>
              <th className='py-3 px-5 text-left text-gray-700 font-semibold text-sm'>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.bookings && dashboardData.bookings.map((booking, index) => (
              <tr key={index} className='border-b border-gray-100 last:border-0'>
                <td className='py-4 px-5 text-gray-600 text-sm'>{booking.user.username}</td>
                <td className='py-4 px-5 text-gray-600 text-sm max-sm:hidden'>{booking.room.roomType}</td>
                <td className='py-4 px-5 text-gray-600 text-sm'>$ {booking.totalPrice}</td>
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
    </div>
  )
}

export default Dashboard
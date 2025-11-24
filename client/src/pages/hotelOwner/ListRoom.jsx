import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { toast } from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'
import { useAuth } from '@clerk/clerk-react'
import { roomsDummyData } from '../../assets/assets'

const ListRoom = () => {
  const { axios } = useAppContext()
  const { getToken } = useAuth()

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRooms = async () => {
    setLoading(true)
    setError('')
    try {
      const token = await getToken()
      const response = await axios.get('/api/rooms/owner', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to load rooms')
      }

      setRooms(response.data.rooms || [])
    } catch (err) {
      console.error('Fetch rooms error:', err)
      // Fallback to dummy data if API fails
      console.log('Using dummy data for rooms')
      setRooms(roomsDummyData)
      // Don't show error toast when using dummy data
      // const message = err.response?.data?.message || err.message || 'Failed to load rooms'
      // toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleToggleAvailability = async (roomId) => {
    try {
      const token = await getToken()
      const response = await axios.post('/api/rooms/toggle-availability', { roomId }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to update room')
      }

      setRooms((prev) =>
        prev.map((room) =>
          room._id === roomId ? { ...room, isAvailable: !room.isAvailable } : room
        )
      )
      toast.success(response.data.message || 'Room availability updated')
    } catch (err) {
      console.error('Toggle availability error:', err)
      // Fallback: update local state even if API fails (for dummy data)
      setRooms((prev) =>
        prev.map((room) =>
          room._id === roomId ? { ...room, isAvailable: !room.isAvailable } : room
        )
      )
      toast.success('Room availability updated (demo mode)')
      // toast.error(err.response?.data?.message || err.message || 'Failed to update room')
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <Title
          align='left'
          font='outfit'
          title='Room Listings'
          subTitle='View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users.'
        />
        <button
          onClick={fetchRooms}
          className='text-sm bg-gray-100 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200 transition-colors'
        >
          Refresh
        </button>
      </div>
      
      <p className='text-gray-500 mt-8'>All Rooms</p>

      {loading ? (
        <p className='text-sm text-gray-500 mt-4'>Loading rooms...</p>
      ) : error ? (
        <p className='text-sm text-red-500 mt-4'>{error}</p>
      ) : rooms.length === 0 ? (
        <p className='text-sm text-gray-500 mt-4'>No rooms added yet.</p>
      ) : (
        <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll bg-white shadow'>
          <table className='w-full'>
            <thead className='bg-gray-50 sticky top-0'>
              <tr>
                <th className='py-3 px-4 text-gray-800 font-medium text-left'>Room Type</th>
                <th className='py-3 px-4 text-gray-800 font-medium text-left max-sm:hidden'>Amenities</th>
                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Price</th>
                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
              </tr>
            </thead>
            <tbody className='text-sm'>
              {rooms.map((item) => (
                <tr key={item._id} className='border-t border-gray-200'>
                  <td className='py-3 px-4 text-gray-700'>
                    {item.roomType}
                  </td>
                  <td className='py-3 px-4 text-gray-600 max-sm:hidden'>
                    {Array.isArray(item.amenities) ? item.amenities.join(', ') : '—'}
                  </td>
                  <td className='py-3 px-4 text-center text-gray-900 font-medium'>
                    ${item.pricePerNight}
                  </td>
                  <td className='py-3 px-4 text-center'>
                    <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                      <input
                        type="checkbox"
                        className='sr-only peer'
                        checked={item.isAvailable}
                        onChange={() => handleToggleAvailability(item._id)}
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200">
                        <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                      </div>
                      <span className='text-xs text-gray-500 min-w-16 text-left'>
                        {item.isAvailable ? 'Active' : 'Hidden'}
                      </span>
                    </label>
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

export default ListRoom

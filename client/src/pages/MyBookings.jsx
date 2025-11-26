import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import Title from '../components/Title'

const bookingsData = [
  {
    id: 1,
    hotel: 'Urbanza Suites',
    roomType: 'Double Bed',
    address: 'Main Road 123 Street , 23 Colony',
    guests: 1,
    total: 299,
    checkIn: 'Wed Apr 30 2025',
    checkOut: 'Thu May 01 2025',
    status: 'Paid',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    hotel: 'Urbanza Suites',
    roomType: 'Double Bed',
    address: 'Main Road 123 Street , 23 Colony',
    guests: 1,
    total: 399,
    checkIn: 'Sun Apr 27 2025',
    checkOut: 'Mon Apr 28 2025',
    status: 'Unpaid',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    hotel: 'Urbanza Suites',
    roomType: 'Single Bed',
    address: 'Main Road 123 Street , 23 Colony',
    guests: 1,
    total: 199,
    checkIn: 'Fri Apr 11 2025',
    checkOut: 'Sat Apr 12 2025',
    status: 'Unpaid',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&h=200&fit=crop'
  }
]

const MyBookings = () => {
  const { axios } = useAppContext()
  const { getToken, isSignedIn } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('gcash')
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState({
    gcashName: '',
    gcashNumber: '',
    gcashReference: '',
    paypalEmail: '',
    paypalTransactionId: ''
  })

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  // Transform API booking data to match display format
  const transformBooking = (booking) => {
    return {
      id: booking._id,
      hotel: booking.hotel?.name || 'Unknown Hotel',
      roomType: booking.room?.roomType || 'Unknown Room',
      address: booking.hotel?.address || 'Address not available',
      guests: booking.guests || 1,
      total: booking.totalPrice || 0,
      checkIn: formatDate(booking.checkInDate),
      checkOut: formatDate(booking.checkOutDate),
      status: booking.isPaid ? 'Paid' : 'Unpaid',
      image: booking.room?.images?.[0] || booking.hotel?.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300&h=200&fit=crop',
      bookingStatus: booking.status || 'pending',
      bookingId: booking._id
    }
  }

  // Fetch user bookings from API
  const fetchBookings = async () => {
    if (!isSignedIn) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const token = await getToken()
      const response = await axios.get('/api/bookings/user', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      if (response.data?.success && response.data.bookings) {
        const transformedBookings = response.data.bookings.map(transformBooking)
        setBookings(transformedBookings)
      } else {
        throw new Error(response.data?.message || 'Failed to load bookings')
      }
    } catch (err) {
      console.error('Error fetching bookings:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load bookings'
      setError(errorMsg)
      // Only use dummy data if we have an error AND no bookings yet
      if (bookings.length === 0) {
        setBookings([]) // Keep empty, don't use dummy data
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn])

  const openPaymentModal = (booking) => {
    setSelectedBooking(booking)
    setPaymentMethod('gcash')
    setPaymentDetails({
      gcashName: '',
      gcashNumber: '',
      gcashReference: '',
      paypalEmail: '',
      paypalTransactionId: ''
    })
    setShowPaymentModal(true)
  }

  const closePaymentModal = () => {
    if (processingPayment) return
    setShowPaymentModal(false)
    setSelectedBooking(null)
  }

  const handlePaymentDetailChange = (field, value) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleConfirmPayment = async () => {
    if (!selectedBooking) return

    if (paymentMethod === 'gcash') {
      if (!paymentDetails.gcashName.trim() || !paymentDetails.gcashNumber.trim() || !paymentDetails.gcashReference.trim()) {
        toast.error('Please fill out all GCash payment details.')
        return
      }
    } else if (paymentMethod === 'paypal') {
      if (!paymentDetails.paypalEmail.trim() || !paymentDetails.paypalTransactionId.trim()) {
        toast.error('Please provide your PayPal email and transaction ID.')
        return
      }
    }

    try {
      setProcessingPayment(true)

      // In a real integration you'd redirect to a payment gateway here.
      // For now we simulate success after a short delay.
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, status: 'Paid' }
            : booking
        )
      )

      toast.success(
        paymentMethod === 'gcash'
          ? 'GCash payment recorded successfully.'
          : 'PayPal payment recorded successfully.'
      )
      closePaymentModal()
    } catch (err) {
      console.error('Payment simulation error:', err)
      toast.error('Failed to record payment. Please try again.')
    } finally {
      setProcessingPayment(false)
    }
  }

  // Use fetched bookings
  const displayBookings = bookings
  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>

      <Title title='My Bookings' subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' align='left' />

      <div className='max-w-6xl mt-8 w-full text-gray-800'>
        {/* Refresh button */}
        <div className='flex justify-end mb-4'>
          <button
            onClick={fetchBookings}
            disabled={loading}
            className='text-sm bg-gray-100 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {error && !loading && (
          <div className='text-red-500 text-sm mb-4 bg-red-50 p-3 rounded'>
            {error}
          </div>
        )}

        {loading ? (
          <div className='text-center py-8 text-gray-500'>
            Loading your bookings...
          </div>
        ) : displayBookings.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <p className='text-lg mb-2'>No bookings found.</p>
            <p className='text-sm'>Start by booking a room from the rooms page!</p>
          </div>
        ) : (
          <>
            <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
              <div>Hotels</div>
              <div>Date & Timings</div>
              <div>Payment</div>
            </div>

            {displayBookings.map((booking) => (
          <div key={booking.id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 gap-4 items-center'>
            
            {/* Hotel Info */}
            <div className='flex flex-col md:flex-row gap-4'>
              <img 
                src={booking.image} 
                alt={booking.hotel} 
                className='w-full md:w-36 h-24 object-cover rounded shadow'
              />
              <div className='flex flex-col gap-1'>
                <p className='text-xl font-playfair'>
                  {booking.hotel} <span className='text-sm text-gray-500'>({booking.roomType})</span>
                </p>
                <p className='text-sm text-gray-500 flex items-center gap-1'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {booking.address}
                </p>
                <p className='text-sm text-gray-500 flex items-center gap-1'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Guests: {booking.guests}
                </p>
                <p className='font-medium'>Total: ${booking.total}</p>
              </div>
            </div>

            {/* Date & Timings */}
            <div className='flex gap-8 items-start'>
              <div>
                <p className='text-gray-500 text-sm'>Check-In:</p>
                <p className='text-gray-800'>{booking.checkIn}</p>
              </div>
              <div>
                <p className='text-gray-500 text-sm'>Check-Out:</p>
                <p className='text-gray-800'>{booking.checkOut}</p>
              </div>
            </div>

            {/* Payment Status */}
            <div className='flex flex-col items-start md:items-center gap-2'>
              <div className='flex items-center gap-2'>
                <span className={`w-2.5 h-2.5 rounded-full ${booking.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={booking.status === 'Paid' ? 'text-green-600' : 'text-red-500'}>
                  {booking.status}
                </span>
              </div>
              {booking.status === 'Unpaid' && (
                <button
                  onClick={() => openPaymentModal(booking)}
                  className='px-4 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors'
                >
                  Pay Now
                </button>
              )}
            </div>

          </div>
            ))}
          </>
        )}

      </div>

      {showPaymentModal && selectedBooking && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4' onClick={closePaymentModal}>
          <div
            className='bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePaymentModal}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
              aria-label='Close payment modal'
            >
              ✕
            </button>

            <h3 className='text-2xl font-semibold mb-2'>Choose Payment Method</h3>
            <p className='text-sm text-gray-500 mb-6'>
              Complete the payment for <span className='font-medium'>{selectedBooking.hotel}</span> ({selectedBooking.roomType})
            </p>

            <div className='space-y-4'>
              <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'gcash' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                <input
                  type='radio'
                  name='payment-method'
                  value='gcash'
                  checked={paymentMethod === 'gcash'}
                  onChange={() => setPaymentMethod('gcash')}
                  className='mt-1 accent-indigo-600'
                />
                <div>
                  <p className='font-semibold text-lg'>GCash</p>
                  <p className='text-sm text-gray-500'>Pay using your GCash mobile wallet. Send payment to <span className='font-medium'>0917-123-4567</span> and upload your reference code.</p>
                </div>
              </label>

              <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'paypal' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                <input
                  type='radio'
                  name='payment-method'
                  value='paypal'
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  className='mt-1 accent-indigo-600'
                />
                <div>
                  <p className='font-semibold text-lg'>PayPal</p>
                  <p className='text-sm text-gray-500'>You will be redirected to PayPal to complete the payment. Use billing email <span className='font-medium'>payments@hotelbooking.com</span>.</p>
                </div>
              </label>
            </div>

            {paymentMethod === 'gcash' && (
              <div className='mt-6 space-y-3'>
                <div>
                  <label className='text-sm font-medium text-gray-600'>GCash Account Name</label>
                  <input
                    type='text'
                    value={paymentDetails.gcashName}
                    onChange={(e) => handlePaymentDetailChange('gcashName', e.target.value)}
                    placeholder='e.g. Juan Dela Cruz'
                    className='mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-indigo-500'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>GCash Number</label>
                  <input
                    type='text'
                    value={paymentDetails.gcashNumber}
                    onChange={(e) => handlePaymentDetailChange('gcashNumber', e.target.value)}
                    placeholder='09XX XXX XXXX'
                    className='mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-indigo-500'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>Reference Code</label>
                  <input
                    type='text'
                    value={paymentDetails.gcashReference}
                    onChange={(e) => handlePaymentDetailChange('gcashReference', e.target.value)}
                    placeholder='Enter the 13-digit reference code'
                    className='mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-indigo-500'
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className='mt-6 space-y-3'>
                <div>
                  <label className='text-sm font-medium text-gray-600'>PayPal Email</label>
                  <input
                    type='email'
                    value={paymentDetails.paypalEmail}
                    onChange={(e) => handlePaymentDetailChange('paypalEmail', e.target.value)}
                    placeholder='your-email@example.com'
                    className='mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-indigo-500'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>PayPal Transaction ID</label>
                  <input
                    type='text'
                    value={paymentDetails.paypalTransactionId}
                    onChange={(e) => handlePaymentDetailChange('paypalTransactionId', e.target.value)}
                    placeholder='Enter the transaction ID'
                    className='mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-indigo-500'
                  />
                </div>
              </div>
            )}

            <div className='mt-6 flex flex-col gap-3'>
              <button
                onClick={handleConfirmPayment}
                disabled={processingPayment}
                className='w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {processingPayment ? 'Processing...' : `Confirm ${paymentMethod === 'gcash' ? 'GCash' : 'PayPal'} Payment`}
              </button>
              <button
                onClick={closePaymentModal}
                disabled={processingPayment}
                className='w-full border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings
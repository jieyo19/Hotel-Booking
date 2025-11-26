import Booking from "../models/Booking.js";
import Hotel from "../models/hotelModel.js";
import Room from "../models/Room.js";

// Function to Check Availability of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room })=>{
    try {
        // Convert dates to Date objects if they're strings
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        
        // Ensure room is a string (Booking model uses String type for room)
        const roomId = String(room);
        
        // Find bookings that overlap with the requested dates
        // A booking overlaps if:
        // - Its check-in is before or on the requested check-out AND
        // - Its check-out is after or on the requested check-in
        // Exclude cancelled bookings
        const bookings = await Booking.find({
            room: roomId,
            status: { $ne: 'cancelled' },
            checkInDate: {$lte: checkOut},
            checkOutDate: {$gte: checkIn},
        });
        const isAvailable = bookings.length === 0;
        console.log(`Availability check for room ${roomId}: ${isAvailable ? 'Available' : 'Not Available'} (Found ${bookings.length} overlapping bookings)`);
        return isAvailable;
    } catch (error) {
        console.error('Error in checkAvailability:', error.message);
        console.error('Stack:', error.stack);
        // Return false on error to be safe (assume not available if we can't check)
        return false;
    }
}

// API to check availability of room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) =>{
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        
        console.log('Check availability request:', { room, checkInDate, checkOutDate });
        
        // Validate required fields
        if (!room || !checkInDate || !checkOutDate) {
            return res.status(400).json({ 
                success: false, 
                message: 'Room, checkInDate, and checkOutDate are required' 
            });
        }

        // Validate dates
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        
        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid date format' 
            });
        }

        if (checkOut <= checkIn) {
            return res.status(400).json({ 
                success: false, 
                message: 'Check-out date must be after check-in date' 
            });
        }

        // Check if room exists
        const roomExists = await Room.findById(room);
        if (!roomExists) {
            return res.status(404).json({ 
                success: false, 
                message: 'Room not found' 
            });
        }

        // Convert room ID to string to match Booking model
        const roomId = roomExists._id.toString();
        
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room: roomId});
        res.json({ success: true, isAvailable })
    } catch (error) {
        console.error('Error in checkAvailabilityAPI:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to check availability' })
    }
}

// API to create a new booking
// POST /api/bookings/book

export const createBooking = async (req, res) =>{
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        
        // Validate required fields
        if (!room || !checkInDate || !checkOutDate || !guests) {
            return res.status(400).json({ 
                success: false, 
                message: "Room, checkInDate, checkOutDate, and guests are required" 
            });
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        const user = req.user._id;
        console.log('Create booking request:', { room, checkInDate, checkOutDate, guests, user });

        // Get room data first
        const roomData = await Room.findById(room).populate("hotel");
        if (!roomData) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        if (!roomData.isAvailable) {
            return res.status(400).json({ success: false, message: "Room is not available for booking" });
        }

        // Convert room ID to string to match Booking model
        const roomId = roomData._id.toString();

        // Before Booking Check Availability
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room: roomId
        });

        if(!isAvailable){
            return res.status(400).json({success: false, message: "Room is not available for the selected dates"})
        }

        // Get totalPrice from Room
        let totalPrice = roomData.pricePerNight;

        // Calculate totalPrice based on nights
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        
        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid date format" });
        }

        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (nights <= 0) {
            return res.status(400).json({ success: false, message: "Invalid date range" });
        }

        totalPrice *= nights;

        const booking = await Booking.create({
            user: String(user),
            room: roomId,
            hotel: roomData.hotel._id.toString(),
            guests: +guests,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate),
            totalPrice,
        })

        console.log('Booking created successfully:', booking._id);
        res.json({ success: true, message: "Booking created successfully", bookingId: booking._id })

    } catch (error) {
        console.error('Error creating booking:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ success: false, message: error.message || "Failed to create booking" })
    }
};


// API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) =>{
    try {
        const user = req.user._id;
        const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt: -1})
        res.json({success: true, bookings})
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
}

export const getHotelBookings = async (req, res) =>{
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const ownerId = auth?.userId;
        if(!ownerId){
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }
        const hotel = await Hotel.findOne({owner: ownerId});
        if(!hotel){
            return res.json({ success: false, message: "No Hotel found" });
        }
        const bookings = await Booking.find({hotel: hotel._id}).populate("room hotel user").sort({ createdAt: -1 });
        // Total Bookings
        const totalBookings = bookings.length;
        // Total Revenue
        const totalRevenue = bookings.reduce((acc, booking)=>acc + booking.totalPrice, 0)

        res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}})
    } catch (error) {
        console.error('Error in getHotelBookings:', error);
        res.json({success: false, message: "Failed to fetch bookings"})
    }
}
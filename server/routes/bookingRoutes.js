import express from 'express';
import { requireAuth } from '@clerk/express';
import {
    checkAvailabilityAPI,
    createBooking,
    getHotelBookings,
    getUserBookings
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const bookingRouter = express.Router();

// Public route - no auth needed
bookingRouter.post('/check-availability', checkAvailabilityAPI);

// Protected routes - add requireAuth() BEFORE protect
bookingRouter.post('/book', requireAuth(), protect, createBooking);
bookingRouter.get('/user', requireAuth(), protect, getUserBookings);
bookingRouter.get('/hotel', requireAuth(), protect, getHotelBookings);

export default bookingRouter;
import express from 'express';
import { requireAuth } from '@clerk/express';
import { protect } from '../middleware/authMiddleware.js';
import { registerHotel, getMyHotel, getAllHotels } from '../controllers/hotelController.js';

const router = express.Router();

// Protected routes - add requireAuth() BEFORE protect
router.post('/register', requireAuth(), protect, registerHotel);
router.get('/my-hotel', requireAuth(), protect, getMyHotel);
router.get('/all', getAllHotels);

export default router;
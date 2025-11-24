import express from 'express';
import { registerHotel, getMyHotel, getAllHotels } from '../controllers/hotelController.js';

const router = express.Router();

router.post('/register', registerHotel);
router.get('/my-hotel', getMyHotel);
router.get('/all', getAllHotels);

export default router;
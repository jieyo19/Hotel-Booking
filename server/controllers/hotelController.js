import Hotel from "../models/hotelModel.js";

export const registerHotel = async (req, res) => {
  console.log('✅ registerHotel function called');
  
  try {
    // DEBUGGING SECTION
    console.log('📍 Step 0: Checking request details...');
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log('Token received:', !!token);
    console.log('Token preview:', token?.substring(0, 50));
    console.log('Environment variables:', {
      secretKey: !!process.env.CLERK_SECRET_KEY,
      publishableKey: !!process.env.CLERK_PUBLISHABLE_KEY,
      secretKeyPreview: process.env.CLERK_SECRET_KEY?.substring(0, 20),
      publishableKeyPreview: process.env.CLERK_PUBLISHABLE_KEY?.substring(0, 20)
    });
    
    console.log('📍 Step 1: Getting auth...');
    const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
    console.log('📍 Full Auth object:', JSON.stringify(auth, null, 2));
    
    if (!auth?.userId) {
      console.log('❌ No userId found');
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    console.log('✅ User ID:', auth.userId);
    console.log('📍 Step 2: Getting body data...');
    const { name, address, contact, city } = req.body;
    console.log('📍 Body data:', { name, address, contact, city });

    if (!name || !contact || !address || !city) {
      console.log('❌ Missing fields');
      return res.status(400).json({
        success: false,
        message: 'All fields required'
      });
    }

    console.log('📍 Step 3: Creating hotel in database...');
    const hotel = await Hotel.create({ 
      name, 
      address, 
      contact, 
      city, 
      owner: auth.userId
    });

    console.log('✅ Hotel created successfully:', hotel._id);
    console.log('📍 Step 4: Sending response...');

    return res.status(201).json({
      success: true, 
      message: "Hotel registered successfully!",
      data: hotel
    });
  } catch (error) {
    console.error('❌ Error in registerHotel:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyHotel = async (req, res) => {
  try {
    const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
    if (!auth?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    const hotel = await Hotel.findOne({ owner: auth.userId });
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'No hotel found' });
    }
    res.json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json({ success: true, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
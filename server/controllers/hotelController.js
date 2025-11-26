import Hotel from "../models/hotelModel.js";

export const registerHotel = async (req, res) => {
  console.log('✅ registerHotel function called');
  
  try {
    console.log('🔍 Checking authentication...');
    
    // Get user from protect middleware (req.user is set by protect middleware)
    const userId = req.user?._id;
    
    console.log('User object:', req.user);
    console.log('User ID:', userId);
    
    if (!userId) {
      console.log('❌ No userId found - user not authenticated');
      return res.status(401).json({
        success: false,
        message: 'Not authenticated - please sign in'
      });
    }

    console.log('✅ User authenticated:', userId);
    
    const { name, address, contact, city } = req.body;
    console.log('📝 Request body:', { name, address, contact, city });

    if (!name || !contact || !address || !city) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required (name, contact, address, city)'
      });
    }

    // Check if user already has a hotel (owner field is unique)
    const existingHotel = await Hotel.findOne({ owner: userId });
    if (existingHotel) {
      console.log('❌ User already has a hotel registered');
      return res.status(400).json({
        success: false,
        message: 'You already have a hotel registered. Each user can only register one hotel.'
      });
    }

    console.log('🏨 Creating hotel in database...');
    const hotel = await Hotel.create({ 
      name, 
      address, 
      contact, 
      city, 
      owner: userId
    });

    console.log('✅ Hotel created successfully:', hotel._id);

    return res.status(201).json({
      success: true, 
      message: "Hotel registered successfully!",
      data: hotel
    });
  } catch (error) {
    console.error('❌ Error in registerHotel:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    
    // Handle duplicate key error (if user tries to register again)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You already have a hotel registered. Each user can only register one hotel.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to register hotel'
    });
  }
};

export const getMyHotel = async (req, res) => {
  try {
    // Get user from protect middleware
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const hotel = await Hotel.findOne({ owner: userId });
    
    if (!hotel) {
      return res.status(404).json({ 
        success: false, 
        message: 'No hotel found' 
      });
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
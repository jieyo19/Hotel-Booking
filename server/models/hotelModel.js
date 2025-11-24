import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  owner: {  // Make sure it's 'owner' not 'ownerId'
    type: String,
    required: [true, 'Owner ID is required'],
    unique: true
  }
}, {
  timestamps: true
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
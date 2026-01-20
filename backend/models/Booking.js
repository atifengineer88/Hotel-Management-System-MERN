const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  roomNumber: String, // Store snapshot in case room details change later
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  guests: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 }
  },
  totalAmount: Number,
  specialRequests: String,
  status: { 
    type: String, 
    enum: ['booked', 'checked_in', 'checked_out', 'cancelled'], 
    default: 'booked' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
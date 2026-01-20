const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // e.g., Single, Suite
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'cleaning', 'maintenance'], 
    default: 'available' 
  },
  description: String,
  imgs: [String]
});

module.exports = mongoose.model('Room', RoomSchema);
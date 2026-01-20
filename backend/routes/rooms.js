const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/rooms
// @desc    Get all rooms
// @access  Public
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/rooms/:id
// @desc    Get single room by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: 'Room not found' });
    res.json(room);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Room not found' });
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/rooms
// @desc    Add a new room
// @access  Private (Admin/Manager only)
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
  const { roomNumber, type, price, description } = req.body;

  try {
    // Check if room number already exists
    let room = await Room.findOne({ roomNumber });
    if (room) {
      return res.status(400).json({ msg: 'Room number already exists' });
    }

    room = new Room({
      roomNumber,
      type,
      price,
      description,
      status: 'available' // Default status
    });

    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/rooms/:id
// @desc    Update room details (Price, Type, Description)
// @access  Private (Admin/Manager only)
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  const { roomNumber, type, price, description, status } = req.body;

  // Build room object
  const roomFields = {};
  if (roomNumber) roomFields.roomNumber = roomNumber;
  if (type) roomFields.type = type;
  if (price) roomFields.price = price;
  if (description) roomFields.description = description;
  if (status) roomFields.status = status;

  try {
    let room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: 'Room not found' });

    // Update
    room = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: roomFields },
      { new: true }
    );

    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/rooms/:id/status
// @desc    Quick status update (for Housekeeping)
// @access  Private (Admin/Manager/Housekeeping)
router.put('/:id/status', protect, authorize('admin', 'manager', 'housekeeping'), async (req, res) => {
  const { status } = req.body;
  
  if (!['available', 'occupied', 'cleaning', 'maintenance'].includes(status)) {
     return res.status(400).json({ msg: 'Invalid status type' });
  }

  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id, 
      { status },
      { new: true }
    );
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/rooms/:id
// @desc    Delete a room
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: 'Room not found' });

    // Use deleteOne() instead of remove() (deprecated in Mongoose 6+)
    await Room.deleteOne({ _id: req.params.id }); 
    
    res.json({ msg: 'Room removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
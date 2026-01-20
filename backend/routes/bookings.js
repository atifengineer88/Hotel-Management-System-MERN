const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/bookings
// @desc    Create a new booking (Guest)
router.post('/', protect, async (req, res) => {
  const { roomId, checkInDate, checkOutDate, adults, children, specialRequests } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ msg: 'Room not found' });

    // Calculate Price
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return res.status(400).json({ msg: 'Invalid date range' });

    const totalAmount = nights * room.price;

    // Check Overlap
    const conflict = await Booking.findOne({
      room: roomId,
      status: { $ne: 'cancelled' }, // Ignore cancelled bookings
      $or: [
        { checkInDate: { $lt: end }, checkOutDate: { $gt: start } }
      ]
    });

    if (conflict) return res.status(400).json({ msg: 'Room unavailable for these dates' });

    const booking = new Booking({
      user: req.user.id,
      room: roomId,
      roomNumber: room.roomNumber,
      checkInDate,
      checkOutDate,
      guests: { adults, children },
      totalAmount,
      specialRequests
    });

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get ONLY logged-in user's bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('room', ['type', 'price'])
      .sort({ checkInDate: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/bookings/all
// @desc    Get ALL bookings (Admin/Manager Only)
router.get('/all', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', ['name', 'email'])
      .populate('room', ['roomNumber', 'type'])
      .sort({ checkInDate: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update Booking Status (Check-in/Check-out/Cancel)
router.put('/:id/status', protect, authorize('admin', 'manager'), async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    // Optional: Auto-update Room Status based on Booking Status
    if (status === 'checked_in') {
      await Room.findByIdAndUpdate(booking.room, { status: 'occupied' });
    } else if (status === 'checked_out') {
      await Room.findByIdAndUpdate(booking.room, { status: 'cleaning' });
    } else if (status === 'cancelled') {
      await Room.findByIdAndUpdate(booking.room, { status: 'available' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');

// @route   POST /api/subscribers
// @desc    Subscribe a new email
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: 'Email is required' });

        const existing = await Subscriber.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already subscribed' });

        const subscriber = new Subscriber({ email });
        await subscriber.save();

        res.status(201).json({ message: 'Subscribed successfully', subscriber });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/subscribers
// @desc    Get all subscribers
// @access  Admin/Private (set restriction if needed)
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ createdAt: -1 });
        res.json(subscribers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/subscribers/unsubscribe
// @desc    Unsubscribe an email
// @access  Public
router.put('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;

        const updated = await Subscriber.findOneAndUpdate(
            { email },
            { unsubscribe: true },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Subscriber not found' });

        res.json({ message: 'Unsubscribed successfully', updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/subscribers/:id
// @desc    Delete a subscriber
// @access  Admin/Private (optional protection)
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Subscriber.findByIdAndDelete(req.params.id);

        if (!deleted) return res.status(404).json({ message: 'Subscriber not found' });

        res.json({ message: 'Subscriber deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

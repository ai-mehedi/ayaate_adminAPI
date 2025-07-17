const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');
const sendResponse = require('../utils/responseHelper');

// @route   POST /api/subscribers
// @desc    Subscribe a new email
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: 'Email is required' });

        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return sendResponse(res, 400, 'error', 'Email already subscribed');
        }

        const subscriber = new Subscriber({ email });
        await subscriber.save();

        return sendResponse(res, 201, 'success', 'Subscribed successfully', subscriber);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

// @route   GET /api/subscribers
// @desc    Get all subscribers
// @access  Admin/Private (set restriction if needed)
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ createdAt: -1 });
        return sendResponse(res, 200, 'success', 'Subscribers fetched successfully', subscribers);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
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

        if (!updated) {
            return sendResponse(res, 404, 'error', 'Subscriber not found');
        }

        return sendResponse(res, 200, 'success', 'Unsubscribed successfully', updated);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

// @route   DELETE /api/subscribers/:id
// @desc    Delete a subscriber
// @access  Admin/Private (optional protection)
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Subscriber.findByIdAndDelete(req.params.id);

        if (!deleted){
            return sendResponse(res, 404, 'error', 'Subscriber not found');
        }

        return sendResponse(res, 200, 'success', 'Subscriber deleted successfully');
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

module.exports = router;

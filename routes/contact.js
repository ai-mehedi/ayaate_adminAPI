const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

/**
 * @route   POST /api/contacts
 * @desc    Create a new contact entry
 * @access  Public
 */
router.post('/', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        const saved = await contact.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @route   GET /api/contacts
 * @desc    Get all contact entries
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @route   GET /api/contacts/:id
 * @desc    Get a single contact by ID
 * @access  Public
 */

router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @route   DELETE /api/contacts/:id
 * @desc    Delete a contact by ID
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

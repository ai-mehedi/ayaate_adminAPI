const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

const sendResponse = require('../utils/responseHelper');


/**
 * @route   POST /api/contacts
 * @desc    Create a new contact entry
 * @access  Public
 */
router.post('/', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        const saved = await contact.save();
     return sendResponse(res, 200, 'success', 'Contact created successfully', saved);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
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
       
        return sendResponse(res, 200, 'success', 'Contacts fetched successfully', contacts);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
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
        return sendResponse(res, 200, 'success', 'Contact fetched successfully', contact);
    } catch (err) {
       return sendResponse(res, 500, 'error', 'Something went wrong');
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
      return sendResponse(res, 200, 'success', 'Contact deleted successfully');
    } catch (err) {
      return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

module.exports = router;

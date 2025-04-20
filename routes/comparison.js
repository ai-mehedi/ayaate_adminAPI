const express = require('express');
const router = express.Router();
const Comparison = require('../models/Comparison');

/**
 * @swagger
 * components:
 *   schemas:
 *     Specification:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         value1:
 *           type: string
 *         value2:
 *           type: string
 *     Comparison:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - product1
 *         - product2
 *         - category
 *         - subcategory
 *         - author
 *       properties:
 *         title:
 *           type: string
 *         focus_keyword:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         specification:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Specification'
 *         product1:
 *           type: string
 *         product2:
 *           type: string
 *         content:
 *           type: string
 *         category:
 *           type: string
 *         subcategory:
 *           type: string
 *         author:
 *           type: string
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *         thumbnail:
 *           type: string
 *         keyword:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Comparisons
 *   description: API endpoints for product comparisons
 */

/**
 * @swagger
 * /comparisons:
 *   get:
 *     summary: Get all comparisons
 *     tags: [Comparisons]
 *     responses:
 *       200:
 *         description: List of all comparisons
 */

/**
 * @swagger
 * /comparisons/{id}:
 *   get:
 *     summary: Get a single comparison by ID
 *     tags: [Comparisons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comparison
 *     responses:
 *       200:
 *         description: A comparison object
 *       404:
 *         description: Comparison not found
 */

/**
 * @swagger
 * /comparisons:
 *   post:
 *     summary: Create a new comparison
 *     tags: [Comparisons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comparison'
 *     responses:
 *       201:
 *         description: Comparison created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /comparisons/{id}:
 *   put:
 *     summary: Update an existing comparison
 *     tags: [Comparisons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comparison
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comparison'
 *     responses:
 *       200:
 *         description: Comparison updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Comparison not found
 */

/**
 * @swagger
 * /comparisons/{id}:
 *   delete:
 *     summary: Delete a comparison
 *     tags: [Comparisons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comparison
 *     responses:
 *       200:
 *         description: Comparison deleted successfully
 *       404:
 *         description: Comparison not found
 */

// @desc    Get all comparisons
// @route   GET /api/comparisons
router.get('/', async (req, res) => {
    try {
        const comparisons = await Comparison.find()
            .populate('product1')
            .populate('product2')
            .populate('category')
            .populate('subcategory')
            .populate('author')
            .populate('comments');
        res.json(comparisons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Get single comparison by ID
// @route   GET /api/comparisons/:id
router.get('/:id', async (req, res) => {
    try {
        const comparison = await Comparison.findById(req.params.id)
            .populate('product1')
            .populate('product2')
            .populate('category')
            .populate('subcategory')
            .populate('author')
            .populate('comments');
        if (!comparison) return res.status(404).json({ message: 'Comparison not found' });
        res.json(comparison);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Create new comparison
// @route   POST /api/comparisons
router.post('/', async (req, res) => {
    try {
        const comparison = new Comparison(req.body);
        const saved = await comparison.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Update a comparison
// @route   PUT /api/comparisons/:id
router.put('/:id', async (req, res) => {
    try {
        const updated = await Comparison.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Comparison not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Delete a comparison
// @route   DELETE /api/comparisons/:id
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Comparison.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Comparison not found' });
        res.json({ message: 'Comparison deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

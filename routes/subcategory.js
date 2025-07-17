const express = require('express');
const mongoose = require('mongoose');
const Subcategory = require('../models/Sub-category');
const Category = require('../models/Category');
const router = express.Router();

const sendResponse = require('../utils/responseHelper');
/**
 * @swagger
 * tags:
 *   name: Subcategory
 *   description: Subcategory management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Subcategory:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the subcategory
 *         slug:
 *           type: string
 *           description: The slug of the subcategory
 *         description:
 *           type: string
 *           description: A brief description of the subcategory
 *         parentcategory:
 *           type: string
 *           description: The parent category ID
 *         metaTitle:
 *           type: string
 *           description: The meta title for the subcategory
 *         metaDescription:
 *           type: string
 *           description: The meta description for the subcategory
 *         metaKeyword:
 *           type: string
 *           description: The meta keyword for the subcategory
 */

/**
 * @swagger
 * /subcategories:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [Subcategory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subcategory'
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *       400:
 *         description: Invalid request body
 */
router.post('/', async (req, res) => {
    try {
        const { title, slug, description, parentcategory, metaTitle, metaDescription, metaKeyword } = req.body;

        // Check if the slug already exists
        const existingSubcategory = await Subcategory.findOne({ slug });
        if (existingSubcategory) {
           return sendResponse(res, 400, 'error', 'Subcategory with this slug already exists');
        }

        const subcategory = new Subcategory({
            title,
            slug,
            description,
            parentcategory,
            metaTitle,
            metaDescription,
            metaKeyword
        });

        await subcategory.save();
        return sendResponse(res, 201, 'success', 'Subcategory created successfully', subcategory);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Invalid request body');
    }
});

/**
 * @swagger
 * /subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [Subcategory]
 *     responses:
 *       200:
 *         description: List of subcategories
 */
router.get('/', async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('parentcategory', 'title');
        return sendResponse(res, 200, 'success', 'Subcategories fetched successfully', subcategories);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

/**
 * @swagger
 * /subcategories/{id}:
 *   get:
 *     summary: Get subcategory by ID
 *     tags: [Subcategory]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The subcategory ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory found
 *       404:
 *         description: Subcategory not found
 */
router.get('/:id', async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate('parentcategory', 'title');
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        return sendResponse(res, 200, 'success', 'Subcategory fetched successfully', subcategory);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

/**
 * @swagger
 * /subcategories/{id}:
 *   put:
 *     summary: Update an existing subcategory
 *     tags: [Subcategory]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The subcategory ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subcategory'
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Subcategory not found
 */
router.put('/:id', async (req, res) => {
    try {
        const { title, slug, description, parentcategory, metaTitle, metaDescription, metaKeyword } = req.body;

        const subcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            { title, slug, description, parentcategory, metaTitle, metaDescription, metaKeyword },
            { new: true }
        );
        if (!subcategory) {
            return sendResponse(res, 404, 'error', 'Subcategory not found');
            }
        return sendResponse(res, 200, 'success', 'Subcategory updated successfully', subcategory);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

/**
 * @swagger
 * /subcategories/{id}:
 *   delete:
 *     summary: Delete a subcategory by ID
 *     tags: [Subcategory]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The subcategory ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *       404:
 *         description: Subcategory not found
 */
router.delete('/:id', async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
        if (!subcategory) {
            return sendResponse(res, 404, 'error', 'Subcategory not found');
        }
    
        return sendResponse(res, 200, 'success', 'Subcategory deleted successfully');
    } catch (err) {

        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

module.exports = router;

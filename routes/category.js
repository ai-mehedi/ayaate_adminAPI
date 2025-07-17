const express = require('express');
const mongoose = require('mongoose');
const Category = require('../models/Category');
const router = express.Router();
const sendResponse = require('../utils/responseHelper');

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the category
 *         slug:
 *           type: string
 *           description: The slug of the category
 *         description:
 *           type: string
 *           description: A brief description of the category
 *         metaTitle:
 *           type: string
 *           description: The meta title for the category
 *         metaDescription:
 *           type: string
 *           description: The meta description for the category
 *         metaKeyword:
 *           type: string
 *           description: The meta keyword for the category
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid request body
 */
router.post('/', async (req, res) => {
    try {
        const { title, slug, description, metaTitle, metaDescription, metaKeyword, navigation } = req.body;

        // Check if the slug already exists
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return sendResponse(res, 404, 'error', 'Category with this slug already exists');
        }

        const category = new Category({
            title,
            slug,
            description,
            metaTitle,
            metaDescription,
            metaKeyword, navigation
        });

        await category.save();
        return sendResponse(res, 200, 'success', 'Category created successfully', category);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        return sendResponse(res, 200, 'success', 'Categories fetched successfully', categories);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 */
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return sendResponse(res, 404, 'error', 'Category not found');
        }
        return sendResponse(res, 200, 'success', 'Category fetched successfully', category);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The category ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Category not found
 */
router.put('/:id', async (req, res) => {
    try {
        const { title, slug, description, metaTitle, metaDescription, metaKeyword } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { title, slug, description, metaTitle, metaDescription, metaKeyword },
            { new: true }
        );
        if (!category) {
            return sendResponse(res, 404, 'error', 'Category not found');
        }

        return sendResponse(res, 200, 'success', 'Update successfully', category);
    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return sendResponse(res, 404, 'success', 'Not found');
        }
        return sendResponse(res, 200, 'success', 'Deleted successfully');

    } catch (err) {
        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

module.exports = router;

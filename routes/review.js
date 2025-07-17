const express = require('express');
const router = express.Router();
const Review = require('../models/Review');


const sendResponse = require('../utils/responseHelper');
/**
 * @swagger
 * components:
 *   schemas:
 *     Specification:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         value:
 *           type: string
 *     Product:
 *       type: object
 *       properties:
 *         affiliate_url:
 *           type: string
 *         price:
 *           type: string
 *         ofprice:
 *           type: string
 *         store:
 *           type: string
 *     DigitalSoftware:
 *       type: object
 *       properties:
 *         affiliate_url:
 *           type: string
 *         subscription:
 *           type: string
 *     Review:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - category
 *         - subcategory
 *         - author
 *       properties:
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         focus_keyword:
 *           type: string
 *         description:
 *           type: string
 *         content:
 *           type: string
 *         thumbnail:
 *           type: string
 *         pros:
 *           type: array
 *           items:
 *             type: string
 *         cons:
 *           type: array
 *           items:
 *             type: string
 *         specification:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Specification'
 *         category:
 *           type: string
 *         subcategory:
 *           type: string
 *         author:
 *           type: string
 *         rating:
 *           type: number
 *         views:
 *           type: number
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *         why_we_pick:
 *           type: string
 *         who_it_works_for:
 *           type: string
 *         bottomline:
 *           type: string
 *         digitalsoftware:
 *           $ref: '#/components/schemas/DigitalSoftware'
 *         product:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Review]
 *     responses:
 *       200:
 *         description: The list of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('category')
      .populate('subcategory')
      .populate('author')
      .populate('comments');
    return sendResponse(res, 200, 'success', 'Reviews fetched successfully', reviews);
  } catch (error) {
    return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a single review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the review
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 */
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('category')
      .populate('subcategory')
      .populate('author')
      .populate('comments');

    if (!review) {
      return sendResponse(res, 404, 'error', 'Review not found');
    }
    return sendResponse(res, 200, 'success', 'Review fetched successfully', review);
  } catch (error) {
    return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    const saved = await review.save();
    return sendResponse(res, 201, 'success', 'Review created successfully', saved);
  } catch (error) {
    return sendResponse(res, 400, 'error', 'Validation error', error.message);
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) {
      return sendResponse(res, 404, 'error', 'Review not found');
    }
    return sendResponse(res, 200, 'success', 'Review updated successfully', updated);
  } catch (error) {
    return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted){
      return sendResponse(res, 404, 'error', 'Review not found');
    }
    return sendResponse(res, 200, 'success', 'Review deleted successfully');
  } catch (error) {
    return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

module.exports = router;

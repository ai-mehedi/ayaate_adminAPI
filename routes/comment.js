const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const sendResponse = require('../utils/responseHelper');
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - userId
 *         - body
 *         - postId
 *       properties:
 *         userId:
 *           type: string
 *           format: ObjectId
 *         postId:
 *           type: string
 *           format: ObjectId
 *         body:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment created successfully
 */
router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    return sendResponse(res, 200, 'success', 'Comment created successfully', comment);
  } catch (err) {
    return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().populate('userId').populate('postId');
    return sendResponse(res, 200, 'success', 'Comments fetched successfully', comments);
  } catch (err) {
    return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: The comment data
 *       404:
 *         description: Comment not found
 */
router.get('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('userId').populate('postId');
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    return sendResponse(res, 200, 'success', 'Comment fetched successfully', comment);
  } catch (err) {
    return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The updated comment
 *       404:
 *         description: Comment not found
 */
router.put('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!comment){
      return sendResponse(res, 404, 'error', 'Comment not found');
    }
    return sendResponse(res, 200, 'success', 'Comment updated successfully', comment);
  } catch (err) {
    return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment deleted
 *       404:
 *         description: Comment not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return sendResponse(res, 404, 'error', 'Comment not found');
    }
    return sendResponse(res, 200, 'success', 'Comment deleted successfully');
  } catch (err) {
    return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

module.exports = router;

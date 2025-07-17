const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const sendResponse = require('../utils/responseHelper');
/**
 * @swagger
 * components:
 *   schemas:
 *     DigitalSoftware:
 *       type: object
 *       properties:
 *         image:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         affiliate_url:
 *           type: string
 *         subscription:
 *           type: string
 *     Product:
 *       type: object
 *       properties:
 *         image:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         affiliate_url:
 *           type: string
 *         price:
 *           type: string
 *         ofprice:
 *           type: string
 *         store:
 *           type: string
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - category
 *         - author
 *       properties:
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         focuskeyword:
 *           type: string
 *         keyword:
 *           type: string
 *         description:
 *           type: string
 *         content:
 *           type: string
 *         thumbnail:
 *           type: string
 *         status:
 *           type: string
 *           enum: [published, draft]
 *         type:
 *           type: string
 *           enum: [article, comparison, review]
 *         digitalsoftware:
 *           $ref: '#/components/schemas/DigitalSoftware'
 *         product:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
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
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: List of articles
 */
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('category')
      .populate('subcategory')
      .populate('author')
      .populate('comments');


        return sendResponse(res, 200, 'success', 'Articles fetched successfully', articles);

  
  } catch (err) {

  return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Get single article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Article ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article data
 *       404:
 *         description: Article not found
 */
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('category')
      .populate('subcategory')
      .populate('author')
      .populate('comments');
    if (!article){
      return sendResponse(res, 404, 'error', 'Not found', );

    }
    return sendResponse(res, 200, 'success', 'Articles fetched successfully', article);

  } catch (err) {
  return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Create new article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       201:
 *         description: Article created
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  try {
    const article = new Article(req.body);
    const saved = await article.save();
   return sendResponse(res, 200, 'success', 'Post Create Successfully',saved);

  } catch (err) {
  return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Update an article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Article ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       200:
 *         description: Article updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Article not found
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return sendResponse(res, 404, 'error', 'Article not found');
    }
    return sendResponse(res, 200, 'success', 'Article updated successfully', updated);
  } catch (err) {
  return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Article ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article deleted
 *       404:
 *         description: Article not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return sendResponse(res, 404, 'error', 'Article not found');
    }
    return sendResponse(res, 200, 'success', 'Article deleted successfully');
  } catch (err) {
  return sendResponse(res, 500, 'error', 'Something went wrong');
  }
});

module.exports = router;

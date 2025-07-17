const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 */
router.get('/', async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 */
router.get('/:id', async (req, res) => {
  const id = req.params.id
  const user = await User.findById({ _id: id });
  if (!user) return res.status(404).json({ message: 'User not found' });

  return res.status(200).json({ message: 'User found', user });

});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *               googleId:
 *                 type: string
 *               facebookId:
 *                 type: string
 *               profilePic:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ['user', 'admin']
 *               status:
 *                 type: string
 *                 enum: ['active', 'inactive']
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               social:
 *                 type: object
 *                 properties:
 *                   facebook:
 *                     type: string
 *                   x:
 *                     type: string
 *                   linkedin:
 *                     type: string
 *                   instagram:
 *                     type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    // Hash the password if it exists (manual auth)
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const user = new User({
      ...rest,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 */
router.put('/:id', async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;

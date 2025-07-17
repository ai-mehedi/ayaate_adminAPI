const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const sendResponse = require('../utils/responseHelper');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 */

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   get:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.get('/register', async (req, res) => {
    try {

        const firstname = "mehedi";
        const lastname = "hasan";

        const email = "admin@admin.com";
        const password = "mehedi000";


        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendResponse(res, 400, 'error', 'User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstname, lastname, email, password: hashedPassword });
        await user.save();

        return sendResponse(res, 201, 'success', 'User registered successfully', {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        });
    } catch (err) {
        console.error(err);
        return sendResponse(res, 500, 'error', 'Something went wrong');
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return sendResponse(res, 500, 'error', 'Server error. Please try again later.');
        }
        if (!user) {
            // Passport sends failure message in 'info.message'
            return sendResponse(res, 401, 'error', 'Login failed: Invalid email or password.');
        }

        // Log in the user manually
        req.logIn(user, (err) => {
            if (err) {

                return sendResponse(res, 500, 'error', 'Login failed. Please try again.');
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '7d',
            });

            // Send response
            return sendResponse(res, 200, 'success', 'Login successful', {
                user: {
                    id: user.id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    profilePic: user.profilePic,
                },
                token,
            });
        });
    })(req, res, next);
});

router.post('/adminlogin', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {

        if (err) {
            return sendResponse(res, 500, 'error', 'Server error. Please try again later.');
        }
        if (!user) {
            // Passport sends failure message in 'info.message'
            return sendResponse(res, 401, 'error', 'Login failed: Invalid email or password.');
        }

        // Log in the user manually
        req.logIn(user, (err) => {
            if (err) {

                return sendResponse(res, 500, 'error', 'Login failed. Please try again.');
            }
            else if (user.role !== 'admin') {
                return sendResponse(res, 403, 'error', 'Access denied. Admins only.');
            }
            // Generate JWT token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '7d',
            });

            // Send response
            return sendResponse(res, 200, 'success', 'Login successful', {
                user: {
                    id: user.id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    profilePic: user.profilePic,
                },
                token,
            });
        });
    })(req, res, next);
});



/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.get('/logout', (req, res) => {
    req.logout(() => res.sendStatus(200));
});

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     tags: [Auth]
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google authentication callback
 *     tags: [Auth]
 */
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            const user = req.user;

            // Optionally: Save or update user data
            await User.findByIdAndUpdate(user.id, {
                lastLogin: new Date(),
                // other fields to update if needed
            });

            // Send the response with user info and JWT token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return sendResponse(res, 200, 'success', 'Login successful', {
                user: {
                    id: user.id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    profilePic: user.profilePic,
                },
                token,
            });
        } catch (err) {
            console.error(err);
            return sendResponse(res, 500, 'error', 'Error processing your request');
        }
    }
);

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Authenticate with Facebook
 *     tags: [Auth]
 */
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     summary: Facebook authentication callback
 *     tags: [Auth]
 */
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            const user = req.user;

            // Optionally: Save or update user data
            await User.findByIdAndUpdate(user.id, {
                lastLogin: new Date(),
                // other fields to update if needed
            });

            // Send the response with user info and JWT token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return sendResponse(res, 200, 'success', 'Login successful', {
                user: {
                    id: user.id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    profilePic: user.profilePic,
                },
                token,
            });
        } catch (err) {
            console.error(err);
            return sendResponse(res, 500, 'error', 'Error processing your request');
        }
    }
);

module.exports = router;

import express from 'express';
import User from '../models/userModel.js';
import { authenticateUser } from '../middleware/authMiddleware.js'
import { generateUserToken } from '../utils/token.js';
import cookie from 'cookie'

const userRouter = express.Router();

// Create a new ordinary user
userRouter.post('/register', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const user = await User.create({
            name,
            email,
            password,
        });
        response.status(201).json(user);
    } catch (error) {
        response.status(400).json({ message: 'Invalid User Data', error: error.message });
    }
});

// Login as an ordinary user
userRouter.post('/login', async (request, response) => {
    const { email, password } = request.body;

    try {
        const user = await User.findOne({ email });

        if (user) {

            if (user.password === password) {
                // Passwords match, so the admin is authenticated
                const token = generateUserToken(user);

                // Set the token as a cookie in the response with a specific path
                response.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    maxAge: 60 * 60, // Token expires in 1 hour (adjust as needed)
                }));

                response.json({
                    token,
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                });
            } else {
                // Passwords don't match, return an unauthorized response
                response.status(401).json({ message: 'Invalid password' });
            }
        } else {
            response.status(401).json({ message: 'Invalid email' });
        }
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ message: 'Server Error' });
    }
});

// Get user profile
userRouter.get('/profile', authenticateUser, async (request, response) => {
    try {
        // Retrieve the authenticated user from req.user
        const authenticatedUser = request.user;

        // Fetch the user details from the database using the _id from req.user
        const user = await User.findById(authenticatedUser._id);

        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        // Respond with the user's profile
        response.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ message: 'Server Error' });
    }
});

// Update user profile
userRouter.put('/profile', authenticateUser, async (request, response) => {
    try {
        // Retrieve the authenticated user from req.user
        const authenticatedUser = request.user;

        // Fetch the user details from the database using the _id from req.user
        const user = await User.findById(authenticatedUser._id);

        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        // Update user's profile with the data from the request body
        user.name = request.body.name || user.name; // Update name if provided
        user.email = request.body.email || user.email; // Update email if provided

        // Save the updated user details
        await user.save();

        // Respond with the updated user profile
        response.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            // Add other profile fields as needed
        });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ message: 'Server Error' });
    }
});


// Delete user profile
userRouter.delete('/profile', authenticateUser, async (request, response) => {
    try {
        // Retrieve the authenticated user from req.user
        const authenticatedUser = request.user;

        // Fetch the user details from the database using the _id from req.user
        const user = await User.findById(authenticatedUser._id);

        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        // Remove the user from the database
        await user.deleteOne();

        // Clear the token cookie to log the user out
        response.setHeader('Set-Cookie', cookie.serialize('token', '', {
            httpOnly: true,
            expires: new Date(0), // Set the cookie to expire immediately
        }));

        response.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ message: 'Server Error' });
    }
});

//Logout the user and destroy cookie
userRouter.post('/logout', async (request, response) => {
    // Clear the token cookie by setting an expired date in the past
    response.setHeader('Set-Cookie', cookie.serialize('token', '', {
        httpOnly: true,
        expires: new Date(0), // Set the cookie to expire immediately
    }));
    response.json({ message: 'Logged out successfully' });
});

export default userRouter;

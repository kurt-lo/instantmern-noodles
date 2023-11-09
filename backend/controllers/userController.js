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
                    path: '/api/users', // Set the path to the desired route
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

// Get all ordinary users
userRouter.get('/', authenticateUser, async (request, response) => {
    try {
        const users = await User.find({});
        response.json(users);
    } catch (error) {
        response.status(500).json({ message: 'Server Error' });
    }
});

// Get a single ordinary user by ID
userRouter.get('/:id', async (request, response) => {
    try {
        const user = await User.findById(request.params.id);
        if (user) {
            response.json(user);
        } else {
            response.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        response.status(500).json({ message: 'Server Error' });
    }
});

// Update an ordinary user's information
userRouter.put('/update/:id', async (request, response) => {
    try {
        const user = await User.findById(request.params.id);
        if (user) {
            user.name = request.body.name || user.name;
            user.email = request.body.email || user.email;
            if (request.body.password) {
                user.password = request.body.password;
            }

            const updatedUser = await user.save();
            response.json(updatedUser);
        } else {
            response.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        response.status(500).json({ message: 'Server Error' });
    }
});

// Delete an ordinary user by ID
userRouter.delete('/users/:id', async (request, response) => {
    try {
        const user = await User.findById(request.params.id);
        if (user) {
            await User.deleteOne({ _id: user._id });
            response.json({ message: 'User removed' });
        } else {
            response.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
});

export default userRouter;

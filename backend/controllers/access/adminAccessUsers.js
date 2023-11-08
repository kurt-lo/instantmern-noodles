import express from 'express';
import User from '../../models/userModel.js'

const adminUserRouter = express.Router();

// Get all ordinary users (accessible by admin)
adminUserRouter.get('/users', async (request, response) => {
    try {
        // You can add an access control check here to ensure that only admin users can access this route
        const users = await User.find({});
        response.json(users);
    } catch (error) {
        response.status(500).json({ message: 'Server Error' });
    }
});

// Get a single ordinary user by ID (accessible by admin)
adminUserRouter.get('/users/:id', async (request, response) => {
    try {
        // You can add an access control check here to ensure that only admin users can access this route
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

// Update an ordinary user's information (accessible by admin)
adminUserRouter.put('/users/:id', async (request, response) => {
    try {
        // You can add an access control check here to ensure that only admin users can access this route
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

// Delete an ordinary user by ID (accessible by admin)
adminUserRouter.delete('/users/:id', async (request, response) => {
    try {
        // You can add an access control check here to ensure that only admin users can access this route
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

export default adminUserRouter;

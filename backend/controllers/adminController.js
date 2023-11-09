import express from 'express';
import Admin from '../models/adminModel.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { generateAdminToken } from '../utils/token.js';

const adminRouter = express.Router();

// Create a new admin
adminRouter.post('/account', async (request, response) => {
    try {
        const { name, email, password } = request.body;
        const admin = await Admin.create({
            name,
            email,
            password,
        });
        response.status(201).json(admin);
    } catch (error) {
        response.status(400).json({ message: 'Invalid Admin Data' });
    }
});

// Login as an admin
adminRouter.post('/login', async (request, response) => {
    const { email, password } = request.body;

    try {
        const admin = await Admin.findOne({ email });

        if (admin) {
            if (admin.password === password) {
                // Passwords match, so the admin is authenticated
                const token = generateAdminToken(admin);
                response.json({
                    token,
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                });
            } else {
                // Passwords don't match, return an unauthorized response
                response.status(401).json({ message: 'Invalid password' });
            }
        } else {
            response.status(401).json({ message: 'Invalid email' });
        }
    } catch (error) {
        response.status(500).json({ message: 'Server Error' });
    }
});


// Get all admin
adminRouter.get('/account', authenticateAdmin, async (request, response) => {
    try {
        const admins = await Admin.find({});
        response.json(admins);
    } catch (error) {
        response.status(500).json({ message: 'Server Error' });
    }
});

// Get a single admin by ID
adminRouter.get('/account/:id', async (request, response) => {
    try {
        const admin = await Admin.findById(request.params.id);
        if (admin) {
            response.json(admin);
        } else {
            response.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        response.status(500).json({ message: 'Server Error' });
    }
});

// Update an admin information
adminRouter.put('/account/:id', async (request, response) => {
    try {
        const admin = await Admin.findById(request.params.id);
        if (admin) {
            admin.name = request.body.name || admin.name;
            admin.email = request.body.email || admin.email;
            if (request.body.password) {
                admin.password = request.body.password;
            }

            const updatedAdmin = await admin.save();
            response.json(updatedAdmin);
        } else {
            response.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        response.status(500).json({ message: 'Server Error' });
    }
});

// Delete an admin by ID
adminRouter.delete('/account/:id', async (request, response) => {
    try {
        const admin = await Admin.findById(request.params.id);
        if (admin) {
            await Admin.deleteOne({ _id: admin._id });
            response.json({ message: 'Admin removed' });
        } else {
            response.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
});


export default adminRouter;
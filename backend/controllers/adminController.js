import express from 'express';
import Admin from '../models/adminModel.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { generateAdminToken } from '../utils/token.js';
import cookie from 'cookie'

const adminRouter = express.Router();

// Create a new admin
adminRouter.post('/register', async (request, response) => {
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
        const admin = await Admin.findOne({ email })

        if (admin) {
            if (admin.password === password) {
                const token = generateAdminToken(admin)

                response.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    maxAge: 60 * 60,
                }));

                response.json({
                    token,
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                })
            } else {
                response.status(401).json({ message: 'Invalid password!' })
            }
        } else {
            response.status(401).json({ message: 'Invalid Email!' })
        }
    } catch (error) {
        console.log('Error:', error)
        response.status(500).json({ message: 'Server Error' });
    }
});

// Get admin data, the one's who logged in (cannot get other admin)
adminRouter.get('/profile', authenticateAdmin, async (request, response) => {
    try {

        const authenticatedAdmin = request.admin;

        const admin = await Admin.findById(authenticatedAdmin._id);

        if (!admin) {
            return response.status(404).json({ message: 'Admin not found' });
        }

        // Respond with the admin's profile
        response.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
        });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ message: 'Server Error' });
    }
});

// Get all admin (can get other admin)
adminRouter.get('/account', authenticateAdmin, async (request, response) => {
    try {
        const admins = await Admin.find({});
        response.json(admins);
    } catch (error) {
        response.status(500).json({ message: 'Server Error' });
    }
});

// Get a single admin by ID (can get other admin)
adminRouter.get('/account/:id', authenticateAdmin, async (request, response) => {
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

// Update admin profile (the one's who logged in)
adminRouter.put('/profile', authenticateAdmin, async (request, response) => {
    try {

        const authenticatedAdmin = request.admin;

        const admin = await Admin.findById(authenticatedAdmin._id);

        if (!admin) {
            return response.status(404).json({ message: 'Admin not found' });
        }

        admin.name = request.body.name || admin.name;
        admin.email = request.body.email || admin.email;

        await admin.save();

        response.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
        });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ message: 'Server Error' });
    }
});

// Update an admin information by ID (can get other admin)
adminRouter.put('/account/:id', authenticateAdmin, async (request, response) => {
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

// Delete admin (admin's personal account, (cannot get other admin))
adminRouter.delete('/profile', authenticateAdmin, async (request, response) => {
    try {
        const authenticatedAdmin = request.admin;

        const admin = await Admin.findById(authenticatedAdmin._id);

        if (!admin) {
            return response.status(404).json({ message: 'Admin not found' });
        }

        await admin.deleteOne();

        response.setHeader('Set-Cookie', cookie.serialize('token', '', {
            httpOnly: true,
            expires: new Date(0),
        }));

        response.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ message: 'Server Error' });
    }
});

// Delete an admin by ID (can delete other admin)
adminRouter.delete('/account/:id', authenticateAdmin, async (request, response) => {
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

//Logout admin and destroy cookie
adminRouter.post('/logout', async (request, response) => {

    response.setHeader('Set-Cookie', cookie.serialize('token', '', {
        httpOnly: true,
        expires: new Date(0),
    }));
    response.json({ message: 'Logged out successfully' });
});

export default adminRouter;
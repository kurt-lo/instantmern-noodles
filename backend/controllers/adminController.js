import express, { response } from 'express';
import Admin from '../models/adminModel.js';
import Product from '../models/productModel.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { generateAdminToken } from '../utils/token.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';
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

//FOR PRODUCT ROUTER STARTS
//DITO KO NA SINAMA KASI UNAUTHORIZED KAPAG NAKAHIWALAY, NEED MAY ADMIN SA URL PARA MA-ACCESS NG ADMIN

// @route   GET /api/admin/products
// @desc    Get all products
// @access  Private
adminRouter.get('/products', authenticateAdmin, async (request, response) => {
    try {
        const products = await Product.find({});
        response.json(products);
    } catch (error) {
        response.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/admin/products/:id
// @desc    Get a specific product by ID
// @access  Private
adminRouter.get('/products/:id', authenticateAdmin, async (request, response) => {
    try {
        const productId = request.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return response.status(404).json({ message: 'Product not found!' })
        }

        response.json(product);
    } catch (error) {
        response.status(500).json({ message: 'Server Error' });
    }
});
 
// @route   POST /api/admin/products
// @desc    Create new product
// @access  Private
adminRouter.post('/products', authenticateAdmin, uploadMiddleware, async (request, response) => {
    try {
        const { name, description, price } = request.body;

        if (!request.files || request.files.length === 0) {
            return response.status(400).json({ error: 'No files uploaded.' });
        }

        const productImage = request.files[0];

        const newProduct = new Product({
            name,
            description,
            price,
            imagePath: productImage.path,
        });

        const savedProduct = await newProduct.save();
        response.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
    }
});

// @route   PUT /api/admin/products/:id
// @desc    Update a product by ID
// @access  Private
adminRouter.put('/products/:id', authenticateAdmin, uploadMiddleware, async (request, response) => {
    try {
        const productId = request.params.id;
        const { name, description, price } = request.body;

        // Check if files were uploaded
        if (request.files && request.files.length > 0) {
            // Get the first uploaded file (assuming only one file is allowed for update)
            const productImage = request.files[0];

            // Update product with new data and imagePath
            const updateProduct = await Product.findByIdAndUpdate(
                productId,
                { name, description, price, imagePath: productImage.path },
                { new: true },
            );

            if (!updateProduct) {
                return response.status(404).json({ message: 'Product not found' });
            }

            response.json(updateProduct);
        } else {
            // No files were uploaded, update product without changing imagePath
            const updateProduct = await Product.findByIdAndUpdate(
                productId,
                { name, description, price },
                { new: true },
            );

            if (!updateProduct) {
                return response.status(404).json({ message: 'Product not found' });
            }

            response.json(updateProduct);
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/admin/products/:id
// @desc    DELETE a product by ID
// @access  Private
adminRouter.delete('/products/:id', authenticateAdmin, async (request, response) => {
    try {
        const productId = request.params.id;

        const deleteProduct = await Product.findByIdAndDelete(productId);

        if (!deleteProduct) {
            return response.status(404).json({ message: 'Product not found!' });
        };

        response.json({ message: 'Product deleted successfully! '});
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
});

export default adminRouter;
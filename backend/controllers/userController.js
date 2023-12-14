import express, { request, response } from 'express';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Cart from '../models/cartModel.js';
import Order from '../models/orderModel.js';
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

                // Set the token as a cookie in the response
                response.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    maxAge: 60 * 60, // Token expires in 1 hour
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

//FOR PRODUCT ROUTER, 
//DITO KO NA SINAMA KASI UNAUTHORIZED KAPAG NAKAHIWALAY, NEED MAY USERS SA URL PARA MA-ACCESS NG USERS

// @route   GET /api/users/products
// @desc    Get all products
// @access  Private
userRouter.get('/products', authenticateUser, async (request, response) => {
    try {
        const products = await Product.find({});
        response.json(products);
    } catch (error) {
        response.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/users/products/:id
// @desc    Get a specific product by ID
// @access  Private
userRouter.get('/products/:id', authenticateUser, async (request, response) => {
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

//FOR CART ROUTER
//DITO KO NA SINAMA KASI UNAUTHORIZED KAPAG NAKAHIWALAY, NEED MAY USERS SA URL PARA MA-ACCESS NG USERS

// @route   GET /api/users/cart
// @desc    Get Cart
// @access  Private
userRouter.get('/cart', authenticateUser, async (request, response) => {
    try {
        const userId = request.user._id;
        const userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        response.json(userCart);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/users/cart
// @desc    ADD Product to Cart
// @access  Private
userRouter.post('/cart/:productId', authenticateUser, async (request, response) => {
    try {
        const userId = request.user._id;
        const productId = request.params.productId;
        const { quantity } = request.body;

        //Fetch the user's cart
        let userCart = await Cart.findOne({ user: userId });
        // If the user doesn't have a cart, create one
        if (!userCart) {
            userCart = new Cart({ user: userId, items: [], totalAmount: 0 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product is already in the cart
        const existingProduct = userCart.items.find(item => item.itemId.equals(productId));
        if (existingProduct) {
            // If the product is already in the cart, update the quantity
            existingProduct.quantity += quantity || 1;
        } else {
            userCart.items.push({
                itemId: productId,
                name: product.name,
                quantity: quantity || 1,
                price: product.price,
            });
        }
        // Recalculate the total amount
        userCart.totalAmount = userCart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        await userCart.save();
        response.json(userCart);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/users/cart/:id
// @desc    DELETE Product to Cart
// @access  Private
userRouter.delete('/cart/:productId', authenticateUser, async (request, response) => {
    try {
        const userId = request.user._id;
        const productId = request.params.productId;

        const userCart = await Cart.findOne({ user: userId });
        if (!userCart || userCart.items.length === 0) {
            return res.status(404).json({ message: 'Cart not found or is empty' });
        }

        const itemIndex = userCart.items.findIndex(item => item.itemId.equals(productId));
        if (itemIndex === -1) {
            return response.status(404).json({ message: 'Product not found in the cart ' });
        }

        userCart.items.splice(itemIndex, 1);
        userCart.totalAmount = userCart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        await userCart.save();
        response.json(userCart);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/users/cart/:id
// @desc    REDUCE the Product by 1 to Cart
// @access  Private
userRouter.delete('/cart/reduce/:productId', authenticateUser, async (request, response) => {
    try {
        const userId = request.user._id;
        const productId = request.params.productId;

        const userCart = await Cart.findOne({ user: userId });
        if (!userCart || userCart.items.length === 0) {
            return response.status(404).json({ message: 'Cart not found or is empty ' });
        };

        const itemIndex = userCart.items.findIndex(item => item.itemId.equals(productId));
        if (itemIndex === -1) {
            return response.status(404).json({ message: 'Product not found in the cart ' });
        }

        const selectedItem = userCart.items[itemIndex];

        if (selectedItem.quantity > 1) {
            selectedItem.quantity -= 1;
        } else {
            userCart.items.splice(itemIndex, 1);
        }

        userCart.totalAmount = userCart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await userCart.save();
        response.json(userCart);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
});

userRouter.put('/cart/increase/:productId', authenticateUser, async (request, response) => {
    try {
        const userId = request.user._id;
        const productId = request.params.productId;

        const userCart = await Cart.findOne({ user: userId });
        if (!userCart || userCart.items.length === 0) {
            return response.status(404).json({ message: 'Cart not found or is empty' });
        }

        const itemIndex = userCart.items.findIndex(item => item.itemId.equals(productId));
        if (itemIndex === -1) {
            return response.status(404).json({ message: 'Product not found in the cart ' });
        }
        //Increment the items in cart
        userCart.items[itemIndex].quantity += 1;

        userCart.totalAmount = userCart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await userCart.save();
        response.json(userCart);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
});

//___ORDER ROUTES____

// @route   GET /api/order
// @desc    Get all orders for the authenticated user
// @access  Private
userRouter.get('/order', authenticateUser, async (request, response) => {
    try {
        const userId = request.user._id;

        const orders = await Order.find({ user: userId }).populate('items.itemId');
        response.json(orders);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/order/:orderId
// @desc    Get details of a specific order
// @access  Private
userRouter.get('/order/:orderId', authenticateUser, async (request, response) => {
    try {
        const userId = request.user._id;
        const orderId = request.params.orderId;

        // Find the order for the given user
        const order = await Order.findOne({ _id: orderId, user: userId }).populate('items.itemId');
        if (!order) {
            return response.status(404).json({ message: 'Order not found' });
        }
        response.json(order);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/order/checkout
// @desc    Checkout and create an order
// @access  Private
userRouter.post('/order/checkout', authenticateUser, async (request, response) => {
    try {
        const userId = request.user._id;

        // Find the user cart
        const userCart = await Cart.findOne({ user: userId }).populate('items.itemId');
        if (!userCart || userCart.items.length === 0) {
            return response.status(404).json({ message: 'Cart not found or is empty' });
        }

        // Create a new order instance
        const newOrder = new Order({
            user: userId,
            items: userCart.items.map((cartItem) => ({
                itemId: cartItem.itemId,  // Reference to the Product model
                name: cartItem.name,
                quantity: cartItem.quantity,
                price: cartItem.price,
            })),
            totalAmount: userCart.totalAmount,
        });

        // Save the order
        const savedOrder = await newOrder.save();

        // Clear cart after checkout
        userCart.items = [];
        userCart.totalAmount = 0;
        await userCart.save();

        response.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
});

export default userRouter;

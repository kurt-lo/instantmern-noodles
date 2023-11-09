import express from "express";
import dotenv from 'dotenv'
import userRoutes from './controllers/userController.js'
import adminRoutes from './controllers/adminController.js'
import cookieParser from "cookie-parser";
import connectDB from './db/db.js'
import adminUserRouter from "./controllers/access/adminAccessUsers.js";

dotenv.config();

const port = process.env.PORT;

connectDB()

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

// User routes
app.use('/api/users', userRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

//Admin route for accessing user data
app.use('/api/admin/access-users', adminUserRouter)

app.get('/', (request, response) => response.send('Backend is ready!'))

app.listen(port, () => console.log(`Backend is connected to port: ${port}`))
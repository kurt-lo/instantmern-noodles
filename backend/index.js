import express from "express";
import dotenv from 'dotenv'
import userRoutes from './controllers/userController.js'
import adminRoutes from './controllers/adminController.js'
import cookieParser from "cookie-parser";
import connectDB from './db/db.js'
import adminUserRouter from "./controllers/access/adminAccessUsers.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT;

connectDB()

const app = express();

app.use(cors({
    origin: 'https://mern-stack-frontend-kohl.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

// Serve static files from the 'uploads' directory, para ma render sa frontend yung image
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// User routes
app.use('/api/users', userRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

//Admin route for accessing user data
app.use('/api/admin/access-users', adminUserRouter)

//Product routes for admin
// app.use('/api/admin/product', productRoutes) //needs admin in the url para gumana kung admin lang makaka-access

//Product routes for admin
// app.use('/api/users/product', productRoutes) //needs users in the url para gumana kung admin lang makaka-access

//Cart routes
// app.use('/api/cart', cartRoutes)

app.get('/', (request, response) => response.send('Backend is ready!'))

app.listen(port, () => console.log(`Backend is connected to port: ${port}`))
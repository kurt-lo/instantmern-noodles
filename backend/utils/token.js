import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();
// Your secret key (store it securely and use environment variables)
const secretKey = process.env.JWT_SECRET;

// Function to generate a JWT token for a user
export function generateUserToken(user) {
  // User role should be 'user'
  const payload = {
    _id: user._id,
    role: 'user',
  };
  
  return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
}

// Function to generate a JWT token for an admin
export function generateAdminToken(admin) {
  // Admin role should be 'admin'
  const payload = {
    _id: admin._id,
    role: 'admin',
  };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
}

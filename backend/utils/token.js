import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();
const secretKey = process.env.JWT_SECRET;

// Function to generate a JWT token for a user
export function generateUserToken(user) {
  const payload = {
    _id: user._id,
    role: 'user',
  };
  
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// Function to generate a JWT token for an admin
export function generateAdminToken(admin) {
  const payload = {
    _id: admin._id,
    role: 'admin',
  };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

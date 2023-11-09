import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization') || req.cookies.token;

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        req.user = decoded;
        if (decoded.role === 'user') {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export const authenticateAdmin = (req, res, next) => {
    const token = req.header('Authorization') || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.admin = decoded;
        if (decoded.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

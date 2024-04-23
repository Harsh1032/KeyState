const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
 
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedToken; // Attach user information to req object
        next(); // Call the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = {
    verifyToken
}
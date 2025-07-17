const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
console.log("Auth Header:", authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(400).json({ message: 'Authentication failed: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach decoded user data to request
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Authentication failed: Invalid or expired token' });
    }
};

module.exports = authenticateToken;

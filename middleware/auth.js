const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Support both "Bearer <token>" and direct token string
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (token !== process.env.AUTH_TOKEN) {
    return res.status(403).json({ message: 'Invalid token.' });
  }

  next();
};

module.exports = authenticate;

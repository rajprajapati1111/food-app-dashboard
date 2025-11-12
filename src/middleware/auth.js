const jwt = require('jsonwebtoken');
const secret = "MY_SECRET_KEY"; 

// Verify token middleware
module.exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.admin = decoded;
    next();
  } catch (err) {
    console.log('JWT Error:', err);
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

const jwt = require('jsonwebtoken');


const isAuthenticated = (req, res, next) => {
    const token = req.header('x_auth_token');

    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET)
            req.user = decodedToken;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'user not authenticated' })
        }
    }
    else {
        return res.status(401).json({ message: 'user not authenticated.' })
    }
}

module.exports = { isAuthenticated };
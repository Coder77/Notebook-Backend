var jwt = require('jsonwebtoken');
const JWT_SECRET = "AapkaHardikSwagatHai"

const fetchUser = (req, res, next) => {
    // Get the user from jwt token 
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send({error: "Please authenticate using valid token"});
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;   
    } catch (error) {
        console.log(error);
        res.status(401).send({error: "Please authenticate using valid token"}); 
    }
    // Add id to req body
    next();
}
module.exports = fetchUser;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
   /// console.log(token)
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  
    const token = authHeader.split(' ')[1];
 
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {   
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.UserInfo.username;
            req.familyname = decoded.UserInfo.familyname;
            req.roles = decoded.UserInfo.roles;
            req.userId = decoded.UserInfo.userID;
            req.email = decoded.UserInfo.email;
            req.structure = decoded.UserInfo.structure;
            req.wilaya = decoded.UserInfo.wilaya;
            next();
        }
    );
}

module.exports = {verifyJWT}
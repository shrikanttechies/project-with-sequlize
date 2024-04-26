const jwt = require('jsonwebtoken');
const S_key = "qwertygfdsazxcvb";

const authrized = (req,res,next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({error:"Token Not Available"});
    }
    jwt.verify(token,S_key,(err,user)=>{
        if (err) {
            return res.status(403).json({error:"Invalid Token"})
        }
        req.user = user;
        next();
    })
};



module.exports = authrized ;
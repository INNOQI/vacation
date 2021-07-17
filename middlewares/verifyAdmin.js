const jwt = require('jsonwebtoken')

const adminOnly = (req, res, next) =>{
    jwt.verify(
        req.headers.authorization,
        process.env.TOKEN_SECRET,
        (err, payload)=>{
            if (err) {
                return res.status(401).send(err)
            }
            req.user = payload
            
            if (req.user.role != 1) {
                return res.status(401).send(err)
            }
            next()
    } )
}

module.exports = {adminOnly}
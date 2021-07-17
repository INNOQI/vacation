const jwt = require('jsonwebtoken')

const usersOnly = (req, res, next) =>{
    jwt.verify(
        req.headers.authorization,
        process.env.TOKEN_SECRET,
        (err, payload)=>{
            if (err) {
                console.log(err)
                return res.status(401).send(err)
            }
            req.user = payload
            // console.log(req.user)

            next()
    } )
}

module.exports = {usersOnly}
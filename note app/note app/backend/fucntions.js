const jwt = require("jsonwebtoken")


const authenticationToken = (req , res , next) =>{
    const authHeader = req.get("authorization")
    const token = authHeader && authHeader.split(" ")[1]

    if(!token)
        return res.sendStatus(401)

    jwt.verify(token , process.env.SECRET , (err , user) =>{
        if(err)
            return res.sendStatus(401);

        req.user=user
        next()
    })
}


module.exports = {
    authenticationToken
}
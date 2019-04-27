const {Users} = require('../models/Users')

const authenticateUser = function(req, res, next){
    // console.log(req.header)
    const token = req.header('x-auth')
        Users.findByToken(token)
            .then(function(user){
                // console.log(user)
                if(user){
                    req.user = user
                    req.token = token
                    next()
                }
                else {
                    res.status('401').send({notice: 'token not avaliable'})
                }
            })
            .catch(function(err){
                res.status('401').send(err)
            })
    
}

module.exports = {
    authenticateUser
}
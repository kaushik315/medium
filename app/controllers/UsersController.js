const express = require('express')
const router = express.Router()
const {Users}  = require('../models/Users')

const {authenticateUser} = require('../middlewares/authentication')

router.get('/account', authenticateUser, function(req,res){
    const {user} = req
    // console.log("inside account get")
    res.send(user)
})


router.put("/new/follow" , authenticateUser, function(req,res){
    const {userid} = req.body
    const followinguser = req.user._id
    const followingUserUpdate = req.user
    // console.log(userid)
    let tobeUpdatedUser = {}
    Users.findById(userid)
        .then((user) => {
            // console.log(user)
            tobeUpdatedUser = user
            // console.log(tobeUpdatedUser)
        })
        .catch((err) => {
            console.log(err)
        })
        setTimeout(() => {
            followingUserUpdate.following.push(userid)
            Users.findByIdAndUpdate(followinguser, {$set: followingUserUpdate})
                .then(() => {
                    console.log("following")
                })
                .catch(() => {
                    console.log("didn't add in following")
                })
            // console.log(followinguser)
            tobeUpdatedUser.followers.push(followinguser)
            // console.log("inside then", tobeUpdatedUser)
            const id = tobeUpdatedUser._id
            Users.findByIdAndUpdate({_id: id}, {$set: tobeUpdatedUser})
                .then((upuser) => {
                    // console.log("inside update then")
                    // console.log(upuser)
                    res.send(upuser)
                })
                .catch((err) => {
                    console.log("Not updated")
                })
        },1000)
       
})

router.put("/new/unfollow", authenticateUser, function(req, res){
    const {userid} = req.body
    console.log(userid)
    Users.findOne({_id: userid})
        .then((user) => {
            let deleteIndex = 0
            for(let i=0; i < user.followers.length; i++){
                if(user.followers[i] == req.user._id){
                    deleteIndex = i
                }
            }
            user.followers.splice(deleteIndex,1)
            return user
        })
        .then((user) => {
            console.log(user)
            Users.findByIdAndUpdate(user._id, {$set: user})
                .then((upuser) => {
                    console.log(upuser)
                    return upuser
                })
                .catch((err) => {
                    console.log("didn't update user unfollow")
                })
        })
        .then((upuser) => {
            Users.findOne({_id: req.user._id})
                .then((followinguser) => {
                    let deleteIndex = 0
                    console.log("inside unfollowing delete then")
                    for(let i=0; i < followinguser.following.length; i++){
                        if(followinguser.following[i] == req.user._id){
                            deleteIndex = i
                        }
                    }
                    followinguser.following.splice(deleteIndex,1)
                    Users.findByIdAndUpdate(followinguser._id, {$set: followinguser})
                        .then((followingupuser) => {
                            console.log(upuser)
                            // return upuser
                        })
                        .catch((err) => {
                            console.log("didn't update user unfollow")
                        })
                    // console.log(followinguser)
                    res.send(upuser)
                })
                .catch((err) => {
                    console.log(err)
                })
        })
        .catch((err) => {
            console.log("unfollow findone didnt work")
        })
})

router.get("/:id", authenticateUser, function(req,res){
    const id = req.params.id
    // console.log(id)
    Users.findOne({_id: id})
        .then((user) => {
            // console.log(user)
            let result = {
                requiredUser: user,
                requestedUser: req.user._id
            }
            res.send(result)
        })
        .catch((err) => {
            res.send(err)
        })
})
router.post('/register', function(req, res){
    const body = req.body
    const user = new Users(body)
    user.save()
        .then(function(user){
            res.send(user)
        })
        .catch(function(err){
            res.send(err.message)
        })
})


//localhost:3000/user/login
router.post('/login', function(req,res){
    const body = req.body
    Users.findByCredentials(body.email, body.password)
        .then(function(user){
            return user.generateToken()
        })
        .then(function(token){
            res.send(token) 
        })
        .catch(function(err){
            res.status('404').send(err)
        })
})

//localhost://3000/user/account



//localhost:3000/user/logout
router.delete('/logout', authenticateUser, function(req, res){
    const {user, token} = req    
    Users.findByIdAndUpdate(user._id, {$pull: {tokens: {token: token}}})
        .then(function(){
            res.send({notice: 'Logout successful'})
        })
        .catch(function(err){
            res.send(err)
        })
})
module.exports = {
    usersRouter: router
}
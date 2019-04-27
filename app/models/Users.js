const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        //check the format of the email
        validate: {
            validator: function(value){
                return validator.isEmail(value)
            },
            message: function(){
                return 'invalid email format'
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128
    },
    stories: [{
        type: Schema.Types.ObjectId,
        ref: "Stories"
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: "Users"
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: "Users"
    }],
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: "Stories"
    }],
    clappedStories: [{
        type: Schema.Types.ObjectId,
        ref: "Stories"
    }],
    tokens: [
        {
            token: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

//pre hooks
userSchema.pre('save', function(next){
    const user = this
    if(user.isNew){
        bcryptjs.genSalt(10)
        .then(function(salt){
            bcryptjs.hash(user.password, salt)
                .then(function(encryptedPassword){
                    user.password = encryptedPassword
                    next()
                })
        })
    }
    else {
        next()
    }
})

// defining our own static method
userSchema.statics.findByCredentials = function(email, password){
    const User = this
    return User.findOne({ email }) //User.findOne({email: email}) // using es6 consice properties
                .then(function(user){
                    if(!user){
                        return Promise.reject({notice: 'invalid email / password'})
                    }
                    return bcryptjs.compare(password, user.password)
                                .then(function(result){
                                    if(result){
                                        return Promise.resolve(user)
                                    }
                                    else{
                                        return Promise.reject({notice: 'invalid email /password'})
                                    }
                                })
                })
                .catch(function(err){
                    return Promise.reject(err)
                })

}
//static method for checking the token
userSchema.statics.findByToken = function(token){
    const User = this
    let tokenData
    try {
        tokenData = jwt.verify(token, 'jwt@123')
    } catch (error) {
        return Promise.reject(error)
    }
    return User.findOne({
        _id: tokenData._id,
        'tokens.token': token
    })
}

// defining our own instance method
userSchema.methods.generateToken = function(){
    const user = this
    const tokenData = {
        _id: user._id,
        username: user.username,
        createdAt: Number(new Date())
    }
    const token = jwt.sign(tokenData, 'jwt@123')
    user.tokens.push({
        token
    })
    return user.save()
        .then(function(user){
            return Promise.resolve(token)
        })
        .catch(function(err){
            Promise.reject(err)
        })
}

const Users = mongoose.model('Users', userSchema)

module.exports = {
    Users
}
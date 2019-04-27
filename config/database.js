const mongoose = require("mongoose")

mongoose.Promise = global.Promise

mongoose.connect("mongodb://localhost:27017/project-blog-data", {useNewUrlParser: true})
    .then(function(){
        console.log("Connected to DB")
    })
    .catch(function(){
        console.log("OOPS!!! Something went wrong")
    })

module.exports = { 
    mongoose
}
const express = require("express")
const router = express.Router()
const { Stories } = require("../models/Stories")
const { Tags } = require("../models/Tags")
const { Topics } = require("../models/Topics")

const { authenticateUser } = require("../middlewares/authentication")


router.get("/", function(req, res){
    Stories.find()
        .then(function(stories){
            res.send(stories)
        })
        .catch(function(err){
            res.send(err)
        })
})

router.get("/:id", function(req, res){
    const id = req.params.id
    Stories.findById(id)
            .populate('tags')
            // .populate("user")
        .then(function(story){
            res.send(story)
        })
        .catch(function(err){
            res.send(err)
        })
})
router.get("/edit/:id", authenticateUser, function(req, res){
    const id = req.params.id
    Stories.findById(id).populate('tags')
        .then(function(story){
            console.log(story.user, req.user._id)
            let sendData = {}
            sendData.story = story
            sendData.userId = req.user._id
            console.log(sendData)
            res.send(sendData)
        })
        .catch(function(err){
            res.send(err)
        })
})
router.put("/add-new-comment", authenticateUser, function(req, res){
    const userId = req.user._id
    const storyId = req.body.storyId
    
    const response = {}
    response.user = userId
    response.body = req.body.response
    console.log(response)
    // Stories.findOneAndUpdate({_id: storyId}, {$push: {responses: response}})
    //     .then((story) => {
    //         // console.log(story)
    //     })
    //     .catch((err) => {
    //         console.log("find by id and update didnt work")
    //     })
    Stories.findById(storyId)  
        .then((story) => {
            story.responses.push(response)
            story.save()
                .then((savedstory) => {
                    res.send(savedstory)
                })
                .catch((err) => {
                    console.log(err)
                })
        })
        .catch((err) => {
            console.log("find by id didnt work")
        })
})
router.post("/add-new-story", authenticateUser , function(req, res){
    
    
    const body = req.body
    // console.log(body)
    const tags = body.tags
    body.tags = []
    body.user = req.user._id
    tags.forEach(loopedtag => {
        tag = {
            name: loopedtag
        }
        newTag = new Tags(tag)
        newTag.save()
            .then((result) => {
                body.tags.push(result._id)
            })
            .catch((err) => {
                console.log(err)
            })
    });
    
    setTimeout(() => {
        // console.log(body)
    const newStory = new Stories(body)
    newStory.save()
        .then((savedStory) => {
            res.send(savedStory)
        })
        .catch((err) => {
            res.send(err)
        })
    },1000)
    
})
router.put("/:id", authenticateUser, function(req,res){
    const body = req.body
    const id = req.params.id
    // console.log('put function encountered')
    const tags = body.tags
    body.tags = []
    tags.forEach(loopedtag => {
        tag = {
            name: loopedtag
        }
        newTag = new Tags(tag)
        newTag.save()
            .then((result) => {
                body.tags.push(result._id)
            })
            .catch((err) => {
                console.log(err)
            })
    });
    setTimeout(() => {
        // console.log(body)

    Stories.findOneAndUpdate({
        user: req.user._id,
        _id: id
    }, {$set: body}, {runValidators: true})
    .then((result) => {
        // console.log(result)
        res.send(result)
    })
    .catch((err) => {
        // console.log(err.message)
        res.send(err)
    })
},1000)

})

router.delete("/:id", authenticateUser, function(req, res){
    const id = req.params.id
    const user = req.user
    Stories.findById(id)
        .then((story) => {
            console.log(story.user, user._id)
            if(user._id == story.user){
                console.log("if entered")
                Stories.findOneAndDelete({
                    user: req.user._id,
                    _id: id
                    })
                    .then((deletedstory) => {
                        res.send(deletedstory)
                    })
                    .catch((err) => {
                        res.send(err)
                    } )
            }
            else{
                res.send({notice: "You are not the author"})
            }
        })
        .catch((err) => {
            res.send(err)
        })
    
})


module.exports = {
    storiesRouter: router
}
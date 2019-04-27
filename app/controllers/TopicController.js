const express = require("express")
const router = express.Router()
const { Topics } = require("../models/Topics")

router.post('/', function(req, res){
    const body = req.body
    const topic = new Topics(body)
    topic.save()
        .then((topic) => {
            res.send(topic)
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get("/", function(req, res){
    Topics.find()
        .then((topics) => {
            res.send(topics)
        })
        .catch((err) => {
            console.log(err)
        })
})

module.exports = {
    topicRouter: router
}
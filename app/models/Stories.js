const mongoose = require("mongoose")
const Users = require("./Users")
const { responseSchema } = require("./Responses")
const Schema = mongoose.Schema

const storiesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: Object,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    createdDate: {
        type: String,
        default: new Date(),
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false,
        required: true
    },
    publishedDate: {
        type: String
    },
    previewImageUrl: {
        type: String
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: "Topics",
        required: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tags"
    }],
    responses: [responseSchema],
    claps: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "Users"
        },
        count: {
            type: Number,
            max: 5
        }
    }]
})

storiesSchema.post("save", function(next){
    story = this
    userid = story.user
    console.log(userid," inside post save")
    if(story.isNew){
        Users.findOne({_id: userid})
        .then((user) => {
            console.log("inside findbyid")
            user.stories.push(story._id)
            Users.findOneAndUpdate({
                _id: user._id
            }, {$set: user})
                .then(() => {
                    console.log("update successful")
                })
                .catch((err) => {
                    console.log("not successful")
                })
        })
        .catch((err) => {
            console.log("findbyid not working")
        })
    }
    
})

const Stories = mongoose.model("Stories", storiesSchema)

module.exports = {
    Stories
}
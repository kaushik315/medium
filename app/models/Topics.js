const mongoose = require("mongoose")

const Schema = mongoose.Schema

const topicSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const Topics = mongoose.model("topics", topicSchema)

module.exports = {
    Topics
}
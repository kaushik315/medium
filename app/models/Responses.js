const mongoose = require("mongoose")

const Schema = mongoose.Schema

const responseSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: new Date(),
        required: true
    }
})

const Responses = mongoose.model("Responses", responseSchema)

module.exports = {
    responseSchema,
    Responses
}
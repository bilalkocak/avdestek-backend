const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const advertSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    candidates: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        },
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "Message",
            default: []
        }
    ],
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    city: {
        type: Number,
        ref: "City",
        required: true
    },
    salary: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    caseDate: {
        type: Date,
        required: true,
    },
    assignedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    isDone: {
        type: Boolean,
        default: false,
    },

});

mongoose.model("Advert", advertSchema);

module.exports = mongoose;

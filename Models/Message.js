const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    channelId: {
        type: String,
        required: true,
        unique: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    advert: {
        type: Schema.Types.ObjectId,
        ref: "Advert",
        required: true
    }
});

mongoose.model("Message", messageSchema);

module.exports = mongoose;

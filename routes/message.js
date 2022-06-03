const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Message = mongoose.model("Message");
const Advert = mongoose.model("Advert");
// Create message
router.post("/create", function (req, res, next) {
    const { receiver, sender, advert } = req.body;
    console.log(req.body);
    console.log(`${sender}_${receiver}`);

    new Message({
        receiver: receiver,
        sender: sender,
        channelId: `${advert}_${sender}`,
        advert: advert
    }).save((error, _message) => {
        if (error) {
            console.log("Hata", error);
            res.status(400).send({
                error,
            });
        } else {
            Advert.findByIdAndUpdate(advert, {
                $push: {
                    messages: _message._id
                }
            }, { upsert: true, new: true }, (error, next) => {
                if (error) {
                    res.status(400).send(error);
                } else {
                    res.status(201).send({
                        _message,
                    });
                }
            });
        }
    })
});

// Get user's messages
router.get("/:userId", function (req, res, next) {
    const userId = req.params.userId;

    Message.find({
        $or: [{
            sender: userId
        },
        {
            receiver: userId
        }
        ],
        $and: [{
            isActive: true
        }]
    }, (error, messageList) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send({
                list: messageList
            });
        }
    }).populate(["sender", "receiver", "advert", {
        path: "sender",
        populate: {
            path: "city",
        }
    },
        {
            path: "advert",
            populate: {
                path: "city"
            }
        },
        {
            path: "advert",
            populate: {
                path: "user"
            }
        },
        {
            path: "receiver",
            populate: {
                path: "city",
            }
        }]);
});


// Get all messages
router.get("/", function (req, res, next) {
    Message.find({
        $and: [{
            isActive: true
        }]
    }, (error, messageList) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send({
                list: messageList
            });
        }
    }).populate(["sender", "receiver", {
        path: "sender",
        populate: {
            path: "city",
        }
    },
        {
            path: "receiver",
            populate: {
                path: "city",
            }
        },
        {
            path: "advert",
            populate: {
                path: "city",
            }
        },
        "advert"
    ]);
});

// Check message exist
router.get("/check/:channelId", function (req, res, next) {
    const channelId = req.params.channelId;

    Message.findOne({
        channelId: channelId,
        isActive: true
    }, (error, message) => {
        if (error) {
            res.status(400).send(error);
        } else {

            res.status(200).send({
                isExist: message ? true : false
            });
        }
    })
});





module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Advert = mongoose.model("Advert");
const City = mongoose.model("City");
const User = mongoose.model("User");

// Create Advert collection
router.post("/create", function (req, res, next) {
    const adverts = req.body;

    new Advert({ ...adverts }).save((error, _advert) => {
        if (error) {
            res.status(400).send({
                error,
            });
        } else {
            res.status(201).send({
                _advert,
            });
        }
    })
});


router.get("/:userId", function (req, res, next) {
    const userId = req.params.userId;
    const isActive = req.query.isActive;

    Advert.find({
        user: userId,
        isActive: isActive
    }, (error, advertList) => {
        if (error) {
            console.log("Hata", error);
            res.status(400).send(error);
        } else {
            res.status(200).send({
                list: advertList
            });
        }
    }).populate([
        "city",
        "user",
        {
            path: "user",
            populate: {
                path: "city",
            }
        },
        {
            path: "candidates",
        },
        {
            path: "candidates",
            populate: {
                path: "city"
            }
        }
    ]);
});


// Şehir bazlı ilan getirme 

router.get("/city/:cityId", function (req, res, next) {
    const cityId = req.params.cityId;

    Advert.find({
        city: cityId
    }, (error, advertList) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send({
                list: advertList
            });
        }
    }).populate(["city", "user", {
        path: "user",
        path: "assignedUser",
        populate: {
            path: "city",
        }
    }]);
});

router.post("/application", function (req, res, next) {
    const advertId = req.body.advertId;
    const userId = req.body.userId;


    Advert.findByIdAndUpdate(advertId, {
        $push: {
            candidates: userId
        }
    }, { upsert: true, new: true }, (error, next) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(201).send({
                advert: next
            });
        }
    });
});

// assign to user
router.post("/assign", function (req, res, next) {
    const advertId = req.body.advertId;
    const userId = req.body.userId;

    Advert.findByIdAndUpdate(advertId, {
        $set: {
            assignedUser: userId
        }
    }, { upsert: true, new: true }, (error, next) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(201).send({
                advert: next
            });
        }
    });
});

// get advert
router.get("/single/:advertId", function (req, res, next) {
    const advertId = req.params.advertId;
    console.log(advertId);

    Advert.findById(advertId, (error, advert) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send({
                advert
            });
        }
    }).populate(["city", "user",
        {
            path: "candidates",
        },
        {
            path: "user",
            populate: {
                path: "city",
            }
        },
        {
            path: "candidates",
            populate: {
                path: "city"
            }
        }, {
            path: "user",
            path: "assignedUser",
            populate: {
                path: "city",
            }
        }]);
});

// done advert then increment user success count
router.post("/done", function (req, res, next) {
    const advertId = req.body.advertId;
    const userId = req.body.userId;

    console.log(advertId)


    Advert.findByIdAndUpdate(advertId, {
        isDone: true
    }, (error, _next) => {
        if (error) {
            console.log("Hata", error);
            res.status(400).send(error);
        } else {
            console.log("Başarılı", _next);
        }
    });
    User.findByIdAndUpdate(userId, {
        $inc: {
            successCount: 1
        }
    }, (error, next) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(201).send({
                user: next
            });
        }
    });
});


// get users done adverts
router.get("/done/:userId", function (req, res, next) {
    const userId = req.params.userId;

    Advert.find({
        user: userId,
        isDone: true
    }, (error, advertList) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send({
                list: advertList
            });
        }
    }).populate(["city", "user", {
        path: "user",
        path: "assignedUser",
        populate: {
            path: "city",
        }
    }]);
});





module.exports = router;

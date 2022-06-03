const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const User = mongoose.model("User");
const Confirm = mongoose.model("Confirmation");
const City = mongoose.model("City");
const Advert = mongoose.model("Advert");

const md5 = require("md5");
const e = require("express");

/* GET users listing. */
/* router.get('/', function (req, res, next) {
    res.send(
        {
            "users": [
                {
                    "id": 1,
                    {"nidame,label: "Leanne Graham"},
                    {"emidail,label: ""},
                    {"telephidone,label: ""},
                    {"baroNumidber,label: ""},
                    {"cidity,label: ""},
                    "isActive": true,
                }]
        }
    );
}); */

// Get all users
router.get("/", function (req, res, next) {
  const _users = [];
  User.find({}, (error, users) => {
    if (error) {
      res.status(400).send({
        error,
      });
    } else {
      users.map((user) => {
        delete user.password;
        _users.push(user);
      });
      res.status(200).send({
        users: _users,
      });
    }
  });
});

// Gets all active users
router.get("/active", function (req, res, next) {
  const _users = [];
  User.find({ isActive: true }, (error, users) => {
    if (error) {
      res.status(400).send({
        error,
      });
    } else {
      users.map((user) => {
        delete user.password;
        _users.push(user);
      });
      res.status(200).send({
        users: _users,
      });
    }
  });
});

// Gets all inactive users
router.get("/inactive", function (req, res, next) {
  const _users = [];
  User.find({ isActive: false }, (error, users) => {
    if (error) {
      res.status(400).send({
        error,
      });
    } else {
      users.map((user) => {
        delete user.password;
        _users.push(user);
      });
      res.status(200).send({
        users: _users,
      });
    }
  });
});

// Get a user by id
router.get("/:id", function (req, res, next) {
  User.findById({ _id: req.params.id }, (error, user) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.status(200).send(user);
    }
  });
});

// Create a new user
router.post("/", async function (req, res, next) {
  const _city = await City.findById(req.body.city);
  const _user = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: md5(req.body.password),
    telephone: req.body.telephone,
    baroNumber: req.body.baroNumber,
    citizenId: req.body.citizenId,
    city: _city,
    isActive: false,
  };

  new User(_user).save((error, user) => {
    if (error) {
      console.log(error);
      res.status(400).send({
        ...error,
      });
    } else {
      delete _user.password;
      res.status(201).send({
        user,
      });
    }
  });
});

// confirm user
router.post("/confirm", async function (req, res, next) {
  console.log(req.body);
  const confirm = await Confirm.findOne({
    user: req.body.id,
  });
  console.log(confirm.code.toString());
  console.log(req.body.code)

  if (confirm.code.toString() === req.body.code) {
    console.log("code is correct");
    User.findByIdAndUpdate(req.body.id, {
      isActive: true,
    }, (error, user) => {
      if (error) {
        res.status(400).send(error);
      } else {
        Confirm.findByIdAndUpdate(confirm._id, {
          confirmed: true,
        }, (error, confirm) => {
          if (error) {
            res.status(400).send(error);
          } else {
            res.status(200).send({
              confirm,
            })
          };
        });
      }
    });
  } else {
    res.status(400).send({
      error: "Invalid code",
    });
  }

});

// Delete a user by id
router.delete("/:id", function (req, res, next) {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { isActive: false, isBanned: true },
    { new: true },
    (error, next) => {
      if (error) {
        res.status(400).send({
          error: "Did not delete",
        });
      } else {
        res.status(200).send({
          res: "Deleted",
          _id: req.params.id,
        });
      }
    }
  );
});

router.put("/:id", function (req, res, next) {
  const { isPassive, city } = req.body;


  User.findOneAndUpdate(
    { _id: req.params.id },
    { city, isPassive },
    { new: true },
    (error, next) => {
      if (error) {
        console.log(error)
        res.status(400).send({
          error: "Did not update",
          errObj: { ...error },
        });
      } else {
        res.status(201).send({
          result: "User updated",
          user: next,
        });
      }
    }
  );

});

router.put("/activate/:id", function (req, res, next) {
  if (req.params.id) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { isActive: true },
      { new: true },
      (error, next) => {
        if (error) {
          res.status(400).send({
            error: "User did not activate",
            errObj: { ...error },
          });
        } else {
          res.status(201).send({
            result: "User is activated",
            user: next,
          });
        }
      }
    );
  } else {
    res.status(400).send({
      error: "id can not be null",
    });
  }
});

router.put("/join", function (req, res, nex) {
  const { userId, groupId } = req.body;

  User.findOneAndUpdate(
    { _id: userId },
    { $push: { groups: groupId } },
    (error, next) => {
      if (error) {
        res.status(400).send({
          error: "Did not update",
        });
      } else {
        Group.findOneAndUpdate(
          { _id: groupId },
          { $push: { users: userId } },
          (error, next) => {
            if (error) {
              res.status(400).send({
                error: "Did not update",
              });
            } else {
              res.status(200).send({
                res: "Joined user to group",
              });
            }
          }
        );
      }
    }
  );
});

router.post("/login", function (req, res, next) {
  let reqObj = {};
  if (req.body.email) {
    reqObj.email = req.body.email;
  }

  User.findOne(reqObj, (error, user) => {
    if (!user) {
      res.status(401).send({
        result: "Invalid user",
      });
    } else {
      if (user.password === md5(req.body.password)) {
        res.status(200).send({
          result: "Valid user",
          user,
        });
      } else {
        res.status(401).send({
          result: "Invalid user"
        });
      }
    }
  }).populate("city");
});


// Get my possible adverts
router.get("/:id/adverts", async function (req, res, next) {

  const user = await User.findById(req.params.id);
  Advert.find({ city: user.city })
    .populate(["user", {
      path: 'candidates'
    }, {
        path: 'city'
      }, "user", {
        path: "user",
        populate: {
          path: "city",
        }
      }])
    .then(adverts => {
      res.status(200).send({
        adverts
      });
    })
    .catch(error => console.log(error));

});


module.exports = router;

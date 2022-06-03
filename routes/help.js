const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const { use } = require("express/lib/router");
const Confirmation = mongoose.model("Confirmation");
const User = mongoose.model("User");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tevkildestek@gmail.com",
    pass: process.env.MAIL_PASSWORD,
  },
});
router.post("/confirm", async function (req, res, next) {
  const { user_id } = req.body;
  const user = await User.findByIdAndUpdate(user_id, { waitingConfirm: false });


  new Confirmation({ user: user }).save((error, confirmation) => {
    const sendMail = async () => {
      await transporter.sendMail(
        {
          from: '"tevkildestek@gmail.com',
          to: user.email,
          subject: "Üyelik Onayı",
          html: `<div> <div>Onay kodunuz: <b>${confirmation.code}</b>. Uygulamaya giriş yapabilirsiniz.</div> </div>`, // html body
        },
        (error, info) => {
          if (error) {
            console.log("Mail not sent", error);
            res.send("Mail not sent");
          }
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
      );
    };
    sendMail().then(() => {
      res.status(201).send({
        message: "Mail sent",
        confirmation: confirmation,
      });
    });
  });
});

router.get("/", async function (req, res, next) {
  const user = await User.find({
    waitingConfirm: true,
    isBanned: false,
  }).populate("city");
  res.status(200).send({
    user,
  });
});


router.get("/confirmed", async function (req, res, next) {
  const user = await User.find({
    confirmed: false,
    waitingConfirm: false,
    isBanned: false,
  }).populate("city");
  res.status(200).send({
    user,
  });
});


// ban user
router.post("/ban", async function (req, res, next) {
  const { user_id } = req.body;
  const user = await User.findByIdAndUpdate(user_id, { isBanned: true });
  res.status(200).send({
    user,
  });
});

// unban user
router.post("/unban", async function (req, res, next) {
  const { user_id } = req.body;
  const user = await User.findByIdAndUpdate(user_id, { isBanned: false });
  res.status(200).send({
    user,
  });
});



// get banned users
router.get("/banned", async function (req, res, next) {
  const user = await User.find({
    isBanned: true,
  }).populate("city");
  res.status(200).send({
    user,
  });
});


// get user count object {waitindCount: , confirmedCount: , bannedCount: }
router.get("/count", async function (req, res, next) {
  const waitingCount = await User.countDocuments({
    waitingConfirm: true,
    isBanned: false,
  });
  const confirmedCount = await User.countDocuments({
    confirmed: false,
    isBanned: false,
  });
  const bannedCount = await User.countDocuments({
    isBanned: true,
  });

  const activeCount = await User.countDocuments({
    isActive: true,
  });
  res.status(200).send({
    waitingCount,
    confirmedCount,
    bannedCount,
    activeCount
  });
});


// help login
router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    res.status(200).send({
      message: "başarılı"
    });
  }
  else {
    res.status(400).send({
      message: "hatalı giriş denemesi"
    });
  }
});







module.exports = router;

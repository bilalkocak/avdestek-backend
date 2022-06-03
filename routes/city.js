const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const City = mongoose.model("City");

router.get("/", function (req, res, next) {
  City.find({}, (error, cities) => {
    if (error) {
      res.status(400).send({
        error,
      });
    } else {
      res.status(200).send({
        cities,
      });
    }
  }).sort({ _id: 1 });
});

// Create cities collection

router.post("/create", function (req, res, next) {
  const cities = req.body.cities;

  cities.forEach((city) =>
    new City({ ...city }).save((error, _city) => {
      console.log("Kaydedildi", city.label);
      if (error) {
        console.log("Hata", error);
        res.status(400).send({
          error,
        });
      }
    })
  );
  res.status(200).send({
    cities,
  });
});
module.exports = router;

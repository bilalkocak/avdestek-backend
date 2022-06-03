const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const citySchema = new Schema({
  label: String,
  _id: Number,
});

mongoose.model("City", citySchema);

module.exports = mongoose;

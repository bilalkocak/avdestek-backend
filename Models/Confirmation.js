const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const confirmationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  code: {
    type: String,
    default: generateRandom = () => {
      // Here your function to generate random string
      return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    }
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  }
});

mongoose.model("Confirmation", confirmationSchema);

module.exports = mongoose;

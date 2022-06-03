const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  telephone: String,
  baroNumber: Number,
  fullName: {
    type: String,
    default: function () {
      return this.name + " " + this.surname;
    }
  },
  censoredFullName: {
    type: String,
    default: function () {
      return this.name.charAt(0) + "**** " + this.surname.charAt(0) + "****";
    }
  },
  censoredTelephone: {
    type: String,
    default: function () {
      return this.telephone.substring(0, 3) + "***" + this.telephone.substring(6, 9);
    }
  },
  censoredBaroNumber: {
    type: String,
    default: function () {
      return this.baroNumber.toString().substring(0, 3) + "***";
    }
  },
  censoredEmail: {
    type: String,
    default: function () {
      return this.email.substring(0, 3) + "***" + this.email.substring(this.email.indexOf("@"));
    }
  },
  city: {
    type: Number,
    ref: "City",
    required: true,
  },
  citizenId: String,
  waitingConfirm: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isPassive: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  successCount: {
    type: Number,
    default: 0,
  }
});

mongoose.model("User", userSchema);

module.exports = mongoose;

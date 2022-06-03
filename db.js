const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(
  `mongodb+srv://${process.env.DB_HOST}/${process.env.DB_NAME}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

require("./Models/User");
require("./Models/City");
require("./Models/Confirmation");
require("./Models/Advert");
require("./Models/Message");

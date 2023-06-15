const mongoose = require("mongoose");
const NAME = require("./Name");
const ADDRESS = require("./Address");
const IMAGE = require("./Image");
const { EMAIL, PHONE, CREATED_AT } = require("../helpersForCardsAndUsers");

const schema = new mongoose.Schema({
  name: NAME,
  phone: PHONE,
  email: EMAIL,
  password: {
    type: String,
    required: true,
    match: RegExp(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    ),
  },
  image: IMAGE,
  address: ADDRESS,
  isAdmin: { type: Boolean, default: false },
  isBusiness: { type: Boolean, default: false },
  createdAt: CREATED_AT,
});

const User = mongoose.model("users", schema);

module.exports = User;

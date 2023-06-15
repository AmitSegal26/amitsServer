const mongoose = require("mongoose");
const {
  Email,
  Phone,
  Created_At,
  Address,
  Image,
  Name,
} = require("../helpersForCardsAndUsers");

const schema = new mongoose.Schema({
  name: Name,
  phone: Phone,
  email: Email,
  password: {
    type: String,
    required: true,
    match: RegExp(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    ),
  },
  image: Image,
  address: Address,
  isAdmin: { type: Boolean, default: false },
  isBusiness: { type: Boolean, default: false },
  createdAt: Created_At,
});

const User = mongoose.model("users", schema);

module.exports = User;

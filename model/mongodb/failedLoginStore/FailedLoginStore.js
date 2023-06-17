const mongoose = require("mongoose");
const { Created_At, Email } = require("../helpersForCardsAndUsers");

const schema = new mongoose.Schema({
  email: Email,
  attempts: {
    type: Number,
    min: 0,
    max: 3,
    required: true,
    default: 0,
  },
  createdAt: Created_At,
});

const FailedLoginStore = mongoose.model("failedLoginStore", schema);

module.exports = FailedLoginStore;

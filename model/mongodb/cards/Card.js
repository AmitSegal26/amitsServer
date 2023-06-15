const mongoose = require("mongoose");
const {
  Email,
  Phone,
  Created_At,
  Address,
  URL,
  Image,
  DEFAULT_STRING_SCHEMA_REQUIRED,
} = require("../helpersForCardsAndUsers");

const cardSchema = new mongoose.Schema({
  title: DEFAULT_STRING_SCHEMA_REQUIRED,
  subtitle: DEFAULT_STRING_SCHEMA_REQUIRED,
  description: { ...DEFAULT_STRING_SCHEMA_REQUIRED, maxLength: 1024 },
  phone: Phone,
  email: Email,
  web: URL,
  image: Image,
  address: Address,
  bizNumber: {
    type: Number,
    minLength: 7,
    maxLength: 7,
    required: true,
    trim: true,
  },
  likes: [String],
  createdAt: Created_At,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const Card = mongoose.model("cards", cardSchema);

module.exports = Card;

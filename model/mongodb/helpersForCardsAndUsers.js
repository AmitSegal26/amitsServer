const mongoose = require("mongoose");

const URL = {
  type: String,
  match: RegExp(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
  ),
  trim: true,
};

const DEFAULT_STRING_SCHEMA = {
  type: String,
  maxLength: 256,
  trim: true,
};

const DEFAULT_STRING_SCHEMA_REQUIRED = {
  ...DEFAULT_STRING_SCHEMA,
  minLength: 2,
  required: true,
};
const Email = {
  type: String,
  require: true,
  match: RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/),
  lowercase: true,
  trim: true,
  unique: true,
};
const Phone = {
  type: String,
  required: true,
  match: RegExp(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/),
};
const Created_At = {
  type: Date,
  default: Date.now,
};

const Name = new mongoose.Schema({
  first: DEFAULT_STRING_SCHEMA_REQUIRED,
  middle: DEFAULT_STRING_SCHEMA,
  last: DEFAULT_STRING_SCHEMA_REQUIRED,
});

const Image = new mongoose.Schema({
  url: URL,
  alt: DEFAULT_STRING_SCHEMA_REQUIRED,
});

const Address = new mongoose.Schema({
  state: DEFAULT_STRING_SCHEMA,
  country: DEFAULT_STRING_SCHEMA_REQUIRED,
  city: DEFAULT_STRING_SCHEMA_REQUIRED,
  street: DEFAULT_STRING_SCHEMA_REQUIRED,
  houseNumber: {
    type: Number,
    required: true,
    trim: true,
    minLength: 1,
  },
  zip: {
    type: Number,
    trim: true,
    minLength: 4,
    default: 0,
  },
});
module.exports = {
  Email,
  Phone,
  Created_At,
  Address,
  URL,
  Image,
  Name,
  DEFAULT_STRING_SCHEMA_REQUIRED,
};

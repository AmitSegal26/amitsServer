const mongoose = require("mongoose");

const {
  DEFAULT_STRING_SCHEMA,
  DEFAULT_STRING_SCHEMA_REQUIRED,
} = require("./helpers/mongooseValidation");

const Name = new mongoose.Schema({
  first: DEFAULT_STRING_SCHEMA_REQUIRED,
  middle: DEFAULT_STRING_SCHEMA,
  last: DEFAULT_STRING_SCHEMA_REQUIRED,
});

module.exports = Name;

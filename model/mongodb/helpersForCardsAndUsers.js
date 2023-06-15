const EMAIL = {
  type: String,
  require: true,
  match: RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/),
  lowercase: true,
  trim: true,
  unique: true,
};
const PHONE = {
  type: String,
  required: true,
  match: RegExp(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/),
};
const CREATED_AT = {
  type: Date,
  default: Date.now,
};
module.exports = { EMAIL, PHONE, CREATED_AT };

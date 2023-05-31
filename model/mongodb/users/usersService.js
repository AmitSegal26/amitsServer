const User = require("./Users");

const registerUser = (userData) => {
  const user = new User(userData);
  return user.save();
};

const getUserById = (id) => {
  return User.findById(id);
};

const changeBizStatusOfUser = (id, isBiz) => {
  let user = User.findById(id);
  let { isBusiness } = user;
  isBusiness = !isBusiness;
  return User.findByIdAndUpdate(id, {
    $set: { isBusiness: !isBiz },
  });
};

const getAllUsers = () => {
  return User.find();
};

const deleteOneUser = (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = {
  registerUser,
  getUserById,
  getAllUsers,
  deleteOneUser,
  changeBizStatusOfUser,
};

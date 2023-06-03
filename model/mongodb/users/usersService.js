const User = require("./Users");
const normalizationUserService = require("../../usersService/helpers/normalizationUserService");

const registerUser = (userData) => {
  const user = new User(userData);
  return user.save();
};

const getUserById = (id) => {
  return User.findById(id);
};
const getUserByEmail = (email) => {
  return User.findOne({ email });
};

const changeBizStatusOfUser = (id, isBiz) => {
  let user = User.findById(id);
  let { isBusiness } = user;
  isBusiness = !isBusiness;
  return User.findByIdAndUpdate(id, {
    $set: { isBusiness: !isBiz },
  });
};

// const updateUserById = (id, newUserData) => {
//   return User.findByIdAndUpdate(id, newUserData, { new: true });
//   //!fix
// };

const updateUserById = async (id, newUserData) => {
  //normalize card
  return User.findByIdAndUpdate(
    id,
    await normalizationUserService(newUserData),
    {
      new: true,
    }
  );
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
  updateUserById,
  getUserByEmail,
};

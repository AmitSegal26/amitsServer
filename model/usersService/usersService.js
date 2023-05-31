const config = require("config");
const usersServiceMongo = require("../mongodb/users/usersService");
const dbOption = config.get("dbOption");

const registerUser = (userData) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.registerUser(userData);
  }
};

const getUserById = (id) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.getUserById(id);
  }
};

const getAllUsers = () => {
  if (dbOption === "mongo") {
    return usersServiceMongo.getAllUsers();
  }
};
const deleteOneUser = (id) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.deleteOneUser(id);
  }
};
const changeBizStatusOfUser = (id, isBiz) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.changeBizStatusOfUser(id, isBiz);
  }
};

module.exports = {
  registerUser,
  getUserById,
  getAllUsers,
  deleteOneUser,
  changeBizStatusOfUser,
};

const config = require("config");
const failedLoginStoreServiceMongo = require("../mongodb/failedLoginStore/FailedLoginStoreService");
const dbOption = config.get("dbOption");

const addNewUserToStore = (email) => {
  if (dbOption === "mongo") {
    return failedLoginStoreServiceMongo.addNewUserToStore(email);
  }
};

const getBlockedUserByEmail = (email) => {
  if (dbOption === "mongo") {
    return failedLoginStoreServiceMongo.getBlockedUserByEmail(email);
  }
};
const incrementAttemptsOfUser = (email) => {
  if (dbOption === "mongo") {
    return failedLoginStoreServiceMongo.incrementAttemptsOfUser(email);
  }
};
const resetAttemptsOfUser = (email) => {
  if (dbOption === "mongo") {
    return failedLoginStoreServiceMongo.resetAttemptsOfUser(email);
  }
};

const removeBlockedUserFromStore = (email) => {
  if (dbOption === "mongo") {
    return failedLoginStoreServiceMongo.removeBlockedUserFromStore(email);
  }
};

module.exports = {
  addNewUserToStore,
  getBlockedUserByEmail,
  incrementAttemptsOfUser,
  resetAttemptsOfUser,
  removeBlockedUserFromStore,
};

const FailedLoginStore = require("../../mongodb/failedLoginStore/FailedLoginStore");

const addNewUserToStore = (email) => {
  const failureBlock = new FailedLoginStore(email);
  return failureBlock.save();
};

const getBlockedUserByEmail = (email) => {
  return FailedLoginStore.findOne({ email });
};

const incrementAttemptsOfUser = (email) => {
  return FailedLoginStore.findOneAndUpdate(
    { email },
    { $inc: { attempts: 1 } },
    { new: true }
  );
};

const resetAttemptsOfUser = (email) => {
  return FailedLoginStore.findOneAndUpdate(
    { email },
    { attempts: 0 },
    { new: true }
  );
};

const removeBlockedUserFromStore = (email) => {
  return FailedLoginStore.findOneAndDelete({ email });
};

module.exports = {
  addNewUserToStore,
  getBlockedUserByEmail,
  incrementAttemptsOfUser,
  resetAttemptsOfUser,
  removeBlockedUserFromStore,
};

const CustomError = require("../../../utils/CustomError");
const failedLoginStoreService = require("../../failedLoginStoreService/FailedLoginStoreService");

const normalizeLoginFailure = (email) => {
  return { email, attempts: 0, createdAt: new Date() };
};

const handleBlockTime = async (blockedUser) => {
  const BLOCK_DURATION = 24 * 60 * 60 * 1000;
  const currentTime = Date.now();
  const blockStartTime = blockedUser.createdAt.getTime();
  if (currentTime - blockStartTime < BLOCK_DURATION) {
    const remainingTime = blockStartTime + BLOCK_DURATION - currentTime;
    const remainingTimeVariable = remainingTime / 1000 / 60 / 60;
    if (blockedUser.attempts >= 3) {
      throw new CustomError(
        ` Account blocked. Try again after ${
          remainingTimeVariable - Math.floor(remainingTimeVariable) > 0
            ? Math.floor(remainingTimeVariable) +
              " hours and " +
              Math.floor(
                (remainingTimeVariable - Math.floor(remainingTimeVariable)) * 60
              ) +
              " minutes"
            : remainingTimeVariable
        }.`
      );
    }
  } else {
    failedLoginStoreService
      .removeBlockedUserFromStore(blockedUser.email)
      .catch((err) => {
        throw new CustomError("problem removing block");
      });
    console.log("dleeted");
  }
};
module.exports = { normalizeLoginFailure, handleBlockTime };

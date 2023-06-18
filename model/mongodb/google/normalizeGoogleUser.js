// const normalizeGoogUserAfterAuth = (user) => {
//   let normalizedUserToBeReturnedAndSaved = { name: {} };
// };
const _ = require("lodash");

const getRandomCapitalLetter = () => {
  const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomIndex = _.random(0, possibleChars.length - 1);
  return possibleChars[randomIndex];
};
const getRandomSmallLetter = () => {
  const possibleChars = "abcdefghijklmnopqrstuvwxyz";
  const randomIndex = _.random(0, possibleChars.length - 1);
  return possibleChars[randomIndex];
};
const getRandomNum = () => {
  const numbersForPass = "0123456789";
  const randomIndex = _.random(0, numbersForPass.length - 1);
  return numbersForPass[randomIndex];
};
const getRandomSpecialChar = () => {
  const specialChars = "#?!@$%^&*-";
  const randomIndex = _.random(0, specialChars.length - 1);
  return specialChars[randomIndex];
};

const generateRandomPassword = () => {
  let passwordOfUser = "";
  for (let i = 0; i < 2; i++) {
    passwordOfUser += getRandomCapitalLetter();
    switch (_.random(1, 3)) {
      case 1:
        passwordOfUser += getRandomCapitalLetter();
        break;
      case 2:
        passwordOfUser += getRandomSmallLetter();
        break;
      case 3:
        passwordOfUser += getRandomNum();
        break;
      case 4:
        passwordOfUser += getRandomSpecialChar();
        break;
    }
  }
  for (let i = 0; i < 2; i++) {
    passwordOfUser += getRandomNum();
    switch (_.random(1, 3)) {
      case 1:
        passwordOfUser += getRandomCapitalLetter();
        break;
      case 2:
        passwordOfUser += getRandomSmallLetter();
        break;
      case 3:
        passwordOfUser += getRandomNum();
        break;
      case 4:
        passwordOfUser += getRandomSpecialChar();
        break;
    }
  }
  for (let i = 0; i < 2; i++) {
    passwordOfUser += getRandomSmallLetter();
    switch (_.random(1, 3)) {
      case 1:
        passwordOfUser += getRandomCapitalLetter();
        break;
      case 2:
        passwordOfUser += getRandomSmallLetter();
        break;
      case 3:
        passwordOfUser += getRandomNum();
        break;
      case 4:
        passwordOfUser += getRandomSpecialChar();
        break;
    }
  }
  for (let i = 0; i < 2; i++) {
    passwordOfUser += getRandomSpecialChar();
    switch (_.random(1, 3)) {
      case 1:
        passwordOfUser += getRandomCapitalLetter();
        break;
      case 2:
        passwordOfUser += getRandomSmallLetter();
        break;
      case 3:
        passwordOfUser += getRandomNum();
        break;
      case 4:
        passwordOfUser += getRandomSpecialChar();
        break;
    }
  }
  //   if (!/\\d/.test(passwordOfUser)) {
  //     passwordOfUser[_.random(0, passwordOfUser.length - 1)] = getRandomNum();
  //   }
  //   if (!/[a-z]/.test(passwordOfUser)) {
  //     passwordOfUser[_.random(0, passwordOfUser.length - 1)] =
  //       getRandomSmallLetter();
  //   }
  //   if (!/[A-Z]/.test(passwordOfUser)) {
  //     passwordOfUser[_.random(0, passwordOfUser.length - 1)] =
  //       getRandomCapitalLetter();
  //   }
  //   if (!/[#!@$%^&*-]/.test(passwordOfUser)) {
  //     let spec = getRandomSpecialChar();
  //     passwordOfUser[_.random(0, passwordOfUser.length - 1)] = spec;
  //     console.log("here", spec);
  //     console.log(passwordOfUser);
  //   }
  //   if (
  //     !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
  //       passwordOfUser
  //     )
  //   ) {
  //     console.log("yo");
  //     generateRandomPassword();
  //   }
  return passwordOfUser;
};
const normalizeUserFromGoogle = (userFromGoogle) => {
  return {
    name: {
      first: userFromGoogle.name.givenName,
      last: userFromGoogle.name.familyName,
    },
    email: userFromGoogle.emails[0].value,
    image: {
      url: userFromGoogle.photos[0].value,
      alt: "profile image from google",
    },
    password: generateRandomPassword(),
    phone: "052-1234657",
    address: {
      state: "",
      country: "defualt - google",
      city: "defualt - google",
      street: "defualt - google",
      houseNumber: 123,
    },
    googId: userFromGoogle.id,
  };
};

module.exports = { normalizeUserFromGoogle };

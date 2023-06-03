const express = require("express");
const router = express.Router();
const hashService = require("../../utils/hash/hashService");
const {
  registerUserValidation,
  loginUserValidation,
  editUserValidation,
} = require("../../validation/authValidationService");
const normalizeUser = require("../../model/usersService/helpers/normalizationUserService");
const usersServiceModel = require("../../model/usersService/usersService");
const {
  generateToken,
  verifyToken,
} = require("../../utils/token/tokenService");
const CustomError = require("../../utils/CustomError");
const { IDValidation } = require("../../validation/idValidationService");
const permissionsMiddleware = require("../../middleware/permissionsMiddleware");
const authmw = require("../../middleware/authMiddleware");

//http://localhost:8181/api/users/users/:id
//token
//get information about the user
router.get("/users/:id", authmw, async (req, res) => {
  try {
    let idOfUserToGetInformationOf;
    if (!req.userData.isAdmin && req.params.id != req.userData._id) {
      //not an admin so not permitted to view a user using params
      throw new CustomError("you are not permitted to use other user's id");
    }
    if (!req.userData.isAdmin && req.params.id == req.userData._id) {
      //not an admin and did not use params so they may continue
      idOfUserToGetInformationOf = req.userData._id + "";
      console.log("USERER", idOfUserToGetInformationOf);
    } else {
      //an admin so can view whatever user they would like using params
      await IDValidation(req.params.id);
      idOfUserToGetInformationOf = req.params.id;
      console.log("USERER !editItselfOnly", req.params.id);
    }
    const user = await usersServiceModel.getUserById(
      idOfUserToGetInformationOf
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/users/users
//admin
//get an array of all users
router.get(
  "/users",
  authmw,
  permissionsMiddleware(false, true, false),
  async (req, res) => {
    try {
      const usersArr = await usersServiceModel.getAllUsers();
      res.status(200).json(usersArr);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//http://localhost:8181/api/users/users
//all
//register
router.post("/users", async (req, res) => {
  try {
    await registerUserValidation(req.body);
    req.body.password = await hashService.generateHash(req.body.password);
    req.body = normalizeUser(req.body);
    await usersServiceModel.registerUser(req.body);
    res.json(req.body);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/users/login
//all
//login
router.post("/login", async (req, res) => {
  try {
    await loginUserValidation(req.body);
    const userData = await usersServiceModel.getUserByEmail(req.body.email);
    if (!userData) throw new CustomError("invalid email and/or password");
    const isPasswordMatch = await hashService.cmpHash(
      req.body.password,
      userData.password
    );
    if (!isPasswordMatch)
      throw new CustomError("invalid email and/or password");
    const token = await generateToken({
      _id: userData._id,
      isAdmin: userData.isAdmin,
      isBusiness: userData.isBusiness,
    });
    res.json({ token });
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/users/users/:id
//token
//edit user
router.put("/users", authmw, async (req, res) => {
  try {
    let newData = req.body;
    await editUserValidation(newData);
    const userData = req.userData;
    let { _id } = userData;
    //normalize is in the function itself updateUserById
    let newUpdatedUser = await usersServiceModel.updateUserById(_id, newData);
    console.log("userDATATA");
    res.status(200).json(newUpdatedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/users/users/:id
//token
//invert isBusiness value (true/false)
router.patch("/users/:id", authmw, async (req, res) => {
  try {
    let { id } = req.params;
    await IDValidation(id);
    const user = await usersServiceModel.getUserById(id);
    await usersServiceModel.changeBizStatusOfUser(id, user.isBusiness);
    user.isBusiness = !user.isBusiness;
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/users/users/:id
router.delete(
  "/users/:id",
  authmw,
  permissionsMiddleware(false, true, false),
  async (req, res) => {
    try {
      //   let idOfUserToGetInformationOf;
      // if (!req.userData.isAdmin && req.params.id != req.userData._id) {
      //   //not an admin so not permitted to view a user using params
      //   throw new CustomError("you are not permitted to use other user's id");
      // }
      // if (!req.userData.isAdmin && req.params.id == req.userData._id) {
      //   //not an admin and did not use params so they may continue
      //   idOfUserToGetInformationOf = req.userData._id + "";
      //   console.log("USERER", idOfUserToGetInformationOf);
      // } else {
      //   //an admin so can view whatever user they would like using params
      //   await IDValidation(req.params.id);
      //   idOfUserToGetInformationOf = req.params.id;
      //   console.log("USERER !editItselfOnly", req.params.id);
      // }
      // const user = await usersServiceModel.getUserById(
      //   idOfUserToGetInformationOf
      // );
      let { id } = req.params;
      console.log(id);
      await IDValidation(id);
      let user = await usersServiceModel.deleteOneUser(id);
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

module.exports = router;

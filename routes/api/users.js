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
const { generateToken } = require("../../utils/token/tokenService");
const CustomError = require("../../utils/CustomError");
const permissionsMiddleware = require("../../middleware/permissionsMiddleware");
const authmw = require("../../middleware/authMiddleware");

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

//http://localhost:8181/api/users/users/:id
//token for themselves or admin for all users
//get information about the user
router.get(
  "/users/:id",
  authmw,
  permissionsMiddleware(false, true, false, true),
  async (req, res) => {
    try {
      let user = await usersServiceModel.getUserById(req.params.id);
      if (!user) {
        return res.json({ msg: "user not found" });
      }
      res.status(200).json(user);
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
    let user = await usersServiceModel.registerUser(req.body);
    if (!user.password) {
      throw new CustomError("something went wrong, check the database");
    }
    let newUser = JSON.parse(JSON.stringify(user));
    delete newUser.password;
    res.json(newUser);
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
router.put(
  "/users/:id",
  authmw,
  permissionsMiddleware(false, false, false, true),
  // userOwnIdCheckMiddleware(),
  async (req, res) => {
    try {
      let newData = req.body;
      await editUserValidation(newData);
      let newUpdatedUser = await usersServiceModel.updateUserById(
        req.params.id,
        newData
      );
      res.status(200).json(newUpdatedUser);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//http://localhost:8181/api/users/users/:id
//token
//invert isBusiness value (true/false)
router.patch(
  "/users/:id",
  authmw,
  permissionsMiddleware(false, false, false, true),
  // userOwnIdCheckMiddleware(),
  async (req, res) => {
    try {
      let user = await usersServiceModel.changeBizStatusOfUser(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//http://localhost:8181/api/users/users/:id
//token for themselves or admin for all users
router.delete(
  "/users/:id",
  authmw,
  permissionsMiddleware(false, true, false, true),
  async (req, res) => {
    try {
      let user = await usersServiceModel.deleteOneUser(req.params.id);
      if (!user) {
        res.status(204).json({ msg: "no user found by the id that was given" });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

module.exports = router;

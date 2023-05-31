const express = require("express");
const router = express.Router();
const hashService = require("../../utils/hash/hashService");
const {
  registerUserValidation,
  loginUserValidation,
} = require("../../validation/authValidationService");
const normalizeUser = require("../../model/usersService/helpers/normalizationUserService");
const usersServiceModel = require("../../model/usersService/usersService");
const { generateToken } = require("../../utils/token/tokenService");
const CustomError = require("../../utils/CustomError");
const { IDValidation } = require("../../validation/idValidationService");
const permissionsMiddleware = require("../../middleware/permissionsMiddleware");
const authmw = require("../../middleware/authMiddleware");

//http://localhost:8181/api/users/users/:id
//token
router.get("/users/:id", authmw, async (req, res) => {
  try {
    await IDValidation(req.params.id);
    const user = await usersServiceModel.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/users/users
//admin
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

//token
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

router.delete(
  "/users/:id",
  authmw,
  permissionsMiddleware(false, true, false),
  async (req, res) => {
    try {
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

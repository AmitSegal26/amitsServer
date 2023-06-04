const CustomError = require("../utils/CustomError");
const { getCardById } = require("../model/cardsService/cardsService");
const validateID = require("../validation/idValidationService");

const checkIfBizOwner = async (iduser, idcard, res, next) => {
  try {
    await validateID.IDValidation(idcard);
    await validateID.IDValidation(iduser);
    const cardData = await getCardById(idcard);
    if (!cardData) {
      return res.status(400).json({ msg: "card not found" });
    }
    if (cardData.user_id == iduser) {
      next();
    } else {
      res.status(401).json({ msg: "you not the biz owner" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

/*
  isBiz = every biz
  isAdmin = is admin
  isBizOwner = biz owner
*/

const permissionsMiddleware = (isBiz, isAdmin, isBizOwner) => {
  return async (req, res, next) => {
    try {
      if (req.params && req.params.id) {
        await validateID.IDValidation(req.params.id);
      }
      if (!req.userData) {
        throw new CustomError("must provide userData");
      }
      if (isBiz === req.userData.isBusiness && isBiz === true) {
        return next();
      }
      if (isAdmin === req.userData.isAdmin && isAdmin === true) {
        return next();
      }
      if (isBizOwner === req.userData.isBusiness && isBizOwner === true) {
        return checkIfBizOwner(req.userData._id, req.params.id, res, next);
      }
      if (!req.userData.isAdmin && req.params.id != req.userData._id) {
        //not an admin so not permitted to view a user using params
        throw new CustomError("you are not permitted to use other user's id");
      }
      if (!req.userData.isAdmin && req.params.id == req.userData._id) {
        //not an admin and used in params their own id so they may continue
        req.usedOwnId = true;
        return next();
      }
    } catch (err) {
      res.status(400).json(err);
    }
  };
};

module.exports = permissionsMiddleware;

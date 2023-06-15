const CustomError = require("../utils/CustomError");
const { getCardById } = require("../model/cardsService/cardsService");
const validateID = require("../validation/idValidationService");

const checkIfBizOwner = async (iduser, idcard, res, next) => {
  try {
    await validateID.IDValidation(iduser);
    await validateID.IDValidation(idcard);
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

const checkOwnIdIfAdminIsOptionalForUsingSelfID = async (
  idUser,
  idParams,
  res,
  next
) => {
  try {
    await validateID.IDValidation(idParams);
    if (idParams == idUser) {
      next();
    } else {
      res.send("the user is NOT verified for using other id");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

/*
  isBiz = every biz
  isAdmin = is admin
  isBizOwner = biz owner
  isAdminOptionalForUsingOwnId = indicator of enabling registered user for 
                                 themselves or admin for everyone
*/
const permissionsMiddleware = (
  isBiz,
  isAdmin,
  isBizOwner,
  isAdminOptionalForUsingOwnId = false
) => {
  return async (req, res, next) => {
    try {
      if (!req.userData) {
        throw new CustomError("must provide userData");
      }
      if (isBiz === req.userData.isBusiness && isBiz === true) {
        return next();
      }
      if (isAdmin === req.userData.isAdmin && isAdmin === true) {
        return next();
      }
      if (isAdminOptionalForUsingOwnId) {
        return checkOwnIdIfAdminIsOptionalForUsingSelfID(
          req.userData._id,
          req.params.id,
          res,
          next
        );
      }
      if (isBizOwner === true) {
        return checkIfBizOwner(req.userData._id, req.params.id, res, next);
      } else {
        res.status(403).json({ msg: "permissions needed" });
      }
    } catch (err) {
      res.status(400).json(err);
    }
  };
};

module.exports = permissionsMiddleware;

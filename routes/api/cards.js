const express = require("express");
const router = express.Router();
const cardsServiceModel = require("../../model/cardsService/cardsService");
const normalizeCard = require("../../model/cardsService/helpers/normalizationCardService");
const cardsValidationService = require("../../validation/cardsValidationService");
const permissionsMiddleware = require("../../middleware/permissionsMiddleware");
const authmw = require("../../middleware/authMiddleware");
const { verifyToken } = require("../../utils/token/tokenService");

// biz only
router.post("/", authmw, async (req, res) => {
  try {
    await cardsValidationService.createCardValidation(req.body);
    let normalCard = await normalizeCard(req.body, req.userData._id);
    const dataFromMongoose = await cardsServiceModel.createCard(normalCard);
    console.log("dataFromMongoose", dataFromMongoose);
    res.json({ msg: "ok" });
  } catch (err) {
    res.status(400).json(err);
  }
});

// all
router.get("/", async (req, res) => {
  try {
    const allCards = await cardsServiceModel.getAllCards();
    res.json(allCards);
  } catch (err) {
    res.status(400).json(err);
  }
});

//authed
router.get("/get-card-likes", authmw, async (req, res) => {
  try {
    let userCardsArr = [];
    let {
      userData: { _id },
    } = req;
    let cardsArr = await cardsServiceModel.getAllCards();
    if (cardsArr.length === 0) {
      return;
    }
    for (const card of cardsArr) {
      let { likes } = card;
      for (const user of likes) {
        if (user == _id) {
          userCardsArr.push(card);
          break;
        }
      }
    }
    res.status(200).json(userCardsArr);
  } catch (err) {
    res.status(400).json(err);
  }
});

//authed
router.patch("/card-like/:id", authmw, async (req, res) => {
  try {
    let cardId = req.params.id;
    let currCard = await cardsServiceModel.getCardById(cardId);
    if (currCard.likes.find((userId) => userId == req.userData._id)) {
      currCard.likes = currCard.likes.filter(
        (userId) => userId != req.userData._id
      );
    } else {
      currCard.likes = [...currCard.likes, req.userData._id];
    }
    await cardsServiceModel.updateCard(cardId, currCard);
    let updatedCard = await cardsServiceModel.getCardById(cardId);
    res.status(200).json(updatedCard);
  } catch (err) {
    res.status(400).json(err);
  }
});

// all
router.get("/:id", async (req, res) => {
  try {
    //! joi validation
    const cardFromDB = await cardsServiceModel.getCardById(req.params.id);
    res.json(cardFromDB);
  } catch (err) {
    res.status(400).json(err);
  }
});

// admin or biz owner
router.put("/:id", async (req, res) => {
  try {
    //! joi validation
    //! normalize
    const cardFromDB = await cardsServiceModel.updateCard(
      req.params.id,
      req.body
    );
    res.json(cardFromDB);
  } catch (err) {
    res.status(400).json(err);
  }
});

// admin or biz owner
router.delete(
  "/:id",
  authmw,
  permissionsMiddleware(false, true, true),
  async (req, res) => {
    try {
      //! joi validation
      const cardFromDB = await cardsServiceModel.deleteCard(req.params.id);
      if (cardFromDB) {
        res.json({ msg: "card deleted" });
      } else {
        res.json({ msg: "could not find the card" });
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

/*
  under the hood
  let permissionsMiddleware2 = permissionsMiddleware(false, true, false)
  router.delete(
  "/:id",
  authmw,
  permissionsMiddleware2,
  (req, res)=>{- - -});
*/

module.exports = router;

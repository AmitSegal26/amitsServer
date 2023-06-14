const express = require("express");
const router = express.Router();
const cardsServiceModel = require("../../model/cardsService/cardsService");
const normalizeCard = require("../../model/cardsService/helpers/normalizationCardService");
const cardsValidationService = require("../../validation/cardsValidationService");
const permissionsMiddleware = require("../../middleware/permissionsMiddleware");
const authmw = require("../../middleware/authMiddleware");
const { IDValidation } = require("../../validation/idValidationService");
const normalizeCardService = require("../../model/cardsService/helpers/normalizationCardService");
const {
  bizNumberValidation,
} = require("../../validation/bizNumberValidationService");
const CustomError = require("../../utils/CustomError");
bizNumberValidation;

//get all cards
//http://localhost:8181/api/cards/cards
// all
router.get("/cards", async (req, res) => {
  try {
    const allCards = await cardsServiceModel.getAllCards();
    if (!allCards) {
      return res.json({ msg: "no cards at the data base" });
    }
    res.json(allCards);
  } catch (err) {
    res.status(400).json(err);
  }
});

//get all cards of the owning user
//http://localhost:8181/api/cards/my-cards
// all
router.get("/my-cards", authmw, async (req, res) => {
  try {
    const usersCards = await cardsServiceModel.getCardsByUserId(
      req.userData._id
    );
    if (!usersCards.length) {
      res.json({ msg: "no cards by provided token" });
    } else {
      res.json(usersCards);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

//get specific card
//http://localhost:8181/api/cards/cards/:id
// all
router.get("/cards/:id", async (req, res) => {
  try {
    await IDValidation(req.params.id);
    const cardFromDB = await cardsServiceModel.getCardById(req.params.id);
    if (!cardFromDB) {
      return res.json({ msg: "no card found" });
    }
    res.json(cardFromDB);
  } catch (err) {
    res.status(400).json(err);
  }
});

//create a new card
//http://localhost:8181/api/cards/cards
// biz only
router.post(
  "/cards",
  authmw,
  permissionsMiddleware(true, false, false),
  async (req, res) => {
    try {
      await cardsValidationService.createCardValidation(req.body);
      let normalCard = await normalizeCard(req.body, req.userData._id);
      const dataFromMongoose = await cardsServiceModel.createCard(normalCard);
      res.json(dataFromMongoose);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//edit a card
//http://localhost:8181/api/cards/cards/:id
// admin or biz owner
router.put(
  "/cards/:id",
  authmw,
  permissionsMiddleware(false, false, true),
  async (req, res) => {
    try {
      await cardsValidationService.editCardValidation(req.body);
      let normalCard = await normalizeCardService(req.body);
      const cardFromDB = await cardsServiceModel.updateCard(
        req.params.id,
        normalCard
      );
      res.json(cardFromDB);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//like\remove like a card
//http://localhost:8181/api/cards/cards/:id
//authed
router.patch("/cards/:id", authmw, async (req, res) => {
  try {
    let cardId = req.params.id;
    await IDValidation(cardId);
    let currCard = await cardsServiceModel.getCardById(cardId);
    if (!currCard) {
      return res.json({ msg: "no card found to like" });
    }
    if (currCard.likes.find((userId) => userId == req.userData._id)) {
      currCard.likes = currCard.likes.filter(
        (userId) => userId != req.userData._id
      );
    } else {
      currCard.likes = [...currCard.likes, req.userData._id];
    }
    res.status(200).json(await cardsServiceModel.updateCard(cardId, currCard));
  } catch (err) {
    res.status(400).json(err);
  }
});

//!BONUS
//like\remove like a card
//http://localhost:8181/api/cards/changeBizNumber/:id/:newBizNumber
//authed
router.patch(
  "/changeBizNumber/:id/:newBizNumber",
  authmw,
  permissionsMiddleware(false, true, false, false),
  async (req, res) => {
    try {
      let { newBizNumber } = req.params;
      await IDValidation(req.params.id);
      await bizNumberValidation(newBizNumber);
      let cardsArr = await cardsServiceModel.getAllCards();
      let foundAnotherCardContainingTheSameBizNumber = false;
      for (let card of cardsArr) {
        if (card.bizNumber == newBizNumber) {
          foundAnotherCardContainingTheSameBizNumber = true;
          break;
        }
      }
      if (!foundAnotherCardContainingTheSameBizNumber) {
        res.json(
          await cardsServiceModel.changeBizNumber(req.params.id, newBizNumber)
        );
      } else {
        throw new CustomError(
          "new business number is already taken, choose another one"
        );
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

// admin or biz owner
router.delete(
  "/cards/:id",
  authmw,
  permissionsMiddleware(false, true, true),
  async (req, res) => {
    try {
      let card = await cardsServiceModel.deleteCard(req.params.id);
      if (!card) {
        return res.json({ msg: "card not found" });
      }
      res.status(200).json(card);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

module.exports = router;

const Card = require("./Card");

const createCard = (cardToSave) => {
  let card = new Card(cardToSave);
  return card.save();
};

const getAllCards = () => {
  return Card.find();
};

const changeBizNumber = (id, bizNumber) => {
  return Card.findByIdAndUpdate(id, { bizNumber }, { new: true });
};

const getCardById = (id) => {
  return Card.findById(id);
};

const getCardByBizNumber = (bizNumber) => {
  return Card.findOne({ bizNumber }, { bizNumber: 1, _id: 0 });
};

const updateCard = (id, cardToUpdate) => {
  //normalize card
  return Card.findByIdAndUpdate(id, cardToUpdate, {
    new: true,
  });
};

const getCardsByUserId = (userId) => {
  return Card.find({ user_id: userId });
};

const deleteCard = (id) => {
  return Card.findByIdAndDelete(id);
};

module.exports = {
  createCard,
  getAllCards,
  getCardById,
  getCardByBizNumber,
  getCardsByUserId,
  updateCard,
  deleteCard,
  changeBizNumber,
};

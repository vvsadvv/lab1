const { Feedback } = require("../models");

const submitFeedback = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Заполните все поля формы" });
  }

  const feedback = await Feedback.create({ name, email, message });
  return res.status(201).json({
    id: feedback.id,
    createdAt: feedback.createdAt,
    message: "Спасибо за отзыв! Мы скоро свяжемся с вами.",
  });
};

const getAllFeedback = async (req, res) => {
  const entries = await Feedback.findAll({
    order: [["createdAt", "DESC"]],
  });
  return res.json(entries);
};

module.exports = {
  submitFeedback,
  getAllFeedback,
};

const { User } = require("../models");

const getPendingUsers = async (req, res) => {
  const users = await User.findAll({
    where: { role: "pending" },
    attributes: ["id", "username", "role", "createdAt"],
    order: [["createdAt", "ASC"]],
  });

  return res.json(users);
};

const approveUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: "Пользователь не найден" });
  }

  if (user.role !== "pending") {
    return res.status(400).json({ message: "Пользователь уже подтвержден" });
  }

  await user.update({ role: "editor" });
  return res.json({ message: "Пользователь подтвержден", id: user.id, role: user.role });
};

const rejectUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: "Пользователь не найден" });
  }

  if (user.role !== "pending") {
    return res
      .status(400)
      .json({ message: "Можно отклонять только пользователей в статусе pending" });
  }

  await user.destroy();
  return res.status(204).send();
};

module.exports = {
  getPendingUsers,
  approveUser,
  rejectUser,
};

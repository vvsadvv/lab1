const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const { User } = require("../models");

const buildAuthResponse = (user) => {
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "12h" }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  };
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Укажите логин и пароль для входа" });
  }

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ message: "Неверный логин или пароль" });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ message: "Неверный логин или пароль" });
  }

  if (user.role === "pending") {
    return res.status(403).json({
      message: "Ваша заявка на регистрацию ожидает подтверждения администратором",
    });
  }

  return res.json(buildAuthResponse(user));
};

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Укажите логин и пароль" });
  }

  if (String(username).trim().length < 3) {
    return res.status(400).json({ message: "Логин должен содержать минимум 3 символа" });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: "Пароль должен содержать минимум 6 символов" });
  }

  const existing = await User.findOne({ where: { username: username.trim() } });
  if (existing) {
    return res.status(409).json({ message: "Пользователь с таким логином уже существует" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const createdUser = await User.create({
    username: username.trim(),
    passwordHash,
    role: "pending",
  });

  return res.status(201).json({
    id: createdUser.id,
    username: createdUser.username,
    role: createdUser.role,
    message: "Регистрация отправлена. Ожидайте подтверждения администратором.",
  });
};

module.exports = {
  login,
  register,
};

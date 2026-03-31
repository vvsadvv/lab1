const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const { User } = require("../models");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Требуется авторизация" });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Недействительный токен" });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Недостаточно прав" });
  }
  return next();
};

module.exports = {
  authenticate,
  authorize,
};

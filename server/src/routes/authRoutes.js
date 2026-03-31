const { Router } = require("express");
const { login, register } = require("../controllers/authController");
const asyncHandler = require("../utils/asyncHandler");

const authRouter = Router();

authRouter.post("/login", asyncHandler(login));
authRouter.post("/register", asyncHandler(register));

module.exports = authRouter;

const { Router } = require("express");
const authRoutes = require("./authRoutes");
const cacheRoutes = require("./cacheRoutes");
const pageRoutes = require("./pageRoutes");
const feedbackRoutes = require("./feedbackRoutes");
const userRoutes = require("./userRoutes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/cache", cacheRoutes);
router.use("/pages", pageRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/users", userRoutes);

module.exports = router;

const { Router } = require("express");
const { cacheStats, clearCache } = require("../controllers/cacheController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const cacheRouter = Router();

cacheRouter.use(authenticate, authorize("admin"));
cacheRouter.get("/stats", asyncHandler(cacheStats));
cacheRouter.delete("/clear", asyncHandler(clearCache));

module.exports = cacheRouter;

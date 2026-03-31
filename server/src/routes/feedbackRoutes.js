const { Router } = require("express");
const {
  submitFeedback,
  getAllFeedback,
} = require("../controllers/feedbackController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const feedbackRouter = Router();

feedbackRouter.post("/public", asyncHandler(submitFeedback));
feedbackRouter.get(
  "/",
  authenticate,
  authorize("admin", "editor"),
  asyncHandler(getAllFeedback)
);

module.exports = feedbackRouter;

const { Router } = require("express");
const {
  getPendingUsers,
  approveUser,
  rejectUser,
} = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const userRouter = Router();

userRouter.use(authenticate, authorize("admin"));
userRouter.get("/pending", asyncHandler(getPendingUsers));
userRouter.patch("/:id/approve", asyncHandler(approveUser));
userRouter.delete("/:id/reject", asyncHandler(rejectUser));

module.exports = userRouter;

const { Router } = require("express");
const {
  getPublicPages,
  getPublicPageBySlug,
  getAllPages,
  createPage,
  updatePage,
  deletePage,
} = require("../controllers/pageController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const pageRouter = Router();

pageRouter.get("/public", asyncHandler(getPublicPages));
pageRouter.get("/public/:slug", asyncHandler(getPublicPageBySlug));

pageRouter.use(authenticate);
pageRouter.get("/", asyncHandler(getAllPages));
pageRouter.post("/", authorize("admin", "editor"), asyncHandler(createPage));
pageRouter.put("/:id", authorize("admin", "editor"), asyncHandler(updatePage));
pageRouter.delete("/:id", authorize("admin", "editor"), asyncHandler(deletePage));

module.exports = pageRouter;

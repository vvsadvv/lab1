const { Op } = require("sequelize");
const { Page } = require("../models");
const { mapPageToResponse, serializeExtraData } = require("../services/pageService");

const slugPattern = /^[a-z0-9-]+$/;

const normalizePayload = (body) => ({
  slug: body.slug?.trim().toLowerCase(),
  title: body.title?.trim(),
  summary: body.summary?.trim() ?? "",
  content: body.content?.trim() ?? "",
  pageType: body.pageType || "custom",
  menuLabel: body.menuLabel?.trim() || body.title?.trim() || "Страница",
  menuOrder: Number(body.menuOrder) || 0,
  showInMenu: body.showInMenu === undefined ? true : Boolean(body.showInMenu),
  isPublished: body.isPublished === undefined ? true : Boolean(body.isPublished),
  extraData: serializeExtraData(body.extraData),
});

const validateRequiredFields = (data) => {
  if (!data.slug || !slugPattern.test(data.slug)) {
    return "Slug должен содержать латиницу, цифры и дефис";
  }
  if (!data.title) {
    return "Поле title обязательно";
  }
  return null;
};

const getPublicPages = async (req, res) => {
  const pages = await Page.findAll({
    where: {
      isPublished: true,
      showInMenu: true,
    },
    order: [
      ["menuOrder", "ASC"],
      ["title", "ASC"],
    ],
  });

  return res.json(pages.map(mapPageToResponse));
};

const getPublicPageBySlug = async (req, res) => {
  const { slug } = req.params;
  const page = await Page.findOne({
    where: {
      slug,
      isPublished: true,
    },
  });

  if (!page) {
    return res.status(404).json({ message: "Страница не найдена" });
  }

  return res.json(mapPageToResponse(page));
};

const getAllPages = async (req, res) => {
  const pages = await Page.findAll({
    order: [
      ["menuOrder", "ASC"],
      ["createdAt", "DESC"],
    ],
  });
  return res.json(pages.map(mapPageToResponse));
};

const createPage = async (req, res) => {
  const data = normalizePayload(req.body);
  const validationError = validateRequiredFields(data);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const existing = await Page.findOne({
    where: {
      slug: data.slug,
    },
  });
  if (existing) {
    return res.status(409).json({ message: "Страница с таким slug уже существует" });
  }

  const createdPage = await Page.create({
    ...data,
    isSystem: false,
  });
  return res.status(201).json(mapPageToResponse(createdPage));
};

const updatePage = async (req, res) => {
  const { id } = req.params;
  const page = await Page.findByPk(id);
  if (!page) {
    return res.status(404).json({ message: "Страница не найдена" });
  }

  const data = normalizePayload({
    ...page.toJSON(),
    ...req.body,
  });
  const validationError = validateRequiredFields(data);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const duplicate = await Page.findOne({
    where: {
      slug: data.slug,
      id: {
        [Op.ne]: page.id,
      },
    },
  });
  if (duplicate) {
    return res.status(409).json({ message: "Страница с таким slug уже существует" });
  }

  await page.update(data);
  return res.json(mapPageToResponse(page));
};

const deletePage = async (req, res) => {
  const { id } = req.params;
  const page = await Page.findByPk(id);
  if (!page) {
    return res.status(404).json({ message: "Страница не найдена" });
  }
  if (page.slug === "home") {
    return res
      .status(400)
      .json({ message: "Главную страницу удалять нельзя, чтобы не нарушить навигацию" });
  }

  await page.destroy();
  return res.status(204).send();
};

module.exports = {
  getPublicPages,
  getPublicPageBySlug,
  getAllPages,
  createPage,
  updatePage,
  deletePage,
};

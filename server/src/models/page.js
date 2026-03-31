const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Page = sequelize.define(
  "Page",
  {
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9-]+$/i,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    pageType: {
      type: DataTypes.ENUM("home", "contacts", "gallery", "feedback", "custom"),
      allowNull: false,
      defaultValue: "custom",
    },
    menuLabel: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    menuOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    showInMenu: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isSystem: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    extraData: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "{}",
    },
  },
  {
    tableName: "pages",
  }
);

module.exports = Page;

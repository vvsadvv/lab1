const sequelize = require("../config/database");
const User = require("./user");
const Page = require("./page");
const Feedback = require("./feedback");

module.exports = {
  sequelize,
  User,
  Page,
  Feedback,
};

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Feedback = sequelize.define(
  "Feedback",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 80],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 2000],
      },
    },
  },
  {
    tableName: "feedback",
  }
);

module.exports = Feedback;

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("comments", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      message: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      postId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "posts",
          },
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("comments");
  },
};

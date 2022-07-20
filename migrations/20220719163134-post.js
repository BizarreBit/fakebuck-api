"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("posts", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      message: {
        type: Sequelize.DataTypes.STRING,
      },
      image: {
        type: Sequelize.DataTypes.STRING,
      },
      like_count: {
        type: Sequelize.DataTypes.INTEGER,
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("posts");
  },
};

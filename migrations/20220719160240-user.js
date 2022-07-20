'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.DataTypes.STRING(20),
        unique: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      profile_image: {
        type: Sequelize.DataTypes.STRING,
      },
      cover_image: {
        type: Sequelize.DataTypes.STRING,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};

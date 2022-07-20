'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('friends', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: Sequelize.DataTypes.ENUM('PENDING', 'ACCEPTED', 'DENIED'),
        allowNull: false,
      },
      fromUserId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "users"
          },
          key: "id"
        }
      },
      toUserId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "users"
          },
          key: "id"
        }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('friends');
  }
};

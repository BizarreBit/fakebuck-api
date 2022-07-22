const { FRIEND_ACCEPTED, FRIEND_PENDING } = require("../config/constants");

module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      status: {
        type: DataTypes.ENUM(FRIEND_PENDING, FRIEND_ACCEPTED),
        allowNull: false,
        defaultValue: FRIEND_PENDING,
      },
    },
    {
      underscored: true,
    }
  );

  Friend.associate = (models) => {
    Friend.belongsTo(models.User, {
      as: "FromUser",
      foreignKey: {
        name: "fromUserId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Friend.belongsTo(models.User, {
      as: "ToUser",
      foreignKey: {
        name: "toUserId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };
  return Friend;
};

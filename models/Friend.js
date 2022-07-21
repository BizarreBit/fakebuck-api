module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      status: {
        type: DataTypes.ENUM("PENDING", "ACCEPTED"),
        allowNull: false,
        defaultValue: "PENDING",
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

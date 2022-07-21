module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      message: {
        type: DataTypes.STRING,
        validate: {
          isBothEmpty(value) {
            if (!value && !this.image) {
              throw new Error(
                "A post must contain at least a message or an image."
              );
            }
          },
        },
      },
      image: DataTypes.STRING,
      likeCount: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      underscored: true,
    }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Post.hasMany(models.Comment, {
      foreignKey: {
        name: "postId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Post.hasMany(models.Like, {
      foreignKey: {
        name: "postId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };
  return Post;
};

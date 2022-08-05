const fs = require("fs");

const cloudinary = require("../utilities/cloudinary");
const createError = require("../utilities/createError");
const { Post, Like, sequelize } = require("../models");

exports.createPost = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" && !req.file) {
      createError("a message or an image is required", 400);
    }

    let image;
    if (req.file) {
      const result = await cloudinary.upload(req.file.path);
      image = result.secure_url;
    }

    const post = await Post.create({
      message,
      image,
      userId: req.user.id,
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.editPost = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { id } = req.params;

    if (typeof message !== "string" && !req.file) {
      createError("a message or an image is required", 400);
    }

    const post = await Post.findOne({
      where: { id, userId: req.user.id },
    });
    if (!post) {
      createError("post not found", 400);
    }

    if (message) {
      post.message = message;
    }
    if (req.file) {
      const { secure_url: image } = await cloudinary.upload(req.file.path);
      await cloudinary.destroyByUrl(post.image);
      post.image = image;
    }

    await post.save();

    res.status(200).json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      where: { id, userId: req.user.id },
    });
    if (!post) {
      createError("post not found", 400);
    }

    await post.destroy();

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.likePost = async (req, res, next) => {
  const t = await sequelize.transaction(); // START TRANSACTION
  try {
    const { id } = req.params;

    // not nescesary to check if post exist, foreignKey constrain
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      createError("post not found", 400);
    }

    const existLike = await Like.findOne({
      where: { postId: id, userId: req.user.id },
    });
    if (existLike) {
      createError("you already liked this post", 400);
    }

    const like = await Like.create(
      {
        postId: id, //foreignKey constrain
        userId: req.user.id,
      },
      { transaction: t }
    );
    // post.likeCount += 1;
    // await post.save();
    await post.increment({ likeCount: 1 }, { transaction: t });
    // ^ What happen if an error occurs at this line ^
    // e.g. connection to the database is lost
    // but await Like.create is executed
    // (multiple database instruction code)
    // use Transaction
    await t.commit();

    // await Post.increment(
    //   { likeCount: 1 },
    //   { where: { id, userId: req.user.id } }
    // );

    res.status(200).json({ like });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.unlikePost = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      where: { id, userId: req.user.id },
    });
    if (!post) {
      createError("post not found", 400);
    }

    const like = await Like.findOne({
      where: { postId: id, userId: req.user.id },
    });
    if (!like) {
      createError("post not yet be liked ", 400);
    }

    like.destroy({ transaction: t });

    // post.likeCount -= 1;
    // await post.save();
    await post.increment({ likeCount: -1 }, { transaction: t });
    await t.commit();

    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

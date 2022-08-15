const createError = require("../utilities/createError");
const { Comment, Post } = require("../models");

exports.createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { message } = req.body;

    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      createError("the post is not exist or deleted", 400);
    }

    const comment = await Comment.create({
      message,
      postId,
      userId: req.user.id,
    });

    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.editComment = async (req, res, next) => {
  try {
    const { id, postId } = req.params;
    const { message } = req.body;

    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      createError("the post is not exist or deleted", 400);
    }

    // const comment = await Comment.findOne({
    //   where: {
    //     id,
    //     postId,
    //     userId: req.user.id,
    //   },
    // });

    // if (!comment) {
    //   createError(
    //     "you don't have permission, or the comment is not exist or deleted",
    //     400
    //   );
    // }
    const comment = await Comment.findOne({ where: { id, postId } });
    if (!comment) {
      createError("comment not found", 400);
    }
    if (comment.userId !== req.user.id) {
      createError("you have no permission", 400);
    }

    comment.message = message;
    await comment.save();

    res.status(200).json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id, postId } = req.params;

    // const comment = await Comment.findOne({
    //   where: {
    //     id,
    //     postId,
    //     userId: req.user.id,
    //   },
    // });

    // if (!comment) {
    //   createError(
    //     "you don't have permission, or the comment comis not exist or deleted",
    //     400
    //   );
    // }

    const comment = await Comment.findOne({ where: { id, postId } });

    if (!comment) {
      createError("comment not found", 400);
    }
    if (comment.userId !== req.user.id) {
      createError("you have no permission", 400);
    }

    await comment.destroy();

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

const { Op } = require("sequelize");

const createError = require("../utilities/createError");
const { User, Friend } = require("../models");
const {
  FRIEND_ACCEPTED,
  FRIEND_PENDING,
  FRIEND_REQUESTED,
  FRIEND_UNKNOWN,
} = require("../config/constants");
const FriendService = require("../services/friendService");

exports.requestFriend = async (req, res, next) => {
  try {
    const { toUserId } = req.body;

    if (req.user.id === +toUserId) {
      createError("can't request yourself", 400);
    }

    const user = await User.findOne({
      where: { id: toUserId },
    });
    if (!user) {
      createError("user not found", 400);
    }

    const existFriend = await Friend.findOne({
      where: {
        [Op.or]: [
          { fromUserId: req.user.id, toUserId },
          { fromUserId: toUserId, toUserId: req.user.id },
        ],
      },
    });
    if (existFriend) {
      createError("this user is already in friend list", 400);
    }

    const friend = await Friend.create({
      toUserId,
      fromUserId: req.user.id,
      status: FRIEND_PENDING,
    });

    res.status(200).json({ friend });
  } catch (err) {
    next(err);
  }
};

exports.acceptFriend = async (req, res, next) => {
  try {
    const { fromUserId } = req.params;

    const friend = await Friend.findOne({
      where: {
        fromUserId,
        toUserId: req.user.id,
        status: FRIEND_PENDING,
      },
    });
    if (!friend) {
      createError("friend request not found", 400);
    }

    // Instance Method
    friend.status = FRIEND_ACCEPTED;
    await friend.save();
    //// Static Method
    // await Friend.update(
    //   { status: FRIEND_ACCEPTED },
    //   { where: { id: friend.id } }
    // );

    res.json({ message: "friend request accepted" });
  } catch (err) {
    next(err);
  }
};

exports.deleteFriend = async (req, res, next) => {
  try {
    const { id } = req.params;

    const friend = await Friend.findOne({ where: { id } });

    if (!friend) {
      createError("friend request not found", 400);
    }

    if (friend.fromUserId !== req.user.id && friend.toUserId !== req.user.id) {
      createError("you have no permission", 403);
    }

    await friend.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.getAllFriend = async (req, res, next) => {
  try {
    const { status } = req.query;

    let users = {};
    switch (status?.toUpperCase()) {
      case FRIEND_UNKNOWN:
        // *****[FIND UNKNOWN]
        users = await FriendService.findUnknown(req.user.id);
        break;
      case FRIEND_PENDING:
        // *****[FIND PENDING FRIEND]
        users = await FriendService.findPendingFriend(req.user.id);
        break;
      case FRIEND_REQUESTED:
        // *****[FIND REQUEST FRIEND]
        users = await FriendService.findRequestedFriend(req.user.id);
        break;
      default:
        // *****[FIND ACCEPTED FRIEND]
        users = await FriendService.findAcceptedFriend(req.user.id);
    }

    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};
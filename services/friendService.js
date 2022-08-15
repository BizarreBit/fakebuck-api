const { Op } = require("sequelize");

const { Friend, User } = require("../models");
const { FRIEND_ACCEPTED, FRIEND_PENDING } = require("../config/constants");

exports.findAcceptedFriend = async (id) => {
  const friends = await Friend.findAll({
    where: {
      [Op.or]: [{ fromUserId: id }, { toUserId: id }],
      status: FRIEND_ACCEPTED,
    },
  });
  // console.log(JSON.stringify(friends, null, 2));

  const friendIds = friends.map((el) =>
    el.fromUserId === id ? el.toUserId : el.fromUserId
  );

  // SELECT * FROM users WHERE id IN (3,4)
  const users = await User.findAll({
    where: { id: friendIds },
    attributes: { exclude: ["password"] },
  });

  return users;
};

exports.findPendingFriend = async (id) => {
  const friends = await Friend.findAll({
    where: {
      toUserId: id,
      status: FRIEND_PENDING,
    },
    include: {
      model: User,
      as: "FromUser",
      attributes: { exclude: ["password"] },
    },
  });
  // console.log(JSON.stringify(friends, null, 2));

  return friends.map((el) => el.FromUser);
};

exports.findRequestedFriend = async (id) => {
  const friends = await Friend.findAll({
    where: {
      fromUserId: id,
      status: FRIEND_PENDING,
    },
    include: {
      model: User,
      as: "ToUser",
      attributes: { exclude: ["password"] },
    },
  });

  return friends.map((el) => el.ToUser);
};

exports.findUnknown = async (id) => {
  const friends = await Friend.findAll({
    where: {
      [Op.or]: [{ fromUserId: id }, { toUserId: id }],
    },
  });

  const friendIds = friends.map((el) =>
    el.fromUserId === id ? el.toUserId : el.fromUserId
  );

  friendIds.push(id);

  const users = await User.findAll({
    where: {
      id: { [Op.notIn]: friendIds },
    },
    attributes: { exclude: ["password"] },
  });

  return users;
};

exports.findFriendId = async (id) => {
  const friends = await Friend.findAll({
    where: {
      [Op.or]: [{ fromUserId: id }, { toUserId: id }],
      status: FRIEND_ACCEPTED,
    },
  });

  const friendIds = friends.map((el) =>
    el.fromUserId === id ? el.toUserId : el.fromUserId
  );
  return friendIds;
};

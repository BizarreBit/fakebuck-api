const FriendService = require("../services/friendService");

exports.getMe = async (req, res, next) => {
  try {
    // const { password, ...user } = req.user.dataValues //Not recommended

    const friends = await FriendService.findAcceptedFriend(req.user.id);

    // req.user.friends = friends //doesn't work !! req.user is not a plain object (getter setter)
    // res.status(200).json({ user: req.user });

    // res.status(200).json({ user: req.user, friends });  //not conform with API doc

    // res.status(200).json({
    //   user: {
    //     // hard code?
    //     id: req.user.id,
    //     firstName: req.user.firstName,
    //     lastName: req.user.lastName,
    //     email: req.user.email,
    //     phoneNumber: req.user.phoneNumber,
    //     profileImage: req.user.profileImage,
    //     coverImage: req.user.coverImage,
    //     createdAt: req.user.createdAt,
    //     updatedAt: req.user.updatedAt
    //     friends,
    //   },
    // });

    // stringify and parse?
    res
      .status(200)
      .json({ user: { ...JSON.parse(JSON.stringify(req.user)), friends } });
  } catch (err) {
    next(err);
  }
};

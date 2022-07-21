const createError = require("../utilities/createError");
const { User } = require("../models");

exports.getMe = async (req, res, next) => {
  try {
    // const { password, ...user } = req.user.dataValues //Not recommended
    // const user = {
    //   id: req.user.id,
    //   firstName: req.user.firstName,
    //   lastName: req.user.lastName,
    //   email: req.user.email,
    //   phoneNumber: req.user.phoneNumber,
    //   profileImage: req.user.profileImage,
    //   coverImage: req.user.coverImage,
    //   friends: [],
    // };
    // res.status(200).json({ user });
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

// const cloudinary = require("cloudinary").v2;
// const util = require("util");
const fs = require("fs");

const cloudinary = require("../utilities/cloudinary");
const FriendService = require("../services/friendService");
const { User } = require("../models");
const createError = require("../utilities/createError");

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

exports.updateImage = async (req, res, next) => {
  try {
    console.log(req.file);
    // await User.update(
    //   { profileImage: req.file.path },
    //   { where: { id: req.user.id } }
    // );
    // res.json({ profileImage: req.file.path });

    // // callback form
    // cloudinary.uploader.upload(req.file.path, async (error, result) => {
    //   if (error) {
    //     return next(error)
    //   }

    //   await User.update(
    //     { profileImage: result.secure_url },
    //     { where: { id: req.user.id } }
    //   );

    //   fs.unlinkSync(req.file.path)

    //   res.status(200).json({ profileImage: result.secure_url });
    // })

    // //async form
    // const upload = util.promisify(cloudinary.uploader.upload);
    // const result = await upload(req.file.path);

    // // single field
    // if (!req.file) {
    //   createError("profileImage is required", 400)
    // }

    // const result = await cloudinary.upload(req.file.path);
    // await User.update(
    //   { profileImage: result.secure_url },
    //   { where: { id: req.user.id } }
    // );

    // fs.unlinkSync(req.file.path); (if an error occur before this line: temp file won't be removed)

    // res.status(200).json({ profileImage: result.secure_url });

    // // multiple fields
    // console.log(req.files)

    if (!req.files || !(req.files.profileImage || req.files.coverImage)) {
      createError("profileImage or coverImage is required", 400);
    }

    const updateValue = {};
    if (req.files.profileImage) {
      const result = await cloudinary.upload(req.files.profileImage[0].path);
      // if (req.user.profileImage) {
      //   const splited = req.user.profileImage.split("/");
      //   const publicId = splited[splited.length - 1].split(".")[0];
      //   await cloudinary.destroy(publicId)
      // }
      await cloudinary.destroyByUrl(req.user.profileImage);
      updateValue.profileImage = result.secure_url;
    }
    if (req.files.coverImage) {
      const result = await cloudinary.upload(req.files.coverImage[0].path);
      // if (req.user.coverImage) {
      //   const splited = req.user.coverImage.split("/");
      //   const publicId = splited[splited.length - 1].split(".")[0];
      //   await cloudinary.destroy(publicId)
      // }
      await cloudinary.destroyByUrl(req.user.coverImage);
      updateValue.coverImage = result.secure_url;
    }

    await User.update(updateValue, { where: { id: req.user.id } });

    res.status(200).json(updateValue);
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profileImage) {
      fs.unlinkSync(req.files.profileImage[0].path);
    }
    if (req.files.coverImage) {
      fs.unlinkSync(req.files.coverImage[0].path);
    }
  }
};

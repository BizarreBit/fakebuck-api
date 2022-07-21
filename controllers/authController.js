const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const createError = require("../utilities/createError");
const { User } = require("../models");

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.login = async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ phoneNumber: emailOrPhone }, { email: emailOrPhone }],
      },
    });

    if (!user) {
      createError("invalid credential", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      createError("invalid credential", 400);
    }

    const token = genToken({id: user.id})
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, emailOrPhone, password, confirmPassword } =
      req.body;

    if (!emailOrPhone) {
      createError("an email or a phone number is required", 400);
    }
    if (!password) {
      createError("password is required", 400);
    }
    if (password !== confirmPassword) {
      createError("confirm password mismatch", 400);
    }
    if (password.length < 8) {
      createError(
        "password length must be equal or greater than 8 characters",
        400
      );
    }

    const isMobilePhone = validator.isMobilePhone(emailOrPhone + "");
    const isEmail = validator.isEmail(emailOrPhone + "");
    if (!isMobilePhone && !isEmail) {
      createError("email or phone number is invalid format", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      phoneNumber: isMobilePhone ? emailOrPhone : null,
      email: isEmail ? emailOrPhone : null,
      password: hashedPassword,
    });

    const token = genToken({id: user.id})
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

const express = require("express");
const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  console.log(req.body);

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (user) {
      // res.send("user created successfully")
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });
      res.status(201).send({
        message: "user created successfully",
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token,
        },
      });
    }
  } catch (error) {
    console.log(error);

    if (error.code == 11000) {
      res.status(400).send({
        message: "User already exists",
      });
    } else {
      res.status(400).send({
        message: "error creating user",
      });
    }
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isUser = await UserModel.findOne({ email }).select("+password");
    console.log(isUser, "this is the user");

    if (!isUser) {
      res.status(400).send({
        message: "invalid credentials",
      });

      return;
    }
    const isMatch = await bcrypt.compare(password, isUser.password);

    if (!isMatch) {
      res.status(400).send({
        message: "invalid credentials",
      });

      return;
    }
    const token = await jwt.sign({ id: isUser._id }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    res.status(200).send({
      message: "User logged in successfully",
      data: {
        firstName: isUser.firstName,
        lastName: isUser.lastName,
        email: isUser.email,
        token,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "error logging user in",
    });
  }
};

const getUserFromDb = async (req, res) => {
  try {
    const users = await UserModel.find();

    res.status(200).send({
      message: "users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "user fetch failed",
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByIdAndDelete({ _id: id });

    res.status(200).send({
      message: "user deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "error deleting user",
    });
  }
};

const updateUser = async (req, res) => {
  const { firstName, lastName } = req.body;
  const { id } = req.params;

  try {
    let allowedUpdate = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    };

    const isUser = await UserModel.findById(id);
    if (!isUser) {
      res.status(404).send({
        message: "cannot update this user as it does not exist",
      });

      return;
    }
    console.log(isUser);

    const user = await UserModel.findByIdAndUpdate(id, allowedUpdate, {
      new: true,
    });
    // lastName?lastName:null
    // firstName&&firstName

    res.status(200).send({
      message: "user updated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "cannot update user at this time",
      reason: String(error),
    });
  }
};

const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
    ? req.headers.authorization?.split(" ")[1]
    : req.headers?.authorization?.split(" ")[0];

  try {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        res.status(401).send({
          message: "User unauthorized",
        });

        return;
      }

      console.log(decoded);
      next();
    });
  } catch (error) {
    console.log(error);

    res.status(401).send({
      message: "User unauthorized",
    });
  }
};

module.exports = {
  register,
  getUserFromDb,
  deleteUser,
  updateUser,
  loginUser,
  verifyUser,
};

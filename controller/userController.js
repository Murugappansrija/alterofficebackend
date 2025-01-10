import mongoose from "mongoose";
import userModel from "../model/User.js";
import Response from "../utils/utils.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userController = {
  createUser: async (req, res) => {
    try {
      const { userName, email, password } = req.body;
      if (!userName || !email || !password) {
        return userController.sendResponse(
          res,
          400,
          "Invalid Data format Kindly Check",
          req.body
        );
      }
      const salting = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salting);
      const userData = { userName, email, password: hashedPassword };

      const newUser = await userModel.create(userData);
      const delPassword = newUser.toObject();

      delete delPassword.password;

      return userController.sendResponse(
        res,
        201,
        "User Created Successfully",
        delPassword
      );
    } catch (error) {
      return userController.sendResponse(
        res,
        500,
        "Internal Server Error Kindly Please Check Again",
        error.message
      );
    }
  },
  updateUser: async (req, res) => {
    try {
      console.log("hit");
      const userID = req.params.id;
      console.log(userID);
      if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
        return userController.sendResponse(
          res,
          400,
          "Invalid Data format Kindly Check",
          userID
        );
      }

      const { userName, password } = req.body;
      if (!userName || !password) {
        return userController.sendResponse(
          res,
          400,
          "Invalid Data format Kindly Check",
          req.body
        );
      }
      const salting = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salting);
      const userData = { userName, password: hashedPassword };

      const updatedUser = await userModel.findByIdAndUpdate(
        { _id: userID },
        userData,
        { new: true }
      );
      const delPassword = updatedUser.toObject();

      delete delPassword.password;

      return userController.sendResponse(
        res,
        200,
        "User updated Successfully",
        delPassword
      );
    } catch (error) {
      return userController.sendResponse(
        res,
        500,
        "Internal Server Error Kindly Please Check Again",
        error.message
      );
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return userController.sendResponse(
          res,
          400,
          "Invalid Data format Kindly Check",
          req.body
        );
      }
      const userIsExist = await userModel.findOne({ email: email });
      if (!userIsExist) {
        return userController.sendResponse(
          res,
          400,
          "Invalid Credential",
          req.body
        );
      }
      const storedPassword = userIsExist.password;

      const verifyPass = await bcrypt.compare(password, storedPassword);

      if (!verifyPass) {
        return userController.sendResponse(
          res,
          400,
          "Invalid Credential",
          req.body
        );
      }
      const token = await jwt.sign(
        { id: userIsExist._id },
        process.env.SECRET_KEY,
        { expiresIn: "3h" }
      );
      if (!token) {
        return userController.sendResponse(res, 400, "failed to Create Token");
      }
      const userRes = { token: token, userIsExist };
      return userController.sendResponse(
        res,
        200,
        "Login Successfully",
        userRes
      );
    } catch (error) {
      return userController.sendResponse(
        res,
        500,
        "Internal Server Error Kindly Please Check Again",
        error.message
      );
    }
  },

  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return userController.sendResponse(res, 400, "Invalid token");
      }

      await jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.log("hit")
          return userController.sendResponse(res, 400, "Faild to token");
        }
        req.user = user;
        next();
      });
    } catch (error) {
      return userController.sendResponse(
        res,
        500,
        "Internal Server Error Kindly Please Check Again",
        error.message
      );
    }
  },
  sendResponse: (res, statusCode, message, data) => {
    const response = new Response(statusCode, message, data);
    return res.status(statusCode).send(response);
  },
};

export const { createUser, updateUser, login, verifyToken } = userController;

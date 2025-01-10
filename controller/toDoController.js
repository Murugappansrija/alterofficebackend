import mongoose from "mongoose";
import toDoModel from "../model/toDo.js";
import Response from "../utils/utils.js";

const toDoController = {
  getAllToDo: async (req, res) => {
    try {
      const getAllToDo = await toDoModel.find({ createdBy: req.user.id });
      if (getAllToDo.length === 0) {
        return toDoController.sendResponse(res, 400, "No Data Found", []);
      }
      return toDoController.sendResponse(
        res,
        200,
        "Data Fetched Successfully",
        getAllToDo
      );
    } catch (error) {
      toDoController.sendResponse(
        res,
        500,
        "Internal Server Error Kindly Please Check Again",
        error.message
      );
    }
  },
  createToDO: async (req, res) => {
    try {
      console.log(req.body)
      const requiredField = [
        "task_name",
        "due_date",
        "status",
        "category",
        "createdBy",
      ];
      if (!toDoController.checkRequiredField(req.body, requiredField)) {
        return toDoController.sendResponse(
          res,
          400,
          "Invalid Data format Kindly Check",
          req.body
        );
      }
      const newTask = await toDoModel.create(req.body);
      return toDoController.sendResponse(
        res,
        201,
        "Task Created Successfully",
        newTask
      );
    } catch (error) {
      console.log(error.message)
      toDoController.sendResponse(
        res,
        500,
        "Internal Server Error Kindly Please Check Again",
        error.message
      );
    }
  },
  getToDo: async (req, res) => {
    try {
      const toDoID = req.params.id;
      if (!toDoID || !mongoose.Types.ObjectId.isValid(toDoID)) {
        return toDoController.sendResponse(
          res,
          400,
          "Invalid Data format Kindly Check",
          req.params
        );
      }
      const toDo = await toDoModel.findById(toDoID);
      if (toDo.length === 0) {
        return toDoController.sendResponse(res, 400, "No Data Found", []);
      }
      return toDoController.sendResponse(
        res,
        200,
        "Data Fetched Successfully",
        toDo
      );
    } catch (error) {
      toDoController.sendResponse(
        res,
        500,
        "Internal Server Error Kindly Please Check Again",
        error.message
      );
    }
  },
  updateToDO: async (req, res) => {
    try {
      const toDoID = req.params.id;
      if (!toDoID || !mongoose.Types.ObjectId.isValid(toDoID)) {
        return toDoController.sendResponse(
          res,
          400,
          "Invalid Data format Kindly Check",
          req.params
        );
      }
      const requiredField = [
        "task_name",
        "due_date",
        "status",
        "category",
        "createdBy",
      ];
      if (!toDoController.checkSomeRequiredField(req.body, requiredField)) {
        return toDoController.sendResponse(
          res,
          400,
          "Invalid Data format Kindly Check",
          req.body
        );
      }
      const newTask = await toDoModel.findByIdAndUpdate(
        { _id: toDoID },
        req.body,
        { new: true }
      );
      return toDoController.sendResponse(
        res,
        200,
        "Task updated Successfully",
        newTask
      );
    } catch (error) {
      toDoController.sendResponse(
        res,
        500,
        "Internal Server Error Kindly Please Check Again",
        error.message
      );
    }
  },
  deleteToDo: async (req, res) => {
    try {
      console.log("ljbv");
      const toDoID = req.params.id;
      console.log(toDoID);
      if (!toDoID || !mongoose.Types.ObjectId.isValid(toDoID)) {
        console.log("hit");
        return toDoController.sendResponse(
          res,
          400,
          "Invalid Data format Kindly Check",
          req.params
        );
      }
      const toDo = await toDoModel.findByIdAndDelete(toDoID);

      return toDoController.sendResponse(res, 200, "Data Deleted Successfully");
    } catch (error) {
      toDoController.sendResponse(
        res,
        500,
        "Internal Server Error Kindly Please Check Again",
        error.message
      );
    }
  },
  checkRequiredField: (data, requiredField) => {
    return requiredField.every((field) => data[field]);
  },
  checkSomeRequiredField: (data, requiredField) => {
    return requiredField.every((field) => data[field]);
  },
  sendResponse: (res, statusCode, message, data) => {
    const response = new Response(statusCode, message, data);
    return res.status(statusCode).send(response);
  },
};

export const {
  createToDO,
  getAllToDo,
  getToDo,
  updateToDO,
  deleteToDo,
} = toDoController;

import { Router } from "express";
import {
  createToDO,
  getAllToDo,
  getToDo,
  updateToDO,
  deleteToDo,
} from "../controller/toDoController.js";
import { verifyToken } from "../controller/userController.js";

const toDoRouter = Router();

toDoRouter.route("/add").post( createToDO);
toDoRouter.route("/get").get(verifyToken, getAllToDo);
toDoRouter.route("/get/:id").get(verifyToken, getToDo);
toDoRouter.route("/edit/:id").put(verifyToken, updateToDO);
toDoRouter.route("/delete/:id").delete(verifyToken, deleteToDo);

export default toDoRouter;

import { Router } from "express";
import { createUser,updateUser,login,verifyToken } from "../controller/userController.js";

const userRouter = Router();

userRouter.route("/add").post(createUser);

userRouter.route("/update/:id").put(verifyToken,updateUser);

userRouter.route("/login").post(login);



export default userRouter;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./connectDB.js";
import userRouter from "./router/userRouter.js";
import toDoRouter from "./router/toDoRouter.js";

const app = express();
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/todo", toDoRouter);
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server is running under ${port}`);
});

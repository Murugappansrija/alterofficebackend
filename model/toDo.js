import mongoose from "mongoose";

const toDOSchema = new mongoose.Schema({
  task_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  due_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["TO-DO", "IN-PROGRESS", "COMPLETED"],
  },
  category: {
    type: String,
    required: true,
    enum: ["Work", "Personal"],
  },
  attachment: {
    type: String,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
const toDoModel = mongoose.model("ToDo", toDOSchema);
export default toDoModel;

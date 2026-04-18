import mongoose from "mongoose";
import Task from "../models/Task.js";

export async function createTask(req, res) {
  try {
    const { title, description, completed } = req.body ?? {};

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      completed: completed ?? false,
      owner: req.user._id
    });

    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getTasks(req, res) {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (String(task.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await task.deleteOne();
    return res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}


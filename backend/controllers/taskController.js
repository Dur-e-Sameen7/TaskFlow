import Task from "../models/Task.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    if (
      priority !== undefined &&
      !["Low", "Medium", "High"].includes(priority)
    ) {
      return res.status(400).json({
        message: "Invalid priority",
      });
    }

    if (
      status !== undefined &&
      !["Pending", "In Progress", "Completed"].includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      priority,
      status,
      dueDate: dueDate || null,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL USER TASKS
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE TASK
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "priority",
      "status",
      "dueDate",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.title !== undefined &&
      !updates.title.trim()
    ) {
      return res.status(400).json({
        message: "Task title cannot be empty",
      });
    }

    if (
      updates.priority !== undefined &&
      !["Low", "Medium", "High"].includes(updates.priority)
    ) {
      return res.status(400).json({
        message: "Invalid priority",
      });
    }

    if (
      updates.status !== undefined &&
      !["Pending", "In Progress", "Completed"].includes(updates.status)
    ) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    if (updates.title !== undefined) {
      updates.title = updates.title.trim();
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
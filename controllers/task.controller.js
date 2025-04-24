const Task = require('../models/tasks.model');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { 
		title, 
		description, 
		category, 
		deadline,
		priority 
	} = req.body;

    if (!title || !priority) {
        return res.status(400).json({ error: "Title and priority are required" });
    }

    const task = new Task({ title, description, category, deadline, priority, creator: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: `Error creating task: ${error.message}` });
  }
};

const getTasks = async (req, res) => {
    try {
        // Destructure query parameters with default values
        const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;

        // Convert `page` and `limit` to numbers (they are strings by default)
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Fetch tasks with pagination and sorting
        const tasks = await Task.find({ creator: req.user.id })
            .sort({ [sortBy]: order === "desc" ? -1 : 1 }) // Sort by field and order
            .skip((pageNumber - 1) * limitNumber) // Skip tasks for previous pages
            .limit(limitNumber); // Limit the number of tasks per page

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: `Error fetching tasks: ${error.message}` });
    }
};

const getTasksByCategory = async (req, res) => {
	try {
    	const { category } = req.params;
    	const tasks = await Task.find({ creator: req.user.id, category }); // Filter by user and category
    	res.json(tasks);
  	} catch (error) {
    	res.status(400).json({ error: error.message });
  }
};


// Update a task
const updateTask = async (req, res) => {
    const { id } = req.params;

    try {
        // Find and update the task
        const task = await Task.findOneAndUpdate(
            { _id: id, creator: req.user.id }, // Ensure the task belongs to the user
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the task
        const task = await Task.findOneAndDelete({ _id: id, creator: req.user.id });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};

module.exports = { createTask, getTasks, getTasksByCategory, updateTask, deleteTask };
const express = require("express");
const { 
    createTask,
    getTasks,
    updateTask,
    getTasksByCategory,
    deleteTask
} = require("../controllers/task.controller");

const authorization = require("../middlewares/authorization");

const router = express.Router();

router.use(authorization);

router.post("/createtask", createTask);
router.get("/", getTasks);
router.post("/task/:id", updateTask);
router.post("/task/:id", deleteTask);
router.get('/category/:category', getTasksByCategory);

module.exports = router;
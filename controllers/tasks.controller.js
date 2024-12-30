const { tasksJSON } = require("../tasksJSON");

let tasks = tasksJSON.tasks;

const createTask = function (req, res, next) {
  try {
    const newTask = req.body;
    if (!newTask.title || !newTask.description) {
      return res.status(400).send("Invalid data");
    }
    if (
      typeof newTask.title !== "string" ||
      typeof newTask.description !== "string"
    ) {
      return res.status(400).send("Title and description must be strings");
    }
    if (newTask.title.trim() === "" || newTask.description.trim() === "") {
      return res.status(400).send("Title and description cannot be empty");
    }
    newTask.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    newTask.completed = false;
    tasks.push(newTask);
    return res.status(201).send(newTask);
  } catch (error) {
    next(error);
  }
};

const getTasks = function (_req, res, next) {
  try {
    if (!tasks || tasks.length === 0) {
      return res.status(404).send("No tasks available");
    }
    return res.status(200).send(tasks);
  } catch (error) {
    next(error);
  }
};

const getTask = function (req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).send("Invalid task ID");
    }
    const task = tasks.find((task) => task.id === id);
    if (!task) {
      return res.status(404).send("Task not found");
    }
    return res.status(200).send(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = function (req, res, next) {
  try {
    {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).send("Invalid task ID");
      }
      const updatedTask = req.body;
      const task = tasks.find((task) => task.id === id);
      if (!task) {
        return res.status(404).send("Task not found");
      }
      if (
        !updatedTask.title ||
        !updatedTask.description ||
        updatedTask.completed === undefined
      ) {
        return res.status(400).send("Invalid data");
      }
      if (
        typeof updatedTask.title !== "string" ||
        typeof updatedTask.description !== "string" ||
        typeof updatedTask.completed !== "boolean"
      ) {
        return res
          .status(400)
          .send(
            "Title and description must be strings and completed must be a boolean"
          );
      }
      if (
        updatedTask.title.trim() === "" ||
        updatedTask.description.trim() === ""
      ) {
        return res.status(400).send("Title and description cannot be empty");
      }
      task.title = updatedTask.title;
      task.description = updatedTask.description;
      task.completed = updatedTask.completed;
      return res.status(200).send(task);
    }
  } catch (error) {
    next(error);
  }
};

const deleteTask = function (req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).send("Invalid task ID");
    }
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      return res.status(404).send("Task not found");
    }
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    return res.status(200).send(deletedTask);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  deleteTask,
  updateTask,
};

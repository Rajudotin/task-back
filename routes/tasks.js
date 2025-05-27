const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ GET tasks by username
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const result = await db.execute("SELECT id FROM users WHERE username = ?", [username]);
    const [users] = result;

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = users[0].id;

    const taskResult = await db.execute("SELECT * FROM tasks WHERE user_id = ?", [userId]);
    const [tasks] = taskResult;

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// ✅ POST /tasks/add
router.post("/add", async (req, res) => {
  const { username, text } = req.body;

  try {
    const result = await db.execute("SELECT id FROM users WHERE username = ?", [username]);
    const [users] = result;

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = users[0].id;

    const insertResult = await db.execute(
      "INSERT INTO tasks (user_id, text) VALUES (?, ?)",
      [userId, text]
    );
    const [insertInfo] = insertResult;

    res.status(201).json({
      taskId: insertInfo.insertId,
      text,
      completed: false,
    });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ message: "Error adding task" });
  }
});

// ✅ PUT update task
router.put("/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { text, completed } = req.body;

  try {
    await db.execute("UPDATE tasks SET text = ?, completed = ? WHERE id = ?", [
      text,
      completed,
      taskId,
    ]);
    res.status(200).json({ message: "Task updated" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Error updating task" });
  }
});

// ✅ DELETE task
router.delete("/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    await db.execute("DELETE FROM tasks WHERE id = ?", [taskId]);
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;

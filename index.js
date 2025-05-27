const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const taskRoutes = require("./routes/tasks"); // ✅ Import tasks
const registerRoute = require("./routes/register"); // ✅ Import register route
const loginRoute = require("./routes/login");

app.use(cors());
app.use(express.json());

// Routes
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/tasks", taskRoutes); // ✅ Add this line

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

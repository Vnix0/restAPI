// server.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/User");

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB!");
});

app.use(express.json());

// GET: return all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: add a new user to the database
app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;

  const user = new User({
    name,
    email,
    age,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: edit a user by id
app.put("/users/:id", async (req, res) => {
  const { name, email, age } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error("User not found.");

    user.name = name || user.name;
    user.email = email || user.email;
    user.age = age || user.age;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: remove a user by id
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error("User not found.");

    await user.remove();
    res.json({ message: "User deleted." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});

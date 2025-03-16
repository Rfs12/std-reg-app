const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Student Model
const Student = require("./model/student");

// Routes

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

// Create a new student
app.post("/students", async (req, res) => {
  try {
    const { name, image, age, status } = req.body;
    const newStudent = new Student({ name, image, age, status });
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

// Update student status
app.put("/students/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Active", "Inactive"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

// Delete student
app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.json({ message: "Student deleted." });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

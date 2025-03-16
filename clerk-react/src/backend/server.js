const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
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

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Add a unique suffix to the filename
  },
});

const upload = multer({ storage });

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API to add a new student with an image
app.post("/students", upload.single("image"), async (req, res) => {
  try {
    const { name, age, status } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Save the file path

    const newStudent = new Student({ name, age, status, image });
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: "Error adding student", error });
  }
});
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
app.put("/students/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, status } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, age, status, image },
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error });
  }
});
app.put("/students/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, status } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, age, status, image },
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    image: {
      type: String, // Optional: Image URL as a string
      required: false,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive", // Default status is "Inactive"
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Student = mongoose.model("students", studentSchema); // Collection will be 'students'

module.exports = Student;

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const studentSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true, // Ensure the ID is unique
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    image: {
      type: String, // Optional: Image URL as a string
      required: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [10, "Age cannot be under 10"],
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

// Apply the auto-increment plugin to the studentSchema
studentSchema.plugin(AutoIncrement, { inc_field: "ID" });

// Reset the counter to the highest ID in the collection
studentSchema.pre("save", async function (next) {
  if (!this.isNew) return next(); // Only run for new documents

  try {
    const lastStudent = await Student.findOne().sort({ ID: -1 }).exec();
    if (lastStudent && lastStudent.ID) {
      this.ID = lastStudent.ID + 1; // Increment the ID
    } else {
      this.ID = 1; // Start from 1 if no documents exist
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Student = mongoose.model("students", studentSchema); // Collection will be 'students'

module.exports = Student;

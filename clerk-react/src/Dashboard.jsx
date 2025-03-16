import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [age, setAge] = useState("");
  const [status, setStatus] = useState("Inactive");
  const [editingStudent, setEditingStudent] = useState(null); // Track the student being edited
  const [editImage, setEditImage] = useState(null); // Track the new image in edit mode

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Set the selected file
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const addStudent = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("status", status);
    if (image) {
      formData.append("image", image); // Append the image file
    }

    try {
      const res = await axios.post("http://localhost:5000/students", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type for file upload
        },
      });
      setStudents([...students, res.data]); // Add the new student to the list
      setName("");
      setAge("");
      setStatus("Inactive");
      setImage(null); // Reset the image input
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/students/${id}/status`,
        {
          status: newStatus,
        }
      );
      setStudents(
        students.map((student) =>
          student._id === id ? { ...student, status: res.data.status } : student
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
      setStudents(students.filter((student) => student._id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const startEditing = (student) => {
    setEditingStudent(student); // Set the student being edited
    setEditImage(null); // Reset the edit image
  };

  const cancelEditing = () => {
    setEditingStudent(null); // Cancel editing mode
  };

  const saveChanges = async () => {
    const formData = new FormData();
    formData.append("name", editingStudent.name);
    formData.append("age", editingStudent.age);
    formData.append("status", editingStudent.status);
    if (editImage) {
      formData.append("image", editImage); // Append the new image file
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/students/${editingStudent._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type for file upload
          },
        }
      );
      setStudents(
        students.map((student) =>
          student._id === editingStudent._id ? res.data : student
        )
      );
      setEditingStudent(null); // Exit editing mode
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingStudent({
      ...editingStudent,
      [name]: value,
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student Dashboard</h2>

      {/* Add Student Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Student</h5>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input required type="file" onChange={handleImageChange} />
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Age"
              value={age}
              required
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={addStudent}>
            Add Student
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Student List</h5>
          <ul className="list-group">
            {students.map((student) => (
              <li key={student._id} className="list-group-item">
                {editingStudent && editingStudent._id === student._id ? (
                  // Edit Mode
                  <div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={editingStudent.name}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setEditImage(e.target.files[0])}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={editingStudent.age}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="mb-3">
                      <select
                        className="form-select"
                        name="status"
                        value={editingStudent.status}
                        onChange={handleEditChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <button
                      className="btn btn-success me-2"
                      onClick={saveChanges}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // View Mode
                  <div className="d-flex align-items-center">
                    {/* Display the student's image */}
                    {student.image && (
                      <img
                        src={`http://localhost:5000${student.image}`} // Use the full image URL
                        alt={student.name}
                        className="rounded-circle me-3"
                        width="50"
                        height="50"
                      />
                    )}
                    <div className="flex-grow-1">
                      <span className="fw-bold">ID: {student.ID}</span> -{" "}
                      {student.name} (Age: {student.age}) - Status:{" "}
                      <span
                        className={
                          student.status === "Active"
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {student.status}
                      </span>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() =>
                          updateStatus(
                            student._id,
                            student.status === "Active" ? "Inactive" : "Active"
                          )
                        }
                      >
                        Toggle Status
                      </button>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => startEditing(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteStudent(student._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

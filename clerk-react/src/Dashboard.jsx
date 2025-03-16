import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState("Inactive");

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
    try {
      const res = await axios.post("http://localhost:5000/students", {
        name,
        image,
        age,
        status,
      });
      setStudents([...students, res.data]);
      setName("");
      setImage("");
      setAge("");
      setStatus("Inactive");
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

  return (
    <div>
      <h2>Student Dashboard</h2>

      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={addStudent}>Add Student</button>
      </div>

      <ul>
        {students.map((student) => (
          <li key={student._id}>
            <img src={student.image} alt={student.name} width="50" />
            <span>
              {student.name} (Age: {student.age}) - Status: {student.status}
            </span>
            <button
              onClick={() =>
                updateStatus(
                  student._id,
                  student.status === "Active" ? "Inactive" : "Active"
                )
              }
            >
              Toggle Status
            </button>
            <button onClick={() => deleteStudent(student._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PatientDatabase = ({ show, onClose }) => {
  const [patients, setPatients] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", medicalHistory: "" });

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5157/patients");
      setPatients(res.data);
    } catch (error) {
      setPatients([]);
    }
  };

  useEffect(() => {
    if (show) fetchPatients();
  }, [show]);

  // Delete patient
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`http://localhost:5157/patients/${id}`);
      setPatients(patients.filter((p) => p.id !== id));
    } catch (error) {
      alert("Failed to delete patient.");
    }
  };

  // Start editing
  const handleEdit = (patient) => {
    setEditing(patient.id);
    setEditForm({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      medicalHistory: patient.medicalHistory,
    });
  };

  // Save update
  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5157/patients/${id}`, {
        ...editForm,
        id,
      });
      setEditing(null);
      fetchPatients();
    } catch (error) {
      alert("Failed to update patient.");
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/admin">
            <i className="bi bi-arrow-left-circle me-2"></i>
            Back to Admin
          </Link>
          <span className="navbar-text text-white ms-auto fw-semibold">
            Patient Database
          </span>
        </div>
      </nav>
      {/* Modal */}
      <div
        className="modal fade show"
        style={{
          display: "block",
          background: "rgba(0,0,0,0.5)",
          zIndex: 1050,
          position: "fixed",
          top: 0, left: 0, width: "100vw", height: "100vh"
        }}
        tabIndex="-1"
        role="dialog"
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">🧑‍⚕️ Patient Database</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive shadow-sm">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Medical History</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p) =>
                      editing === p.id ? (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>
                            <input
                              className="form-control"
                              value={editForm.name}
                              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              value={editForm.email}
                              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              value={editForm.phone}
                              onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              value={editForm.medicalHistory}
                              onChange={e => setEditForm({ ...editForm, medicalHistory: e.target.value })}
                            />
                          </td>
                          <td>
                            <button className="btn btn-success btn-sm me-2" onClick={() => handleUpdate(p.id)}>
                              Save
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(null)}>
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.name}</td>
                          <td>{p.email}</td>
                          <td>{p.phone}</td>
                          <td>{p.medicalHistory}</td>
                          <td>
                            <button className="btn btn-info btn-sm me-2" onClick={() => handleEdit(p)}>
                              Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                    {patients.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">No patients found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDatabase;
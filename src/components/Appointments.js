import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "https://backend-uk7h.onrender.com/appointments";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setAppointments(res.data);
    } catch (error) {
      setAppointments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Delete appointment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchAppointments();
    } catch (error) {
      alert("Failed to delete appointment.");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/admin">
            <i className="bi bi-arrow-left-circle me-2"></i>
            Admin Dashboard
          </Link>
          <span className="navbar-text text-white ms-auto">
            Appointments Management
          </span>
        </div>
      </nav>
      <div className="container py-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h3 className="fw-bold mb-4 text-primary">
              <i className="bi bi-calendar-check me-2"></i>
              Appointments Management
            </h3>
            {loading ? (
              <p>Loading appointments...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Patient ID</th>
                      <th>Doctor ID</th>
                      <th>Date & Time</th>
                      <th>Emergency</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.patientId}</td>
                        <td>{a.doctorId}</td>
                        <td>{new Date(a.appointmentDateTime).toLocaleString()}</td>
                        <td>
                          {a.isEmergency ? (
                            <span className="badge bg-danger">Yes</span>
                          ) : (
                            <span className="badge bg-secondary">No</span>
                          )}
                        </td>
                        <td>
                          {a.notes || <span className="text-muted">No notes</span>}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(a.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No appointments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointments;
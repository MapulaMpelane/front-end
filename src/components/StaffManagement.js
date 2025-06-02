import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // <-- Add this import

const StaffManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({ name: "", email: "", phone: "", specialization: "" });
  const [loading, setLoading] = useState(false);

  const [nurses, setNurses] = useState([]);
  const [newNurse, setNewNurse] = useState({ name: "", email: "", phone: "" });
  const [loadingNurses, setLoadingNurses] = useState(false);

  const [responders, setResponders] = useState([]);
  const [newResponder, setNewResponder] = useState({ name: "", email: "", phone: "" });
  const [loadingResponders, setLoadingResponders] = useState(false);

  const doctorApi = "https://backend-uk7h.onrender.com/doctors"; // Updated endpoint
  const nurseApi = "https://backend-uk7h.onrender.com/nurses"; // Updated endpoint
  const responderApi = "https://backend-uk7h.onrender.com/emergencyresponders"; // Updated endpoint

  // Doctor functions
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(doctorApi);
      setDoctors(response.data);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoading(false);
    }
  };

  const addDoctor = async () => {
    try {
      const response = await axios.post(doctorApi, newDoctor);
      setDoctors([...doctors, response.data]);
      setNewDoctor({ name: "", email: "", phone: "", specialization: "" });
    } catch (error) {
      console.error("Error adding doctor", error);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await axios.delete(`${doctorApi}/${id}`);
      setDoctors(doctors.filter((doc) => doc.Id !== id));
    } catch (error) {
      console.error("Error deleting doctor", error);
    }
  };

  // Nurse functions
  const fetchNurses = async () => {
    setLoadingNurses(true);
    try {
      const response = await axios.get(nurseApi);
      setNurses(response.data);
    } catch (error) {
      console.error("Failed to fetch nurses", error);
    } finally {
      setLoadingNurses(false);
    }
  };

  const addNurse = async () => {
    try {
      const response = await axios.post(nurseApi, newNurse);
      setNurses([...nurses, response.data]);
      setNewNurse({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error adding nurse", error);
    }
  };

  const deleteNurse = async (id) => {
    try {
      await axios.delete(`${nurseApi}/${id}`);
      setNurses(nurses.filter((nurse) => nurse.Id !== id));
    } catch (error) {
      console.error("Error deleting nurse", error);
    }
  };

  // Emergency Responder functions
  const fetchResponders = async () => {
    setLoadingResponders(true);
    try {
      const response = await axios.get(responderApi);
      setResponders(response.data);
    } catch (error) {
      console.error("Failed to fetch responders", error);
    } finally {
      setLoadingResponders(false);
    }
  };

  const addResponder = async () => {
    try {
      const response = await axios.post(responderApi, newResponder);
      setResponders([...responders, response.data]);
      setNewResponder({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error adding responder", error);
    }
  };

  const deleteResponder = async (id) => {
    try {
      await axios.delete(`${responderApi}/${id}`);
      setResponders(responders.filter((r) => r.Id !== id));
    } catch (error) {
      console.error("Error deleting responder", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchNurses();
    fetchResponders();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/admin">
            <i className="bi bi-arrow-left-circle me-2"></i>
            Back to Admin
          </Link>
          <span className="navbar-text text-white ms-auto fw-semibold">
            Staff Management
          </span>
        </div>
      </nav>
      <div className="container py-4">
        <h2 className="fw-bold mb-4">👨‍⚕️ Staff Management</h2>

        {/* Doctor Section */}
        <div className="card mb-4 p-3 shadow-sm">
          <h5>Add New Doctor</h5>
          <div className="row g-2 mb-3">
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Name"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Email"
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Phone"
                value={newDoctor.phone}
                onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Specialization"
                value={newDoctor.specialization}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
              />
            </div>
          </div>
          <button className="btn btn-success" onClick={addDoctor}>
            <i className="bi bi-plus-circle me-2"></i>Add Doctor
          </button>
        </div>

        <h5 className="mb-3">Registered Doctors</h5>
        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <div className="table-responsive shadow-sm mb-5">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.id}</td>
                    <td>{doc.name}</td>
                    <td>{doc.email}</td>
                    <td>{doc.phone}</td>
                    <td>{doc.specialization}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteDoctor(doc.id)}
                      >
                        <i className="bi bi-trash3-fill"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {doctors.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">No doctors found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Nurse Section */}
        <div className="card mb-4 p-3 shadow-sm">
          <h5>Add New Nurse</h5>
          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Name"
                value={newNurse.name}
                onChange={(e) => setNewNurse({ ...newNurse, name: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Email"
                value={newNurse.email}
                onChange={(e) => setNewNurse({ ...newNurse, email: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Phone"
                value={newNurse.phone}
                onChange={(e) => setNewNurse({ ...newNurse, phone: e.target.value })}
              />
            </div>
          </div>
          <button className="btn btn-primary" onClick={addNurse}>
            <i className="bi bi-plus-circle me-2"></i>Add Nurse
          </button>
        </div>

        <h5 className="mb-3">Registered Nurses</h5>
        {loadingNurses ? (
          <p>Loading nurses...</p>
        ) : (
          <div className="table-responsive shadow-sm">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {nurses.map((nurse) => (
                  <tr key={nurse.id}>
                    <td>{nurse.id}</td>
                    <td>{nurse.name}</td>
                    <td>{nurse.email}</td>
                    <td>{nurse.phone}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteNurse(nurse.id)}
                      >
                        <i className="bi bi-trash3-fill"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {nurses.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No nurses found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Emergency Responder Section */}
        <div className="card mb-4 p-3 shadow-sm">
          <h5>Add New Emergency Responder</h5>
          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Name"
                value={newResponder.name}
                onChange={(e) => setNewResponder({ ...newResponder, name: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Email"
                value={newResponder.email}
                onChange={(e) => setNewResponder({ ...newResponder, email: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Phone"
                value={newResponder.phone}
                onChange={(e) => setNewResponder({ ...newResponder, phone: e.target.value })}
              />
            </div>
          </div>
          <button className="btn btn-warning" onClick={addResponder}>
            <i className="bi bi-plus-circle me-2"></i>Add Emergency Responder
          </button>
        </div>

        <h5 className="mb-3">Registered Emergency Responders</h5>
        {loadingResponders ? (
          <p>Loading responders...</p>
        ) : (
          <div className="table-responsive shadow-sm mb-5">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {responders.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.phone}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteResponder(r.id)}
                      >
                        <i className="bi bi-trash3-fill"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {responders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No responders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default StaffManagement;

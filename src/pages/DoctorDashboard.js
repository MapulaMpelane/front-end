import React, { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios";
// Simulate endpoints with dummy JSON
const dummyEndpoints = {
  descriptions: "https://jsonplaceholder.typicode.com/posts",
  conditions: "https://jsonplaceholder.typicode.com/comments",
  treatments: "https://jsonplaceholder.typicode.com/albums",
  support: "https://jsonplaceholder.typicode.com/photos",
  followups: "https://jsonplaceholder.typicode.com/todos"
};

const DoctorDashboard = () => {
  const [data, setData] = useState({
    
    descriptions: [],
    conditions: [],
    treatments: [],
    support: [],
    followups: []
  });

    const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [b , setB] = useState("");



  const ambulanceApi = "http://localhost:8080/api/appointments";


  const fetchAmbulances = async () => {
    setLoading(true);
    try {
      const response = await axios.get(ambulanceApi);
      setAmbulances(response.data);
    } catch (error) {
      console.error("Failed to fetch ambulances", error);
    } finally {
      setLoading(false);
    }
  };



  const approve = async (id) => {
    try {
      await axios.put(`${ambulanceApi}/${id}`);
      setAmbulances(ambulances.filter((a) => a.bookingId !== id));
    } catch (error) {
      console.error("Error deleting ambulance booking", error);
    }
  };




  useEffect(() => {
    fetchAmbulances();
   
  }, []);


  const [activeSection, setActiveSection] = useState(null);

  // Fetch data from all dummy endpoints
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          descRes,
          condRes,
          treatRes,
          supportRes,
          followRes
        ] = await Promise.all([
          fetch(dummyEndpoints.descriptions).then(res => res.json()),
          fetch(dummyEndpoints.conditions).then(res => res.json()),
          fetch(dummyEndpoints.treatments).then(res => res.json()),
          fetch(dummyEndpoints.support).then(res => res.json()),
          fetch(dummyEndpoints.followups).then(res => res.json())
        ]);

        setData({
          descriptions: descRes.slice(0, 5),
          conditions: condRes.slice(0, 5),
          treatments: treatRes.slice(0, 5),
          support: supportRes.slice(0, 5),
          followups: followRes.slice(0, 5)
        });

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardSections = [
    {
      key: "descriptions",
      icon: "file-medical-text",
      title: "Patient Descriptions",
      desc: "Detailed patient medical histories.",
      btn: "primary"
    },
    {
      key: "conditions",
      icon: "heart-pulse",
      title: "Identify Conditions",
      desc: "Analyze patient data to diagnose issues.",
      btn: "danger"
    },
    {
      key: "treatments",
      icon: "chat-left-text",
      title: "Treatment Options",
      desc: "Discuss possible treatments with patients.",
      btn: "success"
    },
    {
      key: "support",
      icon: "life-preserver",
      title: "Medical Support",
      desc: "Offer support and guidance.",
      btn: "warning"
    },
    {
      key: "followups",
      icon: "calendar-plus",
      title: "Follow-Up Appointments",
      desc: "Organize and schedule follow-ups.",
      btn: "info"
    }
  ];

  return (
    <div className="d-flex flex-column flex-md-row vh-100 bg-gradient bg-body-tertiary">
      {/* Sidebar */}
      <aside className="bg-dark text-white p-4" style={{ width: "260px" }}>
        <h4 className="mb-4 fw-bold">🩺 Doctor Panel</h4>
        <ul className="nav flex-column gap-2">
          {cardSections.map(section => (
            <li className="nav-item" key={section.key}>
              <button
                className={`nav-link text-white btn btn-link text-start ${
                  activeSection === section.key ? "fw-bold text-info" : ""
                }`}
                onClick={() => setActiveSection(section.key)}
              >
                <i className={`bi bi-${section.icon} me-2`}></i>
                {section.title}
              </button>
            </li>
          ))}
          <li className="nav-item mt-4">
            <a className="nav-link text-danger" href="#"><i className="bi bi-box-arrow-right me-2"></i>Logout</a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4 overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Doctor Dashboard</h2>
          <span className="badge bg-primary fs-6 shadow-sm">Welcome, Doctor</span>
        </div>

        <div className="row g-4">
          {cardSections.map((card, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="card h-100 shadow-sm border-0 bg-white rounded-4">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <i className={`bi bi-${card.icon} text-${card.btn} fs-3 me-3`}></i>
                    <h5 className="card-title fw-bold mb-0">{card.title}</h5>
                  </div>
                  <p className="card-text text-muted flex-grow-1">{card.desc}</p>
                  <button
                    className={`btn btn-${card.btn} mt-2`}
                    onClick={() => setActiveSection(card.key)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic section data display */}
        {activeSection && (
        <div className="table-responsive shadow-sm mb-5">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>PatientId</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Emergency</th>

              </tr>
            </thead>
            <tbody>
              {ambulances.map((a) => (
                <tr key={a.appointmentId}>
                  <td>{a.appointmentId}</td>
                  <td>{a.patientId}</td>
                  <td>{a.appointmentDateTime}</td>
                  <td>{a.notes}</td>
                  <td>{a.emergency && "true"}</td>
              
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => approve(a.bookingId)}
                    >
                      <i className=""></i> Approve
                    </button>
                  </td>
                </tr>
              ))}
              {ambulances.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">No ambulance booking found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;

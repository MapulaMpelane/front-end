import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

const EmergencyDashboard = () => (
  <div className="d-flex flex-column flex-md-row vh-100 bg-gradient bg-body-tertiary">
    {/* Sidebar */}
    <aside className="bg-dark text-white p-4" style={{ width: "260px" }}>
      <h4 className="mb-4 fw-bold">🚑 Emergency Panel</h4>
      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <a className="nav-link text-white" href="#"><i className="bi bi-speedometer2 me-2"></i>Dashboard</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#"><i className="bi bi-truck me-2"></i>Track Ambulances</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#"><i className="bi bi-people-fill me-2"></i>Dispatch Responders</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#"><i className="bi bi-journal-text me-2"></i>Log Incidents</a>
        </li>
        <li className="nav-item mt-4">
          <a className="nav-link text-danger" href="#"><i className="bi bi-box-arrow-right me-2"></i>Logout</a>
        </li>
      </ul>
    </aside>

    {/* Main Content */}
    <main className="flex-grow-1 p-4 overflow-auto">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Emergency Dashboard</h2>
        <span className="badge bg-primary fs-6 shadow-sm">Welcome, Emergency Team</span>
      </div>

      <div className="row g-4">
        {[
          {
            icon: "truck",
            title: "Track Ambulances",
            desc: "Monitor real-time ambulance locations and routes.",
            btn: "primary",
          },
          {
            icon: "people-fill",
            title: "Dispatch Responders",
            desc: "Assign emergency teams to incidents efficiently.",
            btn: "danger",
          },
          {
            icon: "journal-text",
            title: "Log Incident Reports",
            desc: "Record emergency incidents and actions taken.",
            btn: "warning",
          },
        ].map((card, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <div className="card h-100 shadow-sm border-0 bg-white rounded-4">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <i className={`bi bi-${card.icon} text-${card.btn} fs-3 me-3`}></i>
                  <h5 className="card-title fw-bold mb-0">{card.title}</h5>
                </div>
                <p className="card-text text-muted flex-grow-1">{card.desc}</p>
                <button className={`btn btn-${card.btn} mt-2`}>Open</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
);

export default EmergencyDashboard;

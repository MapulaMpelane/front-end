import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

const NurseDashboard = () => (
  <div className="d-flex flex-column flex-md-row vh-100 bg-gradient bg-body-tertiary">
    {/* Sidebar */}
    <aside className="bg-dark text-white p-4" style={{ width: "260px" }}>
      <h4 className="mb-4 fw-bold">🩺 Nurse Panel</h4>
      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <a className="nav-link text-white" href="#"><i className="bi bi-speedometer2 me-2"></i>Dashboard</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#"><i className="bi bi-clipboard-check me-2"></i>Conduct Tests</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#"><i className="bi bi-file-earmark-medical me-2"></i>Update Reports</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#"><i className="bi bi-person-heart me-2"></i>Support Doctors</a>
        </li>
        <li className="nav-item mt-4">
          <a className="nav-link text-danger" href="#"><i className="bi bi-box-arrow-right me-2"></i>Logout</a>
        </li>
      </ul>
    </aside>

    {/* Main Content */}
    <main className="flex-grow-1 p-4 overflow-auto">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Nurse Dashboard</h2>
        <span className="badge bg-primary fs-6 shadow-sm">Welcome, Nurse</span>
      </div>

      <div className="row g-4">
        {[
          {
            icon: "clipboard-check",
            title: "Conduct Routine Tests",
            desc: "Perform patient tests and log results efficiently.",
            btn: "primary",
          },
          {
            icon: "file-earmark-medical",
            title: "Update Patient Reports",
            desc: "Enter and update patient test results and medical data.",
            btn: "success",
          },
          {
            icon: "person-heart",
            title: "Support Doctors & Patients",
            desc: "Assist doctors in patient care and appointment scheduling.",
            btn: "info",
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

export default NurseDashboard;

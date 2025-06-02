import React from "react";
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Only keep the relevant cards
  const dashboardCards = [
    {
      icon: "truck",
      title: "Booked Ambulances",
      desc: "View and approve ambulances",
      btn: "danger",
      route: "/ambulances",
    },
    {
      icon: "people",
      title: "Staff Management",
      desc: "Add/remove staff, manage schedules and duties.",
      btn: "success",
      route: "/staff-management",
    },
    {
      icon: "person-lines-fill",
      title: "Patient Database",
      desc: "Search and update patient health information.",
      btn: "info",
      route: "/patients",
    },
    {
      icon: "calendar-check",
      title: "Manage Appointments",
      desc: "View and update all appointments.",
      btn: "primary",
      route: "/appointments",
    },
  ];

  // Simple logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Responsive Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-heart-pulse me-2"></i>Admin Console
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarAdmin"
            aria-controls="navbarAdmin"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarAdmin">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link text-white" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1 p-4 overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Admin Dashboard</h2>
          <span className="badge bg-primary fs-6 shadow-sm">Welcome, Admin</span>
        </div>

        <div className="row g-4">
          {dashboardCards.map((card, index) => (
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
                    onClick={() => navigate(card.route)}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

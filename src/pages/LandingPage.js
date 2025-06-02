import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-between align-items-center bg-primary bg-gradient">
      <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1">
        <div
          className="card shadow-lg bg-white border-0 rounded-4 p-5 mt-5"
          style={{ maxWidth: 640, width: '100%' }}
        >
          <h1 className="display-5 fw-bold text-center text-primary mb-3">
            Welcome to the Hospital Management System
          </h1>
          <p className="text-center text-muted fs-5 mb-4">
            Streamline hospital operations and deliver exceptional patient care with our modern digital solution.
          </p>

          <section className="mb-4">
            <h2 className="h5 text-center text-primary fw-semibold mb-3">System Designed For</h2>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {[
                { icon: '👩‍⚕️', label: 'Patients' },
                { icon: '👨‍⚕️', label: 'Doctors' },
                { icon: '🧑‍⚕️', label: 'Nurses' },
                { icon: '🛠', label: 'Admins' },
                { icon: '🚑', label: 'Emergency Responders' },
              ].map((role, index) => (
                <span
                  key={index}
                  className="badge rounded-pill bg-light text-dark border border-primary px-3 py-2 fs-6"
                >
                  {role.icon} {role.label}
                </span>
              ))}
            </div>
          </section>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary btn-lg px-4 rounded-pill shadow-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn btn-outline-primary btn-lg px-4 rounded-pill shadow-sm"
            >
              Register
            </button>
          </div>
        </div>
      </div>

      <footer className="w-100 text-center py-4 text-white-50 bg-transparent small">
        &copy; 2025 <span className="fw-bold">Group 9 Extended</span> — All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;

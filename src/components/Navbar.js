import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container">
      <Link className="navbar-brand" to="/">Hospital System</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link className="nav-link" to="/patient">Patient</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/doctor">Doctor</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/nurse">Nurse</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/emergency">Emergency</Link></li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
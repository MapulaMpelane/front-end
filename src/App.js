import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Use HashRouter for GitHub Pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NurseDashboard from "./pages/NurseDashboard";
import EmergencyDashboard from "./pages/EmergencyDashboard";
import StaffManagement from "./components/StaffManagement";
import { Login } from "./components/Login";
import LandingPage from "./pages/LandingPage";
import { Register } from "./components/Register";
import Ambulances from "./components/Ambulances";
import Patients from "./components/Patients";
import Appointments from "./components/Appointments";

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/nurse" element={<NurseDashboard />} />
          <Route path="/emergency" element={<EmergencyDashboard />} />
          <Route path="/staff-management" element={<StaffManagement />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ambulances" element={<Ambulances />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
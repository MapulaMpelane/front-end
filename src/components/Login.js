import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://backend-uk7h.onrender.com/login", credentials);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("patientData", JSON.stringify(response.data));
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("patientId", response.data.id);

      // Check for admin login
      if (
        credentials.email.toLowerCase() === "admin" &&
        credentials.password === "admin@123"
      ) {
        navigate("/admin"); // Redirect to admin dashboard
      } else {
        navigate("/patient"); // Redirect to patient dashboard
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4 rounded-4">
            <h3 className="text-center text-primary mb-4">🔐 Login</h3>
            <input
              className="form-control mb-3"
              placeholder="Email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
            />
            <input
              className="form-control mb-3"
              placeholder="Password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
            />
            <button className="btn btn-primary w-100 mb-2" onClick={handleLogin}>
              <i className="bi bi-box-arrow-in-right me-2"></i>Login
            </button>
            <div className="text-center">
              <span className="text-muted">Don't have an account?</span>
              <button
                className="btn btn-link p-0 ms-2"
                style={{ textDecoration: "underline" }}
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

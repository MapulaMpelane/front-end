import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    medicalHistory: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Password validation: 6-16 chars, at least 1 special char
  const isPasswordValid = (password) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return (
      password.length >= 6 &&
      password.length <= 16 &&
      specialCharRegex.test(password)
    );
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      // 1. Get all existing patients
      const { data } = await axios.get("https://backend-uk7h.onrender.com/patients");
      const emails = data.map((patient) => patient.email);

      // 2. Check if email already exists
      if (emails.includes(form.email)) {
        alert("Email already registered. Please use a different email.");
        setLoading(false);
        return;
      }

      // 3. Validate password
      if (!isPasswordValid(form.password)) {
        alert("Password must be 6-16 characters and include at least 1 special character.");
        setLoading(false);
        return;
      }

      // 4. Register user
      await axios.post("https://backend-uk7h.onrender.com/patients", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        medicalHistory: form.medicalHistory,
        password: form.password
      });
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4 rounded-4">
            <h3 className="text-center text-primary mb-4">📝 Register</h3>
            <input
              className="form-control mb-3"
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              className="form-control mb-3"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              className="form-control mb-3"
              placeholder="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <textarea
              className="form-control mb-3"
              placeholder="Medical History"
              name="medicalHistory"
              value={form.medicalHistory}
              onChange={handleChange}
              rows={3}
            />
            <input
              className="form-control mb-3"
              placeholder="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
            <button
              className="btn btn-success w-100"
              onClick={handleRegister}
              disabled={loading}
            >
              <i className="bi bi-person-plus me-2"></i>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
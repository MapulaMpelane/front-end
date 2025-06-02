import React, { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";

const MAPS_API_KEY = "AIzaSyCJH2UVNd7udDBjWA4S3vIrZQ5ffxstnbU";

const mapContainerStyle = {
  width: "100%",
  height: "400px"
};

const defaultCenter = {
  lat: -23.9081,   // Polokwane TUT Campus latitude
  lng: 29.4486     // Polokwane TUT Campus longitude
};

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointment, setAppointment] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
    emergency: false
  });
    const [ambilanceBook, setAmbilanceBook] = useState({
    patientId: "",
    responderId: "",
    location: "",
    confirmed: false
  });

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [b , setB] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState(defaultCenter);
  const [showPickLocation, setShowPickLocation] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [eta, setEta] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();

  const ambulanceApi = "https://backend-uk7h.onrender.com/emergencybookings";


  const fetchAmbulances = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://backend-uk7h.onrender.com/emergencybookings");
      const patientId = localStorage.getItem("patientId");
      // Only show bookings for the logged-in patient
      const filtered = response.data.filter(
        (a) => a.patientId === patientId
      );
      setAmbulances(
        filtered.map((a) => ({
          bookingId: a.id,
          patientId: a.patientId,
          responderId: a.responderId,
          location: a.location,
          ambulancelocation: a.ambulanceLocation,
          confirmed: a.confirmed,
          date: a.date,
        }))
      );
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

  // Fetch appointments for the logged-in user
  const fetchAppointments = async () => {
    try {
      const response = await axios.get("https://backend-uk7h.onrender.com/appointments");
      const patientId = localStorage.getItem("patientId");
      // Only show appointments for the logged-in patient
      const filtered = response.data.filter(
        (a) => a.patientId === patientId
      );
      setAppointments(filtered);
    } catch (error) {
      setAppointments([]);
    }
  };

  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      fetchAmbulances();
      fetchAppointments(); // Fetch appointments on mount
      setInitializing(false);
    } else {
      // If not logged in, redirect to login or home
      navigate("/login");
    }
  // eslint-disable-next-line
  }, []);

  // Fetch doctors only after initialization
  useEffect(() => {
    if (!initializing) {
      const fetchDoctors = async () => {
        try {
          const res = await axios.get("https://backend-uk7h.onrender.com/doctors");
          setDoctors(res.data);
        } catch (err) {
          setDoctors([]);
        } finally {
          setLoadingDoctors(false);
        }
      };
      fetchDoctors();
    }
  }, [initializing]);

  // Handle appointment form changes
  const handleAppointmentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppointment((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
const handleLogout = (e) => {
  e.preventDefault();
  localStorage.clear();
  navigate("/login", { replace: true });
};
  // Handle appointment submit
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    const patientId = localStorage.getItem("patientId");
    if (!patientId) {
      alert("Patient not logged in.");
      return;
    }
    if (!appointment.doctorId || !appointment.appointmentDate || !appointment.appointmentTime) {
      alert("Please fill all required fields.");
      return;
    }
    const appointmentDateTime = `${appointment.appointmentDate}T${appointment.appointmentTime}`;
    const selectedDate = new Date(appointmentDateTime);

    try {
      // 1. Get all appointments
      const response = await axios.get("https://backend-uk7h.onrender.com/appointments");
      // 2. Check if the selected doctor has an appointment within 3 hours of the selected time
      const doctorAppointments = response.data.filter(
        (a) => a.doctorId === appointment.doctorId
      );
      const isConflict = doctorAppointments.some((a) => {
        const bookedDate = new Date(a.appointmentDateTime);
        const diffMs = Math.abs(selectedDate - bookedDate);
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours < 3;
      });
      if (isConflict) {
        alert("The selected doctor is not available within 3 hours of this time. Please choose another slot.");
        return;
      }

      // 3. Proceed to book appointment
      await axios.post("https://backend-uk7h.onrender.com/appointments", {
        id: 0,
        patientId: patientId,
        doctorId: appointment.doctorId,
        appointmentDateTime: appointmentDateTime,
        isEmergency: appointment.emergency,
        notes: appointment.notes
      });
      alert("Appointment booked successfully!");
      setAppointment({
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        notes: "",
        emergency: false
      });
      fetchAppointments(); // Refresh appointments list
    } catch (error) {
      alert("Failed to book appointment.");
    }
  };



    const handleBookAmbulanceSubmit = async (e) => {
    e.preventDefault();
    const patientId = localStorage.getItem("patientId");
    if (!patientId) {
      alert("Patient not logged in.");
      return;
    }
    if (!ambilanceBook.location) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await axios.post("https://backend-uk7h.onrender.com/emergencybookings", {
        patientId: patientId,
        responderId: "",
        location: ambilanceBook.location,
        ambulanceLocation: "",
        confirmed: false,
        date: new Date().toISOString()
      });
      alert("Ambulance booked successfully!");
      setAmbilanceBook({
        patientId: "",
        responderId: "",
        location: "",
        confirmed: false
      });
    } catch (error) {
      alert("Failed to book ambulance.");
    }
  };

  // Function to open map modal with ambulance location and patient location
  const handleTrackAmbulance = (ambulanceLocationString, patientLocationString) => {
    // Parse ambulance and patient locations
    if (
      ambulanceLocationString &&
      ambulanceLocationString.includes(",") &&
      patientLocationString &&
      patientLocationString.includes(",")
    ) {
      const [ambulanceLat, ambulanceLng] = ambulanceLocationString.split(",").map(Number);
      const [patientLat, patientLng] = patientLocationString.split(",").map(Number);

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: ambulanceLat, lng: ambulanceLng },
          destination: { lat: patientLat, lng: patientLng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
            // Get ETA from the first leg
            const duration = result.routes[0]?.legs[0]?.duration?.text;
            setEta(duration || null);
          } else {
            setDirections(null);
            setEta(null);
            alert("Could not find a route.");
          }
        }
      );
      setMapLocation({ lat: ambulanceLat, lng: ambulanceLng });
      setShowMap(true);
    } else {
      setDirections(null);
      setEta(null);
      setMapLocation(defaultCenter);
      setShowMap(true);
    }
  };

  // Add this function to handle map click for picking location
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPickedLocation({ lat, lng });
  };

  // Add this function inside PatientDashboard component
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setAmbilanceBook({
            ...ambilanceBook,
            location: `${lat},${lng}`
          });
          setPickedLocation({ lat, lng });
        },
        (error) => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const email = localStorage.getItem("name") || "";

  if (initializing) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={MAPS_API_KEY}>
      {/* Responsive Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
  <div className="container-fluid">
    <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
      <i className="bi bi-heart-pulse me-2"></i>
      Health
      {email && (
        <span className="badge bg-light text-primary ms-3" style={{ fontSize: "1rem" }}>
          {email}
        </span>
      )}
    </Link>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarPatient"
      aria-controls="navbarPatient"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarPatient">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link" to="#" onClick={handleLogout}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
      <div className="d-flex flex-column vh-100 bg-light">
        {/* Removed Sidebar */}
        <main className="flex-grow-1 p-4 overflow-auto">
          <h2 className="text-primary fw-bold mb-4">Patient Dashboard</h2>
          <div className="row g-4">
            {/* Book Appointment */}
            <div className="col-12 col-md-6 col-lg-4 d-flex">
              <div className="card shadow-sm border-0 bg-white rounded-4 flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-calendar-plus fs-3 text-primary me-3"></i>
                    <h5 className="card-title mb-0 fw-bold">Book Appointment</h5>
                  </div>
                  <form onSubmit={handleAppointmentSubmit}>
                    <div className="mb-2">
                      <label className="form-label">Doctor</label>
                      <select
                        className="form-select"
                        name="doctorId"
                        value={appointment.doctorId}
                        onChange={handleAppointmentChange}
                        required
                        disabled={loadingDoctors}
                      >
                        <option value="">Select Doctor</option>
                        {doctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} ({doc.specialization})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="appointmentDate"
                        value={appointment.appointmentDate}
                        onChange={handleAppointmentChange}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="appointmentTime"
                        value={appointment.appointmentTime}
                        onChange={handleAppointmentChange}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Notes</label>
                      <input
                        type="text"
                        className="form-control"
                        name="notes"
                        value={appointment.notes}
                        onChange={handleAppointmentChange}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="emergency"
                        id="emergencyCheck"
                        checked={appointment.emergency}
                        onChange={handleAppointmentChange}
                      />
                      <label className="form-check-label" htmlFor="emergencyCheck">
                        Emergency
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-2">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>



            <div className="col-12 col-md-6 col-lg-4 d-flex">
              <div className="card shadow-sm border-0 bg-white rounded-4 flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-truck fs-3 text-danger me-3"></i>
                    <h5 className="card-title mb-0 fw-bold">Book Ambulance</h5>
                  </div>
                  <form onSubmit={handleBookAmbulanceSubmit}>
                    <div className="mb-2">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="location"
                        value={ambilanceBook.location}
                        readOnly
                        placeholder="Pick location on map"
                        style={{ width: "100%" }}
                      />
                      <div className="d-flex flex-column gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPickLocation(true)}
                        >
                          Pick Location
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-success"
                          onClick={handleUseMyLocation}
                        >
                          Use My Location
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-2">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Appointments Booked by the User */}
            <div className="col-12 col-md-6 col-lg-4 d-flex">
              <div className="card shadow-sm border-0 bg-white rounded-4 flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-calendar-check fs-3 text-success me-3"></i>
                    <h5 className="card-title mb-0 fw-bold">My Appointments</h5>
                  </div>
                  {appointments.length === 0 ? (
                    <p className="text-muted mb-0">No appointments found.</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {appointments.map((a) => (
                        <li key={a.id} className="list-group-item px-0">
                          <div>
                            <strong>Date:</strong>{" "}
                            {new Date(a.appointmentDateTime).toLocaleString()}
                          </div>
                          <div>
                            <strong>Doctor ID:</strong> {a.doctorId}
                          </div>
                          <div>
                            <strong>Emergency:</strong>{" "}
                            {a.isEmergency ? (
                              <span className="badge bg-danger">Yes</span>
                            ) : (
                              <span className="badge bg-secondary">No</span>
                            )}
                          </div>
                          {a.notes && (
                            <div>
                              <strong>Notes:</strong> {a.notes}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Requested Ambulances */}
            <div className="col-12">
      <div className="card shadow-sm border-0 bg-white rounded-4">
        <div className="card-body">
          <h2 className="fw-bold mb-4">👨‍⚕️ Ambulance</h2>
          <h5 className="mb-3">Requested Ambulances</h5>
          {loading ? (
            <p>Loading ambulances...</p>
          ) : (
            <div className="table-responsive shadow-sm mb-0">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>PatientId</th>
                    <th>responderId</th>
                    <th>location</th>
                    <th>ambulancelocation</th>
                    <th>Confirmed</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ambulances.map((a) => (
                    <tr key={a.bookingId}>
                      <td>{a.bookingId}</td>
                      <td>{a.patientId}</td>
                      <td>{a.responderId}</td>
                      <td>{a.location}</td>
                      <td>{a.ambulancelocation}</td>
                      <td>{a.confirmed ? "Yes" : "No"}</td>
                      <td>{a.date}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleTrackAmbulance(a.ambulancelocation, a.location)}
                        >
                          Track Ambulance
                        </button>
                      </td>
                    </tr>
                  ))}
                  {ambulances.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">No ambulance booking found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
          </div>
        </main>
        {/* Google Map Modal */}
          {showMap && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.5)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={() => setShowMap(false)}
            >
              <div
                style={{
                  background: "#fff",
                  padding: 20,
                  borderRadius: 10,
                  minWidth: 350,
                  minHeight: 480, // Increased height for better visibility
                  position: "relative",
                  boxShadow: "0 0 20px rgba(0,0,0,0.2)"
                }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    border: "none",
                    background: "transparent",
                    fontSize: 28,
                    cursor: "pointer",
                    color: "#888"
                  }}
                  onClick={() => setShowMap(false)}
                  aria-label="Close"
                  title="Close"
                >
                  &times;
                </button>
                <h5 className="mb-3 text-center text-primary fw-bold">
        Ambulance Route & ETA
      </h5>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapLocation}
                  zoom={13}
                >
                  {directions ? (
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        polylineOptions: {
                          strokeColor: "#1976d2",
                          strokeWeight: 5
                        }
                      }}
                    />
                  ) : (
                    <Marker position={mapLocation} />
                  )}
                </GoogleMap>
                {eta && (
                  <div className="alert alert-info mt-3 text-center">
                    <i className="bi bi-clock-history me-2"></i>
                    Estimated Arrival Time: <strong>{eta}</strong>
                  </div>
                )}
                {!directions && (
                  <div className="alert alert-warning mt-3 text-center">
                    No route available. Waiting for ambulance location update.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal for picking location */}
          {showPickLocation && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.5)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={() => setShowPickLocation(false)}
            >
              <div
                style={{
                  background: "#fff",
                  padding: 20,
                  borderRadius: 10,
                  minWidth: 350,
                  minHeight: 420,
                  position: "relative"
                }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    border: "none",
                    background: "transparent",
                    fontSize: 24,
                    cursor: "pointer"
                  }}
                  onClick={() => setShowPickLocation(false)}
                >
                  &times;
                </button>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={pickedLocation || defaultCenter}
                  zoom={15}
                  onClick={handleMapClick}
                >
                  {pickedLocation && <Marker position={pickedLocation} />}
                </GoogleMap>
                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={() => {
                    if (pickedLocation) {
                      setAmbilanceBook({
                        ...ambilanceBook,
                        location: `${pickedLocation.lat},${pickedLocation.lng}`
                      });
                      setShowPickLocation(false);
                    } else {
                      alert("Please pick a location on the map.");
                    }
                  }}
                >
                  Use This Location
                </button>
              </div>
            </div>
          )}
      </div>
    </LoadScript>
  );
};

export default PatientDashboard;

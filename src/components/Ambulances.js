import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { Link } from "react-router-dom"; // <-- Add this import

const MAPS_API_KEY = "AIzaSyCJH2UVNd7udDBjWA4S3vIrZQ5ffxstnbU"; // Replace with your key
const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: -23.9081, lng: 29.4486 }; // Polokwane TUT Campus

const Ambulances = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responders, setResponders] = useState([]);
  const [assigning, setAssigning] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [mapBookingId, setMapBookingId] = useState(null);
  const [pickedLocation, setPickedLocation] = useState(null);

  const ambulanceApi = "https://backend-uk7h.onrender.com/emergencybookings"; // Updated endpoint
  const responderApi = "https://backend-uk7h.onrender.com/emergencyresponders"; // Updated endpoint

  // Fetch all ambulances
  const fetchAmbulances = async () => {
    setLoading(true);
    try {
      const response = await axios.get(ambulanceApi);
      // Map backend fields to frontend expected fields
      setAmbulances(
        response.data.map((a) => ({
          bookingId: a.id,
          patientId: a.patientId,
          responderId: a.responderId,
          location: a.location,
          ambulancelocation: a.ambulanceLocation, // map ambulanceLocation to ambulancelocation
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

  // Fetch all responders
  const fetchResponders = async () => {
    try {
      const response = await axios.get(responderApi);
      setResponders(response.data);
    } catch (error) {
      console.error("Failed to fetch responders", error);
    }
  };

  // Approve and assign responder
  const approveAndAssign = async (bookingId) => {
    const responderId = assigning[bookingId];
    if (!responderId) {
      alert("Please select a responder.");
      return;
    }
    const booking = ambulances.find((a) => a.bookingId === bookingId);
    if (!booking) {
      alert("Booking not found.");
      return;
    }
    try {
      await axios.put(`${ambulanceApi}/${bookingId}`, {
        ...booking,
        responderId,
        confirmed: true,
        ambulancelocation: booking.ambulancelocation || "",
      });
      setAmbulances(
        ambulances.map((a) =>
          a.bookingId === bookingId
            ? { ...a, responderId, confirmed: true }
            : a
        )
      );
      setAssigning((prev) => ({ ...prev, [bookingId]: "" }));
    } catch (error) {
      alert("Failed to approve and assign responder.");
    }
  };

  // Handle map click to pick ambulance location
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPickedLocation({ lat, lng });
  };

  // Save picked ambulance location
  const saveAmbulanceLocation = async () => {
    if (pickedLocation && mapBookingId) {
      // Find the booking to update
      const booking = ambulances.find((a) => a.bookingId === mapBookingId);
      if (!booking) return;

      const updatedBooking = {
        ...booking,
        ambulancelocation: `${pickedLocation.lat},${pickedLocation.lng}`,
      };

      try {
        // Persist to backend
        await axios.put(`${ambulanceApi}/${mapBookingId}`, updatedBooking);

        // Update UI
        setAmbulances(
          ambulances.map((a) =>
            a.bookingId === mapBookingId
              ? { ...a, ambulancelocation: `${pickedLocation.lat},${pickedLocation.lng}` }
              : a
          )
        );
      } catch (error) {
        alert("Failed to update ambulance location.");
      }

      setShowMap(false);
      setMapBookingId(null);
      setPickedLocation(null);
    }
  };

  useEffect(() => {
    fetchAmbulances();
    fetchResponders();
  }, []);

  return (
    <LoadScript googleMapsApiKey={MAPS_API_KEY}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/admin">
            <i className="bi bi-arrow-left-circle me-2"></i>
            Back to Admin
          </Link>
          <span className="navbar-text text-white ms-auto fw-semibold">
            Ambulance Management
          </span>
        </div>
      </nav>
      <div className="container py-4">
        <h2 className="fw-bold mb-4">👨‍⚕️ Ambulance</h2>
        <h5 className="mb-3">Requested Ambulances</h5>
        {loading ? (
          <p>Loading ambulances...</p>
        ) : (
          <div className="table-responsive shadow-sm mb-5">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>PatientId</th>
                  <th>Responder</th>
                  <th>Location</th>
                  <th>Ambulance Location</th>
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
                    <td>
                      <select
                        className="form-select"
                        value={assigning[a.bookingId] || a.responderId || ""}
                        onChange={(e) =>
                          setAssigning((prev) => ({
                            ...prev,
                            [a.bookingId]: e.target.value,
                          }))
                        }
                        disabled={a.confirmed}
                      >
                        <option value="">Select Responder</option>
                        {responders.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.phone})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{a.location}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          className="form-control"
                          value={a.ambulancelocation || ""}
                          readOnly
                          style={{ marginRight: 8 }}
                        />
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setMapBookingId(a.bookingId);
                            // If already set, parse and center map there
                            if (a.ambulancelocation && a.ambulancelocation.includes(",")) {
                              const [lat, lng] = a.ambulancelocation.split(",").map(Number);
                              setPickedLocation({ lat, lng });
                            } else {
                              setPickedLocation(defaultCenter);
                            }
                            setShowMap(true);
                          }}
                          disabled={a.confirmed}
                        >
                          Set on Map
                        </button>
                      </div>
                    </td>
                    <td>{a.confirmed ? "Yes" : "No"}</td>
                    <td>{a.date}</td>
                    <td>
                      {!a.confirmed ? (
                        <button
                          className="btn btn-success"
                          onClick={() => approveAndAssign(a.bookingId)}
                        >
                          Approve & Assign
                        </button>
                      ) : (
                        <span className="text-success fw-bold">Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {ambulances.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No ambulance booking found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Google Map Modal for picking ambulance location */}
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
              justifyContent: "center",
            }}
            onClick={() => setShowMap(false)}
          >
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 10,
                minWidth: 350,
                minHeight: 420,
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  border: "none",
                  background: "transparent",
                  fontSize: 24,
                  cursor: "pointer",
                }}
                onClick={() => setShowMap(false)}
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
                onClick={saveAmbulanceLocation}
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

export default Ambulances;

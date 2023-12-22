import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    chassisNumber: "",
    registrationNumber: "",
    lastLocation: { lat: 0, long: 0 },
    kind: "",
    milesDriven: 0,
    lastInspection: new Date().toISOString(),
  });
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("https://vehicles-g0qb.onrender.com/api/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setNewVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleLocationChange = (e, type) => {
    const { value } = e.target;
    setNewVehicle((prev) => ({
      ...prev,
      lastLocation: {
        ...prev.lastLocation,
        [type]: value,
      },
    }));
  };

  const addVehicle = async () => {
    try {
      await axios.post("https://vehicles-g0qb.onrender.com/api/vehicles", newVehicle);
      setNewVehicle({
        chassisNumber: "",
        registrationNumber: "",
        lastLocation: { lat: 0, long: 0 },
        kind: "",
        milesDriven: 0,
        lastInspection: new Date().toISOString(),
      });
      fetchVehicles();
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const editVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle(vehicle);
  };

  const updateVehicle = async () => {
    try {
      await axios.put(
        `https://vehicles-g0qb.onrender.com/api/vehicles/${editingVehicle._id}`,
        newVehicle
      );
      setEditingVehicle(null);
      setNewVehicle({
        chassisNumber: "",
        registrationNumber: "",
        lastLocation: { lat: 0, long: 0 },
        kind: "",
        milesDriven: 0,
        lastInspection: new Date().toISOString(),
      });
      fetchVehicles();
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await axios.delete(`https://vehicles-g0qb.onrender.com/api/vehicles/${id}`);
      fetchVehicles();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };
  console.log(newVehicle);
  return (
    <div className="app-container">
      <h1>Vehicle Management App</h1>
      <div className="form-container">
        <h2>{editingVehicle ? "Edit Vehicle" : "Add a New Vehicle"}</h2>
        <label>Chassis Number:</label>
        <input
          type="text"
          name="chassisNumber"
          value={newVehicle.chassisNumber}
          onChange={handleInputChange}
        />
        <label>Registration Number:</label>
        <input
          type="text"
          name="registrationNumber"
          value={newVehicle.registrationNumber}
          onChange={handleInputChange}
          placeholder=""
        />

        <label>Last Location:</label>
        <div>
          <input
            type="text"
            name="lat"
            value={newVehicle.lastLocation.lat}
            onChange={(e) => handleLocationChange(e, "lat")}
            placeholder="Latitude"
          />
          <input
            type="text"
            name="long"
            value={newVehicle.lastLocation.long}
            onChange={(e) => handleLocationChange(e, "long")}
            placeholder="Longitude"
          />
        </div>
        <label>Kind:</label>

        <select
          name="kind"
          onChange={handleInputChange}
          value={newVehicle.kind}
        >
          <option selected>Select</option>
          <option value="Reefer">Reefer</option>
          <option value="Heavy">Heavy</option>
          <option value="Light">Light</option>
        </select>
        <br />
        <label>Miles Driven:</label>
        <input
          type="number"
          name="milesDriven"
          value={newVehicle.milesDriven}
          onChange={handleInputChange}
        />

        <label>Last Inspection:</label>
        <input
          type="datetime-local"
          id="birthdaytime"
          name="lastInspection"
          value={newVehicle.lastInspection}
          onChange={handleInputChange}
        ></input>

        {editingVehicle ? (
          <button className="update-button" onClick={updateVehicle}>
            Update Vehicle
          </button>
        ) : (
          <button className="add-button" onClick={addVehicle}>
            Add Vehicle
          </button>
        )}
      </div>

      <div className="list-container">
        <h2>Vehicle List</h2>
        <ul>
          {vehicles.map((vehicle) => (
            <li key={vehicle._id} className="vehicle-item">
              {vehicle.chassisNumber} - {vehicle.registrationNumber} -{" "}
              {vehicle.kind}
              <button
                className="edit-button"
                onClick={() => editVehicle(vehicle)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => deleteVehicle(vehicle._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

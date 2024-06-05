// src/Doctors.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../Usercontext";

const Doctors = () => {
  const { userId } = useUser();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get("http://127.0.0.1:5000/doctors");
      setDoctors(response.data);
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const appointment = {
      user_id: userId,
      doctor_id: selectedDoctor,
      data: appointmentDate,
      hora: appointmentTime,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/appointments",
        appointment
      );
      alert(response.data.message);
    } catch (error) {
      alert("Error creating appointment");
    }
  };
  const handleAppointment = async (doctorId) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/appointments", {
        user_id: userId,
        doctor_id: doctorId,
        data: "2024-06-01", // Exemplo de data
        hora: "10:00", // Exemplo de hora
      });
      if (response.status === 200) {
        alert("Appointment made successfully");
      }
    } catch (error) {
      console.error("Error making appointment", error);
    }
  };

  return (
    <div>
      <h2>Doctors</h2>
      {doctors.length > 0 ? (
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              <p>Nome: {doctor.nome}</p>
              <p>Especialidade: {doctor.especialidade}</p>
              <p>CRM: {doctor.crm}</p>
              <button onClick={() => handleAppointment(doctor.id)}>
                Agendar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Carregando médicos...</p>
      )}
    </div>
  );
};

export default Doctors;

// src/Home.js

import React, { useState, useEffect } from "react";
import axios from "axios";

import { useUser } from "../../Usercontext";
import Doctors from "../../components/doctors";

const Home = () => {
  const { userId } = useUser();
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/users/${userId}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors", error);
      }
    };

    if (userId) {
      fetchUserData();
      fetchDoctors();
    }
  }, [userId]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/appointments/user/${userId}`
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };

    if (userId) {
      fetchAppointments();
    }
  }, [userId, appointments]);

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/appointments", {
        user_id: userId,
        doctor_id: selectedDoctor,
        data: date,
        hora: time,
      });
      if (response.status === 201) {
        alert("Appointment made successfully");
        setAppointments((prevAppointments) => [
          ...prevAppointments,
          response.data,
        ]);
      }
    } catch (error) {
      console.error("Error making appointment", error);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/appointments/${appointmentId}`);
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment.appointment_id !== appointmentId
        )
      );
    } catch (error) {
      console.error("Error deleting appointment", error);
    }
  };

  return (
    <div className="container">
      <h1>Clínica Santa Emília de Rodat</h1>
      {user ? (
        <div>
          <h2>Dados do Usuário: </h2>
          <p>Nome: {user.nome}</p>
          <p>CPF: {user.cpf}</p>
          <p>Idade: {user.idade}</p>
          <p>Endereço: {user.endereco}</p>
          <p>Data de Nascimento: {user.dataNascimento}</p>
          <p>Estado de Origem: {user.estadoOrigem}</p>
          <p>Cidade: {user.cidade}</p>
          <p>Comorbidades: {user.comorbidades}</p>
        </div>
      ) : (
        <p>Carregando dados do usuário...</p>
      )}

      <h2>Agendar Consulta: </h2>
      <form onSubmit={handleAppointment}>
        <div>
          <label>Médico: </label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">Selecione um médico</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.nome} - {doctor.especialidade}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Data: </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Hora: </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Agendar</button>
      </form>

      <h2>Meus Agendamentos: </h2>
      {appointments.length > 0 ? (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div className="appointment-card" key={appointment.appointment_id}>
              <p>Médico: {appointment.doctor_name}</p>
              <p>Especialidade: {appointment.specialty}</p>
              <p>CRM: {appointment.crm}</p>
              <p>Data: {appointment.date}</p>
              <p>Hora: {appointment.time}</p>
              <button
                onClick={() =>
                  handleCancelAppointment(appointment.appointment_id)
                }
              >
                Desmarcar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Você não tem agendamentos.</p>
      )}
    </div>
  );
};

export default Home;

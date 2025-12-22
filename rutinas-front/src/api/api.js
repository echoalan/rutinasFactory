import { API_URL } from "../api/env";

// Rutinas
export const getRutinas = () =>
  fetch(`${API_URL}/rutinas`).then(r => r.json());

export const getRutina = (id) =>
  fetch(`${API_URL}/rutinas/${id}`).then(r => r.json());

// Ejercicios
export const getEjercicios = () =>
  fetch(`${API_URL}/ejercicios`).then(r => r.json());

// Crear rutina
export const crearRutina = (data) =>
  fetch(`${API_URL}/rutinas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const eliminarRutina = (id) =>
  fetch(`${API_URL}/rutinas/${id}`, {
    method: "DELETE",
  }).then(r => r.json());

// Crear ejercicio (con imagen)
export const crearEjercicio = (formData) =>
  fetch(`${API_URL}/ejercicios`, {
    method: "POST",
    body: formData,
  }).then(r => r.json());

// Agregar ejercicio a rutina
export const agregarEjercicioARutina = (rutinaId, data) =>
  fetch(`${API_URL}/rutinas/${rutinaId}/ejercicios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());


export const quitarEjercicioDeRutina = (rutinaId, pivotId) =>
  fetch(`${API_URL}/rutinas/${rutinaId}/ejercicios/${pivotId}`, {
    method: "DELETE",
  }).then(r => r.json());
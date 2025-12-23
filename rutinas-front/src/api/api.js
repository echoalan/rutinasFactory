import { API_URL } from "../api/env";

// Fetch con token
export const fetchWithToken = (url, token, options = {}) => {
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    // Manejo de errores global
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw error;
    }
    return res.json();
  });
};

// ------------------------------------
// Rutinas (requieren token)
// ------------------------------------
export const getRutinas = (token) =>

 
    
  fetchWithToken("/rutinas", token);

export const getRutina = (id, token) =>
  fetchWithToken(`/rutinas/${id}`, token);

export const crearRutina = (data, token) =>
  fetchWithToken("/rutinas", token, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const eliminarRutina = (id, token) =>
  fetchWithToken(`/rutinas/${id}`, token, {
    method: "DELETE",
  });

// ------------------------------------
// Ejercicios
// ------------------------------------
export const getEjercicios = (token) =>
  fetchWithToken("/ejercicios", token);

export const crearEjercicio = (formData, token) =>
  fetch(`${API_URL}/ejercicios`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json());

export const agregarEjercicioARutina = (rutinaId, data, token) =>
  fetchWithToken(`/rutinas/${rutinaId}/ejercicios`, token, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const quitarEjercicioDeRutina = (rutinaId, pivotId, token) =>
  fetchWithToken(`/rutinas/${rutinaId}/ejercicios/${pivotId}`, token, {
    method: "DELETE",
  });

export const eliminarEjercicio = async (id, token) => {
  const res = await fetch(`${API_URL}/ejercicios/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204) return { ok: true };
  try {
    return await res.json();
  } catch {
    return { ok: true };
  }
};

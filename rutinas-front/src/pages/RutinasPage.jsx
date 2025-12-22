import { useEffect, useState } from "react";
import { getRutinas, crearRutina, eliminarRutina } from "../api/api";
import EjercicioModal from "../components/EjercicioModal";
import LoadingButton from "../components/LoadingButton";

export default function RutinasPage({ onSelect, mostrarMensaje }) {
  const [rutinas, setRutinas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [nivel, setNivel] = useState("");
  const [calentamiento, setCalentamiento] = useState("");
  const [notas, setNotas] = useState("");
  const [openEjercicios, setOpenEjercicios] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingEliminar, setLoadingEliminar] = useState(null); // null o id de la rutina





const eliminar = async (id) => {
  const confirmacion = window.confirm("¿Seguro que quieres eliminar esta rutina?");
  if (!confirmacion) return;

  try {
    setLoadingEliminar(id); // comienza el spinner en este id
    await eliminarRutina(id);
    setRutinas(rutinas.filter(r => r.id !== id));
    mostrarMensaje("Rutina eliminada con éxito", "success");
  } catch (err) {
    console.log(err);
    mostrarMensaje("Error al eliminar la rutina", "error");
  } finally {
    setLoadingEliminar(null); // termina el spinner
  }
};


  useEffect(() => {
    getRutinas().then(setRutinas);
  }, []);

  const crear = async () => {
    if (!nombre.trim() || !objetivo.trim() || !nivel.trim()) {
      mostrarMensaje("Por favor completá todos los campos obligatorios", "error");
      return;
    }

    try {
      setLoading(true); // empieza el loading
      const r = await crearRutina({ nombre, objetivo, nivel, calentamiento, notas });
      setRutinas([...rutinas, r]);
      setNombre(""); setObjetivo(""); setNivel(""); setCalentamiento(""); setNotas("");
      mostrarMensaje("Rutina creada con éxito", "success");
    } catch (err) {
      console.error(err);
      mostrarMensaje("Error al crear la rutina", "error");
    } finally {
      setLoading(false); // termina el loading
    }
  };

  return (
    <div className="container">
     

      
      <div className="nuevarutinaHeader">
         <h2 className="rutinasTitle">Nueva Rutina</h2>
          {/* Botón para abrir la biblioteca de ejercicios */}
      <button 
        
        onClick={() => setOpenEjercicios(true)}
       
      >
        Ver ejercicios
      </button>
      </div>

      {openEjercicios && (
        <EjercicioModal
          onClose={() => setOpenEjercicios(false)}
           mostrarMensaje={mostrarMensaje}
          // No pasamos rutinaId → modo libre
        />
      )}

      <article className="formRutinas">
        <input
          placeholder="Nombre de la rutina"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          placeholder="Objetivo (Hipertrofia, Fuerza, etc.)"
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
        />

        <input
          placeholder="Nivel (Principiante, Intermedio, Avanzado)"
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
        />

        <textarea
          placeholder="Calentamiento"
          value={calentamiento}
          onChange={(e) => setCalentamiento(e.target.value)}
        />

        <textarea
          placeholder="Notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
        />

      </article>

      <LoadingButton onClick={crear} loading={loading}>
        Crear rutina
      </LoadingButton>

      <article className="rutinasContainer">
        <h3>Tus rutinas</h3>
          <ul>
          {rutinas.map((r) => (
            <li key={r.id} className="rutinaList">
              {r.nombre} 
              <div className="containerButtonsRutina">
                <button onClick={() => onSelect(r.id)}>Ver</button>
                <LoadingButton
                  onClick={() => eliminar(r.id)}
                  loading={loadingEliminar === r.id}
                >
                  Eliminar
                </LoadingButton>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

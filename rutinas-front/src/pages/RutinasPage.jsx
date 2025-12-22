import { useEffect, useState } from "react";
import { getRutinas, crearRutina, eliminarRutina } from "../api/api";
import EjercicioModal from "../components/EjercicioModal";

export default function RutinasPage({ onSelect }) {
  const [rutinas, setRutinas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [nivel, setNivel] = useState("");
  const [calentamiento, setCalentamiento] = useState("");
  const [notas, setNotas] = useState("");
  const [openEjercicios, setOpenEjercicios] = useState(false);



  const eliminar = async (id) => {
    const confirmacion = window.confirm("¿Seguro que quieres eliminar esta rutina?");
    if (!confirmacion) return;

    await eliminarRutina(id);

    setRutinas(rutinas.filter(r => r.id !== id));
  };


  useEffect(() => {
    getRutinas().then(setRutinas);
  }, []);

  const crear = async () => {
    if (!nombre || !objetivo || !nivel) return; // campos obligatorios

    const r = await crearRutina({
      nombre,
      objetivo,
      nivel,
      calentamiento,
      notas,
    });

    setRutinas([...rutinas, r]);
    setNombre("");
    setObjetivo("");
    setNivel("");
    setCalentamiento("");
    setNotas("");
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

      <button onClick={crear}>Crear rutina</button>

      <article className="rutinasContainer">
        <h3>Tus rutinas</h3>
          <ul>
          {rutinas.map((r) => (
            <li key={r.id} className="rutinaList">
              {r.nombre} — {r.objetivo} — {r.nivel}
              <div className="containerButtonsRutina">
                <button onClick={() => onSelect(r.id)}>Ver</button>
                <button onClick={() => eliminar(r.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

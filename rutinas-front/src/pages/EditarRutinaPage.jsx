import { useEffect, useState, useContext  } from "react";
import { getRutina, quitarEjercicioDeRutina } from "../api/api";
import EjercicioModal from "../components/EjercicioModal";
import { exportRutinaPdf } from "../utils/exportRutinaPdf";
import { STORAGE_URL } from "../api/env";
import Spinner from "../components/Spinner";
import LoadingButton from "../components/LoadingButton";
import { AuthContext } from "../context/AuthContext";

export default function EditarRutinaPage({ rutinaId, onBack, mostrarMensaje }) {
  const [rutina, setRutina] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingQuitar, setLoadingQuitar] = useState({});
  const { token } = useContext(AuthContext);
  
  const cargar = async () => {
    const data = await getRutina(rutinaId, token); // pasar token
    setRutina(data);    
  };

  useEffect(() => {
    cargar();
  }, [rutinaId]);

  if (!rutina) {
    return (
      <div className="container">
        <Spinner />
      </div>
    );
  }

  // Agrupar ejercicios por día
  const dias = {};
  rutina.ejercicios.forEach((e) => {


    const dia = e.pivot.dia || 1; // por defecto día 1
    if (!dias[dia]) dias[dia] = [];
    dias[dia].push(e);
  });

  return (
    <div className="container">
      <button className="back" onClick={onBack}>← Volver</button>

      <h2 className="rutinaName">{rutina.nombre}</h2>

      <div className="addEjToRutina">
        <button
          onClick={() => {
            exportRutinaPdf(rutina);
            mostrarMensaje("PDF exportado con éxito", "success");
          }}
        >
          Exportar PDF
        </button>
        <button onClick={() => setOpen(true)}>+ Agregar ejercicio a la rutina</button>
      </div>

      <h3>Calentamiento:</h3>
      <p className="calentamientoText">{rutina.calentamiento}</p>

      {/* Renderizar por día */}
      {Object.keys(dias).map((dia) => (
        <div key={dia} className="dia-grupo">
          <h3>Día {dia}</h3>
          <div className="containerRutinaEjercicios">
            <ul className="rutina-ejercicios">
              {dias[dia].map((e) => (
                <li key={e.pivot.id} className="rutina-item">
                  {e.imagen_url && (
                    <img
                      src={`${STORAGE_URL}/ejercicios/${e.imagen_url}`}
                      alt={e.nombre}
                      className="imgaenRutina"
                    />
                  )}

                  <div className="rutina-info">
                      <strong>{e.nombre}</strong>
                      <p>Grupo Muscular: {e.grupo_muscular}</p>
                      <p>Observaciones: {e.pivot.observacion}</p>
                      <p>Descanso: {e.pivot.descanso_segundos}</p>
                      <div className="serie-peso">
                        <p> {e.pivot.series} x {e.pivot.repeticiones_min} - {e.pivot.repeticiones_max } </p>
                        <p>{e.pivot.peso && ` ${e.pivot.peso}kg`}</p>
                      </div>
                    <div className="casperRutinaInfo">
                      

                       <LoadingButton
                      onClick={async () => {
                        if (!window.confirm("¿Quitar este ejercicio de la rutina?")) return;

                        try {
                          setLoadingQuitar((prev) => ({ ...prev, [e.pivot.id]: true }));
                          

                          await quitarEjercicioDeRutina(rutinaId, e.pivot.id, token);
                          await cargar(); // recarga la rutina
                          mostrarMensaje("Ejercicio desvinculado con éxito", "success");
                        } catch (err) {
                          console.error(err);
                          mostrarMensaje("Error al quitar el ejercicio", "error");
                        } finally {
                          setLoadingQuitar((prev) => ({ ...prev, [e.pivot.id]: false }));
                        }
                      }}
                      loading={loadingQuitar[e.pivot.id]}
                    >
                      Quitar ejercicio
                    </LoadingButton>
                    </div>
                   
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {open && (
        <EjercicioModal
          rutinaId={rutinaId}
          onClose={() => setOpen(false)}
          onAgregar={() => {
            cargar(); // recarga la rutina
            mostrarMensaje("Ejercicio agregado a la rutina", "success");
          }}
          mostrarMensaje={mostrarMensaje} // 🔹 PASO CLAVE
          
        />
)}
    </div>
  );
}

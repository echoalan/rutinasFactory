import { useEffect, useState } from "react";
import { getRutina, quitarEjercicioDeRutina   } from "../api/api";
import EjercicioModal from "../components/EjercicioModal";
import { exportRutinaPdf } from "../utils/exportRutinaPdf";
import { STORAGE_URL } from "../api/env";
import Spinner from "../components/Spinner";

export default function EditarRutinaPage({ rutinaId, onBack }) {
  const [rutina, setRutina] = useState(null);
  const [open, setOpen] = useState(false);

  const cargar = async () => {
    const data = await getRutina(rutinaId);
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
        <button onClick={() => exportRutinaPdf(rutina)}>Exportar PDF</button>
      <button onClick={() => setOpen(true)}>+ Agregar ejercicio a la rutina</button>
      </div>

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
                  
                  <div className="serie-peso">
                   <p> {e.pivot.series} x {e.pivot.repeticiones}</p>
                   <p>{e.pivot.peso && ` — ${e.pivot.peso}kg`}</p> 
                  </div>
                  <button
                    className="quitarEjercicio"
                    onClick={async () => {
                      if (!window.confirm("¿Quitar este ejercicio de la rutina?")) return;

                      await quitarEjercicioDeRutina(rutinaId, e.pivot.id);
                      await cargar(); // recarga la rutina
                    }}
                  >
                    Quitar ejercicio
                  </button>
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
          onClose={() => {
            setOpen(false);
            cargar();
          }}
        />
      )}
    </div>
  );
}

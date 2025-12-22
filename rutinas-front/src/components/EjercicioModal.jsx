import { useEffect, useState } from "react";
import {
  getEjercicios,
  agregarEjercicioARutina,
  crearEjercicio,
} from "../api/api";
import { STORAGE_URL } from "../api/env";

export default function EjercicioModal({ rutinaId = null, onClose }) {
  const [ejercicios, setEjercicios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState(null);

  // Estado para cada ejercicio: dia, series, repeticiones, peso
  const [ejercicioData, setEjercicioData] = useState({});

  useEffect(() => {
    getEjercicios().then((data) => {
      setEjercicios(data);

      // Inicializar estado para cada ejercicio si no existe
      const initData = {};
      data.forEach((e) => {
        initData[e.id] = { dia: 1, series: 3, repeticiones: 10, peso: "" };
      });
      setEjercicioData(initData);
    });
  }, []);

  const agregar = async (e) => {
    if (!rutinaId) return;

    const data = ejercicioData[e.id];

    await agregarEjercicioARutina(rutinaId, {
      ejercicio_id: e.id,
      series: Number(data.series),
      repeticiones: Number(data.repeticiones),
      peso: data.peso ? Number(data.peso) : null,
      orden: 1,
      dia: Number(data.dia),
    });

    onClose();
  };

  const crear = async () => {
    if (!nombre) return;

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("grupo_muscular", "General");
    if (imagen) formData.append("imagen", imagen);

    await crearEjercicio(formData);

    const data = await getEjercicios();
    setEjercicios(data);

    // Inicializar estado para nuevos ejercicios
    const newData = { ...ejercicioData };
    data.forEach((e) => {
      if (!newData[e.id]) newData[e.id] = { dia: 1, series: 3, repeticiones: 10, peso: "" };
    });
    setEjercicioData(newData);

    setNombre("");
    setImagen(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Nuevo Ejercicio</h3>

        {/* Crear ejercicio */}
       
       <div className="containerNuevoEjercicio">
          <input
            placeholder="Nuevo ejercicio"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <div className="containerImgPrevBtn">
            <label className="fileInput">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files[0])}
            />
            <span>📷 Imagen</span>
          </label>

          
          </div>

          <button onClick={crear}>Crear</button>
        </div>
        {imagen && (
                    <img
                      src={URL.createObjectURL(imagen)}
                      className="previewImagen"
                    />
                  )}
        {/* Lista de ejercicios existentes */}

        <h3>
          {rutinaId ? "Elegí un ejercicio de la lista" : "Lista de ejercicios"}
        </h3>

        <ul>
          {ejercicios.map((e) => {
            const data = ejercicioData[e.id] || { dia: 1, series: 3, repeticiones: 10, peso: "" };
            return (
              <li
                key={`ej-${e.id}`}
                className="ejercicio-item"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                {e.imagen_url && (
              <img
                src={`${STORAGE_URL}/ejercicios/${e.imagen_url}`}
                alt={e.nombre}
                style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }}
              />
                )}

                <span>{e.nombre}</span>

                {rutinaId && (
                  <div className="editRutina">
                    {/* Selector de día */}
                    <select
                    className="selectDia"
                      value={data.dia}
                      onChange={(ev) =>
                        setEjercicioData((prev) => ({
                          ...prev,
                          [e.id]: { ...data, dia: Number(ev.target.value) },
                        }))
                      }
                    >
                      <option value={1}>Día 1</option>
                      <option value={2}>Día 2</option>
                      <option value={3}>Día 3</option>
                      <option value={4}>Día 4</option>
                      <option value={5}>Día 5</option>
                    </select>

                    {/* Series */}
                   <div>
                    <p className="pIndicador">Series</p>
                     <input
                      type="number"
                      min="1"
                      value={data.series}
                      onChange={(ev) =>
                        setEjercicioData((prev) => ({
                          ...prev,
                          [e.id]: { ...data, series: Number(ev.target.value) },
                        }))
                      }
                      placeholder="Series"
                      style={{ width: 60 }}
                    />
                   </div>

                    {/* Repeticiones */}
                    <div>
                      <p className="pIndicador">Repes</p>
                      <input
                      type="number"
                      min="1"
                      value={data.repeticiones}
                      onChange={(ev) =>
                        setEjercicioData((prev) => ({
                          ...prev,
                          [e.id]: { ...data, repeticiones: Number(ev.target.value) },
                        }))
                      }
                      placeholder="Reps"
                      style={{ width: 60 }}
                    />
                    </div>

                    {/* Peso */}
                    <div>
                      <p className="pIndicador">Peso</p>
                      <input
                      type="number"
                      min="0"
                      value={data.peso}
                      onChange={(ev) =>
                        setEjercicioData((prev) => ({
                          ...prev,
                          [e.id]: { ...data, peso: ev.target.value },
                        }))
                      }
                      placeholder="Peso"
                      style={{ width: 60 }}
                    />
                    </div>

                    <button onClick={() => agregar(e)}>+</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

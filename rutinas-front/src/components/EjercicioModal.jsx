import { useEffect, useState, useContext } from "react";
import {
  getEjercicios,
  agregarEjercicioARutina,
  crearEjercicio,
  eliminarEjercicio
} from "../api/api";
import { STORAGE_URL } from "../api/env";
import LoadingButton from "./LoadingButton";
import { AuthContext } from "../context/AuthContext";

export default function EjercicioModal({ rutinaId = null, onClose, onAgregar, mostrarMensaje }) {
  const [ejercicios, setEjercicios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("General");

  const [imagen, setImagen] = useState(null);

  const [loadingCrear, setLoadingCrear] = useState(false);
  const [loadingAgregar, setLoadingAgregar] = useState({}); // { [ejercicioId]: true }
  const [loadingEliminar, setLoadingEliminar] = useState({});

  const { token } = useContext(AuthContext);

  const [busqueda, setBusqueda] = useState("");

  // Estado para cada ejercicio: dia, series, repeticiones, peso
  const [ejercicioData, setEjercicioData] = useState({});

  useEffect(() => {
    getEjercicios(token).then((data) => {
      setEjercicios(data);

      // Inicializar estado para cada ejercicio si no existe
      const initData = {};
      data.forEach((e) => {
        initData[e.id] = {
          dia: 1,
          series: 3,
          repeticiones: { min: 10, max: 12 },
          peso: "",
          descanso_segundos: "",
          observacion: "",
        };
      });
      setEjercicioData(initData);
    });




  }, []);

  const agregar = async (e) => {
    if (!rutinaId) return;

    const data = ejercicioData[e.id] || {
      dia: 1,
      series: 3,
      repeticiones: { min: 10, max: 12 },
      peso: "",
      descanso_segundos: "",
      observacion: "",
    };

    try {
      setLoadingAgregar((prev) => ({ ...prev, [e.id]: true }));

      await agregarEjercicioARutina(
        rutinaId,
        {
          ejercicio_id: e.id,
          series: Number(data.series),
          repeticiones_min: Number(data.repeticiones.min),
          repeticiones_max: Number(data.repeticiones.max),
          peso: data.peso ? Number(data.peso) : null,
          orden: 1,
          dia: Number(data.dia),
          descanso_segundos: data.descanso_segundos,
          observacion: data.observacion,
        },
        token
      );

      // Llamar callback de agregado si existe
      if (onAgregar) onAgregar();

      onClose();
    } finally {
      setLoadingAgregar((prev) => ({ ...prev, [e.id]: false }));
    }
  };

  const crear = async () => {
    if (!nombre) return;

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("grupo_muscular", grupoMuscular || "General");
    if (imagen) formData.append("imagen", imagen);

    try {
      setLoadingCrear(true);
      await crearEjercicio(formData, token);

      const data = await getEjercicios(token);
      setEjercicios(data);

      // Inicializar estado de los nuevos ejercicios
      const newData = { ...ejercicioData };
      data.forEach((e) => {
        if (!newData[e.id]) {
          newData[e.id] = {
            dia: 1,
            series: 3,
            repeticiones: { min: 10, max: 12 },
            peso: "",
            descanso_segundos: "",
            observacion: "",
          };
        }
      });
      setEjercicioData(newData);

      setNombre("");
      setGrupoMuscular("General")
      setImagen(null);

      // 🔹 Mostrar mensaje

      console.log(mostrarMensaje)
      if (mostrarMensaje) {
        mostrarMensaje("Ejercicio creado con éxito", "success");
      }
    } finally {
      setLoadingCrear(false);
    }
  };


  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este ejercicio?")) return;

    try {
      setLoadingEliminar((prev) => ({ ...prev, [id]: true }));
      await eliminarEjercicio(id, token);
      setEjercicios((prev) => prev.filter((e) => e.id !== id));

      // ✅ Mostrar mensaje de éxito
      if (mostrarMensaje) mostrarMensaje("Ejercicio eliminado con éxito", "success");
    } catch (err) {
      console.error(err);
      // ✅ Mostrar mensaje de error
      if (mostrarMensaje) mostrarMensaje("Error al eliminar el ejercicio", "error");
    } finally {
      setLoadingEliminar((prev) => ({ ...prev, [id]: false }));
    }
  };


  const ejerciciosFiltrados = ejercicios.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const ejerciciosPorGrupo = {};

  ejerciciosFiltrados.forEach((e) => {
    const grupo = e.grupo_muscular || "General";
    if (!ejerciciosPorGrupo[grupo]) {
      ejerciciosPorGrupo[grupo] = [];
    }
    ejerciciosPorGrupo[grupo].push(e);
  });

  return (
    <div className="modal-overlay">
      <div className="modal">
        {!rutinaId && (
          <h3>Nuevo Ejercicio</h3>
        ) }
        {/* Crear ejercicio */}
        
        {
          !rutinaId && (
        <div className="containerNuevoEjercicio">
          <div className="containerFirstNewEjercicio">
            <div className="containerInputsNuevoejercicio">
                <input
                placeholder="Nombre del ejercicio"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                />
            </div>
            <div className="containerGrupoMuscularInputs">
            <select
              value={grupoMuscular}
              onChange={(e) => setGrupoMuscular(e.target.value)}
              className="selectDia"
            >
              <option value="General">General</option>
              <option value="Core">Core</option>
              <option value="Pecho">Pecho</option>
              <option value="Espalda">Espalda</option>
              <option value="Piernas">Piernas</option>
              <option value="Hombros">Hombros</option>
              <option value="Brazos">Brazos</option>
            </select>
          </div>
          </div>

          <div className="containerImgPrevBtn">
            <label className="fileInput">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
              />
              <span>📷 Imagen</span>
              </label>
              
              {imagen && (
                  <img
                    src={URL.createObjectURL(imagen)}
                    className="previewImagen"
                  />
                )}
            </div>
                  <LoadingButton onClick={crear} loading={loadingCrear}>
                    Crear
                  </LoadingButton>
        </div>
          )
        }
        
        {/* Lista de ejercicios existentes */}

        <h3>
          {rutinaId ? "Elegí un ejercicio de la lista" : "Lista de ejercicios"}
        </h3>

        <div>
          <input
            type="text"
            placeholder="Buscar ejercicio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <article className="articleGrupoM">
          {Object.keys(ejerciciosPorGrupo).map((grupo) => (
          <div key={grupo} className="grupoContainer">
            <h3>{grupo}</h3>
            <ul>
              {ejerciciosPorGrupo[grupo].map((e) => {
                const data = ejercicioData[e.id] || {
                  dia: 1,
                  series: 3,
                  repeticiones: { min: 10, max: 12 },
                  peso: "",
                  descanso_segundos: "",
                  observacion: "",
                };
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
                        style={{ width: 100, height: 80, borderRadius: 6, objectFit: "cover" }}
                      />
                    )}

                    <span>{e.nombre}</span>

                    {!rutinaId && (
                      <LoadingButton
                        onClick={() => handleEliminar(e.id)}
                        loading={loadingEliminar[e.id]}
                      >
                        Eliminar
                      </LoadingButton>
                    )}


                    {rutinaId && (
                      <div className="editRutina">
                        {/* Selector de día */}
                        <div className="contentEditRutina">
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
                              min={1}
                              step={1}
                              value={data.series}
                              onChange={(ev) => {
                                const value = Number(ev.target.value);
                                setEjercicioData((prev) => ({
                                  ...prev,
                                  [e.id]: { ...data, series: value },
                                }));
                              }}
                              style={{ width: 60 }}
                            />
                          </div>

                          {/* Repeticiones */}
                          <div>
                            <p className="pIndicador">Repes</p>
                            <div style={{ display: "flex", gap: 4 }}>
                              <input
                                className="inputEditAdd"
                                type="number"
                                min="1"
                                value={data.repeticiones.min}
                                onChange={(ev) =>
                                  setEjercicioData((prev) => ({
                                    ...prev,
                                    [e.id]: {
                                      ...data,
                                      repeticiones: {
                                        ...data.repeticiones,
                                        min: Number(ev.target.value),
                                      },
                                    },
                                  }))
                                }
                                placeholder="Min"
                                style={{ width: 60 }}
                              />
                              <span>-</span>
                              <input
                                type="number"
                                min={data.repeticiones.min}
                                value={data.repeticiones.max}
                                className="inputEditAdd"
                                onChange={(ev) =>
                                  setEjercicioData((prev) => ({
                                    ...prev,
                                    [e.id]: {
                                      ...data,
                                      repeticiones: {
                                        ...data.repeticiones,
                                        max: Number(ev.target.value),
                                      },
                                    },
                                  }))
                                }
                                placeholder="Max"
                                style={{ width: 60 }}
                              />
                            </div>
                          </div>

                          {/* Peso */}
                          <div>
                            <p className="pIndicador">Peso</p>
                            <input
                              type="number"
                              className="inputEditAdd"
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
                        </div>

                        <div className="containerObsAdd">
                          <div>
                            <input
                              type="text"
                              placeholder="Observaciones"
                              value={data.observacion}
                              onChange={(ev) =>
                                setEjercicioData((prev) => ({
                                  ...prev,
                                  [e.id]: { ...data, observacion: ev.target.value },
                                }))
                              }
                            />
                          </div>
                          <div className="containerObs">
                            <input
                              type="text"
                              placeholder="Descanso (ej: 2 min)"
                              value={data.descanso_segundos}
                              onChange={(ev) =>
                                setEjercicioData((prev) => ({
                                  ...prev,
                                  [e.id]: { ...data, descanso_segundos: ev.target.value },
                                }))
                              }
                            />
                            <button onClick={() => agregar(e)}>Agregar</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        </article>
       <p className="xCloseModal" onClick={onClose}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </p>

      </div>
    </div>
  );
}

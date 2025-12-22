import { useState } from "react";
import Mensaje from "./components/Mensaje";
import RutinasPage from "./pages/RutinasPage";
import EditarRutinaPage from "./pages/EditarRutinaPage";

function App() {
  const [rutinaId, setRutinaId] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  // Mostrar mensaje con auto-hide
  const mostrarMensaje = (texto, tipo = "success") => {
    setMensaje({ texto, tipo });

    // Borrar mensaje después de 3 segundos
    setTimeout(() => {
      setMensaje(null);
    }, 3000);
  };

  return (
    <>
      {mensaje && (
        <Mensaje
          texto={mensaje.texto}
          tipo={mensaje.tipo}
          onClose={() => setMensaje(null)}
        />
      )}

      {rutinaId ? (
        <EditarRutinaPage
          rutinaId={rutinaId}
          onBack={() => setRutinaId(null)}
          mostrarMensaje={mostrarMensaje}
        />
      ) : (
        <RutinasPage
          onSelect={setRutinaId}
          mostrarMensaje={mostrarMensaje}
          
        />
      )}
    </>
  );
}

export default App;

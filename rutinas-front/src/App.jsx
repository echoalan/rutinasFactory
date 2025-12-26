import { useState, useContext } from "react";
import Mensaje from "./components/Mensaje";
import RutinasPage from "./pages/RutinasPage";
import EditarRutinaPage from "./pages/EditarRutinaPage";
import LoginPage from "./pages/Login";
import { AuthContext, AuthProvider } from "./context/AuthContext";

function AppContent() {
  const [rutinaId, setRutinaId] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [modoRegistro, setModoRegistro] = useState(false);

  const { user, logout } = useContext(AuthContext);

  // Mostrar mensaje con auto-hide
  const mostrarMensaje = (texto, tipo = "success") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

  if (!user) {
    return modoRegistro ? (
      <RegisterPage
        mostrarMensaje={mostrarMensaje}
        onLoginClick={() => setModoRegistro(false)}
      />
    ) : (
      <LoginPage
        mostrarMensaje={mostrarMensaje}
        onRegisterClick={() => setModoRegistro(true)}
      />
    );
  }

  return (
    <>
      {mensaje && (
        <Mensaje
          texto={mensaje.texto}
          tipo={mensaje.tipo}
          onClose={() => setMensaje(null)}
        />
      )}

 {/* BOTÓN DE CERRAR SESIÓN */}
     
   

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
          closeSesion={logout}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

import { useState } from "react";
import RutinasPage from "./pages/RutinasPage";
import EditarRutinaPage from "./pages/EditarRutinaPage";


function App() {
  const [rutinaId, setRutinaId] = useState(null);
 

  return (
    <>
      {rutinaId ? (
        <EditarRutinaPage
          rutinaId={rutinaId}
          onBack={() => setRutinaId(null)}
        />
      ) : (
        <RutinasPage onSelect={setRutinaId} />
      )}

    </>
  );
}

export default App;

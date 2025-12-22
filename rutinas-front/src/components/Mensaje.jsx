export default function Mensaje({ texto, tipo = "success", onClose }) {
  if (!texto) return null;

  const icono = tipo === "success" ? "✅" : "⚠️";

  return (
    <div className={`mensaje ${tipo}`}>
      <span className="icono">{icono}</span>
      <span>{texto}</span>
      <button className="cerrarBtn" onClick={onClose}>×</button>
    </div>
  );
}
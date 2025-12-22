import jsPDF from "jspdf";
import { STORAGE_URL } from "../api/env";
export const exportRutinaPdf = async (rutina) => {
  const doc = new jsPDF();

  // Encabezado
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.setFont("helvetica", "bold");
  doc.text(rutina.nombre, 14, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60);
  doc.text(`Objetivo: ${rutina.objetivo}`, 14, 28);
  doc.text(`Nivel: ${rutina.nivel}`, 14, 36);

  let y = 45; // posición inicial de los ejercicios

  for (const e of rutina.ejercicios) {
    // Bloque gris con borde redondeado
    const blockHeight = 50;
    doc.setDrawColor(220); // borde gris
    doc.setFillColor(245);  // fondo gris suave
    doc.roundedRect(10, y - 2, 190, blockHeight, 3, 3, 'FD'); // FD = fill + stroke

    // Imagen
    if (e.imagen_url) {
      try {
        const res = await fetch(`${STORAGE_URL}/ejercicios/${e.imagen_url}`);
        const blob = await res.blob();
        const imgData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        // Mantener proporción
        const maxWidth = 40;
        const maxHeight = 40;
        const image = new Image();
        image.src = imgData;
        await new Promise((resolve) => (image.onload = resolve));
        let width = image.width;
        let height = image.height;
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width *= ratio;
        height *= ratio;

        doc.addImage(imgData, "JPEG", 14, y, width, height);
      } catch (err) {
        console.log("No se pudo cargar imagen:", e.nombre);
      }
    }

    // Texto a la derecha de la imagen
    const textX = 60;
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text(e.nombre, textX, y + 8);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    if (e.pivot.series && e.pivot.repeticiones)
      doc.text(`Series x Reps: ${e.pivot.series} x ${e.pivot.repeticiones}`, textX, y + 18);
    if (e.pivot.peso)
      doc.text(`Peso: ${e.pivot.peso}kg`, textX, y + 26);
    if (e.pivot.descanso_segundos)
      doc.text(`Descanso: ${e.pivot.descanso_segundos}s`, textX, y + 34);

    // Avanzar Y
    y += blockHeight;
    if (y + blockHeight > 290) { // nueva página si se llena
      doc.addPage();
      y = 20;
    }
  }

  doc.save(`${rutina.nombre}.pdf`);
};

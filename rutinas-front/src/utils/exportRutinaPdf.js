import jsPDF from "jspdf";
import { STORAGE_URL } from "../api/env";

export const exportRutinaPdf = async (rutina) => {

  console.log(rutina)

  const DIAS = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
  };

  const doc = new jsPDF("p", "mm", "a4");
  let y = 20;

  /* =======================
     HEADER
  ======================= */
  doc.setFillColor(30, 144, 255);
  doc.rect(0, 0, 210, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255);
  doc.text(rutina.nombre, 105, 18, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(
    `Objetivo: ${rutina.objetivo} | Nivel: ${rutina.nivel}`,
    105,
    25,
    { align: "center" }
  );

  y = 35;

  /* =======================
     INFO BLOCKS
  ======================= */
  const renderInfoBlock = (title, text) => {
    if (!text || text === "-") return;

    const textHeight = doc.getTextDimensions(text, {
      maxWidth: 170,
    }).h;

    const boxHeight = 18 + textHeight;

    if (y + boxHeight > 290) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(245);
    doc.roundedRect(10, y, 190, boxHeight, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text(title, 14, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text(text, 14, y + 16, { maxWidth: 170 });

    y += boxHeight + 8;
  };

  renderInfoBlock("Calentamiento", rutina.calentamiento);
  renderInfoBlock("Notas", rutina.notas);

  /* =======================
     AGRUPAR EJERCICIOS
  ======================= */
  const ejerciciosPorDia = rutina.ejercicios.reduce((acc, e) => {
    const dia = e.pivot?.dia ?? 1;
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(e);
    return acc;
  }, {});

  const renderDia = (dia) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    // Fondo celeste (igual que header)
    doc.setFillColor(30, 144, 255);
    doc.roundedRect(10, y - 6, 190, 12, 3, 3, "F");

    // Texto blanco
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255);
    doc.text(DIAS[dia], 105, y + 2, { align: "center" });

    y += 14;
  };

  /* =======================
     EJERCICIOS
  ======================= */
  for (const dia of Object.keys(ejerciciosPorDia).sort((a, b) => a - b)) {
    renderDia(dia);

    for (const e of ejerciciosPorDia[dia]) {
      const blockHeight = 130;

      if (y + blockHeight > 290) {
        doc.addPage();
        y = 20;
      }

      // Card
      doc.setFillColor(250);
      doc.setDrawColor(200);
      doc.roundedRect(10, y, 190, blockHeight, 3, 3, "FD");

      /* ===== Imagen ===== */
      const imgBoxSize = 50;
      const imgX = 14;
      const imgY = y + 4;

      if (e.imagen_url) {
        try {
          const res = await fetch(
            `${STORAGE_URL}/ejercicios/${e.imagen_url}`
          );
          const blob = await res.blob();

          const imgData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });

          const image = new Image();
          image.src = imgData;
          await new Promise((r) => (image.onload = r));

          const ratio = Math.min(
            imgBoxSize / image.width,
            imgBoxSize / image.height,
            1
          );

          const imgW = image.width * ratio;
          const imgH = image.height * ratio;

          const centeredX = imgX + (imgBoxSize - imgW) / 2;
          const centeredY = imgY + (imgBoxSize - imgH) / 2;

          doc.setDrawColor(180);
          doc.rect(imgX, imgY, imgBoxSize, imgBoxSize);

          doc.addImage(imgData, "JPEG", centeredX, centeredY, imgW, imgH);
        } catch (err) {
          // imagen opcional
        }
      }

      /* ===== Texto ===== */
      const textX = 80;
      const textY = y + 14;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(30);
      doc.text(e.nombre, textX, textY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(80);

      const {
        series = "N/A",
        repeticiones_min = "N/A",
        repeticiones_max = "N/A",
        peso,
        descanso_segundos,
        observacion,
      } = e.pivot || {};

      const grupo_muscular = e.grupo_muscular;

      // Series x Reps
      doc.text(
        `Series x Reps: ${series} x ${repeticiones_min}-${repeticiones_max}`,
        textX,
        textY + 10
      );

      // Peso
      if (peso != null) {
        doc.text(`Peso: ${peso} kg`, textX, textY + 18);
      }

      // Grupo muscular
      if (grupo_muscular) {
        doc.text(`Grupo Muscular: ${grupo_muscular}`, textX, textY + 26);
      }

      // Observaciones
      if (observacion) {
        doc.text(`Observaciones: ${observacion}`, textX, textY + 34);
      }

      // Descanso
      if (descanso_segundos) {
        let descansoText = descanso_segundos;
        // Si viene en segundos como número, convertir a min/seg
        if (!isNaN(descanso_segundos)) {
          const min = Math.floor(descanso_segundos / 60);
          const seg = descanso_segundos % 60;
          descansoText = min > 0 ? `${min} min${seg > 0 ? ` ${seg} s` : ""}` : `${seg} s`;
        }
        doc.text(`Descanso: ${descansoText}`, textX, textY + 42);
      }

      y += blockHeight + 6;

    }
  }

  /* =======================
     FOOTER
  ======================= */
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Página ${i} de ${pageCount}`, 105, 295, {
      align: "center",
    });
  }

  doc.save(`${rutina.nombre}.pdf`);
};

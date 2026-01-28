import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function gerarPdfEvento(evento: any) {
  const doc = new jsPDF("p", "mm", "a4");

  /* =========================
     CABEÇALHO
  ========================== */
  doc.setFontSize(18);
  doc.text("ASKFO - Relatório de Evento", 14, 20);

  doc.setFontSize(12);
  doc.text(`Evento: ${evento.nome}`, 14, 35);
  doc.text(`Data: ${evento.data}`, 14, 43);

  if (evento.descricao) {
    doc.text(`Descrição: ${evento.descricao}`, 14, 51);
  }

  /* =========================
     PARTICIPANTES
  ========================== */
  autoTable(doc, {
    startY: evento.descricao ? 60 : 52,
    head: [["Aluno", "Colocação"]],
    body: evento.participantes.map((p: any) => [
      p.nome,
      p.colocacao !== null && p.colocacao !== undefined
        ? `${p.colocacao}º lugar`
        : "Participou",
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 0, 0] },
  });

  /* =========================
     ASSINATURA
  ========================== */
  const y =
    (doc as any).lastAutoTable.finalY + 20;

  doc.line(14, y, 90, y);
  doc.setFontSize(11);
  doc.text("Sensei Arliton Almeida", 14, y + 8);
  doc.text("Presidente ASKFO", 14, y + 14);

  /* =========================
     SALVAR
  ========================== */
  doc.save(`evento-${evento.nome}.pdf`);
}

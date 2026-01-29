import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Timestamp } from "firebase/firestore";

/* 🔒 normaliza qualquer formato de data */
function normalizarData(valor: any): string {
  if (!valor) return "-";

  let data: Date | null = null;

  if (valor instanceof Timestamp) {
    data = valor.toDate();
  } else if (valor?.seconds) {
    data = new Date(valor.seconds * 1000);
  } else if (valor instanceof Date) {
    data = valor;
  } else if (typeof valor === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      const [ano, mes, dia] = valor.split("-").map(Number);
      data = new Date(ano, mes - 1, dia);
    }
  }

  if (!data) return "-";
  return data.toLocaleDateString("pt-BR");
}

export function gerarPdfAluno(aluno: any) {
  const doc = new jsPDF("p", "mm", "a4");

  const img = new Image();
  img.src = "/askfo-logo.jpg"; // em /public

  img.onload = () => {
    doc.addImage(img, "JPEG", 10, 10, 30, 30);

    doc.setFontSize(18);
    doc.text("Ficha do Aluno - ASKFO", 50, 20);

    gerarConteudo(doc, aluno);
  };
}

function gerarConteudo(doc: jsPDF, aluno: any) {
  doc.setFontSize(11);

  const nascimento =
    aluno.nascimento ??
    aluno.dataNascimento ??
    aluno.data_nascimento ??
    aluno.dtNascimento ??
    null;

  const nome = aluno.nomeCompleto || aluno.nome || "-";

  doc.text(`Nome: ${nome}`, 10, 50);
  doc.text(`Data de Nascimento: ${normalizarData(nascimento)}`, 10, 57);
  doc.text(`Email: ${aluno.email || "-"}`, 10, 64);
  doc.text(`Telefone: ${aluno.telefone || "-"}`, 10, 71);
  doc.text(`Unidade: ${aluno.unidade || "-"}`, 10, 78);
  doc.text(`Sensei: ${aluno.sensei || "-"}`, 10, 85);
  doc.text(`Faixa Atual: ${aluno.faixa || "-"}`, 10, 92);
  doc.text(`Ativo: ${aluno.ativo ? "Sim" : "Não"}`, 10, 99);

  /* ============================
     DADOS DO RESPONSÁVEL
     ============================ */
  doc.setFontSize(14);
  doc.text("Dados do Responsável", 10, 110);

  autoTable(doc, {
    startY: 115,
    head: [["Campo", "Informação"]],
    body: [
      ["Nome", aluno.responsavelNome || "-"],
      ["Telefone", aluno.responsavelTelefone || "-"],
      ["Parentesco", aluno.responsavelParentesco || "-"],
    ],
  });

  /* ============================
     SAÚDE
     ============================ */
  let y = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text("Informações de Saúde", 10, y);

  autoTable(doc, {
    startY: y + 5,
    head: [["Campo", "Informação"]],
    body: [
      ["Possui problema de saúde?", aluno.saude?.possui || "Não"],
      ["Qual problema?", aluno.saude?.qual || "-"],
      ["Doença neuropsicológica?", aluno.saude?.neuro || "-"],
      ["Medicação contínua?", aluno.saude?.medicacao || "Não"],
      ["Observações médicas", aluno.saude?.obs || "-"],
    ],
  });

  /* ============================
     HISTÓRICO DE FAIXAS
     ============================ */
  y = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text("Histórico de Faixas", 10, y);

  autoTable(doc, {
    startY: y + 5,
    head: [["De", "Para", "Data"]],
    body:
      aluno.historicoFaixas?.map((h: any) => [
        h.de,
        h.para,
        normalizarData(h.data),
      ]) || [],
  });

  /* ============================
     HISTÓRICO DE EVENTOS
     ============================ */
  y = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text("Histórico de Eventos", 10, y);

  autoTable(doc, {
    startY: y + 5,
    head: [["Evento", "Data", "Detalhes"]],
    body:
      aluno.eventos?.map((e: any) => {
        let detalhes = "Participação sem premiação";

        if (e.premiacao) {
          const partes = [];
          if (e.kata && e.kata > 0)
            partes.push(`Kata: ${e.kata}º lugar`);
          if (e.kumite && e.kumite > 0)
            partes.push(`Kumite: ${e.kumite}º lugar`);
          detalhes = partes.join(" | ");
        }

        return [e.nome, normalizarData(e.data), detalhes];
      }) || [],
  });

  /* ============================
     ASSINATURA
     ============================ */
  y = (doc as any).lastAutoTable.finalY + 20;
  doc.text("_____________________________________", 10, y);
  doc.text("Sensei Arliton Almeida", 10, y + 6);
  doc.text("Presidente ASKFO", 10, y + 12);

  doc.save(`aluno-${nome}.pdf`);
}

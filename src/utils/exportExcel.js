import * as XLSX from "xlsx";

export function exportExcel({
  fileName,
  overview = [],
  metrics = [],
  reasoning = [],
  audit = [],
}) {
  const workbook = XLSX.utils.book_new();

  const overviewSheet = XLSX.utils.json_to_sheet(overview);

  const metricsSheet = XLSX.utils.json_to_sheet(metrics);

  const reasoningSheet = XLSX.utils.json_to_sheet(reasoning);

  const auditSheet = XLSX.utils.json_to_sheet(audit);

  XLSX.utils.book_append_sheet(workbook, overviewSheet, "Executive Summary");

  XLSX.utils.book_append_sheet(workbook, metricsSheet, "Performance");

  XLSX.utils.book_append_sheet(workbook, reasoningSheet, "AI Recommendation");

  XLSX.utils.book_append_sheet(workbook, auditSheet, "Audit Trail");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
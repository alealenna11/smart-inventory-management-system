export function logAuditEvent(type, details) {
  const logs = JSON.parse(localStorage.getItem("auditLogs")) || [];

  logs.push({
    type,
    details,
    timestamp: new Date().toISOString()
  });

  localStorage.setItem("auditLogs", JSON.stringify(logs));

  console.log("AUDIT:", type, details);
}
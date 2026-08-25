const departments = {
  "SGAD - RDT": { prefix: "RDT", area: "Treasury / Remittance / Deposits" },
  "SGAD - TRS": { prefix: "TRS", area: "Trade Services" },
  "SGAD - LOA": { prefix: "LOA", area: "Loan Operations Agency" },
  "SGAD - CBS": { prefix: "CBS", area: "Corporate Banking Services" },
  "SGAD - OPC": { prefix: "OPC", area: "SWIFT Operations" },
  "GTBD - Client Service": { prefix: "GTBD", area: "Client Service" },
  "SGAD - FCD": { prefix: "FCD", area: "Financial Control" },
  "SGAD - CPC": { prefix: "CPC", area: "Corporate Coordination" },
};

const events = [
  "Budget Approval Review",
  "Policy Compliance Check",
  "Allocation Override",
  "Missing Evidence Review",
  "SLA Breach Investigation",
  "Control Exception Review",
  "Risk Escalation",
  "Governance Sign-off",
  "Manual Decision Override",
  "Evidence Validation",
];

const risks = ["Low", "Medium", "High", "Medium", "Low"];
const statuses = ["Closed", "In Review", "Open", "Escalated", "Closed"];
const evidence = ["Available", "Partial", "Missing", "Available", "Available"];

function buildAuditLogs(department, config) {
  return Array.from({ length: 10 }, (_, index) => {
    const pattern = index % 5;

    return {
      id: `AUD-${config.prefix}-${String(index + 1).padStart(3, "0")}`,
      event: events[index],
      module: config.area,
      department,
      owner: `${config.area} Governance Owner`,
      risk: risks[pattern],
      status: statuses[pattern],
      evidence: evidence[pattern],
      action:
        risks[pattern] === "High"
          ? "Escalate to Governance Review"
          : statuses[pattern] === "Closed"
          ? "No Further Action"
          : "Review Required",
    };
  });
}

export const auditData = Object.fromEntries(
  Object.entries(departments).map(([department, config]) => [
    department,
    buildAuditLogs(department, config),
  ])
);
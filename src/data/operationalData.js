const departments = {
  "SGAD - RDT": { prefix: "RDT", area: "Remittance, Deposits and Treasury" },
  "SGAD - TRS": { prefix: "TRS", area: "Trade Services" },
  "SGAD - LOA": { prefix: "LOA", area: "Loan Operations Agency" },
  "SGAD - CBS": { prefix: "CBS", area: "Corporate Banking Services" },
  "SGAD - OPC": { prefix: "OPC", area: "SWIFT Operations" },
  "GTBD - Client Service": { prefix: "GTBD", area: "Client Service" },
  "SGAD - FCD": { prefix: "FCD", area: "Financial Control" },
  "SGAD - CPC": { prefix: "CPC", area: "Corporate Coordination" },
};

const issues = [
  "SLA breach detected",
  "Pending validation queue",
  "Approval delay",
  "Missing evidence",
  "High-risk exception",
  "Operational bottleneck",
  "Control review pending",
  "Policy threshold exceeded",
  "Manual follow-up required",
  "Readiness checklist pending",
  "Exception queue increased",
  "Governance review overdue",
];

const severities = ["High", "Medium", "Medium", "Low"];
const statuses = ["Active", "In Progress", "Active", "Stable"];
const slas = ["Breached", "At Risk", "On Track", "On Track"];

function buildOperationalRecords(department, config) {
  return issues.map((issue, index) => {
    const pattern = index % 4;

    return {
      id: `MON-${config.prefix}-${String(index + 1).padStart(3, "0")}`,
      area: config.area,
      issue,
      severity: severities[pattern],
      status: statuses[pattern],
      owner: `${config.area} Governance Owner`,
      sla: slas[pattern],
      department,
    };
  });
}

export const operationalData = Object.fromEntries(
  Object.entries(departments).map(([department, config]) => [
    department,
    buildOperationalRecords(department, config),
  ])
);
const departments = {
  "SGAD - RDT": { prefix: "RDT", area: "Treasury Liquidity and Remittance" },
  "SGAD - TRS": { prefix: "TRS", area: "Trade Services" },
  "SGAD - LOA": { prefix: "LOA", area: "Loan Operations Agency" },
  "SGAD - CBS": { prefix: "CBS", area: "Corporate Banking Services" },
  "SGAD - OPC": { prefix: "OPC", area: "SWIFT Operations" },
  "GTBD - Client Service": { prefix: "GTBD", area: "Client Service" },
  "SGAD - FCD": { prefix: "FCD", area: "Financial Control" },
  "SGAD - CPC": { prefix: "CPC", area: "Corporate Coordination" },
};

const requestTypes = [
  "Operational Capacity Budget",
  "Automation Enhancement Budget",
  "SLA Recovery Budget",
  "Audit Evidence Remediation Budget",
  "Control Exception Resolution Budget",
  "Workflow Optimisation Budget",
  "Governance Monitoring Budget",
  "Risk Mitigation Budget",
  "Department Support Budget",
  "Enterprise Readiness Budget",
];

const risks = ["Low", "Medium", "High", "Medium", "Low"];
const priorities = ["Medium", "High", "Critical", "High", "Medium"];
const statuses = ["Approved", "Review", "Escalated", "Pending", "Approved"];

function buildBudgetRequests(department, config) {
  return requestTypes.map((type, index) => {
    const pattern = index % 5;
    const requestedAmount = 120000 + index * 18000 + pattern * 12000;
    const approvedAmount =
      statuses[pattern] === "Approved"
        ? requestedAmount * 0.9
        : statuses[pattern] === "Escalated"
        ? requestedAmount * 0.6
        : requestedAmount * 0.75;

    return {
      id: `BUD-${config.prefix}-${String(index + 1).padStart(3, "0")}`,
      department,
      request: `${config.area} ${type}`,
      requestedAmount,
      approvedAmount: Math.round(approvedAmount),
      variance: requestedAmount - Math.round(approvedAmount),
      risk: risks[pattern],
      priority: priorities[pattern],
      status: statuses[pattern],
      score: Math.max(65, 94 - pattern * 5 - index),
      owner: `${config.area} Budget Owner`,
    };
  });
}

export const budgetData = Object.fromEntries(
  Object.entries(departments).map(([department, config]) => [
    department,
    buildBudgetRequests(department, config),
  ])
);
const departments = {
  "SGAD - RDT": {
    prefix: "RDT",
    workflows: [
      "Treasury Liquidity Management Platform",
      "Cross Border Remittance Processing Queue",
      "Deposit Reconciliation Console",
      "Treasury Settlement Dashboard",
      "Liquidity Exposure Monitor",
      "Treasury Forecasting Engine",
      "Deposit Operations Dashboard",
      "Remittance Exception Queue",
      "Treasury Risk Analytics Hub",
      "Deposit Validation Workflow",
      "Treasury Resource Allocation Engine",
      "Cross Currency Settlement Tracker",
      "Treasury Compliance Dashboard",
      "Deposit SLA Monitoring Console",
      "Treasury Governance Intelligence Module",
    ],
    owners: ["Treasury Operations", "Remittance Review Team", "Deposit Operations"],
  },

  "SGAD - TRS": {
    prefix: "TRS",
    workflows: [
      "Trade Document Validation Queue",
      "Import Letter of Credit Processing Engine",
      "Export Documentary Collection Tracker",
      "Trade Finance Risk Monitor",
      "Trade Settlement Workflow Console",
      "Trade Compliance Validation Hub",
      "Trade Transaction Review Queue",
      "Trade Operations SLA Dashboard",
      "Trade Discrepancy Resolution Tracker",
      "Trade Workflow Approval Console",
      "Trade Exception Management Hub",
      "Trade Evidence Repository",
      "Document Turnaround Tracker",
      "Trade Regulatory Review Console",
      "Trade Governance Intelligence Module",
    ],
    owners: ["Trade Services", "Trade Review Team", "Document Control Team"],
  },

  "SGAD - LOA": {
    prefix: "LOA",
    workflows: [
      "Loan Processing Queue",
      "Facility Review Dashboard",
      "Agency Operations Console",
      "Credit Administration Tracker",
      "Collateral Validation Hub",
      "Loan Documentation Repository",
      "Agency Workflow Queue",
      "Facility Monitoring Dashboard",
      "Covenant Review Console",
      "Loan Exception Tracker",
      "Loan Disbursement Validation Engine",
      "Repayment Monitoring Console",
      "Agency SLA Review Dashboard",
      "Facility Governance Tracker",
      "Loan Governance Intelligence Module",
    ],
    owners: ["Loan Operations", "Agency Review Team", "Facility Operations"],
  },

  "SGAD - CBS": {
    prefix: "CBS",
    workflows: [
      "Corporate Account Maintenance Platform",
      "Corporate Banking Service Queue",
      "Client Onboarding Review Hub",
      "Relationship Management Console",
      "Corporate Service SLA Tracker",
      "Corporate Request Validation Queue",
      "Client Service Escalation Tracker",
      "Corporate Approval Workflow",
      "Account Update Monitoring Console",
      "Corporate Documentation Review Hub",
      "Client Impact Assessment Tracker",
      "Corporate Banking Evidence Repository",
      "Service Request Prioritisation Engine",
      "Corporate Operations Dashboard",
      "Corporate Banking Governance Module",
    ],
    owners: ["Corporate Banking Services", "Client Review Team", "Account Services"],
  },

  "SGAD - OPC": {
    prefix: "OPC",
    workflows: [
      "SWIFT Message Monitoring Console",
      "SWIFT Payment Validation Hub",
      "Cross Border Payment Queue",
      "Payment Exception Dashboard",
      "SWIFT Operations Control Centre",
      "Message Routing Validation Engine",
      "Settlement Monitoring Platform",
      "Payment Investigation Console",
      "SWIFT Compliance Tracker",
      "Message Repair Workflow",
      "Operational Resilience Dashboard",
      "Payment SLA Monitoring Console",
      "SWIFT Audit Evidence Repository",
      "Payment Risk Review Engine",
      "SWIFT Governance Intelligence Module",
    ],
    owners: ["SWIFT Operations", "Payment Operations", "Operations Control"],
  },

  "GTBD - Client Service": {
    prefix: "GTBD",
    workflows: [
      "Client Service Request Queue",
      "Client SLA Dashboard",
      "Client Escalation Tracker",
      "Service Delivery Console",
      "Customer Issue Resolution Queue",
      "Transaction Service Monitoring Hub",
      "Client Communication Tracker",
      "Service Quality Review Dashboard",
      "Client Evidence Repository",
      "Client Request Prioritisation Engine",
      "Service Exception Monitoring Console",
      "Client Follow-up Workflow",
      "Transaction Banking Support Queue",
      "Client Governance Tracker",
      "Client Service Intelligence Module",
    ],
    owners: ["Client Service Team", "Service Quality Team", "Transaction Banking Support"],
  },

  "SGAD - FCD": {
    prefix: "FCD",
    workflows: [
      "Budget Variance Dashboard",
      "Cost Governance Console",
      "Expense Monitoring Hub",
      "Financial Control Validation Queue",
      "Budget Allocation Tracker",
      "Financial Compliance Dashboard",
      "Cost Centre Review Console",
      "Expense Approval Workflow",
      "Budget Breach Monitoring Console",
      "Financial Evidence Repository",
      "Cost Control Risk Tracker",
      "Financial Governance Review Hub",
      "Budget Utilisation Dashboard",
      "Expense Exception Management Queue",
      "Financial Control Intelligence Module",
    ],
    owners: ["Financial Control", "Cost Control Team", "Expense Review Team"],
  },

  "SGAD - CPC": {
    prefix: "CPC",
    workflows: [
      "Cross Department Coordination Portal",
      "Governance Follow-up Tracker",
      "Escalation Management Console",
      "Programme Coordination Dashboard",
      "Stakeholder Alignment Queue",
      "Enterprise Dependency Tracker",
      "Corporate Function Review Hub",
      "Cross-Team Request Workflow",
      "Governance Delay Monitoring Console",
      "Coordination Evidence Repository",
      "Department Follow-up Engine",
      "Corporate Support Request Queue",
      "Enterprise Issue Tracker",
      "Governance Coordination Dashboard",
      "Corporate Coordination Intelligence Module",
    ],
    owners: ["Corporate Coordination", "Governance Follow-up Team", "Programme Coordination"],
  },
};

const statuses = ["Allocated", "Pending", "Allocated", "Over-allocated", "Allocated"];
const validations = ["Passed", "Pending", "Passed", "Failed", "Passed"];
const risks = ["Low", "Medium", "Low", "High", "Low"];
const actions = [
  "Validated",
  "Awaiting Review",
  "Approved",
  "Risk Threshold Breached",
  "Governance Review Complete",
];

function buildRecords(department, config) {
  return config.workflows.map((workflow, index) => {
    const pattern = index % 5;

    return {
      id: `${config.prefix}-${String(index + 1).padStart(3, "0")}`,
      asset: workflow,
      dept: department,
      status: statuses[pattern],
      validation: validations[pattern],
      risk: risks[pattern],
      allocatedTo: config.owners[index % config.owners.length],
      lastAction: actions[pattern],
      manualTime: 18 + index + pattern * 4,
      systemTime: 5 + Math.floor(index / 3) + pattern,
    };
  });
}

export const allocationData = Object.fromEntries(
  Object.entries(departments).map(([department, config]) => [
    department,
    buildRecords(department, config),
  ])
);
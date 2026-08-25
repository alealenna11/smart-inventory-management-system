const baseDepartmentConfig = {
  "SGAD - RDT": {
    title: "Remittance, Deposits and Treasury Workspace",
    shortName: "RDT",
    focus: "Remittance processing, deposits operations, treasury liquidity, and funding governance.",
    kpis: [
      { label: "Remittance SLA", value: "92%" },
      { label: "Treasury Risk", value: "Medium" },
      { label: "Deposit Queue", value: "18" },
      { label: "Budget Utilisation", value: "76%" },
    ],
    actions: [
      "Submit Treasury Budget Request",
      "Escalate Liquidity Risk",
      "Review Deposit Exceptions",
      "Validate Remittance Evidence",
    ],
  },

  "SGAD - TRS": {
    title: "Trade Services Workspace",
    shortName: "TRS",
    focus: "Trade document validation, transaction exceptions, trade SLA, and operational governance.",
    kpis: [
      { label: "Trade SLA", value: "88%" },
      { label: "Document Exceptions", value: "12" },
      { label: "Pending Reviews", value: "9" },
      { label: "Budget Utilisation", value: "69%" },
    ],
    actions: [
      "Submit Trade Services Budget Request",
      "Review Trade Exception",
      "Escalate Document Delay",
      "Validate Trade Evidence",
    ],
  },

  "SGAD - LOA": {
    title: "Loan and Operations Agency Workspace",
    shortName: "LOA",
    focus: "Loan processing, agency operations, facility support, and repayment governance.",
    kpis: [
      { label: "Loan Queue", value: "24" },
      { label: "Facility SLA", value: "84%" },
      { label: "Agency Risk", value: "High" },
      { label: "Budget Utilisation", value: "81%" },
    ],
    actions: [
      "Submit Loan Operations Budget Request",
      "Escalate Facility Risk",
      "Review Agency SLA",
      "Validate Loan Evidence",
    ],
  },

  "SGAD - CBS": {
    title: "Corporate Banking Services Workspace",
    shortName: "CBS",
    focus: "Corporate banking support, client servicing, account maintenance, and service governance.",
    kpis: [
      { label: "Client Impact", value: "Medium" },
      { label: "Service SLA", value: "90%" },
      { label: "Open Requests", value: "16" },
      { label: "Budget Utilisation", value: "72%" },
    ],
    actions: [
      "Submit CBS Budget Request",
      "Review Client Impact",
      "Escalate Corporate Banking Issue",
      "Validate Service Evidence",
    ],
  },

  "SGAD - OPC": {
    title: "Operations and SWIFT Communications Workspace",
    shortName: "OPC",
    focus: "SWIFT communications, payment messaging, operational resilience, and message-risk governance.",
    kpis: [
      { label: "SWIFT Message Risk", value: "High" },
      { label: "Payment Exceptions", value: "14" },
      { label: "Operational SLA", value: "86%" },
      { label: "Budget Utilisation", value: "89%" },
    ],
    actions: [
      "Submit SWIFT Operations Budget Request",
      "Escalate Payment Message Risk",
      "Review SWIFT Exception",
      "Validate Operations Evidence",
    ],
  },

  "GTBD - Client Service": {
    title: "Global Transactions Banking Client Services Workspace",
    shortName: "GTBD",
    focus: "Client servicing, transaction banking support, service quality, and SLA governance.",
    kpis: [
      { label: "Client SLA", value: "91%" },
      { label: "Client Requests", value: "27" },
      { label: "Service Quality", value: "Strong" },
      { label: "Budget Utilisation", value: "74%" },
    ],
    actions: [
      "Submit Client Service Budget Request",
      "Escalate Client SLA Breach",
      "Review Service Quality",
      "Validate Client Evidence",
    ],
  },

  "SGAD - FCD": {
    title: "Financial Control Division Workspace",
    shortName: "FCD",
    focus: "Financial control, budget variance monitoring, cost governance, and expense oversight.",
    kpis: [
      { label: "Budget Variance", value: "6.8%" },
      { label: "Cost Control", value: "Moderate" },
      { label: "Expense Reviews", value: "11" },
      { label: "Governance Score", value: "87%" },
    ],
    actions: [
      "Submit Financial Control Budget Request",
      "Review Cost Variance",
      "Escalate Budget Breach",
      "Validate Financial Evidence",
    ],
  },

  "SGAD - CPC": {
    title: "Corporate Function Coordination Workspace",
    shortName: "CPC",
    focus: "Cross-department coordination, governance follow-up, corporate support, and escalation tracking.",
    kpis: [
      { label: "Cross-Team Requests", value: "19" },
      { label: "Governance Follow-ups", value: "13" },
      { label: "Escalations", value: "5" },
      { label: "Coordination Score", value: "82%" },
    ],
    actions: [
      "Submit Coordination Budget Request",
      "Assign Cross-Department Follow-up",
      "Escalate Governance Delay",
      "Validate Coordination Evidence",
    ],
  },
};

export function normalizeDepartment(department) {
  const aliases = {

    "SGAD-FCD": "SGAD - FCD",
    "SGAD-RDT": "SGAD - RDT",
    "SGAD-TRS": "SGAD - TRS",
    "SGAD-LOA": "SGAD - LOA",
    "SGAD-CBS": "SGAD - CBS",
    "SGAD-OPC": "SGAD - OPC",
    "SGAD-CPC": "SGAD - CPC",
    "GTBD-Client Service": "GTBD - Client Service",
  };

  return aliases[department] || department;
}

export const departmentConfig = {
  ...baseDepartmentConfig,

  "SGAD-FCD": baseDepartmentConfig["SGAD - FCD"],
  "SGAD-RDT": baseDepartmentConfig["SGAD - RDT"],
  "SGAD-TRS": baseDepartmentConfig["SGAD - TRS"],
  "SGAD-LOA": baseDepartmentConfig["SGAD - LOA"],
  "SGAD-CBS": baseDepartmentConfig["SGAD - CBS"],
  "SGAD-OPC": baseDepartmentConfig["SGAD - OPC"],
  "SGAD-CPC": baseDepartmentConfig["SGAD - CPC"],
  "GTBD-Client Service": baseDepartmentConfig["GTBD - Client Service"],
};

baseDepartmentConfig["SGAD - RDT"].additionalModules = [
  {
    name: "Treasury Liquidity Governance",
    route: "/treasury-liquidity",
    icon: "🏦"
  },
  {
    name: "Remittance Control Centre",
    route: "/remittance-control",
    icon: "💸"
  },
  {
    name: "Funding Risk Oversight",
    route: "/funding-risk",
    icon: "📈"
  }
];

baseDepartmentConfig["SGAD - TRS"].additionalModules = [
  {
    name: "Trade Compliance Monitoring",
    route: "/trade-compliance",
    icon: "📑"
  },
  {
    name: "Letter of Credit Governance",
    route: "/letter-credit-governance",
    icon: "📜"
  },
  {
    name: "Trade Risk Intelligence",
    route: "/trade-risk-intelligence",
    icon: "🌍"
  }
];

baseDepartmentConfig["SGAD - FCD"].additionalModules = [
  {
    name: "Financial Controls Hub",
    route: "/financial-controls",
    icon: "💰"
  },
  {
    name: "Regulatory Reporting Centre",
    route: "/regulatory-reporting",
    icon: "📊"
  },
  {
    name: "Budget Performance Analytics",
    route: "/budget-performance",
    icon: "💹"
  }
];

baseDepartmentConfig["SGAD - OPC"].additionalModules = [
  {
    name: "Operations Command Centre",
    route: "/operations-command",
    icon: "⚙️"
  },
  {
    name: "SLA Governance Monitoring",
    route: "/sla-governance",
    icon: "⏱️"
  },
  {
    name: "Workflow Governance Hub",
    route: "/workflow-governance",
    icon: "🔄"
  }
];

baseDepartmentConfig["SGAD - LOA"].additionalModules = [
  {
    name: "Loan Portfolio Governance",
    route: "/loan-portfolio",
    icon: "🏠"
  },
  {
    name: "Credit Risk Monitoring",
    route: "/credit-risk",
    icon: "📉"
  },
  {
    name: "Loan Compliance Centre",
    route: "/loan-compliance",
    icon: "✅"
  }
];

baseDepartmentConfig["SGAD - CBS"].additionalModules = [
  {
    name: "Core Banking Stability Hub",
    route: "/core-banking-stability",
    icon: "🏛️"
  },
  {
    name: "Service Health Monitoring",
    route: "/service-health",
    icon: "🩺"
  },
  {
    name: "Batch Processing Governance",
    route: "/batch-processing",
    icon: "🖥️"
  }
];

baseDepartmentConfig["SGAD - CPC"].additionalModules = [
  {
    name: "Customer Protection Controls",
    route: "/customer-protection",
    icon: "🛡️"
  },
  {
    name: "Conduct Risk Monitoring",
    route: "/conduct-risk",
    icon: "⚠️"
  },
  {
    name: "Customer Experience Governance",
    route: "/customer-experience",
    icon: "😊"
  }
];

baseDepartmentConfig["GTBD - Client Service"].additionalModules = [
  {
    name: "Client Service Governance",
    route: "/client-service",
    icon: "🤝"
  },
  {
    name: "Client Experience Intelligence",
    route: "/client-experience",
    icon: "📋"
  },
  {
    name: "Relationship Risk Monitoring",
    route: "/relationship-risk",
    icon: "🔍"
  }
];
import { budgetData } from "../data/budgetData";
import { auditData } from "../data/auditData";
import { operationalData } from "../data/operationalData";
import { allocationData } from "../data/allocationData";
import { inventoryData } from "../data/inventoryData";
import { controlExceptionsData } from "../data/controlexceptionsData";
import { governanceRules } from "../data/governanceRulesData";
import { performanceData } from "../data/performanceData";
import { policyData } from "../data/policyData";
import { usersData } from "../data/userManagementData";
import { departmentComparisonData } from "../data/departmentcomparisonData";
import { executiveReportingData } from "../data/executivereportingData";
import { executiveBoardPacksData } from "../data/executiveboardpacksData";

function countObjectRecords(data) {
  return Object.values(data || {}).reduce(
    (total, records) => total + (Array.isArray(records) ? records.length : 0),
    0
  );
}

export default function DataSourceEvidencePanel() {
  const dataSources = [
    {
      source: "Budget Governance Dataset",
      file: "budgetData.js",
      records: countObjectRecords(budgetData),
      purpose: "Budget utilisation, approval requests and financial governance",
    },
    {
      source: "Audit Evidence Dataset",
      file: "auditData.js",
      records: countObjectRecords(auditData),
      purpose: "Audit readiness, evidence validation and compliance review",
    },
    {
      source: "Operational Monitoring Dataset",
      file: "operationalData.js",
      records: countObjectRecords(operationalData),
      purpose: "SLA breaches, operational risks and workflow bottlenecks",
    },
    {
      source: "Allocation Dataset",
      file: "allocationData.js",
      records: countObjectRecords(allocationData),
      purpose: "Resource allocation, ownership and workload distribution",
    },
    {
      source: "Inventory Dataset",
      file: "inventoryData.js",
      records: inventoryData.length,
      purpose: "Asset governance, ownership and validation status",
    },
    {
      source: "Control Exception Dataset",
      file: "controlexceptionsData.js",
      records: controlExceptionsData.length,
      purpose: "Policy breaches, control exceptions and escalation items",
    },
    {
      source: "Governance Rules Dataset",
      file: "governanceRulesData.js",
      records: governanceRules.length,
      purpose: "Governance thresholds, policy rules and decision logic",
    },
    {
      source: "Performance Dataset",
      file: "performanceData.js",
      records: performanceData.length,
      purpose: "System quality, response time and validation evidence",
    },
    {
      source: "Policy Dataset",
      file: "policyData.js",
      records: policyData.length,
      purpose: "Policy compliance and governance rule validation",
    },
    {
      source: "User Management Dataset",
      file: "userManagementData.js",
      records: usersData.length,
      purpose: "Role-based access, user governance and audit status",
    },
    {
      source: "Department Benchmarking Dataset",
      file: "departmentcomparisonData.js",
      records: departmentComparisonData.length,
      purpose: "Cross-department benchmarking and maturity comparison",
    },
    {
      source: "Executive Reporting Dataset",
      file: "executivereportingData.js",
      records: executiveReportingData.length,
      purpose: "Executive KPIs, board reporting and governance outputs",
    },
    {
      source: "Executive Board Pack Dataset",
      file: "executiveboardpacksData.js",
      records: executiveBoardPacksData.length,
      purpose: "Board pack generation and executive reporting evidence",
    },
  ];

  const totalRecords = dataSources.reduce((sum, item) => sum + item.records, 0);

  return (
    <div className="admin-card executive">
      <h3>Enterprise Data Sources & Test Evidence</h3>

      <p>
        INVISOR uses simulated enterprise datasets to represent governance inputs
        from budget, audit, operations, inventory, allocation, policy, user
        management and control exception domains. These inputs are processed by
        the Governance Intelligence Engine to generate governance scores,
        recommendations, benchmarking results and Excel reports.
      </p>

      <div className="benefit-grid">
        <div className="benefit-box">
          <h2>{dataSources.length}</h2>
          <p>Data Source Files</p>
        </div>

        <div className="benefit-box">
          <h2>{totalRecords}</h2>
          <p>Records Analysed</p>
        </div>

        <div className="benefit-box">
          <h2>3</h2>
          <p>User Roles Tested</p>
        </div>

        <div className="benefit-box">
          <h2>Excel</h2>
          <p>Audit-Ready Output</p>
        </div>
      </div>

      <table className="summary-table">
        <thead>
          <tr>
            <th>Data Input</th>
            <th>Source File</th>
            <th>Records</th>
            <th>Used For</th>
          </tr>
        </thead>

        <tbody>
          {dataSources.map((item) => (
            <tr key={item.file}>
              <td><b>{item.source}</b></td>
              <td>{item.file}</td>
              <td>{item.records}</td>
              <td>{item.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="admin-insight">
        <b>Input → Processing → Output Evidence</b>
        <p>
          Input datasets are loaded into INVISOR, processed through governance
          scoring, risk assessment, benchmarking and Explainable AI logic, then
          presented as dashboards, recommendations and exportable Excel reports.
        </p>
      </div>
    </div>
  );
}
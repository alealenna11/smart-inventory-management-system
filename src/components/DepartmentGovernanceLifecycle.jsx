import { exportExcel } from "../utils/exportExcel";

export default function DepartmentGovernanceLifecycle({
  title = "Department Governance Lifecycle",
  departmentName = "Department",
  governanceScore = 0,
  maturityLevel = "Managed",
  decisionStatus = "Monitor",
  confidence = 94,
  rootCause,
  input,
  processing,
  output,
  businessValue,
  recommendation,
}) {
  const stages = [
    ["Root Cause", rootCause],
    ["Input", input],
    ["Processing", processing],
    ["Output", output],
    ["Business Value", businessValue],
  ];

  function exportDepartmentReport() {
  exportExcel({
    fileName: `INVISOR_${departmentName}_Governance_Report`,

    overview: [
      { Section: "Department", Value: departmentName },
      { Section: "Governance Score", Value: `${governanceScore}%` },
      { Section: "Maturity Level", Value: maturityLevel },
      { Section: "Decision", Value: decisionStatus },
      { Section: "Confidence", Value: `${confidence}%` },
      { Section: "Generated", Value: new Date().toLocaleString() },
    ],

    metrics: stages.map(([stage, desc]) => ({
      Stage: stage,
      Description: desc,
    })),

    reasoning: [
      { Category: "Recommendation", Value: recommendation },
    ],

    audit: [
      { Activity: "Department governance report exported", Status: "Completed" },
    ],
  });
}

  return (
    <div className="admin-card executive">
      <h3>{title}</h3>

      <p>
        INVISOR converts departmental governance data into explainable decision
        intelligence by linking the business problem, system inputs, governance
        processing, outputs and measurable value.
      </p>

      <div className="benefit-grid">
        <div className="benefit-box">
          <h2>{governanceScore}%</h2>
          <p>Governance Score</p>
        </div>

        <div className="benefit-box">
          <h2>{maturityLevel}</h2>
          <p>Maturity Level</p>
        </div>

        <div className="benefit-box">
          <h2>{decisionStatus}</h2>
          <p>Recommended Decision</p>
        </div>

        <div className="benefit-box">
          <h2>{confidence}%</h2>
          <p>Decision Confidence</p>
        </div>
      </div>

      <table className="summary-table">
        <tbody>
          {stages.map(([stage, desc]) => (
            <tr key={stage}>
              <td>
                <b>{stage}</b>
              </td>
              <td>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="admin-insight">
        <b>INVISOR Recommendation</b>
        <p>{recommendation}</p>
      </div>

      <button className="primary-btn" onClick={exportDepartmentReport}>
        Export Department Governance Report
      </button>
    </div>
  );
}
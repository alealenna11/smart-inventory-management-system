import { exportExcel } from "../utils/exportExcel";

export default function DepartmentDecisionIntelligencePanel({
  departmentName = "Department",
  governanceScore = 0,
  maturityLevel = "Defined",
  decisionStatus = "Review",
  confidence = 88,
  riskExposure = 0,
  auditReadiness = 0,
  slaHealth = 0,
  budgetUtilisation = 0,
  validationReadiness = 0,
  recommendation = "Review governance gaps and continue monitoring.",
}) {
  const scenarioIfValidationClosed = Math.min(100, governanceScore + 6);
  const scenarioIfAuditClosed = Math.min(100, governanceScore + 9);
  const scenarioIfRiskReduced = Math.min(100, governanceScore + 12);


function exportDepartmentDecisionReport() {
  exportExcel({
    fileName: `INVISOR_${departmentName}_Decision_Intelligence_Report`,

    overview: [
      { Section: "Department", Value: departmentName },
      { Section: "Governance Score", Value: `${governanceScore}%` },
      { Section: "Maturity Level", Value: maturityLevel },
      { Section: "Decision", Value: decisionStatus },
      { Section: "Confidence", Value: `${confidence}%` },
      { Section: "Generated", Value: new Date().toLocaleString() },
    ],

    metrics: [
      { Metric: "Risk Exposure", Value: `${riskExposure}%` },
      { Metric: "Audit Readiness", Value: `${auditReadiness}%` },
      { Metric: "SLA Health", Value: `${slaHealth}%` },
      { Metric: "Budget Utilisation", Value: `${budgetUtilisation}%` },
      { Metric: "Validation Readiness", Value: `${validationReadiness}%` },
    ],

    reasoning: [
      { Category: "Recommendation", Value: recommendation },
      {
        Category: "Decision Logic",
        Value:
          "INVISOR combines governance score, risk exposure, audit readiness, SLA health, budget utilisation and validation readiness before generating the department recommendation.",
      },
    ],

    audit: [
      { Scenario: "Complete Validation Activities", ForecastScore: `${scenarioIfValidationClosed}%` },
      { Scenario: "Close Outstanding Audit Findings", ForecastScore: `${scenarioIfAuditClosed}%` },
      { Scenario: "Reduce Operational Risk", ForecastScore: `${scenarioIfRiskReduced}%` },
    ],
  });
}

  return (
    <div className="admin-card executive">
      <h3>{departmentName} Decision Intelligence & Scenario Analysis</h3>

      <p>
        This panel explains why INVISOR generated the current recommendation,
        which governance factors influenced the decision, and how the department
        can improve its governance outcome.
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
          <p>Decision</p>
        </div>

        <div className="benefit-box">
          <h2>{confidence}%</h2>
          <p>Confidence</p>
        </div>
      </div>

      <h4>Why INVISOR Generated This Decision</h4>

      <table className="summary-table">
        <tbody>
          <tr>
            <td><b>Primary Driver</b></td>
            <td>
              Risk exposure is currently <b>{riskExposure}%</b>, which affects
              the department governance decision.
            </td>
          </tr>

          <tr>
            <td><b>Supporting Driver</b></td>
            <td>
              Audit readiness is <b>{auditReadiness}%</b> and validation
              readiness is <b>{validationReadiness}%</b>, indicating remaining
              evidence or validation gaps.
            </td>
          </tr>

          <tr>
            <td><b>Operational Driver</b></td>
            <td>
              SLA health is <b>{slaHealth}%</b> and budget utilisation is{" "}
              <b>{budgetUtilisation}%</b>, which are used to assess operational
              stability and resource governance.
            </td>
          </tr>

          <tr>
            <td><b>Decision Logic</b></td>
            <td>
              INVISOR combines governance score, risk exposure, audit readiness,
              SLA health, budget utilisation and validation readiness before
              generating the <b>{decisionStatus}</b> recommendation.
            </td>
          </tr>
        </tbody>
      </table>

      <h4>Recommended Improvement Scenarios</h4>

      <div className="benefit-grid">
        <div className="benefit-box">
          <h2>{scenarioIfValidationClosed}%</h2>
          <p>Complete Validation Activities</p>
        </div>

        <div className="benefit-box">
          <h2>{scenarioIfAuditClosed}%</h2>
          <p>Close Outstanding Audit Findings</p>
        </div>

        <div className="benefit-box">
          <h2>{scenarioIfRiskReduced}%</h2>
          <p>Reduce Operational Risk</p>
        </div>
      </div>

      <div className="admin-insight">
        <b>Expected Business Impact</b>
        <ul>
          <li>Increase governance visibility across the department.</li>
          <li>Reduce manual reporting and validation effort.</li>
          <li>Improve audit readiness before executive review.</li>
          <li>Strengthen operational governance and compliance.</li>
          <li>Support faster evidence-based decision-making.</li>
        </ul>
      </div>

      <div className="admin-insight">
        <b>INVISOR Recommendation</b>
        <p>{recommendation}</p>
      </div>

      <button className="primary-btn" onClick={exportDepartmentDecisionReport}>
        Export Department Decision Report
      </button>
    </div>
  );
}
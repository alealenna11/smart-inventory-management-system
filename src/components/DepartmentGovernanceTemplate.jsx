import "../styles/departmentGovernanceTemplate.css";
import { exportExcel } from "../utils/exportExcel";
export default function DepartmentGovernanceTemplate({
  eyebrow,
  title,
  subtitle,
  story,
  metrics = [],
  governance = {},
  recommendation,
  cards = [],
}) {
  function exportModuleReport() {
  exportExcel({
    fileName: `INVISOR_${title.replaceAll(" ", "_")}_Report`,

    overview: [
      { Section: "Module", Value: title },
      { Section: "Governance Score", Value: governance.score },
      { Section: "Maturity", Value: governance.maturity },
      { Section: "Risk Rating", Value: governance.risk },
      { Section: "Decision", Value: governance.decision },
      { Section: "AI Confidence", Value: governance.confidence },
      { Section: "Generated", Value: new Date().toLocaleString() },
    ],

    metrics: metrics.map((metric) => ({
      Metric: metric.label,
      Value: metric.value,
      Status: metric.status,
    })),

    reasoning:
      recommendation?.factors?.map((factor, index) => ({
        ReasonNo: index + 1,
        Reason: factor,
      })) || [],

    audit: [
      { Section: "Recommendation", Value: governance.recommendation },
      { Section: "Expected Outcome", Value: recommendation?.outcome || "N/A" },
      { Section: "Report Type", Value: "Specialist Governance Report" },
    ],
  });
}
  return (
    <div className="governance-page">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}

      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="governance-status-box">
          <span>Executive Decision</span>
          <h2>{governance.decision}</h2>
          <p>{governance.confidence} confidence</p>
        </div>
      </div>

      {story && (
        <div className="story-card">
          <h2>{story.title}</h2>
          <p>{story.text}</p>
        </div>
      )}

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-label">{metric.label}</div>
            <div className={`metric-value ${metric.status}`}>
              {metric.value}
            </div>
            <small>{metric.status === "good" ? "Healthy" : metric.status === "bad" ? "Requires Review" : "Monitor"}</small>
          </div>
        ))}
      </div>

      <div className="governance-panel">
        <h2>Governance Impact Analysis</h2>

        <table className="summary-table">
          <tbody>
            <tr>
              <td><strong>Existing Process Limitation</strong></td>
              <td>
                Manual tracking, disconnected reports and static dashboards make
                it difficult to identify root causes, trace decisions and act
                before governance issues escalate.
              </td>
            </tr>

            <tr>
              <td><strong>INVISOR Data Inputs</strong></td>
              <td>
                Operational records, control indicators, reporting metrics,
                exceptions, approval status, risk signals and governance
                evidence are consolidated into one decision layer.
              </td>
            </tr>

            <tr>
              <td><strong>Governance Processing</strong></td>
              <td>
                INVISOR applies governance scoring, risk classification,
                maturity assessment, control evaluation and explainable
                recommendation logic.
              </td>
            </tr>

            <tr>
              <td><strong>Decision Output</strong></td>
              <td>
                Generates a <strong>{governance.decision}</strong> decision with{" "}
                <strong>{governance.confidence}</strong> confidence and{" "}
                <strong>{governance.score}</strong> governance score.
              </td>
            </tr>

            <tr>
              <td><strong>Why INVISOR Stands Out</strong></td>
              <td>
                Unlike manual spreadsheets or static dashboards, INVISOR links
                data, reasoning, recommendations, auditability and business
                impact in one governance workflow.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="governance-panel two-column">
        <div>
          <h2>Governance Evaluation</h2>

          <div className="governance-score-card">
            <div className="score-circle">{governance.score}</div>

            <div>
              <h3>Enterprise Governance Rating</h3>
              <p>
                Assessment based on compliance, resilience, maturity, policy
                effectiveness and enterprise controls.
              </p>
            </div>
          </div>

          <div className="decision-box">
            <p><strong>Maturity:</strong> {governance.maturity}</p>
            <p><strong>Risk Rating:</strong> {governance.risk}</p>
            <p><strong>Decision:</strong> {governance.decision}</p>
            <p><strong>AI Confidence:</strong> {governance.confidence}</p>
          </div>
        </div>

        <div>
          <h2>Performance Statistics</h2>

          <table className="summary-table">
            <tbody>
              {metrics.map((metric, index) => (
                <tr key={index}>
                  <td>{metric.label}</td>
                  <td><strong>{metric.value}</strong></td>
                  <td>{metric.status === "good" ? "Within Target" : "Action Required"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {recommendation && (
        <div className="ai-card">
          <h2>Explainable AI Governance Recommendation</h2>

          <div className="ai-section">
            <strong>Recommendation</strong>
            <p>{recommendation.summary}</p>
          </div>

          <div className="ai-section">
            <strong>Reasoning</strong>
            <ul>
              {recommendation.factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>

          <div className="ai-section">
            <strong>Expected Outcome</strong>
            <p>{recommendation.outcome}</p>
          </div>

          <div className="ai-section">
            <strong>AI Confidence</strong>
            <p>{recommendation.confidence}</p>
          </div>
        </div>
      )}

      <div className="insight-grid">
        {cards.map((card, index) => (
          <div key={index} className="insight-card">
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </div>
        ))}
      </div>

      <div className="governance-panel">
        <h2>INVISOR Value Compared with Existing Governance Methods</h2>

        <table className="summary-table">
          <tbody>
            <tr>
              <td><strong>Manual Spreadsheets</strong></td>
              <td>
                Require manual consolidation, provide limited traceability and
                delay governance decision-making.
              </td>
            </tr>

            <tr>
              <td><strong>Static Dashboards</strong></td>
              <td>
                Show metrics but usually do not explain why a governance decision
                should be made.
              </td>
            </tr>

            <tr>
              <td><strong>INVISOR</strong></td>
              <td>
                Combines governance scoring, explainable AI, evidence
                traceability, risk assessment, business impact and exportable
                reports in one decision-support workflow.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="governance-panel">
        <h2>Enterprise Governance Lifecycle</h2>

        <div className="metrics-grid">
          {[
            ["Current State", "Governance data monitored"],
            ["Issue Detected", "Risks or exceptions identified"],
            ["Assessment", `${governance.score} governance score`],
            ["AI Recommendation", governance.decision],
            ["Manager Action", "Review and approve action"],
            ["Business Outcome", recommendation?.outcome || "Improved governance"],
          ].map(([label, value]) => (
            <div className="metric-card" key={label}>
              <div className="metric-label">{label}</div>
              <div className="metric-value good">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="primary-btn" onClick={exportModuleReport}>
        Export Specialist Governance Report
      </button>
    </div>
  );
}
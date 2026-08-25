import { useMemo, useState } from "react";
import "../styles/admin.css";
import { governanceRules } from "../data/governanceRulesData";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

function KPI({ label, value, description, primary }) {
  return (
    <div className={`admin-kpi ${primary ? "primary" : ""}`}>
      <span>{label}</span>
      <h2>{value}</h2>
      <p>{description}</p>
    </div>
  );
}

function MiniTrendChart({ violations, exceptions }) {
  const history = [
    { month: "Jan", violations: 18, exceptions: 11, compliance: 86 },
    { month: "Feb", violations: 15, exceptions: 10, compliance: 88 },
    { month: "Mar", violations: 13, exceptions: 8, compliance: 90 },
    { month: "Apr", violations: 11, exceptions: 7, compliance: 92 },
    { month: "May", violations: 9, exceptions: 5, compliance: 94 },
    {
      month: "Jun",
      violations,
      exceptions,
      compliance: clamp(100 - violations)
    }
  ];

  return (
    <div className="executive-chart">
      {history.map((item) => (
        <div className="chart-column" key={item.month}>
          <div
            className="chart-bar"
            style={{
              height: `${clamp(100 - item.violations * 4, 25, 95)}%`
            }}
          >
            <span>{item.violations}</span>
          </div>

          <small>{item.month}</small>
        </div>
      ))}
    </div>
  );
}



export default function GovernanceRules() {
 const [rules, setRules] = useState(governanceRules);
 const activeRules = rules.length;

  const activeStatus = rules.filter(
    (rule) => rule.status === "Active"
  ).length;

  const criticalRules = rules.filter(
    (rule) => rule.priority === "Critical"
  ).length;

  const highPriority = rules.filter(
    (rule) => rule.priority === "High"
  ).length;

  const mediumPriority = rules.filter(
    (rule) => rule.priority === "Medium"
  ).length;

  const totalViolations = rules.reduce(
    (sum, rule) => sum + rule.violations,
    0
  );

  const totalExceptions = rules.reduce(
    (sum, rule) => sum + rule.exceptions,
    0
  );

  const averageCompliance = Math.round(
    rules.reduce(
      (sum, rule) => sum + rule.compliance,
      0
    ) / governanceRules.length
  );

  const averageGovernance = Math.round(
    rules.reduce(
      (sum, rule) => sum + rule.governanceScore,
      0
    ) / rules.length
  );

  const averageConfidence = Math.round(
  rules.reduce(
      (sum, rule) => sum + rule.confidence,
      0
    ) / rules.length
  );


  const complianceRate = Math.round(
  rules.reduce((sum, rule) => sum + rule.compliance, 0) / rules.length
);
  const [violations, setViolations] = useState(11);
  const [exceptions, setExceptions] = useState(7);
  const [reviewedPolicies, setReviewedPolicies] = useState(0);
 

 const policyHealth = clamp(complianceRate - violations + highPriority + reviewedPolicies);

  const [message, setMessage] = useState("");
  const [policyMode, setPolicyMode] = useState("Idle");
  const [lastRun, setLastRun] = useState("Not executed");
  const [events, setEvents] = useState([]);
  const aiRecommendation =
  totalViolations > 40
    ? "Immediate executive intervention required. Prioritise critical policy remediation and close outstanding governance exceptions."
    : criticalRules > 5
    ? "Continue reviewing critical governance controls while reducing exception backlog."
    : "Enterprise governance posture is healthy. Continue continuous monitoring.";

  function pushPolicyEvent(type, title, detail) {
    const event = {
      id: `POL-${Date.now()}`,
      type,
      title,
      detail,
      time: new Date().toLocaleTimeString(),
    };

    setEvents((prev) => [event, ...prev].slice(0, 5));
    setLastRun(event.time);
  }

  return (
    <div className="admin-page">
      <p className="eyebrow">ENTERPRISE POLICY & GOVERNANCE ENGINE</p>

      <h1>Governance Rules Management</h1>

      <p className="admin-sub">
        Centralised governance rule repository for policy validation, compliance
        monitoring, exception management, risk controls and executive decision
        intelligence across INVISOR.
      </p>

      <div className="iam-command-hero">
        <div>
          <p className="hero-eyebrow">POLICY GOVERNANCE INTELLIGENCE</p>
          <h2>Enterprise Policy Control Command Centre</h2>
          <p>
            INVISOR monitors <b>{activeRules}</b> governance rule(s), including{" "}
            <b>{highPriority}</b> high-priority control(s). Current policy health is{" "}
            <b>{policyHealth}%</b> with <b>{complianceRate}%</b> compliance coverage.
          </p>
        </div>

        <div className="iam-decision-orb monitor">
                  <span>
          {totalViolations > 40
            ? "Executive Escalation"
            : totalViolations > 20
            ? "Governance Review"
            : "Continuous Monitoring"}
        </span>
          <small>{policyHealth}% Policy Health</small>
        </div>
      </div>

      <div className="admin-kpi-grid">
        <KPI label="Active Rules" value={activeRules} description="Enterprise policies enforced" primary />
        <KPI label="Compliance Rate" value={`${complianceRate}%`} description="Enterprise adherence" />
        <KPI label="Critical Policies"
              value={criticalRules}
              description="Immediate executive oversight"
            />

            <KPI
              label="Enterprise Violations"
              value={totalViolations}
              description="Across all governance domains"
            />

            <KPI
              label="Open Exceptions"
              value={totalExceptions}
              description="Awaiting governance review"
            />

            <KPI
              label="Governance Score"
              value={`${averageGovernance}%`}
              description="Enterprise governance maturity"
            />

            <KPI
              label="Average Compliance"
              value={`${averageCompliance}%`}
              description="Across all governance policies"
            />

            <KPI
              label="AI Confidence"
              value={`${averageConfidence}%`}
              description="Decision intelligence confidence"
            />
      </div>

      {message && <div className="admin-success">{message}</div>}

      <div className="admin-card governance-event-centre">
        <div className="card-header">
          <h3>Live Policy Governance Event Centre</h3>
          <span>Last Execution: {lastRun}</span>
        </div>

        <div className="event-status-row">
          <div>
            <span>Policy Engine</span>
            <strong>{policyMode}</strong>
          </div>

          <div>
            <span>Compliance Rate</span>
            <strong>{complianceRate}%</strong>
          </div>

          <div>
            <span>Executive Decision</span>
            <strong>
          {totalViolations > 40
            ? "Executive Escalation"
            : totalViolations > 20
            ? "Governance Review"
            : "Continuous Monitoring"}
          </strong>
          </div>
        </div>

        <div className="event-list">
          {events.length === 0 ? (
            <p>No policy governance events executed yet.</p>
          ) : (
            events.map((event) => (
              <div className={`event-item ${event.type}`} key={event.id}>
                <strong>{event.time}</strong>
                <div>
                  <h4>{event.title}</h4>
                  <p>{event.detail}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="enterprise-action-grid">
        <div
          className="enterprise-action-card"
          onClick={() => {
            setPolicyMode("High-Risk Policy Review Completed");
            setReviewedPolicies(highPriority);
            setViolations((prev) => Math.max(prev - 2, 0));
            pushPolicyEvent(
              "warning",
              "High-Risk Policy Review Completed",
              `${highPriority} high-priority governance policies reviewed.`
            );
            setRules((prev) =>
                prev.map((rule) =>
                  rule.priority === "Critical" || rule.priority === "High"
                    ? {
                        ...rule,
                        status: "Under Review",
                        aiDecision: "Review",
                        recommendation: "Policy reviewed by governance engine.",
                        violations: Math.max(rule.violations - 1, 0),
                        updated: true,
                      }
                    : rule
                )
              );
            setMessage(`${highPriority} high-priority governance policies reviewed and flagged for executive oversight.`);
          }}
        >
          <div className="enterprise-action-icon">⚠️</div>
          <h3>Review High-Risk Policies</h3>
          <p>Analyse high-priority rules, policy exposure and recurring governance exceptions.</p>
          <span>Execute →</span>
        </div>

        <div
          className="enterprise-action-card"
          onClick={() => {
            setPolicyMode("Exception Review Initiated");
            setExceptions((prev) => Math.max(prev - 3, 0));
            pushPolicyEvent(
              "info",
              "Exception Review Initiated",
              `${exceptions} exception request(s) routed for approval review.`
            );
            setRules((prev) =>
              prev.map((rule) =>
                rule.exceptions > 0
                  ? {
                      ...rule,
                      exceptions: Math.max(rule.exceptions - 1, 0),
                      recommendation: "Exception routed for approval review.",
                      updated: true,
                    }
                  : rule
              )
            );
            setMessage(`${exceptions} exception request(s) routed to the governance approval queue.`);
          }}
        >
          <div className="enterprise-action-icon">📋</div>
          <h3>Review Exceptions</h3>
          <p>Route exception requests for policy validation and approval assessment.</p>
          <span>Execute →</span>
        </div>

        <div
          className="enterprise-action-card"
          onClick={() => {
            setPolicyMode("Compliance Audit Scheduled");
            setViolations((prev) => Math.max(prev - 1, 0));
            setExceptions((prev) => Math.max(prev - 1, 0));
            pushPolicyEvent(
              "success",
              "Compliance Audit Scheduled",
              "Next compliance audit cycle prepared for governance validation."
            );
            setRules((prev) =>
          prev.map((rule) => ({
            ...rule,
            auditReadiness: "Compliant",
            confidence: Math.min(rule.confidence + 1, 100),
            updated: true,
          }))
        );
            setMessage("Compliance audit cycle scheduled and governance evidence checklist refreshed.");
          }}
        >
          <div className="enterprise-action-icon">✅</div>
          <h3>Schedule Compliance Audit</h3>
          <p>Prepare audit readiness checks, evidence review and compliance validation.</p>
          <span>Execute →</span>
        </div>

        <div
          className="enterprise-action-card warning"
          onClick={() => {
            setPolicyMode("AI Recommendation Generated");
            pushPolicyEvent(
              "critical",
              "AI Recommendation Generated",
              "Financial approval governance requires strengthened executive control."
            );
            setRules((prev) =>
            prev.map((rule) =>
              rule.businessImpact === "Critical"
                ? {
                    ...rule,
                    aiDecision: "Escalate",
                    recommendation: "AI recommends executive-level governance intervention.",
                    updated: true,
                  }
                : rule
            )
          );
            setMessage("AI recommendation generated: strengthen financial approval governance controls.");
          }}
        >
          <div className="enterprise-action-icon">🤖</div>
          <h3>Generate AI Recommendation</h3>
          <p>Generate explainable policy recommendation based on violations and maturity score.</p>
          <span>Execute →</span>
        </div>
      </div>

      <div className="admin-card">
        <h3>Enterprise Governance Processing Workflow</h3>

        <div className="workflow-grid">
          <div>
            <h4>Input</h4>
            <ul>
              <li>Governance Policies</li>
              <li>Risk Thresholds</li>
              <li>Audit Findings</li>
              <li>Compliance Standards</li>
              <li>Exception Requests</li>
            </ul>
          </div>

          <div>
            <h4>Processing</h4>
            <ul>
              <li>Policy Validation</li>
              <li>Compliance Assessment</li>
              <li>Risk Classification</li>
              <li>Governance Scoring</li>
              <li>AI Recommendation Engine</li>
            </ul>
          </div>

          <div>
            <h4>Output</h4>
            <ul>
              <li>Compliance Dashboard</li>
              <li>Governance Score</li>
              <li>Risk Rating</li>
              <li>Executive Decision</li>
              <li>Governance Report</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Policy Violation Trend</h3>
        <MiniTrendChart
  violations={totalViolations}
  exceptions={totalExceptions}
/>
        <div className="chart-summary">
          <div>
            <strong>67%</strong>
            <span>Violation reduction</span>
          </div>
          <div>
            <strong>{totalViolations}</strong>
            <span>Current violations</span>
          </div>
          <div>
            <strong>{totalExceptions}</strong>
            <span>Open exceptions</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Governance Maturity Assessment</h3>

        <table>
          <thead>
            <tr>
              <th>Capability</th>
              <th>Current Score</th>
              <th>Maturity Level</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Policy Governance</td>
              <td>94%</td>
              <td>Optimised</td>
            </tr>
            <tr>
              <td>Compliance Monitoring</td>
              <td>92%</td>
              <td>Optimised</td>
            </tr>
            <tr>
              <td>Risk Governance</td>
              <td>89%</td>
              <td>Managed</td>
            </tr>
            <tr>
              <td>Audit Governance</td>
              <td>96%</td>
              <td>Optimised</td>
            </tr>
            <tr>
              <td>Decision Intelligence</td>
              <td>93%</td>
              <td>Optimised</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Enterprise Governance Policy Register</h3>

        <table>
          <thead>
            <tr>
            <th>Policy</th>
            <th>Framework</th>
            <th>Compliance</th>
            <th>Governance</th>
            <th>Confidence</th>
            <th>Business Impact</th>
            <th>Decision</th>
          </tr>
          </thead>

          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} className={rule.updated ? "updated-row" : ""}>
                <td>{rule.policy}</td>
                <td>{rule.framework}</td>
                <td>{rule.compliance}%</td>
                <td>{rule.governanceScore}%</td>
                <td>{rule.confidence}%</td>
                <td>{rule.businessImpact}</td>
                <td>
                  <span className={`decision-badge ${rule.aiDecision.toLowerCase()}`}>
                    {rule.aiDecision}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Automated Governance Rule Evaluation Engine</h3>

        <table>
          <thead>
            <tr>
              <th>Rule</th>
              <th>Threshold</th>
              <th>Observed Value</th>
              <th>Compliance</th>
              <th>Confidence</th>
              <th>Decision</th>
              <th>Recommendation</th>
            </tr>
          </thead>

          <tbody>
          {governanceRules.map((rule) => (
          <tr key={rule.id} className={rule.updated ? "updated-row" : ""}>
            <td>{rule.policy}</td>
            <td>{rule.threshold}</td>
            <td>{rule.observedValue}</td>
            <td>{rule.compliance}%</td>
            <td>{rule.confidence}%</td>
            <td>
              <span className={`decision-badge ${rule.aiDecision.toLowerCase()}`}>
                {rule.aiDecision}
              </span>
            </td>
            <td>{rule.recommendation}</td>
          </tr>
        ))}
          </tbody>
        </table>
      </div>

     <div className="admin-card">

  <div className="card-header-between">

    <div>

      <p className="eyebrow">
        EXPLAINABLE AI DECISION ENGINE
      </p>

      <h2>Executive Governance Recommendation</h2>

    </div>

    <span className="status-badge success">
      {averageConfidence}% AI Confidence
    </span>

  </div>

  <div className="executive-ai-grid">

    {/* LEFT */}

    <div className="executive-ai-card">

      <h3>Executive Decision</h3>

      <div className="decision-box">

        <h2>

          {totalViolations > 30

            ? "Executive Escalation"

            : totalViolations > 15

            ? "Governance Review"

            : "Continuous Monitoring"}

        </h2>

        <p>{aiRecommendation}</p>

      </div>

      <div className="confidence-bar">

        <div

          className="confidence-fill"

          style={{ width: `${averageConfidence}%` }}

        />

      </div>

      <small>

        AI Confidence

        {" "}

        <strong>{averageConfidence}%</strong>

      </small>

    </div>

    {/* RIGHT */}

    <div className="executive-ai-card">

      <h3>Business Impact</h3>

      <table className="summary-table">

        <tbody>

          <tr>

            <td>Governance Score</td>

            <td>

              <strong>{averageGovernance}%</strong>

            </td>

          </tr>

          <tr>

            <td>Compliance</td>

            <td>

              <strong>{averageCompliance}%</strong>

            </td>

          </tr>

          <tr>

            <td>Critical Policies</td>

            <td>

              <strong>{criticalRules}</strong>

            </td>

          </tr>

          <tr>

            <td>Violations</td>

            <td>

              <strong>{totalViolations}</strong>

            </td>

          </tr>

          <tr>

            <td>Exceptions</td>

            <td>

              <strong>{totalExceptions}</strong>

            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>

  <div className="executive-ai-grid">

    {/* WHY */}

    <div className="executive-ai-card">

      <h3>Evidence Used</h3>

      <ul className="recommendation-list">

        <li>Policy repository evaluation</li>

        <li>Governance rule engine</li>

        <li>Compliance threshold assessment</li>

        <li>Historical violation patterns</li>

        <li>Risk scoring model</li>

        <li>Audit readiness indicators</li>

        <li>Department benchmarking</li>

      </ul>

    </div>

    {/* ACTIONS */}

    <div className="executive-ai-card">

      <h3>Recommended Executive Actions</h3>

      <ol className="recommendation-list">

        <li>Escalate critical governance findings.</li>

        <li>Review high-risk enterprise policies.</li>

        <li>Close outstanding governance exceptions.</li>

        <li>Recalculate governance maturity.</li>

        <li>Schedule executive compliance review.</li>

      </ol>

    </div>

  </div>

  <div className="executive-ai-card">

    <h3>Predicted Business Outcome</h3>

    <table className="summary-table">

      <thead>

        <tr>

          <th>KPI</th>

          <th>Current</th>

          <th>Predicted</th>

        </tr>

      </thead>

      <tbody>

        <tr>

          <td>Governance Score</td>

          <td>{averageGovernance}%</td>

          <td>{Math.min(100, averageGovernance + 8)}%</td>

        </tr>

        <tr>

          <td>Compliance</td>

          <td>{averageCompliance}%</td>

          <td>{Math.min(100, averageCompliance + 5)}%</td>

        </tr>

        <tr>

          <td>Violations</td>

          <td>{totalViolations}</td>

          <td>{Math.max(0, totalViolations - 7)}</td>

        </tr>

        <tr>

          <td>Exceptions</td>

          <td>{totalExceptions}</td>

          <td>{Math.max(0, totalExceptions - 4)}</td>

        </tr>

      </tbody>

    </table>

  </div>

</div>
    </div>
  );
}
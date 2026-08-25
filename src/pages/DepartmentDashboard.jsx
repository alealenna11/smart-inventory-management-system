import { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { departmentConfig, normalizeDepartment } from "../config/departmentConfig";
import { exportExcel } from "../utils/exportExcel";
import "../styles/global.css";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

function parsePercent(value) {
  if (typeof value === "number") return value;
  const num = Number(String(value).replace("%", ""));
  return Number.isFinite(num) ? num : 75;
}

function getMaturity(score) {
  if (score >= 90) return "Optimised";
  if (score >= 80) return "Managed";
  if (score >= 70) return "Defined";
  if (score >= 60) return "Developing";
  return "Initial";
}

export default function DepartmentDashboard() {
  const { user } = useAuth();
  const departmentKey = normalizeDepartment(user?.department);
const config = departmentConfig[departmentKey];
const departmentName = config?.shortName || departmentKey || "Enterprise";
  const [selected, setSelected] = useState(null);

  if (!config) {
    return (
      <div className="dashboard-container">
        <h1>Department Workspace</h1>
        <p>No department configuration found.</p>
      </div>
    );
  }



  const governanceSignals = useMemo(() => {
    const numericKpis = config.kpis.map((kpi) => ({
      ...kpi,
      score: parsePercent(kpi.value),
    }));

    const governanceScore = clamp(
      numericKpis.reduce((sum, kpi) => sum + kpi.score, 0) /
        Math.max(numericKpis.length, 1)
    );

    const riskSignal = numericKpis.some((kpi) =>
      String(kpi.value).toLowerCase().includes("high")
    )
      ? 75
      : numericKpis.some((kpi) => String(kpi.value).toLowerCase().includes("medium"))
      ? 48
      : 25;

    const decision =
      riskSignal >= 70 || governanceScore < 70
        ? "Escalate"
        : riskSignal >= 45 || governanceScore < 80
        ? "Review"
        : "Monitor";

    return {
      numericKpis,
      governanceScore,
      riskSignal,
      decision,
      maturity: getMaturity(governanceScore),
    };
  }, [config]);

  const recommendation =
    governanceSignals.decision === "Escalate"
      ? "Escalate department risk items and validate supporting evidence."
      : governanceSignals.decision === "Review"
      ? "Review SLA urgency, budget pressure and governance follow-ups."
      : "Maintain current department governance posture.";
      
   function exportDepartmentGovernanceReport() {
  exportExcel({
    fileName: `${departmentName}_Department_Governance_Report`,

    overview: [
      { Section: "Department", Value: departmentName },
      { Section: "Governance Score", Value: governanceSignals.governanceScore },
      { Section: "Risk Signal", Value: governanceSignals.riskSignal },
      { Section: "Maturity", Value: governanceSignals.maturity },
      { Section: "Decision", Value: governanceSignals.decision },
      { Section: "Generated", Value: new Date().toLocaleString() },
    ],

    metrics: config.kpis.map((kpi) => ({
      Metric: kpi.label,
      Value: kpi.value,
    })),

    reasoning: [
      { Category: "Recommendation", Value: recommendation },
      {
        Category: "Decision Logic",
        Value:
          "INVISOR evaluates KPIs, SLA urgency, budget pressure, operational risk and audit traceability before generating the department decision.",
      },
    ],

    audit: config.actions.map((action) => ({
      GovernanceAction: action,
      Department: departmentName,
      Status: "Available for review",
    })),
  });
}


  return (
    <div className="dashboard-container">
      <div className="topbar premium">
        <div>
          <p className="subtitle-small">INVISOR Department Workspace</p>
          <h1>{config.title}</h1>
          <p className="subtitle">{config.focus}</p>
        </div>
      </div>

      <div className="card governance-score glow fade-in">
        <h3>{departmentName} Governance Story</h3>
        <p>
          INVISOR evaluates {departmentName} using department KPIs, action
          queues, SLA urgency, budget pressure, operational risk and audit
          traceability. Current decision: <b>{governanceSignals.decision}</b>.
        </p>
      </div>

      <div className="kpi-grid">
        {config.kpis.map((kpi) => (
          <div className="kpi-card clickable" key={kpi.label} onClick={() => setSelected(kpi)}>
            <span>{kpi.label}</span>
            <h2>{kpi.value}</h2>
          </div>
        ))}
      </div>

      <div className="card governance-score glow fade-in">
        <h3>Department Decision Intelligence</h3>

        <div className="summary-item">
          <span>Governance Score</span>
          <b>{governanceSignals.governanceScore}/100</b>
        </div>

        <div className="summary-item">
          <span>Risk Signal</span>
          <b>{governanceSignals.riskSignal}/100</b>
        </div>

        <div className="summary-item">
          <span>Maturity</span>
          <b>{governanceSignals.maturity}</b>
        </div>

        <div className="summary-item">
          <span>Recommendation</span>
          <b>{recommendation}</b>
        </div>
      </div>

      {selected && (
        <div className="card detail-panel glow">
          <h3>{selected.label} Explanation</h3>
          <p>
            This KPI contributes to the department governance score and helps
            determine whether the department should be monitored, reviewed or
            escalated.
          </p>
          <p>
            <b>Current Value:</b> {selected.value}
          </p>
          <button className="action-btn" onClick={() => setSelected(null)}>
            Close
          </button>
        </div>
      )}

      <div className="card ai-panel">
        <h3>Department Governance Intelligence</h3>
        <p>
          This workspace is tailored for {departmentName}. INVISOR evaluates
          budget requests, allocation pressure, SLA urgency, operational risks,
          audit evidence and policy compliance for this department.
        </p>
      </div>

      <div className="card">
        <h3>Department-Specific Actions</h3>

        <div className="actions-grid">
          {config.actions.map((action) => (
            <div className="action-card clickable" key={action} onClick={() => setSelected({ label: action, value: "Workflow" })}>
              <h4>{action}</h4>
              <p>Execute governance workflow for {departmentName}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card detail-panel">
        <h3>Governance Scope</h3>
        <ul>
          <li>Budget governance and request prioritisation</li>
          <li>Resource allocation and fairness monitoring</li>
          <li>SLA delay detection and escalation</li>
          <li>Audit evidence and decision traceability</li>
          <li>Control exception monitoring</li>
        </ul>
        <button className="primary-btn" onClick={exportDepartmentGovernanceReport}>
  Export Department Governance Report (Excel)
</button>
      </div>
    </div>
  );
}
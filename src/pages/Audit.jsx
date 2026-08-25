import { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { departmentConfig, normalizeDepartment } from "../config/departmentConfig";
import { auditData } from "../data/auditData";
import { explainDecision } from "../utils/governanceDecisionEngine";
import DepartmentGovernanceLifecycle from "../components/DepartmentGovernanceLifecycle";
import "../styles/audit.css";

export default function Audit() {
  const { user } = useAuth();
  const departmentKey = normalizeDepartment(user?.department);
  const config = departmentConfig[departmentKey];
  const departmentName = config?.shortName || departmentKey || "Enterprise";

  const initialLogs =
    user?.role === "department_user"
      ? auditData[user.department] || []
      : Object.values(auditData).flat();

  const [logs, setLogs] = useState(initialLogs);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [actionMsg, setActionMsg] = useState("");

  const filtered = logs.filter((log) =>
    filter === "All" ? true : log.risk === filter
  );

  const totalLogs = logs.length;
  const highRisk = logs.filter((log) => log.risk === "High").length;
  const mediumRisk = logs.filter((log) => log.risk === "Medium").length;
  const openItems = logs.filter((log) => log.status !== "Closed").length;
  const missingEvidence = logs.filter((log) => log.evidence === "Missing").length;
  const escalatedItems = logs.filter((log) => log.status === "Escalated").length;

  const complianceScore = Math.max(
    65,
    100 - highRisk * 5 - openItems * 2 - missingEvidence * 3
  );

  const auditReadiness = useMemo(() => {
    if (!logs.length) return 0;
    const closed = logs.filter((log) => log.status === "Closed").length;
    return Math.round((closed / logs.length) * 100);
  }, [logs]);

  const evidenceAvailability = Math.max(0, 100 - missingEvidence * 5);

  const governanceHealth = Math.round(
    (complianceScore + auditReadiness + evidenceAvailability) / 3
  );

  const governanceMaturity =
    governanceHealth >= 90
      ? "Optimised"
      : governanceHealth >= 80
      ? "Managed"
      : governanceHealth >= 70
      ? "Defined"
      : "Developing";

  const selectedExplanation = selected ? explainDecision(selected) : null;

  const highestPriorityAction =
    highRisk > 0
      ? "Escalate high-risk audit findings"
      : missingEvidence > 0
      ? "Review missing audit evidence"
      : openItems > 0
      ? "Close outstanding audit items"
      : "Maintain audit monitoring";

  function reviewEvidence() {
    setLogs(
      logs.map((log) =>
        log.evidence === "Missing" || log.evidence === "Partial"
          ? {
              ...log,
              evidence: "Available",
              status: "In Review",
              action: "Evidence Reviewed",
            }
          : log
      )
    );

    setActionMsg("Evidence review completed and audit records updated.");
  }

  function escalateHighRisk() {
    setLogs(
      logs.map((log) =>
        log.risk === "High"
          ? {
              ...log,
              status: "Escalated",
              action: "Escalated to Governance Review",
            }
          : log
      )
    );

    setActionMsg("High-risk audit findings escalated to governance review.");
  }

  function closeLowRisk() {
    setLogs(
      logs.map((log) =>
        log.risk === "Low"
          ? {
              ...log,
              status: "Closed",
              action: "Closed After Review",
            }
          : log
      )
    );

    setActionMsg("Low-risk audit items closed after review.");
  }

  function resetAudit() {
    setLogs(initialLogs);
    setSelected(null);
    setActionMsg("Audit dataset reset.");
  }

  return (
    <div className="audit-page">
      <p className="eyebrow">AUDIT & REGULATORY ASSURANCE CENTRE</p>

      <h2>
        {user?.role === "department_user"
          ? `${config?.shortName} Audit & Explainability`
          : "Enterprise Audit & Explainability"}
      </h2>

      <p className="sub">
        Governance audit dashboard for decision traceability, evidence review,
        compliance scoring, audit readiness and escalation monitoring.
      </p>

      <div className="audit-kpi">
        <div className="kpi-card">
          <span>Total Logs</span>
          <h3>{totalLogs}</h3>
        </div>

        <div className="kpi-card">
          <span>High Risk</span>
          <h3 className="risk high">{highRisk}</h3>
        </div>

        <div className="kpi-card">
          <span>Open Items</span>
          <h3>{openItems}</h3>
        </div>

        <div className="kpi-card">
          <span>Compliance</span>
          <h3>{complianceScore}%</h3>
        </div>
      </div>

      <div className="audit-kpi">
        <div className="kpi-card">
          <span>Missing Evidence</span>
          <h3>{missingEvidence}</h3>
        </div>

        <div className="kpi-card">
          <span>Audit Readiness</span>
          <h3>{auditReadiness}%</h3>
        </div>

        <div className="kpi-card">
          <span>Governance Health</span>
          <h3>{governanceHealth}%</h3>
        </div>

        <div className="kpi-card">
          <span>Maturity</span>
          <h3>{governanceMaturity}</h3>
        </div>
      </div>

      {actionMsg && <div className="success-msg">{actionMsg}</div>}

      <div className="audit-card highlight">
        <h3>Audit Intelligence Summary</h3>
        <p>
          <b>Governance Health:</b> {governanceHealth}% <br />
          <b>Maturity Level:</b> {governanceMaturity} <br />
          <b>Highest Priority Action:</b> {highestPriorityAction}
        </p>
      </div>

      <div className="audit-card">
        <h3>Audit Readiness Assessment</h3>

        <div className="summary-item">
          <span>Evidence Availability</span>
          <b>{evidenceAvailability}%</b>
        </div>

        <div className="summary-item">
          <span>Compliance Score</span>
          <b>{complianceScore}%</b>
        </div>

        <div className="summary-item">
          <span>Audit Readiness</span>
          <b>{auditReadiness}%</b>
        </div>

        <div className="summary-item">
          <span>Escalated Findings</span>
          <b>{escalatedItems}</b>
        </div>
      </div>

      <div className="audit-card filter-card">
        {["All", "High", "Medium", "Low"].map((risk) => (
          <button
            key={risk}
            className={filter === risk ? "active-btn" : ""}
            onClick={() => setFilter(risk)}
          >
            {risk}
          </button>
        ))}
      </div>

      <div className="audit-card action-panel">
        <button className="primary-btn" onClick={reviewEvidence}>
          Review Evidence
        </button>

        <button className="danger-btn" onClick={escalateHighRisk}>
          Escalate High Risk
        </button>

        <button className="secondary-btn" onClick={closeLowRisk}>
          Close Low Risk
        </button>

        <button className="reset-btn" onClick={resetAudit}>
          Reset Audit
        </button>
      </div>

      <div className="audit-card">
        <div className="table-header">
          <h3>
            {user?.role === "department_user"
              ? `${config?.shortName} Audit & Explainability Governance Repository`
              : "Audit & Explainability Governance Repository"}
          </h3>
          <span>{filtered.length} records</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Event</th>
                <th>Module</th>
                <th>Department</th>
                <th>Status</th>
                <th>Evidence</th>
                <th>Risk</th>
                <th>Action</th>
                <th>Decision</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((log) => {
                const explanation = explainDecision(log);

                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelected(log)}
                    className={selected?.id === log.id ? "selected-row" : ""}
                  >
                    <td className="mono">{log.id}</td>
                    <td>{log.event}</td>
                    <td>{log.module}</td>
                    <td>{log.department}</td>
                    <td>{log.status}</td>
                    <td>{log.evidence}</td>
                    <td className={`risk ${log.risk.toLowerCase()}`}>
                      {log.risk}
                    </td>
                    <td>{log.action}</td>
                    <td>{explanation.decision}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && selectedExplanation && (
        <div className="audit-card detail">
          <h3>{selected.id} Decision Explainability</h3>

          <div className="detail-grid">
            <div className="detail-item">
              <span>Owner</span>
              <b>{selected.owner}</b>
            </div>

            <div className="detail-item">
              <span>Module</span>
              <b>{selected.module}</b>
            </div>

            <div className="detail-item">
              <span>Status</span>
              <b>{selected.status}</b>
            </div>

            <div className="detail-item">
              <span>Risk</span>
              <b className={`risk ${selected.risk.toLowerCase()}`}>
                {selected.risk}
              </b>
            </div>
          </div>

          <div className="recommendation-box">
            <span>Governance Decision Explanation</span>

            <p>
              <b>Decision:</b> {selectedExplanation.decision}
            </p>

            <p>
              <b>Recommendation:</b> {selectedExplanation.recommendation}
            </p>

            <p>
              <b>Reason:</b> {selectedExplanation.reason}
            </p>

            <p>
              <b>Decision Factors:</b>
            </p>

            <ul>
              {selectedExplanation.factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
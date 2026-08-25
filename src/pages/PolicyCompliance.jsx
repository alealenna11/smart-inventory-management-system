import { useState } from "react";
import { policyData } from "../data/policyData";
import "../styles/admin.css";

function getDecision(policy) {
  if (policy.status === "VIOLATION") return "Escalate";
  if (policy.status === "WARNING") return "Review";
  return "Monitor";
}

export default function PolicyCompliance() {
  const [selected, setSelected] = useState(null);

  const passCount = policyData.filter((p) => p.status === "PASS").length;
  const warningCount = policyData.filter((p) => p.status === "WARNING").length;
  const violationCount = policyData.filter((p) => p.status === "VIOLATION").length;

  const complianceScore = Math.round((passCount / Math.max(policyData.length, 1)) * 100);

  const highestConcern =
    policyData.find((p) => p.status === "VIOLATION") ||
    policyData.find((p) => p.status === "WARNING") ||
    policyData[0];

  const decision =
    violationCount > 0 ? "Escalate" : warningCount > 0 ? "Review" : "Monitor";

  return (
    <div className="admin-page">
      <p className="eyebrow">ENTERPRISE POLICY GOVERNANCE</p>

      <h1>Policy Compliance Engine</h1>

      <p className="admin-sub">
        Governance-driven monitoring of policy compliance, budget controls,
        operational thresholds, audit requirements, approval workflows and
        enterprise governance rules.
      </p>

      <div className="admin-card executive">
        <h3>Policy Compliance Story</h3>
        <p>
          INVISOR assessed <b>{policyData.length}</b> policy rule(s). Compliance
          score is <b>{complianceScore}%</b>, with <b>{violationCount}</b>{" "}
          violation(s) and <b>{warningCount}</b> warning(s). Recommended decision:
          <b> {decision}</b>. Highest concern: <b>{highestConcern?.rule}</b>.
        </p>
      </div>

      <div className="admin-kpi-grid">
        <div className="admin-kpi primary"><span>Compliance Score</span><h2>{complianceScore}%</h2><p>Enterprise governance compliance</p></div>
        <div className="admin-kpi"><span>Passed Rules</span><h2>{passCount}</h2><p>Operating effectively</p></div>
        <div className="admin-kpi"><span>Warnings</span><h2>{warningCount}</h2><p>Require monitoring</p></div>
        <div className="admin-kpi"><span>Violations</span><h2>{violationCount}</h2><p>Require intervention</p></div>
      </div>

      <div className="admin-card">
        <h3>Policy Compliance Register</h3>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Policy Rule</th>
              <th>Department</th>
              <th>Status</th>
              <th>Severity</th>
              <th>Decision</th>
            </tr>
          </thead>

          <tbody>
            {policyData.map((policy) => (
              <tr key={policy.id} onClick={() => setSelected(policy)}>
                <td>{policy.id}</td>
                <td>{policy.category}</td>
                <td>{policy.rule}</td>
                <td>{policy.department}</td>
                <td>{policy.status}</td>
                <td>{policy.severity}</td>
                <td>{getDecision(policy)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="admin-card executive">
          <h3>{selected.id} Compliance Decision Explanation</h3>

          <p><strong>Category:</strong> {selected.category}</p>
          <p><strong>Policy Rule:</strong> {selected.rule}</p>
          <p><strong>Department:</strong> {selected.department}</p>
          <p><strong>Status:</strong> {selected.status}</p>
          <p><strong>Severity:</strong> {selected.severity}</p>
          <p><strong>Description:</strong> {selected.description}</p>
          <p><strong>Decision:</strong> {getDecision(selected)}</p>
          <p>
            <strong>Recommendation:</strong>{" "}
            {getDecision(selected) === "Escalate"
              ? "Escalate violation to governance owner and document remediation."
              : getDecision(selected) === "Review"
              ? "Review warning and monitor trend."
              : "Maintain current control posture."}
          </p>
        </div>
      )}

      <div className="admin-card executive">
        <h3>Policy Intelligence Recommendation</h3>
        <p>
          INVISOR recommends prioritising violations first, monitoring warning
          items and maintaining audit evidence for all passed controls. This
          supports explainable compliance decisions and audit-ready governance.
        </p>
      </div>
    </div>
  );
}
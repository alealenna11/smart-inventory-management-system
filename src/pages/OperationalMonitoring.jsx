import { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { departmentConfig, normalizeDepartment } from "../config/departmentConfig";
import { operationalData } from "../data/operationalData";
import DepartmentGovernanceLifecycle from "../components/DepartmentGovernanceLifecycle";
import "../styles/operationalMonitoring.css";

export default function OperationalMonitoring() {
  const { user } = useAuth();
  const departmentKey = normalizeDepartment(user?.department);
  const config = departmentConfig[departmentKey];
  const departmentName = config?.shortName || departmentKey || "Enterprise";

  const initialRecords =
    user?.role === "department_user"
      ? operationalData[user.department] || []
      : Object.values(operationalData).flat();

  const [records, setRecords] = useState(initialRecords);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const filtered = records.filter((record) =>
    filter === "All" ? true : record.severity === filter
  );

  const total = records.length;
  const active = records.filter((record) => record.status === "Active").length;
  const high = records.filter((record) => record.severity === "High").length;
  const medium = records.filter((record) => record.severity === "Medium").length;
  const low = records.filter((record) => record.severity === "Low").length;
  const breached = records.filter((record) => record.sla === "Breached").length;
  const escalated = records.filter((record) => record.status === "Escalated").length;

  const monitoringScore = useMemo(() => {
    return Math.max(60, 100 - high * 4 - breached * 3 - active);
  }, [high, breached, active]);

  const slaHealth = Math.max(60, 100 - breached * 8);
  const riskControlScore = Math.max(60, 100 - high * 8 - medium * 4);
  const operationalReadiness = Math.max(60, 100 - active * 3 - breached * 5);

  const governanceHealth = Math.round(
    (monitoringScore + slaHealth + riskControlScore + operationalReadiness) / 4
  );

  const maturityLevel =
    governanceHealth >= 90
      ? "Optimised"
      : governanceHealth >= 80
      ? "Managed"
      : governanceHealth >= 70
      ? "Defined"
      : "Developing";

  const governanceTrend =
    high >= 3 || breached >= 3
      ? "Increasing Governance Risk"
      : active >= 5
      ? "Moderate Monitoring Exposure"
      : "Stable Operational Posture";

  const priorityRecommendation =
    high > 0
      ? "Escalate high-severity operational risks"
      : breached > 0
      ? "Run SLA recovery workflow"
      : active > 0
      ? "Continue monitoring active items"
      : "Maintain current operational governance posture";

  function getGovernanceScore(record) {
    const severityPenalty =
      record.severity === "High" ? 25 : record.severity === "Medium" ? 12 : 3;

    const slaPenalty =
      record.sla === "Breached" ? 18 : record.sla === "At Risk" ? 10 : 0;

    const statusPenalty =
      record.status === "Active"
        ? 8
        : record.status === "Escalated"
        ? 15
        : record.status === "In Progress"
        ? 5
        : 0;

    return Math.max(50, 100 - severityPenalty - slaPenalty - statusPenalty);
  }

  function getDecision(record) {
    if (record.severity === "High") {
      return {
        decision: "Escalate",
        recommendation: "Escalate to Governance Review Board",
        reason:
          "High severity operational risk requires immediate governance attention.",
      };
    }

    if (record.sla === "Breached") {
      return {
        decision: "Recover",
        recommendation: "Trigger SLA recovery workflow",
        reason:
          "SLA breach may affect operational readiness and service continuity.",
      };
    }

    if (record.status === "Active") {
      return {
        decision: "Monitor",
        recommendation: "Continue active monitoring",
        reason:
          "Operational item remains active but does not require immediate escalation.",
      };
    }

    return {
      decision: "Close / Monitor",
      recommendation: "Maintain monitoring records",
      reason: "No immediate governance risk detected.",
    };
  }

  const selectedDecision = selected ? getDecision(selected) : null;
  const selectedGovernanceScore = selected ? getGovernanceScore(selected) : null;

  function resolveAlerts() {
    setRecords(
      records.map((record) =>
        record.severity !== "High"
          ? { ...record, status: "Resolved", sla: "On Track" }
          : record
      )
    );
    setMessage("Medium and low monitoring items resolved.");
  }

  function escalateHighRisk() {
    setRecords(
      records.map((record) =>
        record.severity === "High"
          ? {
              ...record,
              status: "Escalated",
              owner: "Governance Review Board",
            }
          : record
      )
    );
    setMessage("High-severity items escalated to Governance Review Board.");
  }

  function runSlaRecovery() {
    setRecords(
      records.map((record) =>
        record.sla === "Breached"
          ? { ...record, sla: "At Risk", status: "In Progress" }
          : record
      )
    );
    setMessage("SLA recovery workflow triggered for breached items.");
  }

  function simulateAlert() {
    const newRecord = {
      id: `MON-${departmentName}-${String(records.length + 1).padStart(3, "0")}`,
      area: config?.title || "Enterprise Governance",
      issue: "New operational exception detected",
      severity: "High",
      status: "Active",
      owner:
        user?.role === "department_user"
          ? `${departmentName} Governance Owner`
          : "Governance Team",
      sla: "Breached",
      department: user?.department || "Enterprise",
    };

    setRecords([newRecord, ...records]);
    setMessage("New operational alert generated.");
  }

  function resetRecords() {
    setRecords(initialRecords);
    setSelected(null);
    setMessage("Operational monitoring dataset reset.");
  }

  return (
    <div className="monitor-page">
      <p className="eyebrow">
        OPERATIONAL RESILIENCE & SERVICE CONTINUITY GOVERNANCE
      </p>

      <h2>
        {user?.role === "department_user"
          ? `${departmentName} Operational Resilience Monitoring`
          : "Enterprise Operational Monitoring Centre"}
      </h2>

      <p className="sub">
        Real-time monitoring dashboard for SLA breaches, validation queues,
        approval delays, audit exceptions, and operational governance risks.
      </p>

      <div className="monitor-kpi">
        <div className="kpi-card">
          <span>Total Records</span>
          <h3>{total}</h3>
        </div>

        <div className="kpi-card">
          <span>Active Items</span>
          <h3>{active}</h3>
        </div>

        <div className="kpi-card">
          <span>High Severity</span>
          <h3 className="risk high">{high}</h3>
        </div>

        <div className="kpi-card">
          <span>Governance Health</span>
          <h3>{governanceHealth}%</h3>
        </div>
      </div>

      <div className="monitor-kpi">
        <div className="kpi-card">
          <span>Monitoring Score</span>
          <h3>{monitoringScore}%</h3>
        </div>

        <div className="kpi-card">
          <span>SLA Health</span>
          <h3>{slaHealth}%</h3>
        </div>

        <div className="kpi-card">
          <span>Breached SLA</span>
          <h3>{breached}</h3>
        </div>

        <div className="kpi-card">
          <span>Maturity</span>
          <h3>{maturityLevel}</h3>
        </div>
      </div>

      {(high > 0 || breached > 0) && (
        <div className="monitor-alert">
          {high} high-severity item(s) and {breached} SLA breach(es) require attention.
        </div>
      )}

      {message && <div className="success-msg">{message}</div>}

      <div className="monitor-card highlight">
        <h3>Operational Governance Intelligence</h3>
        <p>
          <b>Governance Health:</b> {governanceHealth}% <br />
          <b>Maturity Level:</b> {maturityLevel} <br />
          <b>Priority Recommendation:</b> {priorityRecommendation}
        </p>
      </div>

      <div className="monitor-card highlight">
        <h3>Governance Trend Analysis</h3>
        <p>
          <b>High Severity Items:</b> {high} <br />
          <b>SLA Breaches:</b> {breached} <br />
          <b>Escalated Items:</b> {escalated} <br />
          <b>Trend:</b> {governanceTrend}
        </p>
      </div>

      <div className="monitor-card highlight">
        <h3>Operational Decision Logic</h3>
        <p>
          Operational records are assessed using severity, SLA position, active
          status and escalation exposure. INVISOR then recommends whether an
          item should be monitored, recovered, escalated or closed.
        </p>
      </div>

      <div className="monitor-card action-row">
        {["All", "High", "Medium", "Low"].map((filterOption) => (
          <button
            key={filterOption}
            className={filter === filterOption ? "active-btn" : ""}
            onClick={() => setFilter(filterOption)}
          >
            {filterOption}
          </button>
        ))}

        <button className="primary-btn" onClick={resolveAlerts}>
          Resolve Medium/Low
        </button>

        <button className="danger-btn" onClick={escalateHighRisk}>
          Escalate High Risk
        </button>

        <button className="warning-btn" onClick={runSlaRecovery}>
          Run SLA Recovery
        </button>

        <button className="secondary-btn" onClick={simulateAlert}>
          Simulate Alert
        </button>

        <button className="reset-btn" onClick={resetRecords}>
          Reset
        </button>
      </div>

      <div className="monitor-card">
        <div className="table-header">
          <h3>
            {user?.role === "department_user"
              ? `${departmentName} Operational Resilience Monitoring Repository`
              : "Operational Resilience Monitoring Governance"}
          </h3>
          <span>{filtered.length} records</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Area</th>
              <th>Issue</th>
              <th>Owner</th>
              <th>Status</th>
              <th>SLA</th>
              <th>Severity</th>
              <th>Governance Score</th>
              <th>Decision</th>
              <th>Recommendation</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((record) => {
              const decision = getDecision(record);
              const score = getGovernanceScore(record);

              return (
                <tr
                  key={record.id}
                  onClick={() => setSelected(record)}
                  className={selected?.id === record.id ? "selected-row" : ""}
                >
                  <td>{record.id}</td>
                  <td>{record.area}</td>
                  <td>{record.issue}</td>
                  <td>{record.owner}</td>
                  <td>{record.status}</td>
                  <td>{record.sla}</td>
                  <td className={`risk ${record.severity.toLowerCase()}`}>
                    {record.severity}
                  </td>
                  <td>{score}%</td>
                  <td>{decision.decision}</td>
                  <td>{decision.recommendation}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="monitor-card">
        <h3>Operational Governance Assessment</h3>

        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Score</th>
              <th>Interpretation</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Monitoring Score</td>
              <td>{monitoringScore}%</td>
              <td>Measures overall operational monitoring performance</td>
            </tr>

            <tr>
              <td>SLA Health</td>
              <td>{slaHealth}%</td>
              <td>Measures SLA exposure and recovery urgency</td>
            </tr>

            <tr>
              <td>Risk Control</td>
              <td>{riskControlScore}%</td>
              <td>Assesses operational risk exposure</td>
            </tr>

            <tr>
              <td>Operational Readiness</td>
              <td>{operationalReadiness}%</td>
              <td>Measures readiness for stable governance operations</td>
            </tr>

            <tr>
              <td>Governance Health</td>
              <td>{governanceHealth}%</td>
              <td>Overall operational governance posture</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="monitor-card highlight">
        <h3>Operational Intelligence</h3>
        <p>
          <b>Root Cause:</b> SLA breaches, validation delays and active monitoring
          alerts indicate operational governance exposure.
          <br />
          <b>Impact:</b> Delays in escalation, evidence closure and approval routing
          may affect readiness and compliance.
          <br />
          <b>Action:</b> Escalate high-risk items, recover SLA breaches and resolve
          lower-risk monitoring items.
        </p>
      </div>

      <div className="monitor-card">
        <h3>Risk Distribution</h3>

        <div className="summary-item">
          <span>High Severity</span>
          <b>{high}</b>
        </div>

        <div className="summary-item">
          <span>Medium Severity</span>
          <b>{medium}</b>
        </div>

        <div className="summary-item">
          <span>Low Severity</span>
          <b>{low}</b>
        </div>

        <div className="summary-item">
          <span>Escalated Items</span>
          <b>{escalated}</b>
        </div>
      </div>

      <div className="monitor-card highlight">
        <h3>Executive Summary</h3>
        <p>
          INVISOR assessed <b>{total}</b> operational monitoring records.
          Current governance health is <b>{governanceHealth}%</b>{" "}
          (<b>{maturityLevel}</b>). The platform identified <b>{high}</b>{" "}
          high-severity operational risk(s), <b>{breached}</b> SLA breach(es)
          and <b>{escalated}</b> escalated governance item(s) requiring
          management attention.
        </p>
      </div>

      {selected && selectedDecision && (
        <div className="monitor-card detail">
          <h3>{selected.id} Monitoring Decision Explanation</h3>
          <ul>
            <li>Department: {selected.department || departmentName}</li>
            <li>Area monitored: {selected.area}</li>
            <li>Current owner: {selected.owner}</li>
            <li>Status: {selected.status}</li>
            <li>SLA position: {selected.sla}</li>
            <li>Severity: {selected.severity}</li>
            <li>Governance Score: {selectedGovernanceScore}%</li>
            <li>Decision: {selectedDecision.decision}</li>
            <li>Recommendation: {selectedDecision.recommendation}</li>
            <li>Reason: {selectedDecision.reason}</li>
            <li>
              Decision Factors: Severity = {selected.severity}, SLA ={" "}
              {selected.sla}, Status = {selected.status}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
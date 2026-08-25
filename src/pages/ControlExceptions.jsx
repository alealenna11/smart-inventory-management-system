import { useMemo, useState } from "react";
import "../styles/controlExceptions.css";
import { useAuth } from "../contexts/AuthContext";
import { departmentConfig, normalizeDepartment } from "../config/departmentConfig";
import { controlExceptionsData } from "../data/controlExceptionsData";
import DepartmentGovernanceLifecycle from "../components/DepartmentGovernanceLifecycle";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

function getMaturity(score) {
  if (score >= 90) return "Optimised";
  if (score >= 80) return "Managed";
  if (score >= 70) return "Defined";
  if (score >= 60) return "Developing";
  return "Initial";
}

function getSeverityWeight(severity) {
  if (severity === "High") return 25;
  if (severity === "Medium") return 12;
  return 4;
}

function getStatusWeight(status) {
  if (status === "Open") return 18;
  if (status === "Escalated") return 22;
  if (status === "In Remediation") return 9;
  return 0;
}

function MiniTrendChart({ controlHealth, openCount }) {
  const data = [
    { month: "Jan", health: controlHealth - 8, exceptions: openCount + 8 },
    { month: "Feb", health: controlHealth - 6, exceptions: openCount + 6 },
    { month: "Mar", health: controlHealth - 4, exceptions: openCount + 4 },
    { month: "Apr", health: controlHealth - 2, exceptions: openCount + 2 },
    { month: "May", health: controlHealth, exceptions: openCount },
    { month: "Jun", health: controlHealth + 5, exceptions: Math.max(0, openCount - 5) },
  ].map((item) => ({
    ...item,
    health: clamp(item.health),
    exceptions: clamp(item.exceptions * 8),
  }));

  const width = 720;
  const height = 220;
  const pad = 32;

  const makePoints = (key) =>
    data
      .map((d, index) => {
        const x = pad + (index / Math.max(data.length - 1, 1)) * (width - pad * 2);
        const y = height - pad - (d[key] / 100) * (height - pad * 2);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="250">
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = height - pad - (tick / 100) * (height - pad * 2);

          return (
            <g key={tick}>
              <line x1={pad} y1={y} x2={width - pad} y2={y} stroke="#1e293b" />
              <text x="4" y={y + 4} fill="#94a3b8" fontSize="10">
                {tick}
              </text>
            </g>
          );
        })}

        <polyline
          points={makePoints("health")}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
        />

        <polyline
          points={makePoints("exceptions")}
          fill="none"
          stroke="#f97316"
          strokeWidth="4"
        />

        {data.map((d, index) => {
          const x = pad + (index / Math.max(data.length - 1, 1)) * (width - pad * 2);

          return (
            <text key={d.month} x={x - 10} y={height - 5} fill="#94a3b8" fontSize="11">
              {d.month}
            </text>
          );
        })}
      </svg>

      <div className="summary-item">
        <span>Blue = Control Health</span>
        <b>Orange = Exception Pressure</b>
      </div>
    </div>
  );
}

export default function ControlExceptions() {
  const { user } = useAuth();
  const departmentKey = normalizeDepartment(user?.department);
  const config = departmentConfig[departmentKey];
  const departmentName = config?.shortName || departmentKey || "Enterprise";

  const initialRecords =
    user?.role === "department_user"
      ? controlExceptionsData.filter((record) => {
          const recordDept = record.department || record.dept || "";
          return (
            recordDept === user.department ||
            recordDept === departmentName ||
            recordDept.includes(departmentName)
          );
        })
      : controlExceptionsData;

  const [records, setRecords] = useState(initialRecords);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const enrichedRecords = useMemo(() => {
    return records.map((record) => {
      const severityPenalty = getSeverityWeight(record.severity);
      const statusPenalty = getStatusWeight(record.status);
      const governanceScore = clamp(100 - severityPenalty - statusPenalty, 45, 100);

      let decision = "Monitor";
      let recommendation = "Maintain evidence and continue monitoring.";
      let reason = "Control exception is within acceptable monitoring threshold.";

      if (record.severity === "High") {
        decision = "Escalate";
        recommendation = "Escalate to Governance Review Board.";
        reason =
          "High-severity control exception may create material governance exposure.";
      } else if (record.status !== "Closed") {
        decision = "Remediate";
        recommendation = "Move exception into remediation workflow.";
        reason =
          "Open control exception remains unresolved and requires closure tracking.";
      }

      return {
        ...record,
        governanceScore,
        decision,
        recommendation,
        reason,
      };
    });
  }, [records]);

  const filtered = enrichedRecords.filter((record) =>
    filter === "All" ? true : record.severity === filter
  );

  const total = enrichedRecords.length;
  const safeTotal = Math.max(total, 1);

  const open = enrichedRecords.filter((record) => record.status !== "Closed").length;
  const high = enrichedRecords.filter((record) => record.severity === "High").length;
  const medium = enrichedRecords.filter((record) => record.severity === "Medium").length;
  const low = enrichedRecords.filter((record) => record.severity === "Low").length;
  const closed = enrichedRecords.filter((record) => record.status === "Closed").length;
  const escalated = enrichedRecords.filter((record) => record.status === "Escalated").length;
  const inRemediation = enrichedRecords.filter(
    (record) => record.status === "In Remediation"
  ).length;

  const controlScore = clamp(100 - high * 5 - open * 2, 62, 100);
  const closureRate = clamp((closed / safeTotal) * 100);
  const exceptionExposure = clamp(100 - high * 8 - medium * 4, 50, 100);
  const remediationReadiness = clamp(100 - open * 3 + inRemediation * 2, 50, 100);
  const escalationExposure = clamp(100 - escalated * 6, 50, 100);

  const governanceHealth = clamp(
    (controlScore + closureRate + exceptionExposure + remediationReadiness) / 4
  );

  const maturityLevel = getMaturity(governanceHealth);

  const auditReadiness = clamp(
    100 - high * 6 - open * 3 + closed * 1,
    50,
    100
  );

  const forecastOpen = Math.max(0, open - Math.ceil(open * 0.55));
  const forecastControlHealth = clamp(governanceHealth + (open > 0 ? 6 : 2));
  const forecastAuditReadiness = clamp(auditReadiness + (open > 0 ? 7 : 2));

  const decisionStatus =
    high > 0 || escalated > 0
      ? "Escalate"
      : open > 0
      ? "Remediate"
      : "Monitor";

  const priorityRecommendation =
    decisionStatus === "Escalate"
      ? "Escalate high-severity control exceptions."
      : decisionStatus === "Remediate"
      ? "Complete remediation activities and close outstanding exceptions."
      : "Maintain current control environment.";

  const governanceTrend =
    high >= 3 || open >= 8
      ? "Increasing Control Risk"
      : escalated > 0
      ? "Active Governance Escalation"
      : "Stable Control Environment";

  const rootCauseBreakdown = [
    { label: "Missing Approval", value: high > 0 ? 40 : 25 },
    { label: "Missing Evidence", value: open > 0 ? 25 : 15 },
    { label: "Validation Failure", value: medium > 0 ? 20 : 10 },
    { label: "Control Override", value: escalated > 0 ? 15 : 8 },
  ];

  const departmentHeatmap = Object.values(
    enrichedRecords.reduce((acc, record) => {
      const dept = record.department || record.dept || "Enterprise";

      if (!acc[dept]) {
        acc[dept] = {
          department: dept,
          total: 0,
          high: 0,
          open: 0,
          score: 0,
        };
      }

      acc[dept].total += 1;
      acc[dept].score += record.governanceScore;

      if (record.severity === "High") acc[dept].high += 1;
      if (record.status !== "Closed") acc[dept].open += 1;

      return acc;
    }, {})
  ).map((dept) => ({
    ...dept,
    avgScore: clamp(dept.score / Math.max(dept.total, 1)),
    riskLevel: dept.high > 0 ? "High" : dept.open > 0 ? "Medium" : "Low",
  }));

  const executiveWatchlist = enrichedRecords
    .filter(
      (record) =>
        record.severity === "High" ||
        record.status === "Escalated" ||
        record.status === "Open"
    )
    .slice(0, 6);

  function remediateOpen() {
    setRecords(
      records.map((record) =>
        record.status !== "Closed"
          ? {
              ...record,
              status: "In Remediation",
              lastAction: "Moved into remediation workflow",
            }
          : record
      )
    );
    setMessage("Open exceptions moved into remediation workflow.");
  }

  function escalateHigh() {
    setRecords(
      records.map((record) =>
        record.severity === "High"
          ? {
              ...record,
              status: "Escalated",
              owner: "Governance Review Board",
              lastAction: "Escalated to Governance Review Board",
            }
          : record
      )
    );
    setMessage("High-severity exceptions escalated.");
  }

  function closeLowRisk() {
    setRecords(
      records.map((record) =>
        record.severity === "Low"
          ? {
              ...record,
              status: "Closed",
              lastAction: "Closed after low-risk review",
            }
          : record
      )
    );
    setMessage("Low-risk control exceptions closed.");
  }

  function simulateException() {
    const newRecord = {
      id: `EXC-${departmentName}-${String(records.length + 1).padStart(3, "0")}`,
      control: "Automated governance check",
      area: "Control Monitoring",
      issue: "New control exception detected",
      severity: "High",
      status: "Open",
      owner:
        user?.role === "department_user"
          ? `${departmentName} Governance Owner`
          : "Governance Team",
      department: user?.department || "Enterprise",
      lastAction: "New simulated control exception",
    };

    setRecords([newRecord, ...records]);
    setMessage("New control exception generated.");
  }

  function resetData() {
    setRecords(initialRecords);
    setSelected(null);
    setMessage("Control exception dataset reset.");
  }

  return (
    <div className="exceptions-page">
      <p className="eyebrow">
        ENTERPRISE CONTROL MONITORING & BREACH INTELLIGENCE HUB
      </p>

      <h2>
        {user?.role === "department_user"
          ? `${departmentName} Control Breach and Exception`
          : "Enterprise Control Breach and Exception"}
      </h2>

      <p className="sub">
        Centralised exception register for governance breaches, failed controls,
        missing evidence, remediation tracking and explainable escalation decisions.
      </p>

      <div className="exceptions-card highlight">
        <h3>Executive Control Exception Narrative</h3>

        <p>
          INVISOR analysed <b>{total}</b> control exception record(s). Current
          governance health is <b>{governanceHealth}%</b>, audit readiness is{" "}
          <b>{auditReadiness}%</b>, and maturity is <b>{maturityLevel}</b>. The
          platform detected <b>{high}</b> high-severity exception(s),{" "}
          <b>{open}</b> open item(s), and <b>{escalated}</b> escalated issue(s).
          Recommended decision: <b>{decisionStatus}</b>.
        </p>
      </div>

      <div className="exceptions-kpi">
        <div className="kpi-card">
          <span>Total Exceptions</span>
          <h3>{total}</h3>
        </div>

        <div className="kpi-card">
          <span>Open Items</span>
          <h3>{open}</h3>
        </div>

        <div className="kpi-card">
          <span>High Severity</span>
          <h3 className="risk high">{high}</h3>
        </div>

        <div className="kpi-card">
          <span>Control Score</span>
          <h3>{controlScore}%</h3>
        </div>
      </div>

      <div className="exceptions-kpi">
        <div className="kpi-card">
          <span>Governance Health</span>
          <h3>{governanceHealth}%</h3>
        </div>

        <div className="kpi-card">
          <span>Audit Readiness</span>
          <h3>{auditReadiness}%</h3>
        </div>

        <div className="kpi-card">
          <span>Closure Rate</span>
          <h3>{closureRate}%</h3>
        </div>

        <div className="kpi-card">
          <span>Maturity</span>
          <h3>{maturityLevel}</h3>
        </div>
      </div>

      {high > 0 && (
        <div className="exceptions-alert">
          {high} high-severity control exception(s) require escalation.
        </div>
      )}

      {message && <div className="success-msg">{message}</div>}

      <div className="exceptions-card highlight">
        <h3>Governance Intelligence Engine</h3>

        <p>
          <b>Decision:</b> {decisionStatus} <br />
          <b>Governance Trend:</b> {governanceTrend} <br />
          <b>Priority Recommendation:</b> {priorityRecommendation}
        </p>
      </div>

      <div className="exceptions-card">
        <h3>Control Exception Trend</h3>
        <MiniTrendChart controlHealth={governanceHealth} openCount={open} />
      </div>

      <div className="exceptions-card">
        <h3>Predictive Closure Forecast</h3>

        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Current</th>
              <th>30-Day Forecast</th>
              <th>Expected Direction</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Audit Readiness</td>
              <td>{auditReadiness}%</td>
              <td>{forecastAuditReadiness}%</td>
              <td>Improving</td>
            </tr>

            <tr>
              <td>Control Health</td>
              <td>{governanceHealth}%</td>
              <td>{forecastControlHealth}%</td>
              <td>Improving</td>
            </tr>

            <tr>
              <td>Open Exceptions</td>
              <td>{open}</td>
              <td>{forecastOpen}</td>
              <td>Reducing</td>
            </tr>

            <tr>
              <td>Closure Rate</td>
              <td>{closureRate}%</td>
              <td>{clamp(closureRate + 18)}%</td>
              <td>Improving</td>
            </tr>
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="exceptions-card detail">
          <h3>{selected.id} Exception Decision Explanation</h3>

          <ul>
            <li>Control Area: {selected.control}</li>
            <li>Issue: {selected.issue}</li>
            <li>Owner: {selected.owner}</li>
            <li>Status: {selected.status}</li>
            <li>Severity: {selected.severity}</li>
            <li>Governance Score: {selected.governanceScore}%</li>
            <li>Decision: {selected.decision}</li>
            <li>Recommendation: {selected.recommendation}</li>
            <li>Reason: {selected.reason}</li>
            <li>
              Root Cause:{" "}
              {selected.severity === "High"
                ? "Control breach or failed governance checkpoint"
                : selected.status !== "Closed"
                ? "Outstanding remediation or incomplete evidence"
                : "Closed exception retained for monitoring"}
            </li>
            <li>
              Business Impact:{" "}
              {selected.decision === "Escalate"
                ? "May affect audit readiness, compliance posture and executive oversight"
                : selected.decision === "Remediate"
                ? "Requires timely remediation to avoid governance backlog"
                : "No immediate business impact"}
            </li>
            <li>
              Target Closure Date:{" "}
              {selected.decision === "Escalate"
                ? "Within 3 working days"
                : selected.decision === "Remediate"
                ? "Within 7 working days"
                : "Monitor in next review cycle"}
            </li>
          </ul>
        </div>
      )}

      <div className="exceptions-card action-row">
        {["All", "High", "Medium", "Low"].map((filterOption) => (
          <button
            key={filterOption}
            className={filter === filterOption ? "active-btn" : ""}
            onClick={() => setFilter(filterOption)}
          >
            {filterOption}
          </button>
        ))}

        <button className="primary-btn" onClick={remediateOpen}>
          Start Remediation
        </button>

        <button className="danger-btn" onClick={escalateHigh}>
          Escalate High
        </button>

        <button className="secondary-btn" onClick={closeLowRisk}>
          Close Low Risk
        </button>

        <button className="warning-btn" onClick={simulateException}>
          Simulate Exception
        </button>

        <button className="reset-btn" onClick={resetData}>
          Reset
        </button>
      </div>

      <div className="exceptions-card">
        <div className="table-header">
          <h3>
            {user?.role === "department_user"
              ? `${departmentName} Control Breach and Exceptions Repository`
              : "Control Breach and Exceptions Governance"}
          </h3>

          <span>{filtered.length} records</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Control</th>
              <th>Area</th>
              <th>Issue</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Severity</th>
              <th>Governance Score</th>
              <th>Decision</th>
              <th>Recommendation</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((record) => (
              <tr
                key={record.id}
                onClick={() => setSelected(record)}
                className={selected?.id === record.id ? "selected-row" : ""}
              >
                <td>{record.id}</td>
                <td>{record.control}</td>
                <td>{record.area}</td>
                <td>{record.issue}</td>
                <td>{record.owner}</td>
                <td>{record.status}</td>
                <td className={`risk ${record.severity.toLowerCase()}`}>
                  {record.severity}
                </td>
                <td>{record.governanceScore}%</td>
                <td>{record.decision}</td>
                <td>{record.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="exceptions-card">
        <h3>Executive Control Watchlist</h3>

        <table>
          <thead>
            <tr>
              <th>Priority</th>
              <th>Department</th>
              <th>Issue</th>
              <th>Risk</th>
              <th>Recommended Action</th>
            </tr>
          </thead>

          <tbody>
            {executiveWatchlist.map((record, index) => (
              <tr key={record.id} onClick={() => setSelected(record)}>
                <td>{index + 1}</td>
                <td>{record.department || record.dept || "Enterprise"}</td>
                <td>{record.issue}</td>
                <td>{record.severity}</td>
                <td>{record.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="exceptions-card">
        <h3>Control Governance Heatmap</h3>

        <div className="heatmap-grid">
          {departmentHeatmap.map((dept) => (
            <div className="heatmap-box" key={dept.department}>
              <h4>{dept.department}</h4>
              <h2>{dept.avgScore}%</h2>
              <p>{dept.riskLevel} Control Risk</p>
            </div>
          ))}
        </div>
      </div>

      <div className="exceptions-card">
        <h3>Root Cause Breakdown</h3>

        {rootCauseBreakdown.map((item) => (
          <div className="summary-item" key={item.label}>
            <span>{item.label}</span>
            <b>{item.value}%</b>
          </div>
        ))}
      </div>

      <div className="exceptions-card">
        <h3>Control Governance Assessment</h3>

        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Score</th>
              <th>Assessment</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Control Score</td>
              <td>{controlScore}%</td>
              <td>Measures overall control effectiveness</td>
            </tr>

            <tr>
              <td>Closure Rate</td>
              <td>{closureRate}%</td>
              <td>Measures exception closure progress</td>
            </tr>

            <tr>
              <td>Exception Exposure</td>
              <td>{exceptionExposure}%</td>
              <td>Assesses severity of governance breaches</td>
            </tr>

            <tr>
              <td>Remediation Readiness</td>
              <td>{remediationReadiness}%</td>
              <td>Measures ability to resolve open exceptions</td>
            </tr>

            <tr>
              <td>Escalation Exposure</td>
              <td>{escalationExposure}%</td>
              <td>Assesses escalation pressure on governance teams</td>
            </tr>

            <tr>
              <td>Governance Health</td>
              <td>{governanceHealth}%</td>
              <td>Overall control governance posture</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="exceptions-card highlight">
        <h3>Control Intelligence</h3>

        <p>
          <b>Root Cause:</b> Control gaps occur when approvals, evidence or
          validation steps are incomplete.
          <br />
          <b>Impact:</b> Open exceptions reduce audit readiness and increase
          governance exposure.
          <br />
          <b>Action:</b> Prioritise high-severity exceptions, move open items into
          remediation and maintain traceable closure evidence.
        </p>
      </div>
    </div>
  );
}
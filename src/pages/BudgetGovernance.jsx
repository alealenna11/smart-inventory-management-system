import { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { departmentConfig, normalizeDepartment } from "../config/departmentConfig";
import { budgetData } from "../data/budgetData";
import DepartmentGovernanceLifecycle from "../components/DepartmentGovernanceLifecycle";
import "../styles/allocation.css";
import {
  calculateGovernanceScore,
  classifyMaturity,
  explainDecision,
  rankDepartments,
} from "../utils/governanceDecisionEngine";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

function getBudgetDecision(item) {
  if (item.risk === "High" || item.priority === "Critical") {
    return {
      decision: "Escalate",
      recommendation: "Escalate to Executive Governance Board.",
      reason:
        "High-risk or critical budget request requires senior governance review.",
    };
  }

  if (item.variance > 0 || item.status === "Pending" || item.status === "Review") {
    return {
      decision: "Review",
      recommendation: "Review approval amount, variance and policy compliance.",
      reason:
        "Budget variance or pending approval status requires additional validation.",
    };
  }

  return {
    decision: "Approve / Monitor",
    recommendation: "Maintain approval record and continue monitoring.",
    reason: "Budget request is within acceptable governance threshold.",
  };
}

function MiniTrendChart({ data }) {
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
          points={makePoints("governance")}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
        />

        <polyline
          points={makePoints("pressure")}
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
        <span>Blue = Governance score</span>
        <b>Orange = Budget pressure</b>
      </div>
    </div>
  );
}

export default function BudgetGovernance() {
  const { user } = useAuth();

  const departmentKey = normalizeDepartment(user?.department);
  const config = departmentConfig[departmentKey];
  const departmentName = config?.shortName || departmentKey || "Enterprise";

  const initialData =
    user?.role === "department_user"
      ? budgetData[user.department] || []
      : Object.values(budgetData).flat();

  const [records, setRecords] = useState(initialData);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const scoredRecords = useMemo(() => {
    return records.map((item) => {
      const governanceScore = calculateGovernanceScore({
        risk: item.risk,
        complianceScore: item.score,
        auditReadiness: item.status === "Approved" ? 92 : item.status === "Review" ? 78 : 68,
        operationalHealth: item.variance > 0 ? 72 : 90,
      });

      const engineExplanation = explainDecision(item);
      const budgetDecision = getBudgetDecision(item);

      return {
        ...item,
        governanceScore,
        explanation: {
          ...budgetDecision,
          ...engineExplanation,
          decision: engineExplanation?.decision || budgetDecision.decision,
          recommendation:
            engineExplanation?.recommendation || budgetDecision.recommendation,
          reason: engineExplanation?.reason || budgetDecision.reason,
        },
      };
    });
  }, [records]);

  const totalRequested = records.reduce(
    (sum, item) => sum + Number(item.requestedAmount || 0),
    0
  );

  const totalApproved = records.reduce(
    (sum, item) => sum + Number(item.approvedAmount || 0),
    0
  );

  const totalVariance = Math.max(totalRequested - totalApproved, 0);
  const highRisk = records.filter((item) => item.risk === "High").length;
  const reviewItems = records.filter(
    (item) => item.status === "Review" || item.status === "Pending"
  ).length;
  const escalated = records.filter((item) => item.status === "Escalated").length;

  const approvalRate =
    totalRequested > 0 ? clamp((totalApproved / totalRequested) * 100) : 0;

  const budgetPressure =
    totalRequested > 0 ? clamp((totalVariance / totalRequested) * 100 + highRisk * 6) : 0;

  const overallGovernanceScore =
    scoredRecords.length > 0
      ? clamp(
          scoredRecords.reduce((sum, item) => sum + item.governanceScore, 0) /
            scoredRecords.length
        )
      : 0;

  const avgScore =
    scoredRecords.length > 0
      ? clamp(scoredRecords.reduce((sum, item) => sum + item.score, 0) / scoredRecords.length)
      : 0;

  const maturityLevel = classifyMaturity(overallGovernanceScore);

  const decisionStatus =
    highRisk > 0 || budgetPressure >= 60
      ? "Escalate"
      : reviewItems > 0 || budgetPressure >= 35
      ? "Review"
      : "Monitor";

  const executiveRecommendation =
    decisionStatus === "Escalate"
      ? "Escalate high-risk budget requests for executive governance review."
      : decisionStatus === "Review"
      ? "Review pending approvals, validate variance and confirm policy alignment."
      : "Maintain current budget governance posture and continue monitoring.";

  const storyText =
    `INVISOR analysed ${records.length} budget governance record(s) for ${departmentName}. ` +
    `It detected ${highRisk} high-risk request(s), ${reviewItems} pending or review item(s), ` +
    `${escalated} escalated item(s), and a budget pressure level of ${budgetPressure}%. ` +
    `Based on these signals, the recommended decision is ${decisionStatus}.`;

  const topRecommendation =
    scoredRecords.find((x) => x.risk === "High")?.explanation?.recommendation ||
    scoredRecords.find((x) => x.status === "Review")?.explanation?.recommendation ||
    "Maintain current governance posture.";

  const departmentRanking = rankDepartments(scoredRecords);

  const trendData = [
    {
      month: "Jan",
      governance: clamp(overallGovernanceScore - 7),
      pressure: clamp(budgetPressure + 9),
    },
    {
      month: "Feb",
      governance: clamp(overallGovernanceScore - 5),
      pressure: clamp(budgetPressure + 6),
    },
    {
      month: "Mar",
      governance: clamp(overallGovernanceScore - 3),
      pressure: clamp(budgetPressure + 4),
    },
    {
      month: "Apr",
      governance: clamp(overallGovernanceScore - 1),
      pressure: clamp(budgetPressure + 2),
    },
    {
      month: "May",
      governance: overallGovernanceScore,
      pressure: budgetPressure,
    },
    {
      month: "Jun",
      governance: clamp(overallGovernanceScore + (approvalRate > 70 ? 2 : -2)),
      pressure: clamp(budgetPressure - 3),
    },
  ];

  const watchlist = [
    {
      priority: highRisk > 0 ? "Critical" : "Medium",
      issue: `${highRisk} high-risk budget request(s)`,
      action: "Escalate high-risk requests to Executive Governance Board.",
    },
    {
      priority: reviewItems > 0 ? "High" : "Low",
      issue: `${reviewItems} pending or review item(s)`,
      action: "Validate approval rationale and supporting evidence.",
    },
    {
      priority: budgetPressure >= 60 ? "High" : "Medium",
      issue: `Budget pressure at ${budgetPressure}%`,
      action: "Review variance, policy alignment and approval queue.",
    },
  ];

  function approveReviews() {
    setRecords(
      records.map((item) =>
        item.status === "Review" || item.status === "Pending"
          ? {
              ...item,
              status: "Approved",
              approvedAmount: item.requestedAmount,
              variance: 0,
              score: Math.min(100, Number(item.score || 0) + 5),
            }
          : item
      )
    );
    setMessage("Review and pending budget requests approved with audit traceability.");
  }

  function escalateHighRisk() {
    setRecords(
      records.map((item) =>
        item.risk === "High"
          ? {
              ...item,
              status: "Escalated",
              owner: "Executive Governance Board",
            }
          : item
      )
    );
    setMessage("High-risk budget requests escalated to Executive Governance Board.");
  }

  function simulateBudgetPressure() {
    const newRecord = {
      id: `BUD-${departmentName}-${String(records.length + 1).padStart(3, "0")}`,
      department: user?.department || "Enterprise",
      request: `${config?.title || "Enterprise"} Emergency Budget Request`,
      requestedAmount: 350000,
      approvedAmount: 0,
      variance: 350000,
      risk: "High",
      priority: "Critical",
      status: "Escalated",
      score: 91,
      owner:
        user?.role === "department_user"
          ? `${departmentName} Budget Owner`
          : "Enterprise Budget Owner",
    };

    setRecords([newRecord, ...records]);
    setMessage("New high-priority budget pressure scenario simulated.");
  }

  function resetBudget() {
    setRecords(initialData);
    setSelected(null);
    setMessage("Budget governance dataset reset.");
  }

  return (
    <div className="alloc-page">
      <p className="eyebrow">FINANCIAL GOVERNANCE & BUDGET OVERSIGHT</p>

      <h2>
        {user?.role === "department_user"
          ? `${departmentName} Budget Governance & Approval Intelligence`
          : "Enterprise Budget Governance"}
      </h2>

      <p className="sub">
        Governance-driven budget evaluation using requested amount, approved
        amount, variance, priority, risk, policy compliance, approval status and
        explainable recommendation logic.
      </p>

      <div className="alloc-card highlight">
        <h3>Budget Governance Story</h3>
        <p>{storyText}</p>
      </div>

      <div className="alloc-kpi">
        <div className="kpi-card">
          <span>Total Requests</span>
          <h3>{records.length}</h3>
        </div>

        <div className="kpi-card">
          <span>Approval Rate</span>
          <h3>{approvalRate}%</h3>
        </div>

        <div className="kpi-card">
          <span>Budget Pressure</span>
          <h3>{budgetPressure}%</h3>
        </div>

        <div className="kpi-card">
          <span>Governance Score</span>
          <h3>{overallGovernanceScore}%</h3>
        </div>
      </div>

      <div className="alloc-kpi">
        <div className="kpi-card">
          <span>Total Requested</span>
          <h3>${totalRequested.toLocaleString()}</h3>
        </div>

        <div className="kpi-card">
          <span>Total Approved</span>
          <h3>${totalApproved.toLocaleString()}</h3>
        </div>

        <div className="kpi-card">
          <span>Total Variance</span>
          <h3>${totalVariance.toLocaleString()}</h3>
        </div>

        <div className="kpi-card">
          <span>Maturity</span>
          <h3>{maturityLevel}</h3>
        </div>
      </div>

      {(highRisk > 0 || escalated > 0) && (
        <div className="alloc-alert">
          {highRisk} high-risk request(s), {reviewItems} review item(s), and{" "}
          {escalated} escalated budget item(s) require governance attention.
        </div>
      )}

      {message && <div className="success-msg">{message}</div>}

      <div className="alloc-card highlight">
        <h3>Governance Decision Intelligence</h3>
        <p>
          <b>Overall Governance Score:</b> {overallGovernanceScore}% <br />
          <b>Maturity Level:</b> {maturityLevel} <br />
          <b>Decision Status:</b> {decisionStatus} <br />
          <b>Top Recommendation:</b> {topRecommendation}
        </p>
      </div>

      <div className="alloc-card detail">
        <h3>Budget Governance Trend</h3>
        <MiniTrendChart data={trendData} />
      </div>

      {selected && (
        <div className="alloc-card detail">
          <h3>{selected.id} Budget Decision Explanation</h3>

          <ul>
            <li>Owner: {selected.owner}</li>
            <li>Requested Amount: ${selected.requestedAmount.toLocaleString()}</li>
            <li>Approved Amount: ${selected.approvedAmount.toLocaleString()}</li>
            <li>Variance: ${selected.variance.toLocaleString()}</li>
            <li>Risk Level: {selected.risk}</li>
            <li>Priority: {selected.priority}</li>
            <li>Governance Score: {selected.governanceScore}%</li>
            <li>Decision: {selected.explanation.decision}</li>
            <li>Recommendation: {selected.explanation.recommendation}</li>
            <li>Reason: {selected.explanation.reason}</li>
          </ul>
        </div>
      )}

      <div className="alloc-card highlight">
        <h3>Executive Budget Watchlist</h3>

        <table className="test-table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Issue</th>
              <th>Recommended Action</th>
            </tr>
          </thead>

          <tbody>
            {watchlist.map((item) => (
              <tr key={item.issue}>
                <td>{item.priority}</td>
                <td>{item.issue}</td>
                <td>{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="alloc-card highlight">
        <h3>Budget Governance Recommendation</h3>
        <p>
          <b>Root Cause:</b> Budget demand, variance exposure, risk level and
          approval urgency create governance pressure.
          <br />
          <b>Impact:</b> Unstructured budget approvals may cause inconsistent
          prioritisation, weak audit traceability and delayed governance closure.
          <br />
          <b>Action:</b> Approve low-risk items, review pending items and
          escalate high-risk budget requests.
        </p>

        <div className="action-row">
          <button className="primary-btn" onClick={approveReviews}>
            Approve Review Items
          </button>

          <button className="danger-btn" onClick={escalateHighRisk}>
            Escalate High Risk
          </button>

          <button className="warning-btn" onClick={simulateBudgetPressure}>
            Simulate Budget Pressure
          </button>

          <button className="reset-btn" onClick={resetBudget}>
            Reset Budget
          </button>
        </div>
      </div>

      <div className="alloc-card detail">
        <h3>
          {user?.role === "department_user"
            ? `${departmentName} Budget Governance & Approval Intelligence Repository`
            : "Enterprise Budget Governance Repository"}
        </h3>

        <table className="test-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Department</th>
              <th>Request</th>
              <th>Requested</th>
              <th>Approved</th>
              <th>Variance</th>
              <th>Risk</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Score</th>
              <th>Governance Score</th>
              <th>Decision</th>
              <th>Recommendation</th>
            </tr>
          </thead>

          <tbody>
            {scoredRecords.map((item) => (
              <tr
                key={item.id}
                onClick={() => setSelected(item)}
                className={selected?.id === item.id ? "selected-row" : ""}
              >
                <td>{item.id}</td>
                <td>{item.department}</td>
                <td>{item.request}</td>
                <td>${item.requestedAmount.toLocaleString()}</td>
                <td>${item.approvedAmount.toLocaleString()}</td>
                <td>${item.variance.toLocaleString()}</td>
                <td className={`risk ${item.risk.toLowerCase()}`}>{item.risk}</td>
                <td>{item.priority}</td>
                <td>{item.status}</td>
                <td>{item.score}%</td>
                <td>{item.governanceScore}%</td>
                <td>{item.explanation.decision}</td>
                <td>{item.explanation.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {departmentRanking?.length > 0 && (
        <div className="alloc-card detail">
          <h3>Department Budget Benchmarking</h3>

          <table className="test-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Department</th>
                <th>Score</th>
              </tr>
            </thead>

            <tbody>
              {departmentRanking.map((item, index) => (
                <tr key={item.department || index}>
                  <td>{index + 1}</td>
                  <td>{item.department || "Enterprise"}</td>
                  <td>{item.score || item.governanceScore || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { getAssets, resetAssets } from "../services/api";
import ExecutiveHero from "../components/adminmatters/ExecutiveHero";
import EnterpriseAlerts from "../components/adminmatters/EnterpriseAlerts";
import DepartmentIntelligenceMatrix from "../components/adminmatters/DepartmentIntelligenceMatrix";
import GovernanceTimeline from "../components/adminmatters/GovernanceTimeline";
import LiveActivityFeed from "../components/adminmatters/LiveActivityFeed";
import EnterpriseStatistics from "../components/adminmatters/EnterpriseStatistics";
import ExecutiveAIInsights from "../components/adminmatters/ExecutiveAIInsights";
import DepartmentLeaderboard from "../components/adminmatters/DepartmentLeaderboard";
import GovernanceCoverage from "../components/adminmatters/GovernanceCoverage";
import { exportExcel } from "../utils/exportExcel";
import "../styles/admin.css";


function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

function getMaturity(score) {
  if (score >= 90) return "Optimised";
  if (score >= 80) return "Managed";
  if (score >= 70) return "Defined";
  return "Developing";
}

function getDecision({ highRisk, pendingValidation, escalatedItems }) {
  if (highRisk > 0 || escalatedItems > 0) return "Escalate";
  if (pendingValidation > 0) return "Review";
  return "Monitor";
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("Enterprise Command Centre");
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [riskWeight, setRiskWeight] = useState(30);
  const [fairnessWeight, setFairnessWeight] = useState(30);
  const [liveFeed, setLiveFeed] = useState([]);



const [forecastDays, setForecastDays] = useState(30);


const [systemTime] = useState(
    new Date().toLocaleString()
);

  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    try {
      const response = await getAssets();
      setData(response.data || []);
    } catch {
      setMessage("Backend connection failed. Start Node.js server.");
    }
  }

  function saveData(updated) {
    setData(updated);
  }

  function recordActivity(activity) {
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  setLiveFeed((previous) => [[time, activity], ...previous].slice(0, 8));
}

function runGovernanceAnalysis() {
  const riskPriority = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const highestRiskRecord = [...data].sort(
    (a, b) =>
      (riskPriority[b.risk] || 0) - (riskPriority[a.risk] || 0)
  )[0];

  setSelected(highestRiskRecord || null);
  setActiveTab("Executive Intelligence");

  recordActivity(
    `Governance analysis completed across ${totalAssets} enterprise records.`
  );

  setMessage(
    `Governance analysis completed. ${highRisk} high-risk record(s), ${pendingValidation} pending validation(s) and ${escalatedItems} escalated case(s) identified.`
  );
}

function detectGovernanceRisks() {
  const detectedRecords = data.filter(
    (item) =>
      item.risk === "High" ||
      item.validation === "Failed" ||
      item.status === "Escalated"
  );

  setSelected(detectedRecords[0] || null);
  setActiveTab("Risk Intelligence Centre");

  recordActivity(
    `${detectedRecords.length} governance risk record(s) detected.`
  );

  setMessage(
    detectedRecords.length > 0
      ? `${detectedRecords.length} governance risk record(s) identified. Risk Intelligence Centre opened.`
      : "No critical governance risks were detected."
  );
}

function startQuarterlyReview() {
  const reviewCount = data.filter(
    (item) => item.validation !== "Passed"
  ).length;

  const updated = data.map((item) =>
    item.validation !== "Passed"
      ? {
          ...item,
          status: "In Review",
          validation:
            item.validation === "Failed"
              ? "Remediation Required"
              : "Under Review",
          lastAction: "Quarterly Governance Review Initiated",
        }
      : item
  );

  saveData(updated);
  setActiveTab("Enterprise Command Centre");

  recordActivity(
    `Quarterly governance review initiated for ${reviewCount} record(s).`
  );

  setMessage(
    `${reviewCount} governance record(s) added to the quarterly review workflow.`
  );
}

function recalculateGovernanceMetrics() {
  recordActivity(
    `Governance metrics recalculated: health ${governanceScore}%, risk ${enterpriseRiskIndex}% and audit readiness ${auditReadiness}%.`
  );

  setActiveTab("Executive Intelligence");

  setMessage(
    `Governance metrics recalculated successfully. Current health: ${governanceScore}%, enterprise risk: ${enterpriseRiskIndex}% and forecast: ${forecastGovernance}%.`
  );
}

function simulatePolicyBreachScenario() {
  simulateBreach();
  setActiveTab("Risk Intelligence Centre");

  recordActivity(
    "Policy breach scenario created and submitted for governance assessment."
  );
}

  const highRisk = data.filter((i) => i.risk === "High").length;
  const mediumRisk = data.filter((i) => i.risk === "Medium").length;
  const lowRisk = data.filter((i) => i.risk === "Low").length;

  const active = data.filter(
    (i) => i.status === "Active" || i.status === "Over-allocated"
  ).length;

  const pendingValidation = data.filter((i) => i.validation !== "Passed").length;
  const escalatedItems = data.filter((i) => i.status === "Escalated").length;
  const totalAssets = data.length;

  const enterpriseRiskIndex = clamp(
    ((highRisk * 100 + mediumRisk * 50) / Math.max(totalAssets, 1))
  );

  const governanceScore = clamp(
    100 - highRisk * 5 - active * 2 - pendingValidation * 2,
    65,
    100
  );

  const auditReadiness = clamp(96 - mediumRisk * 3 - highRisk * 4, 70, 100);
  const policyCompliance = clamp(98 - highRisk * 3, 75, 100);
  const operationalHealth = clamp(100 - active * 4, 68, 100);

  const governanceMaturity = clamp(
    (governanceScore + auditReadiness + policyCompliance + operationalHealth) / 4
  );

  const maturityLevel = getMaturity(governanceMaturity);

  const decisionStatus = getDecision({
    highRisk,
    pendingValidation,
    escalatedItems,
  });

  const forecastGovernance = clamp(
    governanceScore +
      (pendingValidation === 0 ? 3 : -1) +
      (highRisk === 0 ? 3 : -2)
  );

  const executiveRecommendation =
    decisionStatus === "Escalate"
      ? "Escalate high-risk and unresolved governance records to the review board."
      : decisionStatus === "Review"
      ? "Review pending validations and close unresolved governance findings."
      : "Maintain current governance posture and continue monitoring.";
  
 

  const tabs = [
    "Enterprise Command Centre",
    "Policy & Control Governance",
    "Risk Intelligence Centre",
    "Operational Resilience",
    "Executive Intelligence",
  ];

  const benchmarkRows = [
  { department: "SGAD - FCD", governance: 95, risk: 15, rank: "#1" },
  { department: "SGAD - RDT", governance: 91, risk: 20, rank: "#2" },
  { department: "SGAD - LOA", governance: 88, risk: 28, rank: "#3" },
  { department: "SGAD - CBS", governance: 87, risk: 30, rank: "#4" },
  { department: "SGAD - CPC", governance: 86, risk: 32, rank: "#5" },
  { department: "SGAD - TRS", governance: 84, risk: 38, rank: "#6" },
  {
    department: "GTBD - Client Service",
    governance: 82,
    risk: 41,
    rank: "#7",
  },
  { department: "SGAD - OPC", governance: 74, risk: 65, rank: "#8" },
];


const executiveCards = [
  {
    icon: "🔴",
    label: "Business Impact",
    value: highRisk > 0 ? "Critical" : "Low",
    note: "Operational disruption risk",
  },
  {
    icon: "🟢",
    label: "AI Confidence",
    value: "97%",
    note: "High recommendation certainty",
  },
  {
    icon: "🏢",
    label: "Affected Departments",
    value: benchmarkRows.length,
    note: "Departments in scope",
  },
  {
    icon: "📈",
    label: "30-Day Forecast",
    value: `${forecastGovernance}%`,
    note: "Expected governance health",
  },
];
  const maturityMatrix = [
    ["Budget Governance", "92%", "95%", "Optimised"],
    ["Audit Traceability", "100%", "100%", "Optimised"],
    ["Operational Monitoring", `${operationalHealth}%`, "95%", getMaturity(operationalHealth)],
    ["Policy Compliance", `${policyCompliance}%`, "95%", getMaturity(policyCompliance)],
    ["Executive Reporting", "94%", "95%", "Optimised"],
  ];

  const riskDistribution = [
  ["High Risk", highRisk],
  ["Medium Risk", mediumRisk],
  ["Low Risk", lowRisk],
  ["Pending Validation", pendingValidation],
];

const platformHealth = [
  ["React Frontend", "Online"],
  ["Node.js API", data.length > 0 ? "Connected" : "Disconnected"],
  ["MongoDB", data.length > 0 ? "Connected" : "Pending"],
  ["Authentication", "Operational"],
  ["Audit Logging", "Operational"],
  ["Governance Engine", "Operational"],
];

const governanceActivity = [
  ["09:10", "Governance rules synchronised"],
  ["09:25", "High-risk records reviewed"],
  ["09:40", "Policy configuration updated"],
  ["10:05", "Audit readiness recalculated"],
  ["10:30", "Executive governance snapshot generated"],
];

  function moveToReview() {
  const updated = data.map((item) =>
    item.validation !== "Passed" && item.status !== "In Review"
      ? {
          ...item,
          status: "In Review",
          validation: "Under Review",
          lastAction: "Moved to Governance Validation Review",
        }
      : item
  );

  const movedCount = data.filter(
    (item) =>
      item.validation !== "Passed" &&
      item.status !== "In Review"
  ).length;

  saveData(updated);
  setMessage(
    movedCount > 0
      ? `${movedCount} pending governance record(s) moved to the validation review queue.`
      : "All pending governance records are already under review."
  );
}

  function escalateHighRisk() {
  const updated = data.map((item) =>
    item.risk === "High" && item.status !== "Escalated"
      ? {
          ...item,
          status: "Escalated",
          allocatedTo: "Governance Review Board",
          owner: "Governance Review Board",
          lastAction: "Escalated by System Administrator",
        }
      : item
  );

  const newlyEscalated = data.filter(
    (item) => item.risk === "High" && item.status !== "Escalated"
  ).length;

  saveData(updated);
  setMessage(
    newlyEscalated > 0
      ? `${newlyEscalated} high-risk governance record(s) escalated to the Governance Review Board.`
      : "All high-risk governance records have already been escalated."
  );
}
  function closeLowRisk() {
    const updated = data.map((item) =>
      item.risk === "Low"
        ? {
            ...item,
            status: "Closed",
            validation: "Passed",
            lastAction: "Closed by Admin",
          }
        : item
    );

    saveData(updated);
    setMessage("Low-risk items closed.");
  }

  function simulateBreach() {
    const newIssue = {
      id: `AST-${String(data.length + 1).padStart(3, "0")}`,
      asset: "Governance Override",
      department: "Risk Control",
      status: "Active",
      validation: "Failed",
      risk: "High",
      allocatedTo: "Governance Board",
      lastAction: "Breach Simulation",
      owner: "Security Operations",
      manualTime: 34,
      systemTime: 9,
    };

    saveData([newIssue, ...data]);
    setMessage("New governance breach added to dataset.");
  }

  async function resetBackend() {
    try {
      const result = await resetAssets();
      setData(result.assets || []);
      setSelected(null);
      setMessage("Backend dataset reset successfully.");
    } catch {
      setMessage("Backend reset failed.");
    }
  }

  function exportGovernanceSnapshot() {
  exportExcel({
    fileName: "INVISOR_Admin_Governance_Report",

    overview: [
      { Section: "Governance Health", Value: `${governanceScore}%` },
      { Section: "Audit Readiness", Value: `${auditReadiness}%` },
      { Section: "Policy Compliance", Value: `${policyCompliance}%` },
      { Section: "Enterprise Risk", Value: `${enterpriseRiskIndex}%` },
      { Section: "Operational Health", Value: `${operationalHealth}%` },
      { Section: "Governance Maturity", Value: maturityLevel },
      { Section: "Executive Decision", Value: decisionStatus },
      { Section: "Generated", Value: new Date().toLocaleString() },
    ],

    metrics: [
      {
        Metric: "High Risk Records",
        Value: highRisk,
      },
      {
        Metric: "Pending Validation",
        Value: pendingValidation,
      },
      {
        Metric: "Escalated Items",
        Value: escalatedItems,
      },
      {
        Metric: "Operational Assets",
        Value: active,
      },
      {
        Metric: "Total Assets",
        Value: totalAssets,
      },
    ],

    reasoning: [
      {
        Category: "Executive Recommendation",
        Value: executiveRecommendation,
      },
    ],

    audit: benchmarkRows.map((row) => ({
      Department: row.department,
      Governance: row.governance,
      Risk: row.risk,
      Rank: row.rank,
    })),
  });

  setMessage("Administrative Governance Snapshot exported.");
}
  return (
    <div className="admin-page">
      <p className="eyebrow">ENTERPRISE GOVERNANCE INTELLIGENCE HUB</p>

      <h1>Enterprise Governance Command Centre</h1>

      <p className="admin-sub">
        Backend-connected admin command centre for governance oversight, policy
        control, risk intelligence, audit readiness, operational resilience and
        executive decision support.
      </p>

      {/* ===========================
    ENTERPRISE EXECUTIVE HERO
============================ */}

<div className="executive-hero">

  <div className="executive-header">

    <div>

      <p className="hero-eyebrow">
        ENTERPRISE GOVERNANCE INTELLIGENCE CENTRE
      </p>

      <h2>
        Enterprise Governance Command Centre
      </h2>

      <p>
        INVISOR currently oversees
        <strong> {totalAssets} enterprise governance assets</strong>
        across all departments. Governance maturity is currently
        <strong> {maturityLevel}</strong> with an overall governance
        health score of <strong>{governanceScore}%</strong>.
      </p>

    </div>

    <div className="hero-status">

      <span className="status-live">

        ● LIVE

      </span>

      <span>

        Last Updated

      </span>

      <strong>{systemTime}</strong>

    </div>

  </div>

  <div className="enterprise-kpi-grid">

    <div className="enterprise-kpi primary">

      <span>Governance Health</span>

      <h2>{governanceScore}%</h2>

      <small>Overall Enterprise Governance</small>

    </div>

    <div className="enterprise-kpi">

      <span>Enterprise Risk</span>

      <h2>{enterpriseRiskIndex}%</h2>

      <small>Cross Department Exposure</small>

    </div>

    <div className="enterprise-kpi">

      <span>Audit Readiness</span>

      <h2>{auditReadiness}%</h2>

      <small>Audit Preparedness</small>

    </div>

    <div className="enterprise-kpi">

      <span>Compliance</span>

      <h2>{policyCompliance}%</h2>

      <small>Enterprise Controls</small>

    </div>

    <div className="enterprise-kpi">

      <span>Operational Health</span>

      <h2>{operationalHealth}%</h2>

      <small>Platform Operations</small>

    </div>

    <div className="enterprise-kpi">

      <span>Governance Maturity</span>

      <h2>{maturityLevel}</h2>

      <small>{governanceMaturity}% Score</small>

    </div>

    <div className="enterprise-kpi">

      <span>AI Confidence</span>

      <h2>97%</h2>

      <small>Decision Intelligence</small>

    </div>

    <div className="enterprise-kpi">

      <span>Department Coverage</span>

      <h2>100%</h2>

      <small>Enterprise Wide</small>

    </div>

    <div className="enterprise-kpi">

      <span>Platform Availability</span>

      <h2>99.98%</h2>

      <small>System Availability</small>

    </div>

    <div className="enterprise-kpi">

      <span>Executive Readiness</span>

      <h2>{forecastGovernance}%</h2>

      <small>30-Day Forecast</small>

    </div>

  </div>

</div>

<div className="executive-summary-strip">

  <div>

    <h4>{highRisk}</h4>

    <span>Critical Risks</span>

  </div>

  <div>

    <h4>{pendingValidation}</h4>

    <span>Pending Validation</span>

  </div>

  <div>

    <h4>{escalatedItems}</h4>

    <span>Escalated Cases</span>

  </div>

  <div>

    <h4>{active}</h4>

    <span>Operational Assets</span>

  </div>

  <div>

    <h4>{totalAssets}</h4>

    <span>Total Assets</span>

  </div>

</div>

{/* ===========================================================
    ENTERPRISE ALERTS CENTRE
=========================================================== */}

<div className="enterprise-alert-centre">

  <div className="alert-header">
    <div>
      <p className="hero-eyebrow">REAL-TIME GOVERNANCE ALERTS</p>
      <h3>Enterprise Alerts Centre</h3>
    </div>

    <div className="alert-count">
      {highRisk + pendingValidation + escalatedItems} Active Alerts
    </div>
  </div>

  <div className="alert-grid">

    <div className="enterprise-alert critical">

      <div className="alert-top">
        <span>🔴 Critical</span>
        <small>Immediate Attention</small>
      </div>

      <h4>Enterprise Risk Exposure</h4>

      <p>
        {highRisk} high-risk governance record(s) currently require
        executive escalation.
      </p>

      <div className="alert-footer">

        <span>{highRisk} Critical Risks</span>

        <button
          className="mini-action"
          onClick={escalateHighRisk}
        >
          Escalate
        </button>

      </div>

    </div>

    <div className="enterprise-alert warning">

      <div className="alert-top">
        <span>🟠 Warning</span>
        <small>Review Required</small>
      </div>

      <h4>Pending Governance Validation</h4>

      <p>
        {pendingValidation} governance records remain pending validation.
      </p>

      <div className="alert-footer">

        <span>Review Queue</span>

        <button
          className="mini-action"
          onClick={moveToReview}
        >
          Review
        </button>

      </div>

    </div>

    <div className="enterprise-alert info">

      <div className="alert-top">
        <span>🔵 Information</span>
        <small>Forecast</small>
      </div>

      <h4>Governance Forecast</h4>

      <p>
        Projected enterprise governance health is
        <strong> {forecastGovernance}%</strong>
        over the next {forecastDays} days.
      </p>

      <div className="alert-footer">

        <span>Forecast Engine</span>

        <button
  className="mini-action"
  onClick={() => {
    setActiveTab("Risk Intelligence Centre");
    setMessage(
      "Risk Intelligence Centre opened for governance forecast analysis."
    );
  }}
>
  View Analytics
</button>

      </div>

    </div>

    <div className="enterprise-alert success">

      <div className="alert-top">
        <span>🟢 Healthy</span>
        <small>Platform Status</small>
      </div>

      <h4>Operational Readiness</h4>

      <p>

        Audit readiness is currently

        <strong> {auditReadiness}%</strong>

        with

        <strong> {policyCompliance}%</strong>

        compliance.

      </p>

      <div className="alert-footer">

        <span>Executive Ready</span>

        <button
  className="mini-action"
  onClick={exportGovernanceSnapshot}
>
  Generate Report
</button>

      </div>

    </div>

  </div>

</div>

     

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "tab active-tab" : "tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {message && <div className="enterprise-notification">{message}</div>}

     
     <div className="admin-actions">

  

    <button
    className="primary-btn"
    onClick={runGovernanceAnalysis}
  >
    🔍 Run Governance Analysis
  </button>

  <button
    className="secondary-btn"
    onClick={detectGovernanceRisks}
  >
    🛡 Detect Governance Risks
  </button>

  <button
    className="warning-btn"
    onClick={startQuarterlyReview}
  >
    📋 Start Quarterly Review
  </button>

  <button
    className="primary-btn"
    onClick={recalculateGovernanceMetrics}
  >
    📊 Recalculate Score
  </button>

  <button
    className="danger-btn"
    onClick={simulatePolicyBreachScenario}
  >
    ⚠ Simulate Policy Breach
  </button>

  <button
    className="reset-btn"
    onClick={resetBackend}
  >
    ♻ Restore Demo Dataset
  </button>

  <button
className="primary-btn"
onClick={exportGovernanceSnapshot}
>

Export Governance Snapshot

</button>

</div>

      {activeTab === "Enterprise Command Centre" && (
        <div className="admin-grid">
          <div className="admin-card large">
            <div className="card-header">
              <h3>Shared Enterprise Governance Dataset</h3>
              <span>{data.length} backend records</span>
            </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asset</th>
                  <th>Department</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>Validation</th>
                  <th>Allocated To</th>
                  <th>Governance Decision</th>
                  <th>Risk Rating</th>
                  <th>Owner</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => {
                  const decision =
                    item.risk === "High"
                      ? "Escalate"
                      : item.validation !== "Passed"
                      ? "Review"
                      : "Monitor";

                  return (
                    <tr
                      key={item._id || item.id}
                      onClick={() => setSelected(item)}
                      className={
                        (selected?._id || selected?.id) === (item._id || item.id)
                          ? "selected-row"
                          : ""
                      }
                    >
                     <td>{item.id}</td>
                      <td>{item.asset}</td>
                      <td>{item.department}</td>

                      <td className={`risk ${item.risk?.toLowerCase() || ""}`}>
                          {item.risk}
                      </td>
                      <td>{item.status}</td>
                      <td>{item.validation}</td>
                      <td>{item.allocatedTo}</td>
                      <td>{decision}</td>
                      <td>{item.riskScore || "Medium"}</td>
                      <td>{item.owner || "Department Head"}</td>
                    </tr>
                  );
                })}
              </tbody>
              
            </table>
            </div>
          </div>
          

         {/* ===========================================================
    DEPARTMENT INTELLIGENCE MATRIX
=========================================================== */}

<div className="admin-card large">

    <div className="card-header">

        <h3>Department Intelligence Matrix</h3>

        <span>Enterprise-wide Governance Comparison</span>

    </div>

    <div className="table-scroll">

        <table>

            <thead>

                <tr>

                    <th>Department</th>

                    <th>Governance</th>

                    <th>Risk</th>

                    <th>Compliance</th>

                    <th>Audit</th>

                    <th>Assets</th>

                    <th>Health</th>

                    <th>Trend</th>

                    <th>Rank</th>

                </tr>

            </thead>

            <tbody>

                {benchmarkRows.map((row,index)=>(

                    <tr key={row.department}>

                        <td>{row.department}</td>
                        <td>{row.governance}%</td>
                        <td>{row.risk}%</td>
                        <td>{Math.max(row.governance - 2, 70)}%</td>
                        <td>{Math.max(row.governance - 4, 68)}%</td>
                        <td>{Math.max(18 - index, 6)}</td>

                        <td>

                            {row.governance>=90

                                ? "Healthy"

                                : row.governance>=80

                                ? "Monitor"

                                : "Attention"}

                        </td>

                        <td>

                            {row.risk<25

                                ? "▲ Improving"

                                : row.risk<45

                                ? "▬ Stable"

                                : "▼ Declining"}

                        </td>

                        <td>{row.rank}</td>

                    </tr>

                ))}

            </tbody>

        </table>

    </div>

</div>



        <div className="admin-card executive-ai-panel">
  <div className="ai-panel-header">
    <div>
      <p className="hero-eyebrow">AI GOVERNANCE RECOMMENDATION</p>
      <h3>Executive Decision Centre</h3>
    </div>

    <span className={`ai-priority ${decisionStatus.toLowerCase()}`}>
      {decisionStatus}
    </span>
  </div>

  <div className="ai-recommendation-box">
    <div className="ai-orb">🤖</div>

    <div>
      <h2>{decisionStatus} Governance Action</h2>
      <p>{executiveRecommendation}</p>
    </div>
  </div>

  <div className="executive-decision-metrics">
    {executiveCards.map((card) => (
      <div className="decision-metric-card" key={card.label}>
        <span className="decision-icon">{card.icon}</span>
        <small>{card.label}</small>
        <strong>{card.value}</strong>
        <p>{card.note}</p>
      </div>
    ))}
  </div>

  <div className="ai-action-row">
    <button className="primary-btn" onClick={escalateHighRisk}>
      Approve Recommendation
    </button>

    <button className="secondary-btn" onClick={moveToReview}>
      Send for Review
    </button>
  </div>
</div>


          <div className="admin-card">
            <h3>Enterprise Governance Watchlist</h3>

            {data
              .filter((item) => item.risk === "High" || item.status === "Escalated")
              .slice(0, 5)
              .map((item) => (
                <div className="watchlist-item" key={item._id || item.id}>
                  <h4>{item.asset}</h4>
                  <p>Department: {item.department}</p>
                  <p>Risk Status: {item.risk}</p>
                  <p>Current State: {item.status}</p>
                </div>
              ))}
          </div>

          <div className="admin-card">
            <h3>Enterprise Statistics Dashboard</h3>

            <div className="summary-item">
              <span>High Risk</span>
              <b className="risk high">{highRisk}</b>
            </div>

            <div className="summary-item">
              <span>Active / Over-allocated</span>
              <b>{active}</b>
            </div>

            <div className="summary-item">
              <span>Pending Validation</span>
              <b>{pendingValidation}</b>
            </div>

            <div className="summary-item">
              <span>Backend Status</span>
              <b className={data.length > 0 ? "risk low" : "risk high"}>
                {data.length > 0 ? "Connected" : "Disconnected"}
              </b>
            </div>

            {selected && (
              <div className="admin-insight">
                <b>{selected.id} Decision Explanation</b>
                <p>{selected.lastAction || "No previous action recorded."}</p>
              </div>
            )}
          </div>
          <div className="admin-card">
  <h3>Governance Activity Centre</h3>

  <table className="summary-table">
    <tbody>
      {[...liveFeed, ...governanceActivity].map(
  ([time, activity], index) => (
    <tr key={`${time}-${index}`}>
      <td>{time}</td>
      <td>{activity}</td>
    </tr>
  )
)}
    </tbody>
  </table>
</div>
        </div>
      )}

      {activeTab === "Policy & Control Governance" && (
  <div className="admin-grid">
    <div className="admin-card large">
      <h3>Policy Configuration Engine</h3>

      <div className="policy-control-grid">
        {[
          ["High Risk Threshold", "75%", "Determines when governance records require escalation."],
          ["SLA Priority Weight", "40%", "Controls how SLA breaches influence prioritisation."],
          ["Fairness Weight", `${fairnessWeight}%`, "Balances allocation and department fairness."],
          ["Risk Exposure Weight", `${riskWeight}%`, "Adjusts the impact of risk scoring."],
        ].map(([title, value, desc]) => (
          <div className="policy-control-card" key={title}>
            <span>{title}</span>
            <strong>{value}</strong>
            <p>{desc}</p>
          </div>
        ))}
      </div>

      <div className="policy-grid">
        <div>
          <label>Fairness Weight</label>
          <input
            type="range"
            min="10"
            max="90"
            value={fairnessWeight}
            onChange={(e) => setFairnessWeight(Number(e.target.value))}
          />
          <p>{fairnessWeight}%</p>
        </div>

        <div>
          <label>Risk Exposure Weight</label>
          <input
            type="range"
            min="10"
            max="90"
            value={riskWeight}
            onChange={(e) => setRiskWeight(Number(e.target.value))}
          />
          <p>{riskWeight}%</p>
        </div>
      </div>
    </div>

    <div className="admin-card">
      <h3>Policy Impact Preview</h3>

      <div className="impact-list">
        <div><span>Escalation Sensitivity</span><strong>{riskWeight > 50 ? "High" : "Moderate"}</strong></div>
        <div><span>Fairness Balance</span><strong>{fairnessWeight}%</strong></div>
        <div><span>Review Queue</span><strong>{pendingValidation}</strong></div>
        <div><span>Governance Decision</span><strong>{decisionStatus}</strong></div>
      </div>
    </div>
    <div className="admin-card">

        <h3>Policy Impact Assessment</h3>

        <table>

        <tbody>

        <tr>

        <td>Current Policies</td>

        <td>148</td>

        </tr>

        <tr>

        <td>Departments Covered</td>

        <td>8</td>

        </tr>

        <tr>

        <td>Governance Improvement</td>

        <td>+5%</td>

        </tr>

        <tr>

        <td>Expected Risk Reduction</td>

        <td>14%</td>

        </tr>

        </tbody>

        </table>

        </div>
  </div>



)}
      {activeTab === "Risk Intelligence Centre" && (
        <div className="admin-grid">
          <div className="admin-card">
            <h3>Enterprise Governance Trend</h3>

        <div className="executive-chart">
                  {[62, 66, 69, 72, 76, 81, 86].map((value, index) => (
                    <div className="chart-column" key={index}>
                      <div className="chart-bar" style={{ height: `${value}%` }}>
                        <span>{value}%</span>
                      </div>
                      <small>W{index + 1}</small>
                    </div>
                  ))}
                </div>

                <div className="chart-summary">
                  <div>
                    <strong>{governanceScore}%</strong>
                    <span>Current Governance</span>
                  </div>
                  <div>
                    <strong>{forecastGovernance}%</strong>
                    <span>30-Day Forecast</span>
                  </div>
                  <div>
                    <strong>{enterpriseRiskIndex}%</strong>
                    <span>Enterprise Risk</span>
                  </div>
                </div>
          </div>

          <div className="admin-card">
            <h3>Enterprise Risk Heatmap</h3>
            <div className="heat high">High Risk Assets: {highRisk}</div>
            <div className="heat medium">Medium Risk Assets: {mediumRisk}</div>
            <div className="heat low">Low Risk Assets: {lowRisk}</div>
          </div>

          <div className="admin-card">
            <h3>Enterprise Risk Distribution</h3>

            <table className="summary-table">
              <tbody>
                {riskDistribution.map(([label, value]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td><b>{value}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-card">
            <h3>Enterprise Benchmark Ranking</h3>

            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Governance</th>
                  <th>Risk</th>
                  <th>Rank</th>
                </tr>
              </thead>

              <tbody>
                {benchmarkRows.map((row) => (
                  <tr key={row.department}>
                    <td>{row.department}</td>
                    <td>{row.governance}%</td>
                    <td>{row.risk}%</td>
                    <td>{row.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Operational Resilience" && (
        <div className="admin-grid">
          <div className="admin-card">
            <h3>Enterprise Operational Resilience Centre</h3>
            <div className="summary-item">
              <span>React Frontend</span>
              <b className="risk low">Online</b>
            </div>
            <div className="summary-item">
              <span>Node.js API</span>
              <b className={data.length > 0 ? "risk low" : "risk high"}>
                {data.length > 0 ? "Connected" : "Disconnected"}
              </b>
            </div>
            <div className="summary-item">
              <span>Business Continuity Index</span>
              <b>{operationalHealth}%</b>
            </div>
            <div className="summary-item">
              <span>Recovery Readiness</span>
              <b>{auditReadiness}%</b>
            </div>
            <div className="summary-item">
              <span>SLA Compliance</span>
              <b>{policyCompliance}%</b>
            </div>
          </div>

          <div className="admin-card">
            <h3>Platform Coverage</h3>
            <div className="coverage-row">
              <span>Inventory</span>
              <b>Backend-ready</b>
            </div>
            <div className="coverage-row">
              <span>Allocation</span>
              <b>Shared dataset</b>
            </div>
            <div className="coverage-row">
              <span>Audit</span>
              <b>Governance-ready</b>
            </div>
            <div className="coverage-row">
              <span>Admin</span>
              <b>Live control</b>
            </div>
          </div>

          <div className="admin-card">
          <h3>Platform Health Overview</h3>

          <table className="summary-table">
            <tbody>
              {platformHealth.map(([service, status]) => (
                <tr key={service}>
                  <td>{service}</td>
                  <td><b>{status}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {activeTab === "Executive Intelligence" && (
        <div className="admin-grid">
          <div className="admin-card executive">
            <h3>Enterprise Governance Intelligence</h3>

            <p>
              INVISOR currently reports <b>{governanceScore}% Governance Health</b>{" "}
              across <b>{totalAssets}</b> governed assets.
            </p>

            <p>
              Enterprise Governance Maturity is <b>{maturityLevel}</b> with a
              maturity score of <b>{governanceMaturity}%</b>.
            </p>

            <p>
              The platform identified <b>{highRisk}</b> high-risk records,{" "}
              <b>{pendingValidation}</b> pending validations and{" "}
              <b>{escalatedItems}</b> escalated governance issues.
            </p>
          </div>

          <div className="admin-card">
            <h3>Predictive Governance Forecast</h3>

            <table>
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Current</th>
                  <th>30-Day Forecast</th>
                  <th>Risk</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Governance Health</td>
                  <td>{governanceScore}%</td>
                  <td>{forecastGovernance}%</td>
                  <td>Low</td>
                </tr>

                <tr>
                  <td>Compliance</td>
                  <td>{policyCompliance}%</td>
                  <td>{clamp(policyCompliance + 2)}%</td>
                  <td>Low</td>
                </tr>

                <tr>
                  <td>Audit Readiness</td>
                  <td>{auditReadiness}%</td>
                  <td>{clamp(auditReadiness + 3)}%</td>
                  <td>Low</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="admin-card">
            <h3>Governance Recommendation Engine</h3>

            <div className="watchlist-item">
              <h4>Executive Recommendation</h4>
              <p>{executiveRecommendation}</p>
            </div>

            <div className="watchlist-item">
              <h4>Priority 1</h4>
              <p>Resolve pending validation findings.</p>
            </div>

            <div className="watchlist-item">
              <h4>Priority 2</h4>
              <p>Review all escalated governance records.</p>
            </div>

            <div className="watchlist-item">
              <h4>Priority 3</h4>
              <p>Monitor departments with increasing enterprise risk exposure.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
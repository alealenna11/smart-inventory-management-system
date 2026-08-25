import { useMemo, useState } from "react";
import { FiBell, FiUser } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { departmentConfig } from "../config/departmentConfig";
import DecisionExplanationCard from "../components/DecisionExplanationCard";
import { generateDecisionExplanation } from "../services/explainabilityEngine";

import { budgetData } from "../data/budgetData";
import { auditData } from "../data/auditData";
import { allocationData } from "../data/allocationData";
import { inventoryData } from "../data/inventoryData";
import { operationalData } from "../data/operationalData";
import { controlExceptionsData } from "../data/controlExceptionsData";
import DepartmentGovernanceLifecycle from "../components/DepartmentGovernanceLifecycle";
import DepartmentDecisionIntelligencePanel from "../components/DepartmentDecisionIntelligencePanel";
import DepartmentSpecialistModules from "../components/DepartmentSpecialistModules";


import "../styles/global.css";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

function flattenData(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return Object.values(data).flat();
  return [];
}

function getDept(record) {
  return record.department || record.dept || "Enterprise";
}

function getShortName(dept) {
  return departmentConfig[dept]?.shortName || dept || "Enterprise";
}

function getMaturity(score) {
  if (score >= 90) return "Optimised";
  if (score >= 80) return "Managed";
  if (score >= 70) return "Defined";
  if (score >= 60) return "Developing";
  return "Initial";
}

function getLevel(score, reverse = false) {
  if (reverse) {
    if (score >= 80) return "Low";
    if (score >= 60) return "Medium";
    return "High";
  }

  if (score >= 80) return "High";
  if (score >= 60) return "Medium";
  return "Low";
}

function getDecision(score, riskExposure) {
  if (riskExposure >= 65 || score < 65) return "Escalate";
  if (riskExposure >= 40 || score < 75) return "Review";
  return "Monitor";
}

function LineChart({ data }) {
  const width = 760;
  const height = 230;
  const pad = 32;

  const makePoints = (key) =>
    data
      .map((d, i) => {
        const x = pad + (i / Math.max(data.length - 1, 1)) * (width - pad * 2);
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
              <line
                x1={pad}
                y1={y}
                x2={width - pad}
                y2={y}
                stroke="#1e293b"
              />
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
          points={makePoints("risk")}
          fill="none"
          stroke="#f97316"
          strokeWidth="4"
        />

        {data.map((d, i) => {
          const x = pad + (i / Math.max(data.length - 1, 1)) * (width - pad * 2);

          return (
            <text
              key={d.month}
              x={x - 10}
              y={height - 5}
              fill="#94a3b8"
              fontSize="11"
            >
              {d.month}
            </text>
          );
        })}
      </svg>

      <div className="summary-item">
        <span>Blue = Governance score</span>
        <b>Orange = Risk exposure</b>
      </div>
    </div>
  );
}

function BarChart({ rows }) {
  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {rows.map((row) => (
        <div key={row.label}>
          <div className="summary-item">
            <span>{row.label}</span>
            <b>{row.value}%</b>
          </div>

          <div className="score-bar">
            <div style={{ width: `${row.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const config = departmentConfig[user?.department];
  const departmentName = config?.shortName || user?.department || "Department";

  const [detailView, setDetailView] = useState(null);

  const allBudget = flattenData(budgetData);
  const allAudit = flattenData(auditData);
  const allAllocation = flattenData(allocationData);
  const allInventory = flattenData(inventoryData);
  const allOperational = flattenData(operationalData);
  const allExceptions = flattenData(controlExceptionsData);

  const allDepartments = useMemo(() => {
    const set = new Set();

    [
      ...allBudget,
      ...allAudit,
      ...allAllocation,
      ...allInventory,
      ...allOperational,
      ...allExceptions,
    ].forEach((item) => set.add(getDept(item)));

    return Array.from(set).filter(Boolean);
  }, [
    allBudget,
    allAudit,
    allAllocation,
    allInventory,
    allOperational,
    allExceptions,
  ]);

  const departmentAnalytics = useMemo(() => {
    return allDepartments.map((dept) => {
      const budget = allBudget.filter((x) => getDept(x) === dept);
      const audit = allAudit.filter((x) => getDept(x) === dept);
      const allocation = allAllocation.filter((x) => getDept(x) === dept);
      const inventory = allInventory.filter((x) => getDept(x) === dept);
      const operational = allOperational.filter((x) => getDept(x) === dept);
      const exceptions = allExceptions.filter((x) => getDept(x) === dept);

      const allRecords = [
        ...budget,
        ...audit,
        ...allocation,
        ...inventory,
        ...operational,
        ...exceptions,
      ];

      const totalRecords = Math.max(allRecords.length, 1);

      const highRiskCount = allRecords.filter(
        (x) => x.risk === "High" || x.severity === "High"
      ).length;

      const mediumRiskCount = allRecords.filter(
        (x) => x.risk === "Medium" || x.severity === "Medium"
      ).length;

      const breachedSla = operational.filter((x) => x.sla === "Breached").length;

      const openExceptions = exceptions.filter(
        (x) => x.status !== "Closed"
      ).length;

      const missingEvidence = audit.filter(
        (x) => x.evidence === "Missing"
      ).length;

      const openAudit = audit.filter((x) => x.status !== "Closed").length;

      const pendingValidation = [...allocation, ...inventory].filter(
        (x) => x.validation && x.validation !== "Passed"
      ).length;

      const requested = budget.reduce(
        (sum, item) => sum + Number(item.requestedAmount || 0),
        0
      );

      const approved = budget.reduce(
        (sum, item) => sum + Number(item.approvedAmount || 0),
        0
      );

      const budgetUtilisation =
        requested > 0 ? clamp((approved / requested) * 100, 35, 100) : 75;

      const riskRate = (highRiskCount + mediumRiskCount * 0.45) / totalRecords;
      const slaBreachRate = breachedSla / Math.max(operational.length, 1);
      const exceptionRate = openExceptions / Math.max(exceptions.length || 1, 1);
      const evidenceGapRate = missingEvidence / Math.max(audit.length || 1, 1);

      const validationGapRate =
        pendingValidation /
        Math.max(allocation.length + inventory.length || 1, 1);

      const riskExposure = clamp(
        riskRate * 45 +
          slaBreachRate * 25 +
          exceptionRate * 20 +
          evidenceGapRate * 10
      );

      const slaHealth = clamp(100 - slaBreachRate * 55, 45, 100);
      const auditReadiness = clamp(
        100 - evidenceGapRate * 45 - openAudit * 2,
        45,
        100
      );
      const validationReadiness = clamp(100 - validationGapRate * 45, 45, 100);
      const efficiency = clamp(
        (slaHealth + auditReadiness + validationReadiness) / 3
      );

      const governanceScore = clamp(
        efficiency * 0.25 +
          (100 - riskExposure) * 0.3 +
          budgetUtilisation * 0.15 +
          auditReadiness * 0.2 +
          slaHealth * 0.1
      );

      return {
        dept,
        shortName: getShortName(dept),
        budget,
        audit,
        allocation,
        inventory,
        operational,
        exceptions,
        totalRecords,
        highRiskCount,
        mediumRiskCount,
        breachedSla,
        openExceptions,
        missingEvidence,
        openAudit,
        pendingValidation,
        requested,
        approved,
        budgetUtilisation,
        riskExposure,
        slaHealth,
        auditReadiness,
        validationReadiness,
        efficiency,
        governanceScore,
        maturity: getMaturity(governanceScore),
        decision: getDecision(governanceScore, riskExposure),
      };
    });
  }, [
    allDepartments,
    allBudget,
    allAudit,
    allAllocation,
    allInventory,
    allOperational,
    allExceptions,
  ]);

  const currentDept =
    departmentAnalytics.find(
      (x) =>
        x.dept === user?.department ||
        x.shortName === departmentName ||
        getShortName(x.dept) === departmentName
    ) || departmentAnalytics[0];

  const ranking = [...departmentAnalytics].sort(
    (a, b) => b.governanceScore - a.governanceScore
  );

  const currentRank =
    ranking.findIndex((x) => x.dept === currentDept?.dept) + 1 || "-";

  const governanceScore = currentDept?.governanceScore || 0;
  const maturityLevel = currentDept?.maturity || "Initial";
  const decisionStatus = currentDept?.decision || "Review";
  const riskControlScore = clamp(100 - (currentDept?.riskExposure || 0));
  const budgetPressure = clamp(100 - (currentDept?.budgetUtilisation || 0));
  const slaUrgency = clamp(100 - (currentDept?.slaHealth || 0));
  const auditReadiness = currentDept?.auditReadiness || 0;

  const forecastScore = clamp(
    governanceScore +
      (auditReadiness >= 80 ? 3 : -1) +
      (slaUrgency <= 35 ? 2 : -2) -
      (budgetPressure >= 65 ? 2 : 0)
  );

  const forecastTrend =
    forecastScore > governanceScore
      ? "Improving"
      : forecastScore < governanceScore
      ? "Declining"
      : "Stable";

  const executiveRecommendation =
    decisionStatus === "Escalate"
      ? "Escalate high-risk governance items immediately."
      : decisionStatus === "Review"
      ? "Review SLA recovery, audit evidence and validation gaps."
      : "Maintain current governance posture and continue monitoring.";

  const storyTitle =
    decisionStatus === "Escalate"
      ? "Governance risk requires immediate attention"
      : decisionStatus === "Review"
      ? "Governance posture requires management review"
      : "Governance posture is stable";

  const storyText =
    `INVISOR analysed ${currentDept?.totalRecords || 0} records from budget, audit, allocation, inventory, operational monitoring and control exceptions. ` +
    `It detected ${currentDept?.highRiskCount || 0} high-risk item(s), ${
      currentDept?.breachedSla || 0
    } SLA breach(es), ${currentDept?.missingEvidence || 0} missing evidence item(s), and ${
      currentDept?.openExceptions || 0
    } open control exception(s). Based on these signals, the recommended decision is ${decisionStatus}.`;

  const heatmapRows = ranking.map((x) => ({
    dept: x.shortName,
    risk: getLevel(x.riskExposure),
    sla: getLevel(x.slaHealth, true),
    budget: getLevel(x.budgetUtilisation),
    audit: getLevel(x.auditReadiness, true),
  }));

  const maturityRows = ranking.map((x) => ({
    dept: x.shortName,
    level:
      x.governanceScore >= 90
        ? "Level 5"
        : x.governanceScore >= 80
        ? "Level 4"
        : x.governanceScore >= 70
        ? "Level 3"
        : x.governanceScore >= 60
        ? "Level 2"
        : "Level 1",
    maturity: x.maturity,
    score: x.governanceScore,
    decision: x.decision,
  }));

  const watchlist = [
    {
      priority: decisionStatus === "Escalate" ? "Critical" : "High",
      issue: `${departmentName} governance posture requires ${decisionStatus.toLowerCase()} action`,
      impact: decisionStatus === "Escalate" ? "High" : "Medium",
      action: executiveRecommendation,
    },
    {
      priority: currentDept?.breachedSla > 0 ? "High" : "Medium",
      issue: `${currentDept?.breachedSla || 0} SLA breach(es) detected`,
      impact: currentDept?.breachedSla > 0 ? "High" : "Low",
      action: "Run SLA recovery and track operational closure.",
    },
    {
      priority: currentDept?.missingEvidence > 0 ? "High" : "Medium",
      issue: `${currentDept?.missingEvidence || 0} missing audit evidence item(s)`,
      impact: currentDept?.missingEvidence > 0 ? "Medium" : "Low",
      action: "Validate evidence and update audit trail.",
    },
  ];

  const trendData = [
  { month: "Jan", governance: clamp(governanceScore - 10), risk: clamp((currentDept?.riskExposure || 0) + 12) },
  { month: "Feb", governance: clamp(governanceScore - 8), risk: clamp((currentDept?.riskExposure || 0) + 10) },
  { month: "Mar", governance: clamp(governanceScore - 6), risk: clamp((currentDept?.riskExposure || 0) + 8) },
  { month: "Apr", governance: clamp(governanceScore - 4), risk: clamp((currentDept?.riskExposure || 0) + 6) },
  { month: "May", governance: clamp(governanceScore - 2), risk: clamp((currentDept?.riskExposure || 0) + 4) },
  { month: "Jun", governance: governanceScore, risk: currentDept?.riskExposure || 0 },
  { month: "Jul", governance: clamp(governanceScore + 1), risk: clamp((currentDept?.riskExposure || 0) - 1) },
  { month: "Aug", governance: clamp(governanceScore + 2), risk: clamp((currentDept?.riskExposure || 0) - 2) },
  { month: "Sep", governance: clamp(governanceScore + 3), risk: clamp((currentDept?.riskExposure || 0) - 3) },
  { month: "Oct", governance: clamp(forecastScore), risk: clamp((currentDept?.riskExposure || 0) - 4) },
  { month: "Nov", governance: clamp(forecastScore + 1), risk: clamp((currentDept?.riskExposure || 0) - 5) },
  { month: "Dec", governance: clamp(forecastScore + 2), risk: clamp((currentDept?.riskExposure || 0) - 6) },
];

  const explanation = generateDecisionExplanation({
    risk: currentDept?.riskExposure || 0,
    compliance: governanceScore,
    budget: budgetPressure,
    utilisation: currentDept?.validationReadiness || 0,
  });

  const evidenceRows = [
    { label: "Budget records", value: currentDept?.budget.length || 0 },
    { label: "Audit records", value: currentDept?.audit.length || 0 },
    { label: "Inventory records", value: currentDept?.inventory.length || 0 },
    { label: "Allocation records", value: currentDept?.allocation.length || 0 },
    { label: "Operational records", value: currentDept?.operational.length || 0 },
    { label: "Control exceptions", value: currentDept?.exceptions.length || 0 },
  ];

  const scoreBreakdown = [
    { label: "Risk control", value: riskControlScore },
    { label: "SLA health", value: currentDept?.slaHealth || 0 },
    { label: "Audit readiness", value: auditReadiness },
    {
      label: "Validation readiness",
      value: currentDept?.validationReadiness || 0,
    },
    { label: "Budget utilisation", value: currentDept?.budgetUtilisation || 0 },
  ];

  return (
    <div className="dashboard-container">
      <div className="topbar premium">
        <div>
          <h2>{config?.title || `${departmentName} Governance Workspace`}</h2>
          <p>
            Department-level decision intelligence from budget, audit,
            allocation, inventory, operational monitoring and control exception
            records.
          </p>
        </div>

        <div className="topbar-right">
          <FiBell className="icon pulse" />
          <div className="profile">
            <FiUser />
            <span>{user?.name || "Department User"}</span>
          </div>
        </div>
      </div>

      <div className="ai-hero glow">
        <h3>{departmentName} AI Governance Insight Engine</h3>
        <p>{executiveRecommendation}</p>
        <div className="confidence-bar">
          <div style={{ width: `${Math.max(55, governanceScore)}%` }}></div>
        </div>
      </div>

      <div className="card governance-score glow fade-in">
        <h3>{storyTitle}</h3>
        <p>{storyText}</p>
      </div>

      <DepartmentGovernanceLifecycle
  departmentName={departmentName}
  governanceScore={governanceScore}
  maturityLevel={maturityLevel}
  decisionStatus={decisionStatus}
  confidence={Math.max(88, governanceScore)}
  rootCause="Department governance information is fragmented across budget, audit, inventory, allocation, operational monitoring and control exception records."
  input="Budget records, audit evidence, inventory records, allocation status, SLA indicators and control exceptions are consolidated."
  processing="INVISOR validates the records, calculates governance scores, evaluates risk exposure, benchmarks department performance and generates explainable recommendations."
  output={`The platform produces a ${governanceScore}% governance score, ${maturityLevel} maturity level and ${decisionStatus} recommendation.`}
  businessValue="This improves departmental visibility, reduces manual consolidation effort and supports faster evidence-based governance decisions."
  recommendation={executiveRecommendation}
/>


    <DepartmentDecisionIntelligencePanel
  departmentName={departmentName}
  governanceScore={governanceScore}
  maturityLevel={maturityLevel}
  decisionStatus={decisionStatus}
  confidence={Math.max(88, governanceScore)}
  riskExposure={currentDept?.riskExposure || 0}
  auditReadiness={auditReadiness}
  slaHealth={currentDept?.slaHealth || 0}
  budgetUtilisation={currentDept?.budgetUtilisation || 0}
  validationReadiness={currentDept?.validationReadiness || 0}
  recommendation={executiveRecommendation}
/>

<DepartmentSpecialistModules departmentName={departmentName} />

      <div className="kpi-grid">
        {[
          { label: "Governance Score", value: `${governanceScore}/100` },
          { label: "Decision", value: decisionStatus },
          { label: "SLA Health", value: `${currentDept?.slaHealth || 0}%` },
          { label: "Audit Readiness", value: `${auditReadiness}%` },
        ].map((kpi) => (
          <div
            className="kpi-card clickable"
            key={kpi.label}
            onClick={() => setDetailView(kpi.label)}
          >
            <p>{kpi.label}</p>
            <h2>{kpi.value}</h2>
          </div>
        ))}
      </div>

      <div className="card governance-score glow fade-in">
        <h3>Executive Governance Summary</h3>

        <div className="summary-item">
          <span>Enterprise benchmark rank</span>
          <b>
            {currentRank} / {ranking.length}
          </b>
        </div>

        <div className="summary-item">
          <span>Governance maturity</span>
          <b>{maturityLevel}</b>
        </div>

        <div className="summary-item">
          <span>Recommended decision</span>
          <b>{decisionStatus}</b>
        </div>

        <div className="summary-item">
          <span>Executive recommendation</span>
          <b>{executiveRecommendation}</b>
        </div>
      </div>

      <div className="page-layout">
        <div className="main-panel">
          <div className="card governance-card-pro">
            <div className="card-header">
              <h3>Governance Score Engine</h3>
              <span className="card-sub">
                Normalised scoring from imported datasets
              </span>
            </div>

            <h1 className="score-value">{governanceScore}</h1>
            <BarChart rows={scoreBreakdown} />
          </div>

          <div className="card governance-card-pro">
            <div className="card-header">
              <h3>Governance Score & Risk Trend</h3>
              <span className="card-sub">Blue improves; orange should reduce</span>
            </div>

            <LineChart data={trendData} />
          </div>

          {detailView && (
            <div className="card detail-panel glow">
              <h3>{String(detailView).toUpperCase()} — DECISION EXPLANATION</h3>

              <p>
                This view explains how INVISOR converts governance records into
                an executive-level recommendation. The system checks risk
                exposure, SLA health, budget utilisation, audit readiness,
                validation readiness and control exceptions before generating a
                decision.
              </p>

              <h4>What was detected</h4>
              <ul>
                <li>{currentDept?.highRiskCount || 0} high-risk item(s)</li>
                <li>{currentDept?.breachedSla || 0} SLA breach(es)</li>
                <li>{currentDept?.missingEvidence || 0} missing evidence item(s)</li>
                <li>{currentDept?.openExceptions || 0} open control exception(s)</li>
              </ul>

              <h4>Why this matters</h4>
              <ul>
                <li>Weakens audit readiness and governance traceability</li>
                <li>Creates escalation pressure for department owners</li>
                <li>May delay approvals, remediation and operational closure</li>
              </ul>

              <h4>Recommended action</h4>
              <ul>
                <li>{executiveRecommendation}</li>
                <li>Review supporting records in the relevant module</li>
                <li>Maintain audit trail for management review</li>
              </ul>

              <button onClick={() => setDetailView(null)} className="action-btn">
                Close
              </button>
            </div>
          )}

          <div className="card governance-card-pro">
            <div className="card-header">
              <h3>Enterprise Governance Heatmap</h3>
              <span className="card-sub">
                Click any row to inspect department story
              </span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Risk</th>
                  <th>SLA</th>
                  <th>Budget</th>
                  <th>Audit</th>
                </tr>
              </thead>

              <tbody>
                {heatmapRows.map((row) => (
                  <tr
                    key={row.dept}
                    onClick={() => setDetailView(`Heatmap: ${row.dept}`)}
                  >
                    <td>{row.dept}</td>
                    <td>{row.risk}</td>
                    <td>{row.sla}</td>
                    <td>{row.budget}</td>
                    <td>{row.audit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card governance-card-pro">
            <div className="card-header">
              <h3>Governance Maturity Matrix</h3>
              <span className="card-sub">
                Click any department for evidence summary
              </span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Level</th>
                  <th>Maturity</th>
                  <th>Score</th>
                  <th>Decision</th>
                </tr>
              </thead>

              <tbody>
                {maturityRows.map((row) => (
                  <tr
                    key={row.dept}
                    onClick={() => setDetailView(`Maturity: ${row.dept}`)}
                  >
                    <td>{row.dept}</td>
                    <td>{row.level}</td>
                    <td>{row.maturity}</td>
                    <td>{row.score}</td>
                    <td>{row.decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card governance-card-pro">
            <div className="card-header">
              <h3>Executive Governance Watchlist</h3>
              <span className="card-sub">
                Decision actions generated from detected issues
              </span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Issue</th>
                  <th>Impact</th>
                  <th>Recommended Action</th>
                </tr>
              </thead>

              <tbody>
                {watchlist.map((item) => (
                  <tr key={item.issue} onClick={() => setDetailView(item.issue)}>
                    <td>{item.priority}</td>
                    <td>{item.issue}</td>
                    <td>{item.impact}</td>
                    <td>{item.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DecisionExplanationCard
            decision={explanation.decision}
            score={explanation.score}
            reasons={[
              `Governance score is ${governanceScore}/100`,
              `Risk exposure is ${currentDept?.riskExposure || 0}%`,
              `SLA urgency is ${slaUrgency}%`,
              `Budget pressure is ${budgetPressure}%`,
              `Audit readiness is ${auditReadiness}%`,
              ...explanation.reasons,
            ]}
          />
        </div>

        <div className="side-panel">
          <div className="card">
            <h3>Enterprise Governance Benchmarking</h3>

            {ranking.map((item, index) => (
              <div
                key={item.dept}
                className="risk-item clickable"
                onClick={() => setDetailView(`Benchmark: ${item.shortName}`)}
              >
                <span>
                  {index + 1}. {item.shortName} — {item.maturity}
                </span>
                <span className="risk-badge medium">
                  {item.governanceScore}
                </span>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>{departmentName} Evidence Sources</h3>

            {evidenceRows.map((item) => (
              <div
                className="summary-item clickable"
                key={item.label}
                onClick={() => setDetailView(item.label)}
              >
                <span>{item.label}</span>
                <b>{item.value}</b>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Predictive Governance Forecast</h3>

            <div className="summary-item">
              <span>Current score</span>
              <b>{governanceScore}/100</b>
            </div>

            <div className="summary-item">
              <span>30-day forecast</span>
              <b>{forecastScore}/100</b>
            </div>

            <div className="summary-item">
              <span>Projected trend</span>
              <b>{forecastTrend}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
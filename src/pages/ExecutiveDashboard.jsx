import { useMemo, useState } from "react";
import "../styles/admin.css";
import { useNavigate } from "react-router-dom";
import { exportExcel } from "../utils/exportExcel";
import DataSourceEvidencePanel from "../components/DataSourceEvidencePanel";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

function getMaturity(score) {
  if (score >= 90) return "Optimised";
  if (score >= 80) return "Managed";
  if (score >= 70) return "Defined";
  return "Developing";
}

function getDecision(dept) {
  if (dept.risk >= 60 || dept.governance < 75) return "Escalate";
  if (dept.risk >= 35 || dept.governance < 85) return "Review";
  return "Monitor";
}

function MiniTrendChart({ score, risk }) {
  const data = [
    { month: "Jan", governance: score - 7, risk: risk + 8 },
    { month: "Feb", governance: score - 5, risk: risk + 6 },
    { month: "Mar", governance: score - 3, risk: risk + 4 },
    { month: "Apr", governance: score - 1, risk: risk + 2 },
    { month: "May", governance: score, risk },
    { month: "Jun", governance: score + 3, risk: risk - 4 },
  ].map((x) => ({
    ...x,
    governance: clamp(x.governance),
    risk: clamp(x.risk),
  }));


  const width = 720;
  const height = 220;
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
          points={makePoints("risk")}
          fill="none"
          stroke="#f97316"
          strokeWidth="4"
        />

        {data.map((d, i) => {
          const x = pad + (i / Math.max(data.length - 1, 1)) * (width - pad * 2);
          return (
            <text key={d.month} x={x - 10} y={height - 5} fill="#94a3b8" fontSize="11">
              {d.month}
            </text>
          );
        })}
      </svg>

      <div className="summary-item">
        <span>Blue = Governance Health</span>
        <b>Orange = Risk Exposure</b>
      </div>
    </div>
  );
}

export default function ExecutiveDashboard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [scenarioMode, setScenarioMode] = useState("Enterprise Oversight");
  const [executiveEvents, setExecutiveEvents] = useState([]);
  const [scenarioBoost, setScenarioBoost] = useState(0);
  const [riskAdjustment, setRiskAdjustment] = useState(0);
  

  function addExecutiveEvent(title, detail) {
    const event = {
      id: `${Date.now()}-${Math.random()}`,
      time: new Date().toLocaleTimeString(),
      title,
      detail,
    };

    setExecutiveEvents((prev) => [event, ...prev].slice(0, 6));
  }

  function runExecutiveAnalysis() {
  setScenarioMode("Executive Analysis Completed");
  setScenarioBoost(2);
  setRiskAdjustment(0);

  addExecutiveEvent(
    "Executive Analysis Completed",
    "Enterprise governance, risk, audit and compliance indicators recalculated."
  );
}

  function simulateEnterpriseRisk() {
    setScenarioMode("Enterprise Risk Scenario");
    setRiskAdjustment(8);
    addExecutiveEvent(
      "Enterprise Risk Scenario Simulated",
      "Risk exposure increased to test executive escalation and remediation response."
    );
  }

  function approveRemediationPlan() {
    setScenarioMode("Remediation Plan Approved");
    setScenarioBoost(5);
    setRiskAdjustment(-8);
    addExecutiveEvent(
      "Remediation Plan Approved",
      "Governance forecast improved after executive remediation approval."
    );
  }

  function resetExecutiveView() {
    setScenarioMode("Enterprise Oversight");
    setScenarioBoost(0);
    setRiskAdjustment(0);
    setExecutiveEvents([]);
  }

 

  function exportExecutiveBoardPack() {

  exportExcel({

    fileName: "INVISOR_Executive_Board_Pack",

    overview: [

      {
        Section: "Platform",
        Value: "INVISOR Enterprise Governance Intelligence Platform"
      },

      {
        Section: "Governance Score",
        Value: `${governanceScore}%`
      },

      {
        Section: "Compliance",
        Value: `${complianceScore}%`
      },

      {
        Section: "Audit Readiness",
        Value: `${auditReadiness}%`
      },

      {
        Section: "Executive Decision",
        Value: enterpriseDecision
      },

      {
        Section: "Generated",
        Value: new Date().toLocaleString()
      }

    ],

    metrics: [

      {
        Metric: "Governance Health",
        Value: `${governanceScore}%`
      },

      {
        Metric: "Compliance",
        Value: `${complianceScore}%`
      },

      {
        Metric: "Audit Readiness",
        Value: `${auditReadiness}%`
      },

      {
        Metric: "Highest Risk Department",
        Value: highestRisk.name
      },

      {
        Metric: "Best Performing Department",
        Value: bestDepartment.name
      },

      {
        Metric: "Business Value",
        Value: businessValue.estimatedSavings
      },

      {
        Metric: "Projected ROI",
        Value: businessValue.roi
      }

    ],

    reasoning: aiExecutiveReasons.map(reason => ({

      Recommendation: reason

    })),

    audit: [

      {
        Activity: "Board Pack Generated",
        User: "Executive"
      },

      {
        Activity: "Governance Analysis Completed",
        Status: "Completed"
      },

      {
        Activity: "Executive Decision",
        Status: enterpriseDecision
      }

    ]

  });

}

          function exportExecutiveSummaryReport() {

              exportExcel({

                fileName: "INVISOR_Executive_Summary_Report",

                overview: [

                  {
                    Section: "Platform",
                    Value: "INVISOR Enterprise Governance Intelligence Platform"
                  },

                  {
                    Section: "Generated",
                    Value: new Date().toLocaleString()
                  },

                  {
                    Section: "Executive Decision",
                    Value: enterpriseDecision
                  }

                ],

                metrics: [

                  {
                    Metric: "Governance Health",
                    Value: `${governanceScore}%`
                  },

                  {
                    Metric: "Compliance",
                    Value: `${complianceScore}%`
                  },

                  {
                    Metric: "Audit Readiness",
                    Value: `${auditReadiness}%`
                  },

                  {
                    Metric: "Highest Risk Department",
                    Value: highestRisk.name
                  },

                  {
                    Metric: "Best Performing Department",
                    Value: bestDepartment.name
                  },

                  {
                    Metric: "Decision Confidence",
                    Value: `${decisionConfidence}%`
                  }

                ],

                reasoning: [

                  {
                    Recommendation: executiveRecommendation
                  },

                  ...aiExecutiveReasons.map(reason => ({
                    Recommendation: reason
                  }))

                ],

                audit: [

                  {
                    Activity: "Executive Summary Generated",
                    Status: "Completed"
                  },

                  {
                    Activity: "Decision",
                    Status: enterpriseDecision
                  }

                ]

              });

}
  const departments = [
    { name: "RDT", fullName: "SGAD - RDT", governance: 92, budget: 88, risk: 24, compliance: 95, audit: 94 },
    { name: "TRS", fullName: "SGAD - TRS", governance: 89, budget: 85, risk: 31, compliance: 92, audit: 91 },
    { name: "LOA", fullName: "SGAD - LOA", governance: 84, budget: 82, risk: 38, compliance: 88, audit: 86 },
    { name: "CBS", fullName: "SGAD - CBS", governance: 87, budget: 86, risk: 29, compliance: 91, audit: 90 },
    { name: "OPC", fullName: "SGAD - OPC", governance: 73, budget: 75, risk: 69, compliance: 76, audit: 78 },
    { name: "GTBD", fullName: "GTBD - Client Service", governance: 90, budget: 83, risk: 26, compliance: 94, audit: 93 },
    { name: "FCD", fullName: "SGAD - FCD", governance: 94, budget: 91, risk: 18, compliance: 97, audit: 96 },
    { name: "CPC", fullName: "SGAD - CPC", governance: 86, budget: 84, risk: 35, compliance: 89, audit: 88 },
  ];

  const enrichedDepartments = useMemo(() => {
    return departments
      .map((dept) => {
  const governance = clamp(dept.governance + scenarioBoost);
  const risk = clamp(dept.risk + riskAdjustment);

  return {
    ...dept,

    governance,

    risk,

    composite: clamp(
      governance * 0.35 +
      dept.compliance * 0.25 +
      dept.audit * 0.20 +
      dept.budget * 0.10 +
      (100 - risk) * 0.10
    ),

    maturity: getMaturity(governance),

    decision: getDecision({
      ...dept,
      governance,
      risk,
    }),
  };
})
      .sort((a, b) => b.composite - a.composite);
  }, [scenarioBoost, riskAdjustment]);

  const governanceScore = clamp(
    enrichedDepartments.reduce((sum, d) => sum + d.governance, 0) /
      enrichedDepartments.length
  );

  const governanceStatus =
  governanceScore >= 90
    ? "Excellent"
    : governanceScore >= 80
    ? "Healthy"
    : governanceScore >= 70
    ? "Needs Review"
    : "Critical";

  const complianceScore = clamp(
    enrichedDepartments.reduce((sum, d) => sum + d.compliance, 0) /
      enrichedDepartments.length
  );

  const auditReadiness = clamp(
    enrichedDepartments.reduce((sum, d) => sum + d.audit, 0) /
      enrichedDepartments.length
  );

  const averageRisk = clamp(
    enrichedDepartments.reduce((sum, d) => sum + d.risk, 0) /
      enrichedDepartments.length
  );

  const highestRisk = [...enrichedDepartments].sort((a, b) => b.risk - a.risk)[0];
  const bestDepartment = enrichedDepartments[0];

  const openControlExceptions = 23;
  const executiveDecisionsRequired = enrichedDepartments.filter(
    (d) => d.decision !== "Monitor"
  ).length;

  const forecastGovernance = clamp(
    governanceScore + (averageRisk < 35 ? 4 : averageRisk < 45 ? 2 : -2)
  );

  const forecastTrend =
    forecastGovernance > governanceScore
      ? "Improving"
      : forecastGovernance < governanceScore
      ? "Declining"
      : "Stable";

  const enterpriseDecision =
    highestRisk.risk >= 60
      ? "Escalate"
      : executiveDecisionsRequired > 0
      ? "Review"
      : "Monitor";
  
  const decisionConfidence = clamp(
  (governanceScore * 0.3) +
  (complianceScore * 0.25) +
  (auditReadiness * 0.25) +
  ((100 - averageRisk) * 0.2)
);

  const executiveRecommendation =
    enterpriseDecision === "Escalate"
      ? `Prioritise ${highestRisk.name} control remediation and executive review.`
      : enterpriseDecision === "Review"
      ? "Review monitored departments and close governance gaps before next board cycle."
      : "Maintain current governance posture and continue executive monitoring.";

  const maturityMatrix = [
    ["Budget Governance", "92%", "95%", "Optimised"],
    ["Audit Readiness", `${auditReadiness}%`, "95%", getMaturity(auditReadiness)],
    ["Risk Governance", `${clamp(100 - averageRisk)}%`, "90%", getMaturity(100 - averageRisk)],
    ["Control Monitoring", "82%", "95%", "Managed"],
    ["Executive Reporting", "94%", "95%", "Optimised"],
  ];

  const decisionQueue = [
    {
      ref: "DEC-001",
      type: "Budget Escalation",
      department: "OPC",
      priority: "High",
      action: "Executive approval required",
    },
    {
      ref: "DEC-002",
      type: "Control Breach Escalation",
      department: "LOA",
      priority: "High",
      action: "Review remediation plan",
    },
    {
      ref: "DEC-003",
      type: "Policy Exception Approval",
      department: "TRS",
      priority: "Medium",
      action: "Validate policy evidence",
    },
    {
      ref: "DEC-004",
      type: "Audit Finding Review",
      department: "CBS",
      priority: "Medium",
      action: "Confirm audit closure",
    },
  ];

  const executiveWatchlist = enrichedDepartments
    .filter((dept) => dept.risk >= 35 || dept.governance < governanceScore)
    .slice(0, 4);

    const businessValue = {
    estimatedSavings: "$3.8M",
    auditHoursSaved: "420 hrs",
    manualEffortReduction: "86%",
    roi: "312%",
    riskReduction: `${clamp(100 - averageRisk)}%`,
  };
  const adminOversight = [
  ["Active Users", "42"],
  ["Governance Rules", "148"],
  ["Pending Approvals", "6"],
  ["Audit Events", "2,310"],
  ["Policy Exceptions", openControlExceptions],
  ["System Readiness", "96%"],
];

  const executiveBoardPack = [
    ["Executive Decision", enterpriseDecision],
    ["Governance Health", `${governanceScore}%`],
    ["Compliance", `${complianceScore}%`],
    ["Audit Readiness", `${auditReadiness}%`],
    ["Highest Risk Department", highestRisk.name],
    ["Best Performer", bestDepartment.name],
    ["Projected Business Value", businessValue.estimatedSavings],
    ["Projected ROI", businessValue.roi],
  ];

  const aiExecutiveReasons = [
    `${highestRisk.name} has the highest risk exposure at ${highestRisk.risk}%.`,
    `${bestDepartment.name} is the enterprise benchmark with ${bestDepartment.composite}% composite score.`,
    `Enterprise compliance remains at ${complianceScore}%.`,
    `Audit readiness is currently ${auditReadiness}%.`,
    `Forecast governance is expected to reach ${forecastGovernance}% in 30 days.`,
  ];

  const governanceEvidenceTrace = [
  {
    stage: "Root Cause",
    detail:
      "Governance information is fragmented across departments, making executive oversight slow and manual.",
  },
  {
    stage: "Input",
    detail:
      "Department governance scores, compliance status, audit readiness, budget performance and risk indicators are consolidated.",
  },
  {
    stage: "Processing",
    detail:
      "Governance data is validated, benchmarked, scored, risk assessed and processed through the Explainable AI Engine before executive recommendations are generated.",
  },
  {
    stage: "Output",
    detail:
      `Recommended executive decision: ${enterpriseDecision}. Highest risk department: ${highestRisk.name}. Best performer: ${bestDepartment.name}.`,
  },
  {
    stage: "Business Value",
    detail:
      `Estimated savings ${businessValue.estimatedSavings}, ${businessValue.manualEffortReduction} manual effort reduction and ${businessValue.roi} projected ROI.`,
  },
];

  const executiveTimeline = [
  [
    "Jan",
    "Programme initiated with enterprise governance baseline assessment and governance maturity benchmarking."
  ],
  [
    "Feb",
    "Governance policies standardised and department ownership established across all business units."
  ],
  [
    "Mar",
    "Risk assessment framework implemented with enterprise-wide policy compliance monitoring."
  ],
  [
    "Apr",
    "Budget governance, approval workflows and control exception monitoring deployed."
  ],
  [
    "May",
    "Audit evidence repository integrated with explainable AI decision traceability."
  ],
  [
    "Jun",
    "Department benchmarking and enterprise governance scorecards introduced for executives."
  ],
  [
    "Jul",
    "AI Governance Recommendation Engine activated to generate enterprise recommendations."
  ],
  [
    "Aug",
    "Operational resilience, performance monitoring and executive KPI dashboards validated."
  ],
  [
    "Sep",
    "Cross-department governance optimisation completed with measurable business improvements."
  ],
  [
    "Oct",
    "Enterprise readiness assessment and production validation successfully completed."
  ],
  [
    "Nov",
    "Executive Board Review conducted with AI-assisted governance insights and deployment recommendation."
  ],
  [
    "Dec",
    "Enterprise production approval granted. INVISOR transitioned into continuous governance monitoring and strategic decision intelligence."
  ],
];

  return (
    <div className="admin-page">
      <p className="eyebrow">ENTERPRISE DECISION INTELLIGENCE HUB</p>

      <h1>Executive Governance Command Centre</h1>

      <p className="admin-sub">
        Enterprise-wide governance intelligence platform providing executive
        visibility across budget governance, audit readiness, policy compliance,
        operational performance, control exceptions and risk exposure.
      </p>

      <div className="admin-card executive">
        <h3>Executive Governance Narrative</h3>
        <p>
          INVISOR assessed <b>{enrichedDepartments.length}</b> enterprise
          departments. Governance health is <b>{governanceScore}%</b>, compliance
          is <b>{complianceScore}%</b>, and audit readiness is{" "}
          <b>{auditReadiness}%</b>. <b>{bestDepartment.name}</b> is the strongest
          performer, while <b>{highestRisk.name}</b> has the highest risk exposure
          at <b>{highestRisk.risk}%</b>. Recommended decision:{" "}
          <b>{enterpriseDecision}</b>.
        </p>
      </div>

      <div className="admin-card executive">
  <h3>Root Cause to Executive Decision Traceability</h3>
  <p>
    This panel explains how INVISOR converts fragmented governance information
    into an evidence-based executive decision.
  </p>

  <table className="summary-table">
    <thead>
      <tr>
        <th>Stage</th>
        <th>Evidence</th>
      </tr>
    </thead>

    <tbody>
      {governanceEvidenceTrace.map((item) => (
        <tr key={item.stage}>
          <td><b>{item.stage}</b></td>
          <td>{item.detail}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<DataSourceEvidencePanel />

      
     <div className="admin-kpi-grid">
  <div className="admin-kpi primary">
    <span>Enterprise Governance Health</span>
    <h2>{governanceScore}%</h2>
    <p>
      Overall governance effectiveness
      <br />
      <b>Status:</b> {governanceStatus}
    </p>
  </div>

  <div className="admin-kpi">
    <span>Enterprise Compliance</span>
    <h2>{complianceScore}%</h2>
    <p>Policy and regulatory adherence</p>
  </div>

  <div className="admin-kpi">
    <span>Audit Readiness</span>
    <h2>{auditReadiness}%</h2>
    <p>Enterprise audit preparedness</p>
  </div>

  <div className="admin-kpi">
    <span>Executive Decision</span>
    <h2>{enterpriseDecision}</h2>
    <p>{executiveDecisionsRequired} item(s) require review</p>
  </div>
</div>

<div className="admin-card executive">
  <h3>Governance Score Composition</h3>

  <table className="summary-table">
    <tbody>
      <tr>
        <td>Governance Health</td>
        <td>35%</td>
      </tr>

      <tr>
        <td>Compliance</td>
        <td>25%</td>
      </tr>

      <tr>
        <td>Audit Readiness</td>
        <td>20%</td>
      </tr>

      <tr>
        <td>Budget Governance</td>
        <td>10%</td>
      </tr>

      <tr>
        <td>Risk Adjustment</td>
        <td>10%</td>
      </tr>

      <tr>
        <td>
          <b>Overall Score</b>
        </td>
        <td>
          <b>{governanceScore}%</b>
        </td>
      </tr>
    </tbody>
  </table>
</div>
      
      <div className="admin-kpi-grid">
        <div className="admin-kpi">
          <span>Departments Governed</span>
          <h2>{enrichedDepartments.length}</h2>
          <p>Business operating units</p>
        </div>

        <div className="admin-kpi">
          <span>30-Day Forecast</span>
          <h2>{forecastGovernance}%</h2>
          <p>{forecastTrend} governance posture</p>
        </div>

        <div className="admin-kpi">
          <span>Enterprise Budget Exposure</span>
          <h2>$8.4M</h2>
          <p>Budget requests under review</p>
        </div>

        <div className="admin-kpi">
          <span>Open Control Exceptions</span>
          <h2>{openControlExceptions}</h2>
          <p>Enterprise-wide breaches</p>
        </div>
      </div>

      <div className="enterprise-action-grid">
        <div className="enterprise-action-card" onClick={runExecutiveAnalysis}>
          <div className="enterprise-action-icon">📊</div>
          <h3>Run Executive Analysis</h3>
          <p>Recalculate governance, compliance, audit readiness and executive risk posture.</p>
          <span>Execute →</span>
        </div>

        <div className="enterprise-action-card warning" onClick={simulateEnterpriseRisk}>
          <div className="enterprise-action-icon">⚠️</div>
          <h3>Simulate Enterprise Risk</h3>
          <p>Trigger a risk scenario to test executive escalation and governance response.</p>
          <span>Execute →</span>
        </div>

        <div className="enterprise-action-card" onClick={approveRemediationPlan}>
          <div className="enterprise-action-icon">✅</div>
          <h3>Approve Remediation Plan</h3>
          <p>Apply executive remediation and improve forecast governance posture.</p>
          <span>Execute →</span>
        </div>

        <div className="enterprise-action-card" onClick={resetExecutiveView}>
          <div className="enterprise-action-icon">♻</div>
          <h3>Reset Executive View</h3>
          <p>Restore baseline enterprise governance scenario.</p>
          <span>Execute →</span>
        </div>
      </div>


      <div className="admin-card governance-event-centre">
  <div className="card-header">
    <h3>Executive Decision Event Centre</h3>
    <span>{scenarioMode}</span>
  </div>

  {executiveEvents.length === 0 ? (
    <p>No executive actions executed yet.</p>
  ) : (
    executiveEvents.map((event) => (
      <div className="event-item success" key={event.id}>
        <strong>{event.time}</strong>
        <div>
          <h4>{event.title}</h4>
          <p>{event.detail}</p>
        </div>
      </div>
    ))
  )}
</div>

      <div className="admin-card">
        <h3>Enterprise Governance Trend</h3>
        <MiniTrendChart score={governanceScore} risk={averageRisk} />
      </div>

      {selected && (
        <div className="admin-card executive">
          <h3>{selected.name} Decision Explanation</h3>
          <p>
            <b>Composite Score:</b> {selected.composite}% <br />
            <b>Governance:</b> {selected.governance}% <br />
            <b>Budget:</b> {selected.budget}% <br />
            <b>Risk:</b> {selected.risk}% <br />
            <b>Compliance:</b> {selected.compliance}% <br />
            <b>Audit Readiness:</b> {selected.audit}% <br />
            <b>Maturity:</b> {selected.maturity} <br />
            <b>Decision:</b> {selected.decision} <br />
            <b>Recommendation:</b>{" "}
            {selected.decision === "Escalate"
              ? "Escalate control remediation and governance review."
              : selected.decision === "Review"
              ? "Review risk trend and close governance gaps."
              : "Maintain current governance posture."}
          </p>
        </div>
      )}

      <div className="admin-card">
        <h3>Governance Maturity Matrix</h3>

        <table>
          <thead>
            <tr>
              <th>Capability</th>
              <th>Current</th>
              <th>Target</th>
              <th>Maturity</th>
            </tr>
          </thead>

          <tbody>
            {maturityMatrix.map((row) => (
              <tr key={row[0]}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Enterprise Governance Benchmark Ranking</h3>

        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Department</th>
              <th>Composite</th>
              <th>Governance</th>
              <th>Budget</th>
              <th>Risk</th>
              <th>Compliance</th>
              <th>Audit</th>
              <th>Decision</th>
            </tr>
          </thead>

          <tbody>
            {enrichedDepartments.map((dept, index) => (
              <tr key={dept.name} onClick={() => setSelected(dept)}>
                <td>#{index + 1}</td>
                <td>{dept.name}</td>
                <td>{dept.composite}%</td>
                <td>{dept.governance}%</td>
                <td>{dept.budget}%</td>
                <td>{dept.risk}%</td>
                <td>{dept.compliance}%</td>
                <td>{dept.audit}%</td>
                <td>{dept.decision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Enterprise Risk Heatmap</h3>

        <div className="heatmap-grid">
          {enrichedDepartments.map((dept) => (
            <div
              className="heatmap-box"
              key={dept.name}
              onClick={() => setSelected(dept)}
            >
              <h4>{dept.name}</h4>
              <h2>{dept.risk}%</h2>
              <p>{dept.risk >= 60 ? "High Risk" : dept.risk >= 35 ? "Medium Risk" : "Low Risk"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h3>Executive Watchlist</h3>

        <table>
          <thead>
            <tr>
              <th>Priority</th>
              <th>Department</th>
              <th>Concern</th>
              <th>Recommended Action</th>
            </tr>
          </thead>

          <tbody>
            {executiveWatchlist.map((dept, index) => (
              <tr key={dept.name} onClick={() => setSelected(dept)}>
                <td>{index + 1}</td>
                <td>{dept.name}</td>
                <td>
                  {dept.risk >= 60
                    ? "High risk exposure"
                    : dept.governance < governanceScore
                    ? "Below enterprise governance average"
                    : "Monitoring item"}
                </td>
                <td>
                  {dept.decision === "Escalate"
                    ? "Immediate executive escalation"
                    : dept.decision === "Review"
                    ? "Management review required"
                    : "Routine monitoring"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card executive">
        <h3>Executive Recommendation Engine</h3>

        <p>
          <b>Executive Insight:</b> Enterprise governance remains stable overall,
          with <b>{bestDepartment.name}</b> acting as the benchmark department.
          <b> {highestRisk.name}</b> presents the highest risk concentration and
          should be prioritised for governance remediation.
        </p>

        <p>
          <b>Recommended Executive Actions:</b>
        </p>

        <ul>
          <li>{executiveRecommendation}</li>
          <li>Review OPC operational controls and control exception closure.</li>
          <li>Monitor LOA resource pressure and exception trend.</li>
          <li>Maintain FCD governance practices as the enterprise benchmark.</li>
          <li>Keep audit readiness above 90% across all departments.</li>
        </ul>
      </div>

      <div className="admin-card">
        <h3>Enterprise Executive Decision Queue</h3>

        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Decision Type</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Recommended Action</th>
            </tr>
          </thead>

          <tbody>
            {decisionQueue.map((item) => (
              <tr key={item.ref}>
                <td>{item.ref}</td>
                <td>{item.type}</td>
                <td>{item.department}</td>
                <td>{item.priority}</td>
                <td>{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">

          <h3>Executive Approval Pipeline</h3>

          <table>

          <thead>

          <tr>

          <th>Approval Stage</th>

          <th>Status</th>

          </tr>

          </thead>

          <tbody>

          <tr>

          <td>Department Review</td>

          <td>Completed</td>

          </tr>

          <tr>

          <td>Governance Review</td>

          <td>Completed</td>

          </tr>

          <tr>

          <td>Risk Assessment</td>

          <td>Completed</td>

          </tr>

          <tr>

          <td>Executive Approval</td>

          <td>In Progress</td>

          </tr>

          <tr>

          <td>Production Release</td>

          <td>Pending</td>

          </tr>

          </tbody>

          </table>

          </div>

      <div className="admin-card">
        <h3>Predictive Governance Forecast</h3>

        <table>
          <thead>
            <tr>
              <th>Area</th>
              <th>Current</th>
              <th>30-Day Forecast</th>
              <th>Trend</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Governance Health</td>
              <td>{governanceScore}%</td>
              <td>{forecastGovernance}%</td>
              <td>{forecastTrend}</td>
            </tr>

            <tr>
              <td>Compliance</td>
              <td>{complianceScore}%</td>
              <td>{clamp(complianceScore + 2)}%</td>
              <td>Improving</td>
            </tr>

            <tr>
              <td>Audit Readiness</td>
              <td>{auditReadiness}%</td>
              <td>{clamp(auditReadiness + 2)}%</td>
              <td>Improving</td>
            </tr>

            <tr>
              <td>Risk Exposure</td>
              <td>{averageRisk}%</td>
              <td>{clamp(averageRisk - 4)}%</td>
              <td>Reducing</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="admin-card executive">
  <h3>Enterprise Executive Board Pack</h3>

  <div className="benefit-grid">
    {executiveBoardPack.map(([label, value]) => (
      <div className="benefit-box" key={label}>
        <h2>{value}</h2>
        <p>{label}</p>
        
      </div>
    ))}
  </div>
  <button className="primary-btn" onClick={exportExecutiveBoardPack}>
  Export Executive Board Pack
</button>
</div>

<div className="admin-card executive">
  <h3>Governance Administration Oversight</h3>
  <p>
    High-level administrative governance view covering user activity, rules,
    approvals, audit events and platform readiness.
  </p>

  <div className="benefit-grid">
    {adminOversight.map(([label, value]) => (
      <div className="benefit-box" key={label}>
        <h2>{value}</h2>
        <p>{label}</p>
      </div>
    ))}
  </div>
</div>

<div className="admin-card executive">
  <h3>AI Executive Insight Engine</h3>

  <div className="executive-ai-grid">
    <div className="executive-ai-card">
      <h3>Recommended Decision</h3>
      <h2>{enterpriseDecision}</h2>
      <p>{executiveRecommendation}</p>
      <p>
    <b>Decision Confidence:</b> {decisionConfidence}%
  </p>
    </div>

    <div className="executive-ai-card">
      <h3>Business Value</h3>
      <table className="summary-table">
        <tbody>
          <tr><td>Estimated Savings</td><td>{businessValue.estimatedSavings}</td></tr>
          <tr><td>Audit Hours Saved</td><td>{businessValue.auditHoursSaved}</td></tr>
          <tr><td>Manual Effort Reduction</td><td>{businessValue.manualEffortReduction}</td></tr>
          <tr><td>Risk Reduction</td><td>{businessValue.riskReduction}</td></tr>
          <tr><td>Projected ROI</td><td>{businessValue.roi}</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div className="executive-ai-card">
    <h3>Why INVISOR Recommends This</h3>
    <ul className="recommendation-list">
      {aiExecutiveReasons.map((reason) => (
        <li key={reason}>{reason}</li>
      ))}
    </ul>
  </div>
</div>

<div className="admin-card">
  <h3>Executive Governance Timeline</h3>

  <div className="timeline-row">
    {executiveTimeline.map(([month, event]) => (
      <div className="timeline-step" key={month}>
        <strong>{month}</strong>
        <p>{event}</p>
      </div>
    ))}
  </div>
</div>

      <div className="admin-card">
        <h3>Executive Reporting Centre</h3>

        <p>
          Access enterprise board packs, strategic performance reports,
          governance reporting, audit readiness reporting and executive
          intelligence summaries.
        </p>

        <button
          className="primary-btn"
          onClick={() => navigate("/executive-reporting")}
        >
          Open Board & Executive Reporting Centre
        </button>

        <button className="primary-btn" onClick={exportExecutiveSummaryReport}>
    Export Executive Summary Report
  </button>
      </div>

      <div className="admin-card executive">

    <p>

    <b>INVISOR Enterprise Governance Intelligence Platform</b>

    <br/>

    Version 1.0

    <br/>

    Powered by MERN Architecture, Governance Intelligence Engine and Explainable AI.

    </p>

    </div>
    </div>

    
  );
}
import { useMemo, useState, useEffect } from "react";
import "../styles/inventory.css";
import { inventoryData } from "../data/inventoryData";
console.log("Imported inventoryData:", inventoryData);
import { useAuth } from "../contexts/AuthContext";
import { departmentConfig, normalizeDepartment } from "../config/departmentConfig";
import { getAssets, resetAssets } from "../services/api";
import DepartmentGovernanceLifecycle from "../components/DepartmentGovernanceLifecycle";

const STORAGE_KEY = "invisorInventoryRepository";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

function getInitialAssets() {
  const baseData = Array.isArray(inventoryData) ? inventoryData : [];

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (Array.isArray(saved) && saved.length >= baseData.length) {
      return saved;
    }

    return baseData;
  } catch {
    return baseData;
  }
}

function getAssetGovernanceScore(asset) {
  const riskPenalty =
    asset.risk === "High" ? 25 : asset.risk === "Medium" ? 12 : 3;

  const validationPenalty =
    asset.validation === "Failed"
      ? 22
      : asset.validation === "Pending"
      ? 12
      : 0;

  const statusPenalty =
    asset.status === "Over-allocated"
      ? 18
      : asset.status === "Audit Review"
      ? 15
      : asset.status === "Reallocated"
      ? 8
      : 0;

  return clamp(100 - riskPenalty - validationPenalty - statusPenalty, 45, 100);
}

function getAssetDecision(asset) {
  if (asset.risk === "High" || asset.validation === "Failed") {
    return {
      decision: "Escalate",
      recommendation: "Escalate to Governance Review Board.",
      reason:
        "Asset has high risk exposure or failed validation requiring immediate review.",
    };
  }

  if (asset.status === "Over-allocated" || asset.validation !== "Passed") {
    return {
      decision: "Review",
      recommendation: "Validate asset and optimise allocation.",
      reason:
        "Asset requires governance validation or reallocation before it can be considered stable.",
    };
  }

  return {
    decision: "Monitor",
    recommendation: "Maintain current allocation and continue monitoring.",
    reason:
      "Asset is within acceptable governance threshold with traceable allocation status.",
  };
}

function getMaturity(score) {
  if (score >= 90) return "Optimised";
  if (score >= 80) return "Managed";
  if (score >= 70) return "Defined";
  if (score >= 60) return "Developing";
  return "Initial";
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
          points={makePoints("health")}
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

        {data.map((d, index) => {
          const x = pad + (index / Math.max(data.length - 1, 1)) * (width - pad * 2);

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
        <span>Blue = Governance Health</span>
        <b>Orange = Risk Exposure</b>
      </div>
    </div>
  );
}

export default function Inventory() {
  const { user } = useAuth();
  const departmentKey = normalizeDepartment(user?.department);
  const config = departmentConfig[departmentKey];
  const departmentName = config?.shortName || departmentKey || "Enterprise";
const [assets, setAssets] = useState([]);

const [loading, setLoading] = useState(true);

const [selected, setSelected] = useState(null);

const [actionMsg, setActionMsg] = useState("");




async function loadInventory() {

  try {

    const result = await getAssets();

    if (result.success) {

     setAssets(result.data || []);

    } else {

      setAssets(getInitialAssets());

    }

  }

  catch {

    setAssets(getInitialAssets());

  }

  finally {

    setLoading(false);

  }

}
useEffect(() => {
  loadInventory();
}, []);

function saveAssets(updated) {
  setAssets(updated);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
}

  const scoredAssets = useMemo(() => {
    return assets.map((asset) => ({
      ...asset,
      governanceScore:asset.governanceScore ?? getAssetGovernanceScore(asset),
      explanation: getAssetDecision(asset),
    }));
  }, [assets]);
  console.log(scoredAssets);
  const total = scoredAssets.length;
  const safeTotal = Math.max(total, 1);

  const allocated = scoredAssets.filter((asset) => asset.status === "Allocated").length;
  const highRisk = scoredAssets.filter((asset) => asset.risk === "High").length;
  const mediumRisk = scoredAssets.filter((asset) => asset.risk === "Medium").length;
  const overAllocated = scoredAssets.filter(
    (asset) => asset.status === "Over-allocated"
  ).length;
  const pendingValidation = scoredAssets.filter(
    (asset) => asset.validation !== "Passed"
  ).length;
  const failedValidation = scoredAssets.filter(
    (asset) => asset.validation === "Failed"
  ).length;

  const utilisation = clamp((allocated / safeTotal) * 100);

  const avgManualTime = useMemo(() => {
    if (!scoredAssets.length) return 0;

    return Math.round(
      scoredAssets.reduce((sum, asset) => sum + Number(asset.manualTime || 0), 0) /
        scoredAssets.length
    );
  }, [scoredAssets]);

  const avgSystemTime = useMemo(() => {
    if (!scoredAssets.length) return 0;

    return Math.round(
      scoredAssets.reduce((sum, asset) => sum + Number(asset.systemTime || 0), 0) /
        scoredAssets.length
    );
  }, [scoredAssets]);

  const timeSaved = Math.max(0, avgManualTime - avgSystemTime);

  const riskExposure = clamp(
    ((highRisk + mediumRisk * 0.45) / safeTotal) * 100 +
      (overAllocated / safeTotal) * 20 +
      (failedValidation / safeTotal) * 25
  );

  const validationReadiness = clamp(
    ((total - pendingValidation) / safeTotal) * 100
  );

  const operationalEfficiency =
    avgManualTime > 0 ? clamp((timeSaved / avgManualTime) * 100) : 0;

  const healthScore =
    scoredAssets.length > 0
      ? clamp(
          scoredAssets.reduce((sum, asset) => sum + asset.governanceScore, 0) /
            scoredAssets.length
        )
      : 0;

  const maturityLevel = getMaturity(healthScore);

  const decisionStatus =
    highRisk > 0 || failedValidation > 0
      ? "Escalate"
      : pendingValidation > 0 || overAllocated > 0
      ? "Review"
      : "Monitor";

  const forecastScore = clamp(
    healthScore +
      (validationReadiness >= 80 ? 3 : -2) +
      (riskExposure <= 35 ? 2 : -2) +
      (operationalEfficiency >= 50 ? 2 : 0)
  );

  const forecastTrend =
    forecastScore > healthScore
      ? "Improving"
      : forecastScore < healthScore
      ? "Declining"
      : "Stable";

  const executiveRecommendation =
    decisionStatus === "Escalate"
      ? "Escalate high-risk or failed-validation assets for governance review."
      : decisionStatus === "Review"
      ? "Validate pending assets and optimise over-allocated inventory."
      : "Maintain current inventory governance posture and continue monitoring.";

  const storyText =
    `INVISOR analysed ${total} inventory asset record(s) across enterprise departments. ` +
    `It detected ${highRisk} high-risk asset(s), ${overAllocated} over-allocated asset(s), ` +
    `${pendingValidation} pending validation item(s), and ${failedValidation} failed validation item(s). ` +
    `Based on these signals, the recommended decision is ${decisionStatus}.`;

  const watchlist = scoredAssets
    .filter(
      (asset) =>
        asset.risk === "High" ||
        asset.validation !== "Passed" ||
        asset.status === "Over-allocated"
    )
    .slice(0, 10)
    .map((asset) => ({
      priority:
        asset.risk === "High" || asset.validation === "Failed"
          ? "Critical"
          : "High",
      asset: asset.asset,
      issue:
        asset.risk === "High"
          ? "High risk exposure"
          : asset.validation !== "Passed"
          ? "Validation not completed"
          : "Over-allocation detected",
      action: asset.explanation.recommendation,
    }));

  const deptBenchmark = Object.values(
    scoredAssets.reduce((acc, asset) => {
      const dept =
    asset.department ||
    asset.dept ||
    "Enterprise";

      if (!acc[dept]) {
        acc[dept] = {
          dept,
          count: 0,
          score: 0,
          highRisk: 0,
          pending: 0,
        };
      }

      acc[dept].count += 1;
      acc[dept].score += asset.governanceScore;
      if (asset.risk === "High") acc[dept].highRisk += 1;
      if (asset.validation !== "Passed") acc[dept].pending += 1;

      return acc;
    }, {})
  )
    .map((item) => ({
      ...item,
      avgScore: clamp(item.score / Math.max(item.count, 1)),
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  const heatmapRows = deptBenchmark.map((dept) => ({
    dept: dept.dept,
    health:
      dept.avgScore >= 80 ? "Managed" : dept.avgScore >= 70 ? "Defined" : "Review",
    risk:
      dept.highRisk > 0 ? "High" : dept.pending > 0 ? "Medium" : "Low",
    validation:
      dept.pending > 0 ? "Pending" : "Passed",
  }));

  const trendData = [
    { month: "Jan", health: clamp(healthScore - 8), risk: clamp(riskExposure + 10) },
    { month: "Feb", health: clamp(healthScore - 6), risk: clamp(riskExposure + 7) },
    { month: "Mar", health: clamp(healthScore - 4), risk: clamp(riskExposure + 5) },
    { month: "Apr", health: clamp(healthScore - 2), risk: clamp(riskExposure + 2) },
    { month: "May", health: healthScore, risk: riskExposure },
    { month: "Jun", health: forecastScore, risk: clamp(riskExposure - 3) },
  ];

  function reallocateAssets() {
    const updated = scoredAssets.map((asset) =>
      asset.risk === "High" || asset.status === "Over-allocated"
        ? {
            ...asset,
            status: "Reallocated",
            validation: "Pending",
            risk: "Medium",
            allocatedTo: "Optimised Pool",
            lastAction: "Inventory Reallocated",
          }
        : asset
    );

    saveAssets(updated);
    setActionMsg("High-risk assets reallocated into optimised governance pool.");
  }

  function validateInventory() {
    const updated = scoredAssets.map((asset) =>
      asset.validation === "Pending"
        ? {
            ...asset,
            status: "Validated",
            validation: "Passed",
            risk: "Low",
            lastAction: "Inventory Validation Completed",
          }
        : asset
    );

    saveAssets(updated);
    setActionMsg("Pending inventory validations completed.");
  }

  function triggerRiskAudit() {
    const updated = scoredAssets.map((asset) =>
      asset.risk === "High" || asset.validation === "Failed"
        ? {
            ...asset,
            status: "Audit Review",
            allocatedTo: "Governance Review",
            lastAction: "Risk Audit Triggered",
          }
        : asset
    );

    saveAssets(updated);
    setActionMsg("High-risk assets moved to Governance Review.");
  }

  function simulateRisk() {
    if (!scoredAssets.length) {
      setActionMsg("No inventory records available to simulate risk.");
      return;
    }

    const index = Math.floor(Math.random() * scoredAssets.length);

    const updated = scoredAssets.map((asset, i) =>
      i === index
        ? {
            ...asset,
            status: "Over-allocated",
            validation: "Failed",
            risk: "High",
            allocatedTo: "Exception Queue",
            lastAction: "Inventory Risk Simulated",
          }
        : asset
    );

    saveAssets(updated);
    setActionMsg("New inventory risk simulated.");
  }

 async function resetData(){

    await resetAssets();
    await loadInventory();

  

    setSelected(null);

    setActionMsg(
      "Enterprise Governance Repository reset successfully."
    );

}
if (loading) {
  return (
    <div className="terminal-page">
      <h2>Loading Enterprise Repository...</h2>
    </div>
  );
}
  return (
    
    
    <div className="terminal-page">
      <p className="eyebrow">ENTERPRISE INVENTORY & CONFIGURATION REPOSITORY</p>

      <h2>
        {user?.role === "department_user"
          ? `${departmentName} Resource Allocation & Optimisation Governance`
          : "Enterprise Inventory & Configuration Repository"}
      </h2>

      <p className="sub">
        Governance-driven inventory intelligence platform supporting asset
        lifecycle management, validation readiness, operational efficiency,
        audit traceability and explainable decision intelligence.
      </p>

      <div className="card highlight">
        <h4>INVENTORY GOVERNANCE STORY</h4>
        <p>{storyText}</p>
      </div>

     <div className="kpi-row">

        <div>
          <span>Enterprise Assets</span>
          <h3>{total}</h3>
        </div>

        <div>
          <span>Departments</span>
          <h3>{deptBenchmark.length}</h3>
        </div>

        <div>
          <span>Governance Health</span>
          <h3>{healthScore}%</h3>
        </div>

        <div>
          <span>Maturity</span>
          <h3>{maturityLevel}</h3>
        </div>

      </div>

    <div className="kpi-row">

          <div>
            <span>Risk Exposure</span>
            <h3>{riskExposure}%</h3>
          </div>

          <div>
            <span>Validation</span>
            <h3>{validationReadiness}%</h3>
          </div>

          <div>
            <span>Audit Ready</span>
            <h3>{validationReadiness}%</h3>
          </div>

          <div>
            <span>AI Confidence</span>
            <h3>96%</h3>
          </div>

        </div>

      {(highRisk > 0 || overAllocated > 0 || failedValidation > 0) && (
        <div className="alert-bar">
          Governance Alert: {highRisk} high-risk asset(s), {overAllocated} over-allocated item(s),
          {pendingValidation} pending validation item(s), and {failedValidation} failed validation item(s) detected.
        </div>
      )}

      {actionMsg && <div className="success-msg">{actionMsg}</div>}

      <div className="card highlight">
        <h4>EXECUTIVE AI RECOMMENDATION</h4>

        <div className="row">
            <span>Enterprise Governance Health</span>
            <b>{healthScore}%</b>
            </div>

            <div className="row">
            <span>Governance Maturity</span>
            <b>{maturityLevel}</b>
            </div>

            <div className="row">
            <span>Risk Exposure</span>
            <b>{riskExposure}%</b>
            </div>

            <div className="row">
            <span>Forecast Score</span>
            <b>{forecastScore}%</b>
            </div>

            <div className="row">
            <span>AI Confidence</span>
            <b>96%</b>
            </div>

            <div className="insight">

            <b>Executive Recommendation</b>

            <br/><br/>

            {executiveRecommendation}

            </div>
      
      </div>

      <div className="card highlight">
        <h4>ENTERPRISE GOVERNANCE PERFORMANCE TREND</h4>
        <MiniTrendChart data={trendData} />
      </div>

      {selected && (
        <div className="card highlight">
          <h4>{selected.id} ASSET DECISION EXPLANATION</h4>
         <div className="row">
                  <span>Asset</span>
                  <b>{selected.asset}</b>
                  </div>

                  <div className="row">
                  <span>Department</span>
                  <b>{selected.department || selected.dept}</b>
                  </div>

                  <div className="row">
                  <span>Owner</span>
                  <b>{selected.owner}</b>
                  </div>

                  <div className="row">
                  <span>Allocated To</span>
                  <b>{selected.allocatedTo}</b>
                  </div>

                  <div className="row">
                  <span>Governance Score</span>
                  <b>{selected.governanceScore}%</b>
                  </div>

                  <div className="row">
                  <span>Compliance</span>
                  <b>{selected.compliance}%</b>
                  </div>

                  <div className="row">
                  <span>Risk</span>
                  <b>{selected.risk}</b>
                  </div>

                  <div className="row">
                  <span>Audit Status</span>
                  <b>{selected.auditStatus}</b>
                  </div>

                  <div className="row">
                  <span>Decision</span>
                  <b>{selected.decision}</b>
                  </div>

                  <div className="row">
                  <span>Next Action</span>
                  <b>{selected.nextAction}</b>
                  </div>

                  <div className="row">
                  <span>Recommendation</span>
                  <b>{selected.explanation.recommendation}</b>
                  </div>

                  <div className="row">
                  <span>Reason</span>
                  <b>{selected.explanation.reason}</b>
                  </div>

                  <div className="insight">

                  Executive governance explanation generated automatically by INVISOR using enterprise governance rules, compliance validation, audit readiness and explainable AI.

                  </div>
         
        </div>
      )}

      <div className="grid">
        <div className="table-card">
          <div className="table-header">
            <h3>Enterprise Governance Asset Repository</h3>
            <span> {scoredAssets.length} Governance Assets</span>
          </div>

          <div className="scroll">
            <table>
              <thead>
                    <tr>
                    <th>ID</th>
                    <th>Asset</th>
                    <th>Department</th>
                    <th>Owner</th>
                    <th>Risk</th>
                    <th>Status</th>
                    <th>Validation</th>
                    <th>Governance Score</th>
                    <th>Compliance</th>
                    <th>Audit Status</th>
                    <th>Decision</th>
                    <th>Next Action</th>
                    <th>Allocated To</th>
                    </tr>
                    </thead>
              <tbody>

                  {scoredAssets.map((asset)=>(

                  <tr
                  key={asset.id}
                  onClick={()=>setSelected(asset)}
                  className={selected?.id===asset.id?"active":""}>

                  <td>{asset.id}</td>
                  <td>{asset.asset}</td>
                  <td>{asset.department || asset.dept} </td>
                  <td>{asset.owner}</td>
                  <td className={`risk ${(asset.risk || "").toLowerCase()}`}>
                  {asset.risk}
                  </td>
                  <td>{asset.status}</td>
                  <td>{asset.validation}</td>
                  <td><b>{asset.governanceScore}%</b></td>

                 <td>{`${asset.compliance ?? 100}%`}</td>
                 <td>{asset.auditStatus || "Audit Ready"}</td>
                <td>{asset.decision}</td>
                <td>{asset.nextAction || "Continuous Monitoring"}</td>
                <td>{asset.allocatedTo}</td>

                  </tr>

                  ))}

                  </tbody>
            </table>
          </div>
        </div>

        <div className="side">
          <div className="card highlight">

                <h4>🚨 ENTERPRISE COMMAND CENTRE</h4>

                <div className="row">

                <span>Departments Monitored</span>

                <b>{deptBenchmark.length}</b>

                </div>

                <div className="row">

                <span>Enterprise Assets</span>

                <b>{total}</b>

                </div>

                <div className="row">

                <span>Critical Assets</span>

                <b>{highRisk}</b>

                </div>

                <div className="row">

                <span>Pending Validation</span>

                <b>{pendingValidation}</b>

                </div>

                <div className="row">

                <span>Failed Controls</span>

                <b>{failedValidation}</b>

                </div>

                <div className="row">

                <span>Governance Health</span>

                <b>{healthScore}%</b>

                </div>

                <div className="row">

              <span>Operational Status</span>

              <b>

              {decisionStatus === "Escalate"

              ? "Executive Review"

              : decisionStatus === "Review"

              ? "Monitoring"

              : "Operational"}

              </b>

              </div>

             <div className="row">
                    <span>Average Compliance</span>
                    <b>
                    {Math.round(
                    scoredAssets.reduce((s,a)=>s+(a.compliance||0),0)
                    /Math.max(scoredAssets.length,1)
                    )}%
                    </b>
                    </div>

                    <div className="row">
                    <span>Audit Ready</span>
                    <b>
                    {
                    scoredAssets.filter(a=>a.auditStatus==="Audit Ready").length
                    }
                    </b>
                    </div>

                    <div className="row">
                    <span>Executive Escalations</span>
                    <b>
                    {
                    scoredAssets.filter(a=>a.decision==="Escalate").length
                    }
                    </b>
                    </div>

                    <div className="row">
                    <span>Repository Status</span>
                    <b>Operational</b>
                    </div>

                    <div className="row">
                    <span>AI Decision Engine</span>
                    <b>Online</b>
                    </div>
                                  <div className="insight">

              INVISOR continuously supervises governance activities across all enterprise
              departments and automatically escalates critical governance events requiring
              executive attention.

              </div>

              </div>

          <div className="card highlight">
            <h4>DEPARTMENT BENCHMARKING</h4>

            <table>

<thead>

<tr>

<th>#</th>

<th>Department</th>

<th>Assets</th>

<th>Governance</th>

<th>Compliance</th>

<th>Risk</th>

</tr>

</thead>

<tbody>

{deptBenchmark.map((dept,index)=>(

<tr key={dept.dept}>

    <td>{index + 1}</td>

    <td>{dept.dept}</td>

    <td>{dept.count}</td>

    <td>
        <b>{dept.avgScore}%</b>
    </td>

    <td>
        {
            Math.round(
                scoredAssets
                    .filter(a => (a.department || a.dept) === dept.dept)
                    .reduce((sum, a) => sum + (a.compliance || 0), 0)
                / Math.max(dept.count, 1)
            )
        }%
    </td>

    <td>
        <span
            className={
                dept.highRisk > 0
                    ? "status-high"
                    : dept.pending > 0
                    ? "status-medium"
                    : "status-good"
            }
        >
            {
                dept.highRisk > 0
                    ? "High"
                    : dept.pending > 0
                    ? "Medium"
                    : "Low"
            }
        </span>
    </td>

</tr>

))}

</tbody>

</table>
          </div>

 <div className="card highlight">

  <h4>GOVERNANCE HEATMAP</h4>

  <table>

    <thead>
      <tr>
        <th>Department</th>
        <th>Health</th>
        <th>Risk</th>
        <th>Validation</th>
      </tr>
    </thead>

    <tbody>

{heatmapRows.map((row)=>(

<tr key={row.dept}>

<td>{row.dept}</td>

<td>
<span className={
row.health==="Managed"
? "status-good"
: row.health==="Defined"
? "status-medium"
: "status-high"
}>
{row.health}
</span>
</td>

<td>
<span className={
row.risk==="Low"
? "status-good"
: row.risk==="Medium"
? "status-medium"
: "status-high"
}>
{row.risk}
</span>
</td>

<td>
<span className={
row.validation==="Passed"
? "status-good"
: "status-medium"
}>
{row.validation}
</span>
</td>

</tr>

))}

</tbody>

  </table>

</div>

          <div className="card highlight">

<h4>ENTERPRISE GOVERNANCE SUMMARY</h4>

<div className="row">

<span>Enterprise Governance Health</span>

<b>{healthScore}%</b>

</div>

<div className="row">

<span>Risk Exposure</span>

<b>{riskExposure}%</b>

</div>

<div className="row">

<span>Audit Readiness</span>

<b>{validationReadiness}%</b>

</div>

<div className="row">

<span>Governance Maturity</span>

<b>{maturityLevel}</b>

</div>

<div className="row">

<span>AI Confidence</span>

<b>96%</b>

</div>

<div className="insight">

Executive assessment generated automatically using governance scoring,
compliance validation, audit readiness, operational resilience,
department benchmarking and explainable AI.

</div>

</div>

          <div className="card action-panel">
            <h4>Executive Governance Controls</h4>

            <div className="action-row">
              <button className="action-btn primary" onClick={reallocateAssets}>
                Optimise Asset Allocation
              </button>

              <button className="action-btn" onClick={validateInventory}>
                Run Governance Validation
              </button>

              <button className="action-btn danger" onClick={triggerRiskAudit}>
                Escalate Control Exceptions
              </button>

              <button className="action-btn warning" onClick={simulateRisk}>
                Simulate Risk Event
              </button>

              <button className="action-btn reset" onClick={resetData}>
                Reset Repository
              </button>
            </div>
          </div>
        </div>
      </div>
   </div>
  );
}
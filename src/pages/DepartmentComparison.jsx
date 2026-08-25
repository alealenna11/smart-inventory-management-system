import { useMemo, useState } from "react";
import "../styles/departmentcomparison.css";
import { departmentComparisonData } from "../data/departmentComparisonData";

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

function getDecision(dept) {
  if (dept.risk >= 65 || dept.governance < 70) return "Escalate";
  if (dept.risk >= 40 || dept.governance < 80) return "Review";
  return "Monitor";
}

function MiniTrendChart({ governanceAverage, riskAverage }) {
  const data = [
    { month: "Jan", governance: governanceAverage - 7, risk: riskAverage + 8 },
    { month: "Feb", governance: governanceAverage - 5, risk: riskAverage + 6 },
    { month: "Mar", governance: governanceAverage - 3, risk: riskAverage + 4 },
    { month: "Apr", governance: governanceAverage - 1, risk: riskAverage + 2 },
    { month: "May", governance: governanceAverage, risk: riskAverage },
    { month: "Jun", governance: governanceAverage + 2, risk: riskAverage - 3 },
  ].map((x) => ({
    ...x,
    governance: clamp(x.governance),
    risk: clamp(x.risk),
  }));

  const width = 720;
  const height = 220;
  const pad = 32;

  const points = (key) =>
    data
      .map((d, i) => {
        const x = pad + (i / (data.length - 1)) * (width - pad * 2);
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

        <polyline points={points("governance")} fill="none" stroke="#38bdf8" strokeWidth="4" />
        <polyline points={points("risk")} fill="none" stroke="#f97316" strokeWidth="4" />

        {data.map((d, i) => {
          const x = pad + (i / (data.length - 1)) * (width - pad * 2);
          return (
            <text key={d.month} x={x - 10} y={height - 5} fill="#94a3b8" fontSize="11">
              {d.month}
            </text>
          );
        })}
      </svg>

      <div className="summary-item">
        <span>Blue = Governance maturity</span>
        <b>Orange = Risk exposure</b>
      </div>
    </div>
  );
}

export default function DepartmentComparison() {
  const [selected, setSelected] = useState(null);
 const [scenarioBoost, setScenarioBoost] = useState(0);
const [riskAdjustment, setRiskAdjustment] = useState(0);
const [benchmarkMode, setBenchmarkMode] = useState("Baseline Benchmark");
const [events, setEvents] = useState([]);
const [message, setMessage] = useState("");

function addEvent(title, detail) {
  const event = {
    id: `${Date.now()}-${Math.random()}`,
    time: new Date().toLocaleTimeString(),
    title,
    detail,
  };

  setEvents((prev) => [event, ...prev].slice(0, 5));
}

function runBenchmarkAnalysis() {
  setScenarioBoost(2);
  setRiskAdjustment(0);
  setBenchmarkMode("Benchmark Analysis Completed");
  setMessage("Benchmark analysis completed. Governance, compliance and budget indicators improved.");
  addEvent("Benchmark Analysis Completed", "Department scores recalculated.");
}

function simulateDepartmentRisk() {
  setRiskAdjustment(15);
  setBenchmarkMode("Department Risk Scenario");
  setMessage("Risk scenario simulated. Department risk exposure increased.");
  addEvent("Department Risk Scenario Simulated", "Risk exposure increased across departments.");
}

function applyBestPracticeModel() {
  setScenarioBoost(8);
  setRiskAdjustment(-12);
  setBenchmarkMode("Best Practice Model Applied");
  setMessage("Best practice model applied. Governance improved and risk reduced.");
  addEvent("Best Practice Model Applied", "Top performer practices applied across departments.");
}

function resetBenchmark() {
  setScenarioBoost(0);
  setRiskAdjustment(0);
  setBenchmarkMode("Baseline Benchmark");
  setEvents([]);
  setMessage("");
}

  const departments = useMemo(() => {
    return [...departmentComparisonData]
      .map((dept) => {
      const governance = clamp(dept.governance + scenarioBoost);
      const budget = clamp(dept.budget + Math.round(scenarioBoost / 2));
      const compliance = clamp(dept.compliance + scenarioBoost);
      const risk = clamp(dept.risk + riskAdjustment);

      return {
        ...dept,
        governance,
        budget,
        compliance,
        risk,
        maturity: getMaturity(governance),
        decision: getDecision({ ...dept, governance, risk }),
        compositeScore: clamp(
          governance * 0.35 +
            compliance * 0.25 +
            budget * 0.2 +
            (100 - risk) * 0.2
        ),
      };
    })
      .sort((a, b) => b.compositeScore - a.compositeScore);
  }, [scenarioBoost, riskAdjustment]);

  const highestRisk = [...departments].sort((a, b) => b.risk - a.risk)[0];
  const bestDepartment = departments[0];

  const governanceAverage = clamp(
    departments.reduce((sum, d) => sum + d.governance, 0) / departments.length
  );

  const complianceAverage = clamp(
    departments.reduce((sum, d) => sum + d.compliance, 0) / departments.length
  );

  const riskAverage = clamp(
    departments.reduce((sum, d) => sum + d.risk, 0) / departments.length
  );

  const executiveDecision =
    highestRisk.risk >= 65
      ? "Escalate high-risk department for executive governance review."
      : riskAverage >= 45
      ? "Review departments with elevated operational risk."
      : "Maintain monitoring and benchmark strong performers.";

  const watchlist = departments
    .filter((d) => d.risk >= 40 || d.governance < governanceAverage)
    .slice(0, 4);

  return (
    <div className="admin-page">
      <p className="eyebrow">ENTERPRISE GOVERNANCE BENCHMARKING CENTRE</p>

      <h1>Department Governance Benchmarking Dashboard</h1>

      <p className="admin-sub">
        Enterprise-wide benchmarking engine comparing governance maturity,
        risk exposure, budget discipline, compliance effectiveness and executive
        decision priority across departments.
      </p>

      <div className="admin-card executive">
        <h3>Benchmarking Story</h3>
        <p>
          INVISOR benchmarked <b>{departments.length}</b> departments.{" "}
          <b>{bestDepartment.department}</b> is the strongest performer with a
          composite score of <b>{bestDepartment.compositeScore}%</b>, while{" "}
          <b>{highestRisk.department}</b> has the highest risk exposure at{" "}
          <b>{highestRisk.risk}%</b>. Recommended action:{" "}
          <b>{executiveDecision}</b>
        </p>
      </div>

      <div className="admin-kpi-grid">
        <div className="admin-kpi primary">
          <span>Departments Governed</span>
          <h2>{departments.length}</h2>
          <p>Enterprise operating units</p>
        </div>

        <div className="admin-kpi">
          <span>Governance Index</span>
          <h2>{governanceAverage}%</h2>
          <p>Average maturity</p>
        </div>

        <div className="admin-kpi">
          <span>Compliance Index</span>
          <h2>{complianceAverage}%</h2>
          <p>Policy alignment</p>
        </div>

        <div className="admin-kpi">
          <span>Highest Risk</span>
          <h2>{highestRisk.department}</h2>
          <p>{highestRisk.risk}% exposure</p>
        </div>
      </div>

      <div className="enterprise-action-grid">
        <div className="enterprise-action-card" onClick={runBenchmarkAnalysis}>
          <div className="enterprise-action-icon">📊</div>
          <h3>Run Benchmark Analysis</h3>
          <p>Recalculate departmental scores, maturity and decision priority.</p>
          <span>Execute →</span>
        </div>

        <div className="enterprise-action-card warning" onClick={simulateDepartmentRisk}>
          <div className="enterprise-action-icon">⚠️</div>
          <h3>Simulate Department Risk</h3>
          <p>Increase risk exposure to test watchlist and escalation logic.</p>
          <span>Execute →</span>
        </div>

        <div className="enterprise-action-card" onClick={applyBestPracticeModel}>
          <div className="enterprise-action-icon">🏆</div>
          <h3>Apply Best Practice Model</h3>
          <p>Apply benchmark improvements from top-performing departments.</p>
          <span>Execute →</span>
        </div>

        <div className="enterprise-action-card" onClick={resetBenchmark}>
          <div className="enterprise-action-icon">♻</div>
          <h3>Reset Benchmark</h3>
          <p>Restore baseline department comparison scenario.</p>
          <span>Execute →</span>
        </div>
      </div>

      <div className="admin-card governance-event-centre">
      <div className="card-header">
        <h3>Benchmark Event Centre</h3>
        <span>{benchmarkMode}</span>
        
      </div>
      {message && <div className="admin-success">{message}</div>}

      {events.length === 0 ? (
        <p>No benchmark actions executed yet.</p>
      ) : (
        events.map((event) => (
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
        <MiniTrendChart governanceAverage={governanceAverage} riskAverage={riskAverage} />
      </div>

      {selected && (
        <div className="admin-card executive">
          <h3>{selected.department} Decision Explanation</h3>
          <p>
            <b>Composite Score:</b> {selected.compositeScore}% <br />
            <b>Maturity:</b> {selected.maturity} <br />
            <b>Decision:</b> {selected.decision} <br />
            <b>Reason:</b> Governance {selected.governance}%, risk{" "}
            {selected.risk}%, compliance {selected.compliance}%, budget{" "}
            {selected.budget}%.
          </p>
        </div>
      )}

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
              <th>Maturity</th>
              <th>Decision</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept, index) => (
              <tr key={dept.department} onClick={() => setSelected(dept)}>
                <td>{index + 1}</td>
                <td>{dept.department}</td>
                <td>{dept.compositeScore}%</td>
                <td>{dept.governance}%</td>
                <td>{dept.budget}%</td>
                <td>{dept.risk}%</td>
                <td>{dept.compliance}%</td>
                <td>{dept.maturity}</td>
                <td>{dept.decision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Governance Maturity Heatmap</h3>

        <div className="heatmap-grid">
          {departments.map((dept) => (
            <div
              key={dept.department}
              className="heatmap-box"
              onClick={() => setSelected(dept)}
            >
              <h4>{dept.department}</h4>
              <h2>{dept.compositeScore}%</h2>
              <p>{dept.maturity}</p>
              <small>Risk: {dept.risk}%</small>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h3>Executive Watchlist</h3>

        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Concern</th>
              <th>Decision</th>
              <th>Recommended Action</th>
            </tr>
          </thead>

          <tbody>
            {watchlist.map((dept) => (
              <tr key={dept.department} onClick={() => setSelected(dept)}>
                <td>{dept.department}</td>
                <td>
                  {dept.risk >= 65
                    ? "High risk concentration"
                    : dept.governance < governanceAverage
                    ? "Below average governance maturity"
                    : "Emerging monitoring item"}
                </td>
                <td>{dept.decision}</td>
                <td>
                  {dept.decision === "Escalate"
                    ? "Executive escalation and control review"
                    : dept.decision === "Review"
                    ? "Governance improvement review"
                    : "Routine monitoring"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card executive">
        <h3>Executive Governance Assessment</h3>
        <p>
          Enterprise governance remains broadly stable. {bestDepartment.department}{" "}
          should be used as the benchmark reference model, while{" "}
          {highestRisk.department} should remain a priority oversight area due to
          elevated risk exposure.
        </p>
      </div>
    </div>
  );
}
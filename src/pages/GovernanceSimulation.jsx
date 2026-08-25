import React, { useMemo, useState } from "react";
import runSimulation from "../services/sensitivityEngine";

export default function GovernanceSimulation() {
  const [demand, setDemand] = useState(20);
  const [history, setHistory] = useState([]);

  const result = runSimulation(demand);

  const scenarioDecision =
    result.risk === "High"
      ? "Escalate"
      : result.risk === "Medium"
      ? "Review"
      : "Monitor";

  const bestScenario = useMemo(() => {
    if (!history.length) return null;

    return [...history].sort((a, b) => {
      const riskRank = { Low: 1, Medium: 2, High: 3 };
      return riskRank[a.risk] - riskRank[b.risk] || b.fairness - a.fairness;
    })[0];
  }, [history]);

  function saveScenario() {
    const record = {
      demand,
      fairness: result.fairness,
      risk: result.risk,
      recommendation: result.recommendation,
      policy: result.policy,
      decision: scenarioDecision,
      time: new Date().toLocaleTimeString(),
    };

    setHistory([record, ...history]);
  }

  return (
    <div className="sim-container">
      <h1>Governance Simulation</h1>

      <p className="sim-subtitle">
        Test how organisational demand fluctuations impact fairness, risk, policy triggers and governance decisions.
      </p>

      <div className="sim-card">
        <h3>Simulation Story</h3>
        <p>
          At <b>{demand}%</b> demand increase, INVISOR predicts fairness of{" "}
          <b>{result.fairness}</b>, risk level <b>{result.risk}</b>, and decision{" "}
          <b>{scenarioDecision}</b>. Recommended action: <b>{result.recommendation}</b>.
        </p>
      </div>

      <div className="sim-layout">
        <div className="sim-card">
          <h3>Demand Simulation</h3>

          <label>Increase Department Demand (%)</label>

          <input
            type="range"
            min="0"
            max="100"
            value={demand}
            onChange={(e) => setDemand(Number(e.target.value))}
          />

          <p className="demand-value">Demand Increase: {demand}%</p>

          <button className="primary-btn" onClick={saveScenario}>
            Save Scenario
          </button>
        </div>

        <div className="sim-card">
          <h3>Predicted Governance Impact</h3>

          <div className="sim-metric">
            <span>Fairness Score</span>
            <div className="metric-bar-bg">
              <div className="metric-bar" style={{ width: `${result.fairness * 100}%` }} />
            </div>
            <span>{result.fairness}</span>
          </div>

          <div className="sim-row"><strong>Risk Level</strong><span className={`risk-${result.risk.toLowerCase()}`}>{result.risk}</span></div>
          <div className="sim-row"><strong>Decision</strong><span>{scenarioDecision}</span></div>
          <div className="sim-row"><strong>Recommended Action</strong><span>{result.recommendation}</span></div>
          <div className="sim-row"><strong>Policy Trigger</strong><span>{result.policy}</span></div>
        </div>
      </div>

      <div className="sim-card">
        <h3>Automation Impact</h3>

        <div className="sim-comparison">
          <div><label>Manual Governance Decision</label><strong>{result.manualTime} mins</strong></div>
          <div><label>INVISOR AI Decision</label><strong>{result.automatedTime} mins</strong></div>
          <div><label>Time Reduction</label><strong className="success">{result.timeReduction}%</strong></div>
        </div>
      </div>

      {bestScenario && (
        <div className="sim-card">
          <h3>Best Saved Scenario</h3>
          <p>
            Lowest-risk scenario saved at <b>{bestScenario.demand}%</b> demand,
            with fairness <b>{bestScenario.fairness}</b>, risk{" "}
            <b>{bestScenario.risk}</b>, and decision <b>{bestScenario.decision}</b>.
          </p>
        </div>
      )}

      <div className="sim-card">
        <h3>Scenario Comparison History</h3>

        <table className="audit-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Demand</th>
              <th>Fairness</th>
              <th>Risk</th>
              <th>Decision</th>
              <th>Policy</th>
            </tr>
          </thead>

          <tbody>
            {history.map((h, i) => (
              <tr key={`${h.time}-${i}`}>
                <td>{h.time}</td>
                <td>{h.demand}%</td>
                <td>{h.fairness}</td>
                <td>{h.risk}</td>
                <td>{h.decision}</td>
                <td>{h.policy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sim-card">
        <h3>Governance Interpretation</h3>
        <ul>
          <li>Higher demand can reduce fairness if resource allocation is not balanced.</li>
          <li>Risk increases when fairness falls below governance thresholds.</li>
          <li>Policy triggers provide explainable justification for escalation.</li>
          <li>Scenario history supports audit traceability and decision comparison.</li>
        </ul>
      </div>
    </div>
  );
}
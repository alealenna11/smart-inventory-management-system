import React, { useMemo, useState } from "react";

function pct(value) {
  return Math.round(Number(value || 0) * 100);
}

export default function GovernanceRiskIntelligence() {
  const risks = [
    { department: "Finance", riskScore: 0.82, fairness: 0.74, policy: "INV-GOV-01", status: "High" },
    { department: "Tech", riskScore: 0.61, fairness: 0.81, policy: "None", status: "Medium" },
    { department: "Risk", riskScore: 0.55, fairness: 0.79, policy: "INV-GOV-03", status: "Medium" },
    { department: "Ops", riskScore: 0.34, fairness: 0.88, policy: "None", status: "Low" },
  ];

  const [selected, setSelected] = useState(null);

  const rankedRisks = useMemo(
    () => [...risks].sort((a, b) => b.riskScore - a.riskScore),
    []
  );

  const highRisk = risks.filter((r) => r.status === "High").length;
  const mediumRisk = risks.filter((r) => r.status === "Medium").length;
  const lowRisk = risks.filter((r) => r.status === "Low").length;

  const avgRisk = Math.round(
    (risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length) * 100
  );

  const stability = Math.max(0, 100 - avgRisk);
  const highest = rankedRisks[0];

  function decision(r) {
    if (r.status === "High" || r.riskScore >= 0.75) return "Escalate";
    if (r.status === "Medium" || r.riskScore >= 0.5) return "Review";
    return "Monitor";
  }

  return (
    <div className="risk-container">
      <h1>Governance Risk Intelligence</h1>

      <p className="subtitle">
        Monitor governance risk exposure, fairness imbalance and policy violations across departments.
      </p>

      <div className="card">
        <h3>Executive Risk Story</h3>
        <p>
          INVISOR analysed <b>{risks.length}</b> departments. The highest risk unit is{" "}
          <b>{highest.department}</b> with <b>{pct(highest.riskScore)}%</b> exposure.
          Recommended decision: <b>{decision(highest)}</b>.
        </p>
      </div>

      <div className="kpi-row">
        <div className="kpi-card"><label>High Risk Units</label><strong>{highRisk}</strong></div>
        <div className="kpi-card"><label>Medium Risk</label><strong>{mediumRisk}</strong></div>
        <div className="kpi-card"><label>Low Risk</label><strong>{lowRisk}</strong></div>
        <div className="kpi-card"><label>Governance Stability</label><strong>{stability}%</strong></div>
      </div>

      <div className="risk-layout imp">
        <div className="card">
          <h3>Department Risk Exposure</h3>

          <table className="audit-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Risk Score</th>
                <th>Fairness</th>
                <th>Policy Trigger</th>
                <th>Status</th>
                <th>Decision</th>
              </tr>
            </thead>

            <tbody>
              {rankedRisks.map((r) => (
                <tr key={r.department} onClick={() => setSelected(r)} className="audit-row">
                  <td>{r.department}</td>
                  <td>
                    <div className="metric-bar-bg">
                      <div className="metric-bar" style={{ width: `${pct(r.riskScore)}%` }} />
                    </div>
                    {pct(r.riskScore)}%
                  </td>
                  <td>{pct(r.fairness)}%</td>
                  <td>{r.policy}</td>
                  <td><span className={`risk-badge risk-${r.status.toLowerCase()}`}>{r.status}</span></td>
                  <td>{decision(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          {selected ? (
            <>
              <h3>{selected.department} Risk Analysis</h3>

              <div className="metric-grid">
                <div><label>Risk Score</label><strong>{pct(selected.riskScore)}%</strong></div>
                <div><label>Fairness</label><strong>{pct(selected.fairness)}%</strong></div>
                <div><label>Policy Trigger</label><strong>{selected.policy}</strong></div>
                <div><label>Decision</label><strong>{decision(selected)}</strong></div>
              </div>

              <p className="audit-explanation">
                INVISOR detected governance pressure caused by risk exposure, fairness imbalance
                and policy trigger status. Recommended action:{" "}
                {decision(selected) === "Escalate"
                  ? "escalate to governance board."
                  : decision(selected) === "Review"
                  ? "review risk controls and monitor trend."
                  : "maintain routine monitoring."}
              </p>
            </>
          ) : (
            <p>Select a department to analyse governance risk exposure.</p>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Risk Ranking</h3>

        <table className="audit-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Department</th>
              <th>Risk</th>
              <th>Fairness</th>
              <th>Decision</th>
            </tr>
          </thead>

          <tbody>
            {rankedRisks.map((r, index) => (
              <tr key={r.department} onClick={() => setSelected(r)}>
                <td>#{index + 1}</td>
                <td>{r.department}</td>
                <td>{pct(r.riskScore)}%</td>
                <td>{pct(r.fairness)}%</td>
                <td>{decision(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Governance Risk Heatmap</h3>

        <div className="heatmap-grid">
          {rankedRisks.map((r) => (
            <div key={r.department} className={`heatmap-cell risk-${r.status.toLowerCase()}`} onClick={() => setSelected(r)}>
              <div className="heatmap-label">{r.department}</div>
              <div className="heatmap-overlay">
                <div>Risk: {pct(r.riskScore)}%</div>
                <div>Fairness: {pct(r.fairness)}%</div>
                <div>Status: {r.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Recommended Governance Actions</h2>
        <ul>
          <li>Escalate departments with risk score above 75%.</li>
          <li>Apply fairness controls where allocation imbalance is detected.</li>
          <li>Maintain transparent audit trails for all risk-based decisions.</li>
          <li>Monitor departments with policy triggers and medium risk exposure.</li>
        </ul>
      </div>
    </div>
  );
}
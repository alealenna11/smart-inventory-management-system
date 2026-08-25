import React, { useMemo, useState } from "react";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

export default function FairnessMonitoring() {
  const fairnessData = [
    { department: "Finance", score: 0.78, trend: "+2%", status: "Balanced", demand: 72, allocation: 74 },
    { department: "Risk", score: 0.63, trend: "-3%", status: "Attention", demand: 68, allocation: 58 },
    { department: "Operations", score: 0.58, trend: "-6%", status: "High Risk", demand: 82, allocation: 55 },
    { department: "Compliance", score: 0.61, trend: "-2%", status: "Attention", demand: 70, allocation: 60 },
  ];

  const [selected, setSelected] = useState(null);

  const avg = useMemo(() => {
    return (
      fairnessData.reduce((sum, item) => sum + item.score, 0) /
      fairnessData.length
    ).toFixed(2);
  }, []);

  const avgPercent = clamp(Number(avg) * 100);

  const lowestFairness = [...fairnessData].sort((a, b) => a.score - b.score)[0];
  const highRiskUnits = fairnessData.filter((d) => d.score < 0.6).length;
  const attentionUnits = fairnessData.filter((d) => d.score >= 0.6 && d.score < 0.75).length;

  const forecastScore = clamp(avgPercent + (highRiskUnits > 0 ? -3 : 4));
  const forecastTrend =
    forecastScore > avgPercent ? "Improving" : forecastScore < avgPercent ? "Declining" : "Stable";

  function fairnessLevel() {
    if (avg >= 0.75) return "Fair Allocation";
    if (avg >= 0.6) return "Moderate Imbalance";
    return "High Bias Risk";
  }

  function getDecision(d) {
    if (d.score < 0.6) return "Escalate";
    if (d.score < 0.75) return "Review";
    return "Monitor";
  }

  return (
    <div className="fairness-container">
      <h1>Fairness Monitoring</h1>

      <p className="subtitle">
        Monitor allocation equity across organisational departments using INVISOR fairness metrics.
      </p>

      <div className="fairness-card executive">
        <h3>AI Fairness Assessment</h3>
        <p>
          INVISOR analysed allocation fairness across <b>{fairnessData.length}</b>{" "}
          departments. Lowest fairness was detected in{" "}
          <b>{lowestFairness.department}</b> with a score of{" "}
          <b>{(lowestFairness.score * 100).toFixed(0)}%</b>. Recommended decision:
          <b> {getDecision(lowestFairness)}</b>.
        </p>
      </div>

      <div className="fairness-overview">
        <div className="fairness-card">
          <h3>Overall Fairness Score</h3>
          <div className="score-circle">{avg}</div>
          <p className="fairness-level">{fairnessLevel()}</p>
        </div>

        <div className="fairness-card">
          <h3>Predictive Fairness Forecast</h3>
          <p>
            <b>Current Fairness:</b> {avgPercent}% <br />
            <b>30-Day Forecast:</b> {forecastScore}% <br />
            <b>Projected Trend:</b> {forecastTrend} <br />
            <b>High-Risk Units:</b> {highRiskUnits}
          </p>
        </div>
      </div>

      <div className="fairness-card">
        <h3>Department Fairness Distribution</h3>

        {fairnessData.map((d) => (
          <div key={d.department} className="metric-row" onClick={() => setSelected(d)}>
            <span>{d.department}</span>
            <div className="metric-bar-bg">
              <div className="metric-bar fairness-bar" style={{ width: `${d.score * 100}%` }} />
            </div>
            <span>{(d.score * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>

      <div className="fairness-card">
        <h3>Fairness Heatmap</h3>

        <div className="heatmap-grid">
          {fairnessData.map((d) => (
            <div key={d.department} className="heatmap-box" onClick={() => setSelected(d)}>
              <h4>{d.department}</h4>
              <h2>{(d.score * 100).toFixed(0)}%</h2>
              <p>{getDecision(d)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="fairness-layout">
        <div className="fairness-card">
          <h3>Fairness Analysis</h3>

          <table className="audit-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Fairness</th>
                <th>Demand</th>
                <th>Allocation</th>
                <th>Trend</th>
                <th>Decision</th>
              </tr>
            </thead>

            <tbody>
              {fairnessData.map((d) => (
                <tr key={d.department} onClick={() => setSelected(d)} className="audit-row">
                  <td>{d.department}</td>
                  <td>{(d.score * 100).toFixed(0)}%</td>
                  <td>{d.demand}%</td>
                  <td>{d.allocation}%</td>
                  <td>{d.trend}</td>
                  <td>{getDecision(d)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="fairness-card">
          {selected ? (
            <>
              <h3>{selected.department} Fairness Decision</h3>

              <div className="metric-grid">
                <div><label>Fairness Score</label><strong>{(selected.score * 100).toFixed(0)}%</strong></div>
                <div><label>Demand</label><strong>{selected.demand}%</strong></div>
                <div><label>Allocation</label><strong>{selected.allocation}%</strong></div>
                <div><label>Decision</label><strong>{getDecision(selected)}</strong></div>
              </div>

              <p>
                INVISOR detected allocation imbalance between demand and actual allocation.
                Recommendation:{" "}
                {getDecision(selected) === "Escalate"
                  ? "Escalate for fairness rebalancing review."
                  : getDecision(selected) === "Review"
                  ? "Review allocation distribution and monitor trend."
                  : "Maintain current allocation posture."}
              </p>
            </>
          ) : (
            <p>Select a department to analyse fairness risk.</p>
          )}
        </div>
      </div>

      <div className="fairness-card">
        <h3>Fairness Governance Recommendations</h3>
        <ul>
          <li>Rebalance resource allocation for departments below 60% fairness.</li>
          <li>Apply fairness threshold enforcement during allocation decisions.</li>
          <li>Monitor departments with negative fairness trends.</li>
          <li>Maintain explainable allocation logs for audit transparency.</li>
          <li>Escalate repeated fairness imbalance to governance board.</li>
        </ul>
      </div>
    </div>
  );
}
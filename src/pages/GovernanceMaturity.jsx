import React, { useMemo, useState } from "react";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

export default function GovernanceMaturity() {
  const [selected, setSelected] = useState(null);

  const metrics = [
    { label: "Policy Compliance", score: 4.6, target: 5.0, priority: "Medium" },
    { label: "Audit Traceability", score: 4.8, target: 5.0, priority: "Low" },
    { label: "Risk Governance", score: 4.3, target: 5.0, priority: "High" },
    { label: "Allocation Transparency", score: 4.7, target: 5.0, priority: "Medium" },
  ];

  const avg = useMemo(
    () => (metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length).toFixed(2),
    []
  );

  const maturityPercent = clamp((Number(avg) / 5) * 100);
  const highPriority = metrics.filter((m) => m.priority === "High").length;
  const maturityLevel =
    avg >= 4.5 ? "Optimised Governance" : avg >= 3.5 ? "Managed Governance" : avg >= 2.5 ? "Developing Governance" : "Initial Governance";

  const forecastScore = Math.min(5, (Number(avg) + (highPriority === 0 ? 0.2 : 0.1))).toFixed(2);

  const lowestDimension = [...metrics].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="maturity-container">
      <h1>Governance Maturity Assessment</h1>

      <p className="subtitle">
        Evaluate enterprise governance readiness across policy, audit, risk, allocation transparency and decision explainability.
      </p>

      <div className="maturity-card">
        <h3>Maturity Assessment Story</h3>
        <p>
          INVISOR assessed <b>{metrics.length}</b> governance dimensions. Overall maturity is{" "}
          <b>{avg}/5.0</b>, classified as <b>{maturityLevel}</b>. The key improvement area is{" "}
          <b>{lowestDimension.label}</b>, with a current score of <b>{lowestDimension.score}</b>.
        </p>
      </div>

      <div className="maturity-overview">
        <div className="maturity-card score-card">
          <h3>Overall Governance Score</h3>
          <div className="score-circle">{avg}</div>
          <span className="score-label">{maturityLevel}</span>
          <p className="maturity-insight">
            Forecast maturity score after planned improvements: <b>{forecastScore}/5.0</b>.
          </p>
        </div>

        <div className="maturity-card">
          <h3>Governance Dimensions</h3>

          {metrics.map((m) => (
            <div key={m.label} className="metric-row" onClick={() => setSelected(m)}>
              <span>{m.label}</span>
              <div className="metric-bar-bg">
                <div className="metric-bar" style={{ width: `${m.score * 20}%` }} />
              </div>
              <span>{m.score}</span>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="maturity-card">
          <h3>{selected.label} Decision Explanation</h3>
          <p>
            <b>Current Score:</b> {selected.score}/5.0 <br />
            <b>Target:</b> {selected.target}/5.0 <br />
            <b>Gap:</b> {(selected.target - selected.score).toFixed(1)} <br />
            <b>Priority:</b> {selected.priority} <br />
            <b>Recommendation:</b>{" "}
            {selected.priority === "High"
              ? "Prioritise this dimension in the next governance improvement cycle."
              : "Maintain controls and continue periodic monitoring."}
          </p>
        </div>
      )}

      <div className="dimension-grid">
        {metrics.map((m) => (
          <div key={m.label} className="dimension-card" onClick={() => setSelected(m)}>
            <h4>{m.label}</h4>
            <div className="dimension-score">{m.score}</div>
            <p className={`priority priority-${m.priority.toLowerCase()}`}>
              Priority: {m.priority}
            </p>
          </div>
        ))}
      </div>

      <div className="maturity-card">
        <h3>Governance Maturity Matrix</h3>

        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Current</th>
              <th>Target</th>
              <th>Gap</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {metrics.map((m) => (
              <tr key={m.label} onClick={() => setSelected(m)}>
                <td>{m.label}</td>
                <td>{m.score}</td>
                <td>{m.target}</td>
                <td>{(m.target - m.score).toFixed(1)}</td>
                <td>{m.priority}</td>
                <td>{m.priority === "High" ? "Improve Immediately" : "Monitor"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="maturity-card">
        <h3>Governance Improvement Roadmap</h3>

        <div className="action-list">
          {[
            ["Policy Automation", "Implement automated policy validation during governance decisions."],
            ["Real-Time Audit Logging", "Record all governance decisions and user actions in real time."],
            ["Fairness Monitoring", "Detect and prevent bias in resource allocation."],
            ["Explainable Decision Logs", "Ensure all AI recommendations remain transparent and regulator-ready."],
          ].map(([title, desc]) => (
            <div className="action-card" key={title}>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
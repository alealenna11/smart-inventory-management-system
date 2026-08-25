import React, { useMemo, useState } from "react";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

export default function GovernanceCommandCenter() {
  const alerts = [
    {
      type: "Fairness Imbalance",
      department: "Operations",
      severity: "High",
      message: "Resource imbalance detected",
      impact: "Allocation fairness and operational continuity",
      action: "Escalate fairness rebalancing review",
    },
    {
      type: "Policy Trigger",
      department: "Finance",
      severity: "Medium",
      message: "SLA escalation triggered",
      impact: "Approval delay and policy exception risk",
      action: "Review SLA priority routing",
    },
    {
      type: "Risk Exposure",
      department: "Risk",
      severity: "Medium",
      message: "Threshold nearing",
      impact: "Risk exposure may exceed governance threshold",
      action: "Monitor risk trend and prepare mitigation",
    },
  ];

  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [simulation, setSimulation] = useState(60);

  const highAlerts = alerts.filter((a) => a.severity === "High").length;
  const mediumAlerts = alerts.filter((a) => a.severity === "Medium").length;

  const governanceHealth = clamp(100 - simulation * 0.25 - highAlerts * 6);
  const fairnessScore = clamp(82 - highAlerts * 8 - mediumAlerts * 3);
  const forecastRisk = clamp(Number(simulation) + highAlerts * 8 + mediumAlerts * 4);

  const commandDecision =
    forecastRisk >= 80
      ? "Escalate"
      : forecastRisk >= 60
      ? "Review"
      : "Monitor";

  const recommendation =
    commandDecision === "Escalate"
      ? "Escalate active high-risk governance alerts to executive review."
      : commandDecision === "Review"
      ? "Review medium-risk alerts and monitor forecasted risk increase."
      : "Maintain current monitoring posture.";

  const trendData = useMemo(() => {
    return [
      { label: "T1", health: governanceHealth - 6, risk: simulation - 8 },
      { label: "T2", health: governanceHealth - 4, risk: simulation - 5 },
      { label: "T3", health: governanceHealth - 2, risk: simulation - 2 },
      { label: "T4", health: governanceHealth, risk: simulation },
      { label: "T5", health: governanceHealth - 1, risk: forecastRisk - 2 },
      { label: "T6", health: governanceHealth - 3, risk: forecastRisk },
    ].map((x) => ({
      ...x,
      health: clamp(x.health),
      risk: clamp(x.risk),
    }));
  }, [governanceHealth, simulation, forecastRisk]);

  return (
    <div className="command-container">
      <div className="ai-hero premium">
        <div className="ai-hero-title">AI Governance Brain</div>
        <p>
          INVISOR detected {alerts.length} active governance alert(s). Forecasted
          risk is {forecastRisk}%. Recommended decision: {commandDecision}.
        </p>
        <div className="ai-confidence">Confidence: {governanceHealth}%</div>
      </div>

      <div className="card premium">
        <h3>Enterprise Situation Report</h3>
        <p>
          INVISOR identified <b>{alerts.length}</b> active governance alerts.
          <b> {highAlerts}</b> require executive escalation. Forecast risk is{" "}
          <b>{forecastRisk}%</b>. Recommended action: <b>{recommendation}</b>
        </p>
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <label>Governance Health</label>
          <div className="circle health" style={{ "--value": governanceHealth }}>
            <span>{governanceHealth}%</span>
          </div>
        </div>

        <div className="kpi-card">
          <label>Fairness Score</label>
          <div className="circle fairness" style={{ "--value": fairnessScore }}>
            <span>{fairnessScore}%</span>
          </div>
        </div>

        <div className="kpi-card">
          <label>Risk Exposure</label>
          <div className="circle risk" style={{ "--value": simulation }}>
            <span>{simulation}%</span>
          </div>
        </div>
      </div>

      <div className="card premium">
        <h3>Governance Trend</h3>

        <svg width="100%" height="260" viewBox="0 0 720 260">
          {trendData.map((d, i) => {
            const x = 50 + i * 120;
            const healthY = 220 - d.health * 1.6;
            const riskY = 220 - d.risk * 1.6;

            return (
              <g key={d.label}>
                <circle cx={x} cy={healthY} r="6" fill="#38bdf8" />
                <circle cx={x} cy={riskY} r="6" fill="#f97316" />
                <text x={x - 8} y="245" fill="#94a3b8" fontSize="11">
                  {d.label}
                </text>
              </g>
            );
          })}

          <polyline
            points={trendData
              .map((d, i) => `${50 + i * 120},${220 - d.health * 1.6}`)
              .join(" ")}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
          />

          <polyline
            points={trendData
              .map((d, i) => `${50 + i * 120},${220 - d.risk * 1.6}`)
              .join(" ")}
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
          />
        </svg>

        <div className="simulation-value">
          Blue = Governance Health | Orange = Risk Exposure
        </div>
      </div>

      <div className="card premium">
        <h3>Live Risk Simulation</h3>

        <input
          type="range"
          min="20"
          max="100"
          value={simulation}
          onChange={(e) => setSimulation(Number(e.target.value))}
          className="slider"
        />

        <div className="simulation-value">
          Current Risk Exposure: {simulation}% | 30-Day Forecast: {forecastRisk}% |
          Decision: {commandDecision}
        </div>
      </div>

      <div className="card premium">
        <h3>Governance Alerts</h3>

        <table className="audit-table">
          <thead>
            <tr>
              <th>Alert</th>
              <th>Department</th>
              <th>Severity</th>
              <th>Recommended Action</th>
            </tr>
          </thead>

          <tbody>
            {alerts.map((a, i) => (
              <tr
                key={i}
                className="audit-row"
                onClick={() => {
                  setSelected(a);
                  setShowModal(true);
                }}
              >
                <td>{a.type}</td>
                <td>{a.department}</td>
                <td>
                  <span className={`badge ${a.severity.toLowerCase()}`}>
                    {a.severity}
                  </span>
                </td>
                <td>{a.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selected && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{selected.type}</h2>

            <div className="ai-panel">
              <div className="ai-title">AI Decision Explanation</div>
              <p>
                This alert is driven by governance pressure in{" "}
                <b>{selected.department}</b>. INVISOR assessed severity, impact,
                forecast risk and recommended action before routing the issue.
              </p>
            </div>

            <p><b>Message:</b> {selected.message}</p>
            <p><b>Impact:</b> {selected.impact}</p>
            <p><b>Recommended Action:</b> {selected.action}</p>

            <div className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React from "react";
import "./AdminExecDashboard.css";

export default function EnterpriseStatistics() {
  const stats = [
    { label: "Open Risks", value: 12, note: "4 high priority" },
    { label: "Closed Actions", value: 48, note: "This month" },
    { label: "Control Breaches", value: 4, note: "Requires review" },
    { label: "Audit Items", value: 19, note: "Evidence tracked" },
  ];

  return (
    <section className="exec-card">
      <div className="exec-section-head">
        <div>
          <h2>Enterprise Statistics</h2>
          <p>Real-time governance indicators across enterprise operations.</p>
        </div>
        <span>Statistics</span>
      </div>

      <div className="exec-stat-grid">
        {stats.map((item) => (
          <div className="exec-stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <p>{item.label}</p>
            <span>{item.note}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
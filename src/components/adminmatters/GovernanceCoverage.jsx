import React from "react";
import "./AdminExecDashboard.css";

export default function GovernanceCoverage() {
  const coverage = [
    ["Access Governance", 96],
    ["Audit Evidence", 91],
    ["SLA Monitoring", 84],
    ["Budget Controls", 88],
    ["Risk Tracking", 93],
  ];

  return (
    <section className="exec-card">
      <div className="exec-section-head">
        <div>
          <h2>Governance Coverage</h2>
          <p>Coverage strength across key enterprise governance domains.</p>
        </div>
        <span>Control Coverage</span>
      </div>

      <div className="exec-coverage-list">
        {coverage.map(([label, value]) => (
          <div className="exec-coverage-item" key={label}>
            <div>
              <strong>{label}</strong>
              <span>{value}%</span>
            </div>
            <div className="exec-coverage-bar">
              <i style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
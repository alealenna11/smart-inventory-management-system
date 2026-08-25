import React from "react";
import "./AdminExecDashboard.css";

export default function DepartmentLeaderboard() {
  const departments = [
    ["SGAD-RDT", 94],
    ["SGAD-FCD", 89],
    ["GTBD Client Service", 87],
    ["SGAD-TRS", 81],
    ["SGAD-OPC", 68],
  ];

  return (
    <section className="exec-card">
      <div className="exec-section-head">
        <div>
          <h2>Department Leaderboard</h2>
          <p>Ranking of departments by governance maturity score.</p>
        </div>
        <span>Benchmark</span>
      </div>

      <div className="exec-leaderboard">
        {departments.map(([name, score], index) => (
          <div className="exec-leaderboard-item" key={name}>
            <span>#{index + 1}</span>
            <strong>{name}</strong>
            <p>{score}%</p>
          </div>
        ))}
      </div>
    </section>
  );
}
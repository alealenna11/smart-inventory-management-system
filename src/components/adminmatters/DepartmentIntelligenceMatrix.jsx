import React from "react";
import "./AdminExecDashboard.css";

export default function DepartmentIntelligenceMatrix() {
  const departments = [
    {
      name: "SGAD-RDT",
      score: 94,
      risk: "Low",
      readiness: 96,
      sla: "On Track",
      budget: "Healthy",
    },
    {
      name: "SGAD-TRS",
      score: 81,
      risk: "Medium",
      readiness: 84,
      sla: "Watch",
      budget: "Near Threshold",
    },
    {
      name: "SGAD-OPC",
      score: 68,
      risk: "High",
      readiness: 72,
      sla: "Breached",
      budget: "Controlled",
    },
    {
      name: "GTBD Client Service",
      score: 87,
      risk: "Medium",
      readiness: 90,
      sla: "On Track",
      budget: "Healthy",
    },
    {
      name: "SGAD-FCD",
      score: 89,
      risk: "Low",
      readiness: 91,
      sla: "On Track",
      budget: "Healthy",
    },
        {
      name: "SGAD-CPC",
      score: 39,
      risk: "High",
      readiness: 52,
      sla: "Breached",
      budget: "Controlled",
    },
     {
      name: "SGAD-CBS",
      score: 99,
      risk: "Low",
      readiness: 91,
      sla: "On Track",
      budget: "Healthy",
    },
      {
      name: "SGAD-LOA",
      score: 74,
      risk: "Medium",
      readiness: 83,
      sla: "Watch",
      budget: "Near Threshold",
    },
  ];

  return (
    <section className="exec-card">
      <div className="exec-section-head">
        <div>
          <h2>Department Intelligence Matrix</h2>
          <p>Cross-department view of governance maturity, readiness, SLA, and risk posture.</p>
        </div>
        <span>Comparative Intelligence</span>
      </div>

      <div className="exec-table-wrap">
        <table className="exec-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Governance Score</th>
              <th>Risk</th>
              <th>Readiness</th>
              <th>SLA Status</th>
              <th>Budget Status</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.name}>
                <td>
                  <strong>{dept.name}</strong>
                </td>
                <td>
                  <div className="exec-progress-cell">
                    <span>{dept.score}%</span>
                    <div>
                      <i style={{ width: `${dept.score}%` }} />
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`exec-risk-pill ${dept.risk.toLowerCase()}`}>
                    {dept.risk}
                  </span>
                </td>
                <td>{dept.readiness}%</td>
                <td>{dept.sla}</td>
                <td>{dept.budget}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
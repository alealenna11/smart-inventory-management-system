import React from "react";
import "./AdminExecDashboard.css";

export default function DepartmentLeaderboard() {
  const departments = [
    {
      rank: 1,
      department: "SGAD-RDT",
      score: 96,
      maturity: "Optimised",
      risk: "Low",
      trend: "+4%",
    },
    {
      rank: 2,
      department: "SGAD-FCD",
      score: 93,
      maturity: "Optimised",
      risk: "Low",
      trend: "+3%",
    },
    {
      rank: 3,
      department: "GTBD Client Service",
      score: 90,
      maturity: "Managed",
      risk: "Low",
      trend: "+2%",
    },
    {
      rank: 4,
      department: "SGAD-TRS",
      score: 84,
      maturity: "Managed",
      risk: "Medium",
      trend: "+1%",
    },
    {
      rank: 5,
      department: "SGAD-OPC",
      score: 71,
      maturity: "Developing",
      risk: "High",
      trend: "-6%",
    },
  ];

  return (
    <section className="exec-card">
      <div className="exec-section-head">
        <div>
          <h2>Department Leaderboard</h2>
          <p>
            Enterprise ranking based on governance maturity, operational
            performance, compliance, and overall governance health.
          </p>
        </div>

        <span>Enterprise Benchmark</span>
      </div>

      <div className="leaderboard-table">

        <div className="leaderboard-header">
          <span>Rank</span>
          <span>Department</span>
          <span>Governance</span>
          <span>Maturity</span>
          <span>Risk</span>
          <span>Trend</span>
        </div>

        {departments.map((dept) => (
          <div className="leaderboard-row" key={dept.department}>

            <div className="leader-rank">
              #{dept.rank}
            </div>

            <div className="leader-department">
              <strong>{dept.department}</strong>
            </div>

            <div className="leader-score">

              <div className="score-bar">

                <div
                  className="score-fill"
                  style={{ width: `${dept.score}%` }}
                />

              </div>

              <span>{dept.score}%</span>

            </div>

            <div>

              <span className="leader-pill maturity">
                {dept.maturity}
              </span>

            </div>

            <div>

              <span
                className={`leader-pill ${dept.risk.toLowerCase()}`}
              >
                {dept.risk}
              </span>

            </div>

            <div className={dept.trend.startsWith("-") ? "negative" : "positive"}>
              {dept.trend}
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}
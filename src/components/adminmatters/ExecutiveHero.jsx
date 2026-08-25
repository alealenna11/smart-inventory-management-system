import React from "react";
import "./AdminExecutiveComponents.css";

export default function ExecutiveHero({
  userName = "Alenna",
  lastUpdated = "Live",
  governanceScore = 92,
  riskLevel = "Moderate",
  readiness = 88,
  activeDepartments = 13,
}) {
  return (
    <section className="exec-hero">
      <div className="exec-hero-left">
        <span className="exec-live-pill">
          <span className="exec-live-dot" />
          Enterprise Governance Live
        </span>

        <h1>Enterprise Governance Intelligence Centre</h1>

        <p>
          Executive command dashboard for governance maturity, operational
          readiness, department performance, control exposure, and decision
          intelligence.
        </p>

        <div className="exec-hero-meta">
          <span>Welcome, {userName}</span>
          <span>Updated: {lastUpdated}</span>
          <span>{activeDepartments} Departments Monitored</span>
        </div>

        <div className="exec-hero-actions">
          <button>Generate Executive Report</button>
          <button className="secondary">Review Risk Register</button>
        </div>
      </div>

      <div className="exec-hero-right">
        <div className="exec-score-ring">
          <span>{governanceScore}%</span>
          <p>Governance Health</p>
        </div>

        <div className="exec-hero-kpis">
          <div>
            <strong>{riskLevel}</strong>
            <p>Risk Exposure</p>
          </div>
          <div>
            <strong>{readiness}%</strong>
            <p>Readiness</p>
          </div>
          <div>
            <strong>4</strong>
            <p>Active Escalations</p>
          </div>
          <div>
            <strong>97%</strong>
            <p>Control Coverage</p>
          </div>
        </div>
      </div>
    </section>
  );
}
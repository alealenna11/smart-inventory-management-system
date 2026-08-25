import React from "react";
import "./AdminExecDashboard.css";

export default function ExecutiveDecisionCentre() {
  const decisions = [
    {
      title: "Approve SGAD-OPC remediation plan",
      impact: "High",
      due: "Today",
      reason: "Required to address repeated SLA breach and prevent further control exposure.",
    },
    {
      title: "Review SGAD-TRS budget exception",
      impact: "Medium",
      due: "2 Days",
      reason: "Budget utilisation is nearing the approved governance threshold.",
    },
    {
      title: "Confirm enterprise readiness checkpoint",
      impact: "High",
      due: "Today",
      reason: "Final confirmation required before readiness closure reporting.",
    },
  ];

  return (
    <section className="exec-card">
      <div className="exec-section-head">
        <div>
          <h2>Executive Decision Centre</h2>
          <p>Prioritised decisions requiring leadership review or approval.</p>
        </div>
        <span>Decision Queue</span>
      </div>

      <div className="exec-decision-list">
        {decisions.map((decision) => (
          <article className="exec-decision-card" key={decision.title}>
            <div>
              <h3>{decision.title}</h3>
              <p>{decision.reason}</p>
            </div>

            <div className="exec-decision-meta">
              <span>Impact: {decision.impact}</span>
              <span>Due: {decision.due}</span>
            </div>

            <button type="button">Review</button>
          </article>
        ))}
      </div>
    </section>
  );
}
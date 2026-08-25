import React from "react";
import "./AdminExecDashboard.css";

export default function ExecutiveAIInsights() {
  const insights = [
    {
      title: "SLA Risk Prediction",
      text: "SGAD-OPC shows the highest likelihood of further SLA deterioration.",
    },
    {
      title: "Budget Pressure",
      text: "SGAD-TRS budget utilisation is trending close to governance threshold.",
    },
    {
      title: "Maturity Strength",
      text: "SGAD-RDT and SGAD-FCD remain the strongest governance performers.",
    },
  ];

  return (
    <section className="exec-card">
      <div className="exec-section-head">
        <div>
          <h2>Executive AI Insights</h2>
          <p>Explainable intelligence to support governance decisions.</p>
        </div>
        <span>AI Insights</span>
      </div>

      <div className="exec-insight-grid">
        {insights.map((insight) => (
          <article className="exec-insight-card" key={insight.title}>
            <strong>{insight.title}</strong>
            <p>{insight.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
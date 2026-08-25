import React from "react";
import "./AdminExecutiveComponents.css";

export default function ExecutiveSummary() {
  const items = [
    {
      title: "Governance Health",
      value: "92%",
      trend: "+4%",
      text: "Enterprise governance remains strong with stable maturity across most departments.",
    },
    {
      title: "Operational Readiness",
      value: "88%",
      trend: "+6%",
      text: "Readiness indicators improved after closure of key testing and evidence gaps.",
    },
    {
      title: "Control Exposure",
      value: "4",
      trend: "-2",
      text: "Open control breaches reduced, but SGAD-OPC still requires executive attention.",
    },
  ];

  return (
    <section className="exec-card">
      <div className="exec-section-head">
        <div>
          <h2>Executive Summary</h2>
          <p>High-level governance view for leadership decision-making.</p>
        </div>
        <span>Board View</span>
      </div>

      <div className="exec-summary-grid">
        {items.map((item) => (
          <article className="exec-summary-card" key={item.title}>
            <div>
              <h3>{item.title}</h3>
              <span>{item.trend}</span>
            </div>
            <strong>{item.value}</strong>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
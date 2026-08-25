import React from "react";
import "./AdminExecDashboard.css";

export default function EnterpriseQuickActions() {
  const actions = [
    {
      title: "Generate Executive Report",
      description: "Create a consolidated governance report for leadership review.",
      tag: "Reporting",
    },
    {
      title: "Review Risk Register",
      description: "Open enterprise risks requiring management attention.",
      tag: "Risk",
    },
    {
      title: "Approve Exception",
      description: "Review pending control or budget exception requests.",
      tag: "Approval",
    },
    {
      title: "View Department Benchmark",
      description: "Compare governance maturity across departments.",
      tag: "Benchmark",
    },
  ];

  return (
    <section className="exec-card">
      <div className="exec-section-head">
        <div>
          <h2>Enterprise Quick Actions</h2>
          <p>Frequently used executive governance workflows.</p>
        </div>
        <span>Action Hub</span>
      </div>

      <div className="exec-action-grid">
        {actions.map((action) => (
          <button className="exec-action-card" type="button" key={action.title}>
            <span>{action.tag}</span>
            <strong>{action.title}</strong>
            <p>{action.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
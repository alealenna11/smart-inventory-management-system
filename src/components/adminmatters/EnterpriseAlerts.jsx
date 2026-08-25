import React from "react";
import "./AdminExecutiveComponents.css";

export default function EnterpriseAlerts() {
  const alerts = [
    {
      severity: "Critical",
      department: "SGAD-OPC",
      message: "Repeated SLA breaches detected across operational workflow controls.",
      owner: "Operations Lead",
    },
    {
      severity: "High",
      department: "SGAD-TRS",
      message: "Budget utilisation is approaching approved governance threshold.",
      owner: "Technology Refresh Lead",
    },
    {
      severity: "Medium",
      department: "GTBD Client Service",
      message: "Audit evidence pending final confirmation before readiness closure.",
      owner: "Department Coordinator",
    },
  ];

  return (
    <section className="exec-card">
      <div className="exec-section-head">
        <div>
          <h2>Enterprise Alerts</h2>
          <p>Prioritised control, SLA, and readiness exceptions.</p>
        </div>
        <span>Live Signals</span>
      </div>

      <div className="exec-alert-list">
        {alerts.map((alert) => (
          <article
            className={`exec-alert ${alert.severity.toLowerCase()}`}
            key={alert.message}
          >
            <div>
              <strong>{alert.severity}</strong>
              <h3>{alert.department}</h3>
            </div>
            <p>{alert.message}</p>
            <span>Owner: {alert.owner}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
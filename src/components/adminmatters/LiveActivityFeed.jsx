import React from "react";
import "./AdminExecDashboard.css";

export default function LiveActivityFeed() {
  const activities = [
    "SGAD-RDT submitted readiness evidence.",
    "SGAD-OPC risk rating updated to High.",
    "GTBD Client Service completed audit confirmation.",
    "SGAD-TRS budget threshold alert triggered.",
  ];

  return (
    <section className="exec-card">
      <div className="exec-section-head">
        <div>
          <h2>Live Activity Feed</h2>
          <p>Latest governance updates and operational movements.</p>
        </div>
        <span>Live Feed</span>
      </div>

      <div className="exec-feed">
        {activities.map((activity) => (
          <div className="exec-feed-item" key={activity}>
            <span />
            <p>{activity}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
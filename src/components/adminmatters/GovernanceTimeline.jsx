import React from "react";
import "./AdminExecDashboard.css";

export default function GovernanceTimeline() {
  const events = [
    ["09:00", "Daily readiness checkpoint completed"],
    ["10:30", "Control exception reviewed"],
    ["13:00", "Executive risk summary generated"],
    ["15:45", "Department benchmark refreshed"],
  ];

  return (
    <section className="exec-card">
      <div className="exec-section-head">
        <div>
          <h2>Governance Timeline</h2>
          <p>Chronological view of key governance activities.</p>
        </div>
        <span>Today</span>
      </div>

      <div className="exec-timeline">
        {events.map(([time, event]) => (
          <div className="exec-timeline-item" key={time}>
            <strong>{time}</strong>
            <p>{event}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
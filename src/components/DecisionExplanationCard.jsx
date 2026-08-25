export default function DecisionExplanationCard({
  decision,
  score,
  reasons
}) {

  return (
    <div className="admin-card">

      <h3>
        Governance Explainability Engine
      </h3>

      <div className="summary-item">
        <span>Decision Outcome</span>
        <b>{decision}</b>
      </div>

      <div className="summary-item">
        <span>Governance Score</span>
        <b>{score}/100</b>
      </div>

      <div className="admin-insight">

        <strong>
          Decision Rationale
        </strong>

        <ul>

          {reasons.map((reason, index) => (
            <li key={index}>
              {reason}
            </li>
          ))}

        </ul>

      </div>

    </div>
  );
}
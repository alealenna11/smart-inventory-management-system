export default function GovernanceScore(){

  const score = 4.4;

  return(
    <div className="gov-card">

      {/* HEADER */}
      <div className="gov-header">
        📊 Governance Score
      </div>

      {/* BODY */}
      <div className="gov-body">

        {/* LEFT SIDE */}
        <div className="gov-left">

          <div className="gov-score">
            {score}<span>/5</span>
          </div>

          <div className="gov-status good">
            Strong Governance
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="gov-right">

          <div className="gov-metric">
            <span>Allocation Efficiency</span>
            <span>92%</span>
          </div>

          <div className="gov-metric">
            <span>Audit Compliance</span>
            <span>75%</span>
          </div>

          <div className="gov-metric">
            <span>Risk Monitoring</span>
            <span>88%</span>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="gov-footer">
        Minor risk exposure due to allocation imbalance.
      </div>

    </div>
  );
}
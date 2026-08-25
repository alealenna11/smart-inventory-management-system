import { useState, useEffect, useMemo } from "react";

export default function RiskGovernancePanel() {

  const risks = [
    { id:1, name:"Access Control Violation", probability:4, impact:5 },
    { id:2, name:"Asset Allocation Delay", probability:3, impact:3 },
    { id:3, name:"Inventory Shortage", probability:2, impact:4 },
    { id:4, name:"Audit Gap", probability:5, impact:5 },
    { id:5, name:"System Misconfiguration", probability:3, impact:2 }
  ];

  const [hovered,setHovered] = useState(null);
  const [alert,setAlert] = useState(null);

  /* 🔥 NEW: GOVERNANCE SCORE */
  const governanceScore = useMemo(() => {

    const avgImpact =
      risks.reduce((a, b) => a + b.impact, 0) / risks.length;

    const avgProbability =
      risks.reduce((a, b) => a + b.probability, 0) / risks.length;

    return ((avgImpact + avgProbability) / 2).toFixed(2);

  }, []);

  /* 🔥 NEW: CRITICAL COUNT */
  const criticalCount = useMemo(() => {
    return risks.filter(r => r.impact >= 4 && r.probability >= 4).length;
  }, []);

  useEffect(()=>{

    const critical = risks.find(r => r.impact >=5 && r.probability >=4);

    if(critical){
      setAlert(`⚠ Critical governance risk detected: ${critical.name}`);
    }

  },[]);

  return (

    <div className="risk-governance-container">

      <h2 className="section-title">Risk Intelligence Panel</h2>

      {/* 🔥 NEW: GOVERNANCE SUMMARY */}
      <div className="governance-summary">
        <div>
          <h4>Overall Governance Risk Index</h4>
          <h2>{governanceScore} / 5</h2>
        </div>

        <div>
          <h4>Critical Risks</h4>
          <h2>{criticalCount}</h2>
        </div>
      </div>

      {alert && (
        <div className="governance-alert">
          {alert}
        </div>
      )}

      <div className="risk-layout">

        {/* ================= SCATTER ================= */}
        <div className="risk-card">

          <h3>Risk vs Impact</h3>

          <svg viewBox="0 0 220 220" className="risk-chart">

            <line x1="30" y1="190" x2="200" y2="190" stroke="#888"/>
            <line x1="30" y1="30" x2="30" y2="190" stroke="#888"/>

            {risks.map(r=>{

              const x = 30 + r.probability * 30;
              const y = 190 - r.impact * 30;

              return(
                <circle
                  key={r.id}
                  cx={x}
                  cy={y}
                  r="7"
                  className="risk-point"
                  onMouseEnter={()=>setHovered(r)}
                  onMouseLeave={()=>setHovered(null)}
                />
              );
            })}

          </svg>

          {hovered && (
            <div className="tooltip">
              <strong>{hovered.name}</strong><br/>
              Probability: {hovered.probability}<br/>
              Impact: {hovered.impact}
            </div>
          )}

          <p className="axis-label">
            X-axis: Risk Probability | Y-axis: Impact Severity
          </p>

        </div>

        {/* ================= MATRIX ================= */}
        <div className="risk-card">

          <h3>Risk Matrix (5×5)</h3>

          <div className="risk-matrix">

            {[5,4,3,2,1].map(impact => (

              <div key={impact} className="matrix-row">

                {[1,2,3,4,5].map(prob => {

                  const found = risks.find(
                    r => r.impact===impact && r.probability===prob
                  );

                  return(
                    <div
                      key={prob}
                      className={`matrix-cell
                        ${impact>=4 && prob>=4 ? "critical" : ""}
                        ${impact>=3 && prob>=3 ? "medium" : ""}
                      `}
                      onMouseEnter={()=>found && setHovered(found)}
                      onMouseLeave={()=>setHovered(null)}
                    >

                      {found && "●"}

                    </div>
                  );
                })}

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}
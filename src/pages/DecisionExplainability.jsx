import { useMemo, useState } from "react";
import explainDecision from "../services/decisionexplainabilityEngine";
import DecisionJourney from "../components/DecisionJourney";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

function normaliseDecision(rawDecision) {
  const fallback = {
    resource: "Enterprise Governance Resource",
    department: "Enterprise",
    confidence: 82,
    outcome: "Review",
    recommendation: "Review supporting governance evidence before approval.",
    factors: [
      { name: "SLA Urgency", weight: 30 },
      { name: "Fairness Constraint", weight: 25 },
      { name: "Resource Scarcity", weight: 25 },
      { name: "Risk Exposure", weight: 20 },
    ],
  };

  return {
    ...fallback,
    ...rawDecision,
    confidence: clamp(rawDecision?.confidence || fallback.confidence),
    factors:
      rawDecision?.factors?.length > 0 ? rawDecision.factors : fallback.factors,
  };
}

function MiniBarChart({ factors }) {
  return (
    <div style={{ display: "grid", gap: "14px" }}>
      {factors.map((factor, index) => (
        <div key={`${factor.name}-${index}`}>
          <div className="summary-item">
            <span>{factor.name}</span>
            <b>{factor.weight}%</b>
          </div>

          <div className="factor-bar-bg">
            <div
              className="factor-bar"
              style={{ width: `${clamp(factor.weight)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DecisionExplainability() {
  const [decision, setDecision] = useState(() => normaliseDecision(explainDecision()));

  const governanceScore = useMemo(() => {
    const factorAverage =
      decision.factors.reduce((sum, factor) => sum + Number(factor.weight || 0), 0) /
      Math.max(decision.factors.length, 1);

    return clamp(decision.confidence * 0.55 + factorAverage * 0.45);
  }, [decision]);

  const maturityLevel =
    governanceScore >= 90
      ? "Optimised"
      : governanceScore >= 80
      ? "Managed"
      : governanceScore >= 70
      ? "Defined"
      : governanceScore >= 60
      ? "Developing"
      : "Initial";

  const decisionOutcome =
    governanceScore >= 85
      ? "Approve"
      : governanceScore >= 70
      ? "Review"
      : "Escalate";

  const recommendation =
    decisionOutcome === "Approve"
      ? "Proceed with allocation while maintaining audit traceability."
      : decisionOutcome === "Review"
      ? "Review SLA urgency, fairness balance and resource scarcity before approval."
      : "Escalate to governance owner due to low confidence or high-risk decision factors.";

  const topFactor = [...decision.factors].sort(
    (a, b) => Number(b.weight || 0) - Number(a.weight || 0)
  )[0];

  function recompute() {
    setDecision(normaliseDecision(explainDecision()));
  }

  return (
    <div className="page-container">
      <h1 className="page-title">AI Decision Explainability</h1>

      <p className="page-subtitle">
        Transparent governance intelligence layer explaining how decisions are
        evaluated, justified, audited and recommended.
      </p>

      <div className="card highlight-panel">
        <h3>Decision Story</h3>
        <p>
          INVISOR analysed the selected governance decision using confidence,
          SLA urgency, fairness constraints, resource scarcity and risk exposure.
          The recommended outcome is <b>{decisionOutcome}</b> because the overall
          governance score is <b>{governanceScore}/100</b>.
        </p>
      </div>

      <div className="explain-layout">
        <div className="card">
          <h3>Decision Passport</h3>

          <div className="metric-grid">
            <div>
              <label>Resource</label>
              <strong>{decision.resource}</strong>
            </div>

            <div>
              <label>Department</label>
              <strong>{decision.department}</strong>
            </div>

            <div>
              <label>Confidence</label>
              <strong>{decision.confidence}%</strong>
            </div>

            <div>
              <label>Outcome</label>
              <strong>{decisionOutcome}</strong>
            </div>

            <div>
              <label>Maturity</label>
              <strong>{maturityLevel}</strong>
            </div>

            <div>
              <label>Governance Score</label>
              <strong>{governanceScore}/100</strong>
            </div>
          </div>

          <button className="primary-btn" onClick={recompute}>
            Recompute Decision
          </button>
        </div>

        <div className="card">
          <h3>Governance Interpretation</h3>

          <p>
            The strongest decision driver is{" "}
            <b>{topFactor?.name || "Governance Risk"}</b>. INVISOR uses this
            signal to explain whether the decision should be approved, reviewed
            or escalated.
          </p>

          <div className="confidence-bar">
            <div
              style={{ width: `${decision.confidence}%` }}
              className="confidence-fill"
            />
          </div>

          <p>
            <b>Recommendation:</b> {recommendation}
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Decision Factor Contribution</h3>
        <MiniBarChart factors={decision.factors} />
      </div>

      <div className="card">
        <h3>Governance Policy Triggers</h3>

        <ul className="policy-list">
          <li>High SLA urgency triggers escalation review.</li>
          <li>Resource scarcity requires governance approval.</li>
          <li>Fairness constraint prevents department imbalance.</li>
          <li>Low confidence requires manual review before execution.</li>
          <li>All decisions must be explainable and audit traceable.</li>
        </ul>
      </div>

      <div className="card highlight-panel">
        <h3>Explainable Decision Output</h3>

        <p>
          <b>Decision:</b> {decisionOutcome}
          <br />
          <b>Reason:</b> Score {governanceScore}/100, confidence{" "}
          {decision.confidence}%, strongest factor{" "}
          {topFactor?.name || "Governance Risk"}.
          <br />
          <b>Action:</b> {recommendation}
        </p>
      </div>

      <div className="card">
        <h3>Decision Journey</h3>
        <DecisionJourney />
      </div>
    </div>
  );
}
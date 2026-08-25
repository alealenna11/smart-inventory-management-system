import React from "react";

export default function DecisionJourney() {

  const steps = [
    {
      step: "Resource Scarcity Detected",
      description: "GPU demand exceeded governance allocation threshold."
    },
    {
      step: "AI Allocation Recommendation",
      description: "INVISOR recommended allocation to Finance based on weighted demand scoring."
    },
    {
      step: "Explainability Generated",
      description: "Decision reasoning generated for transparency and audit traceability."
    },
    {
      step: "Governance Policy Check",
      description: "Allocation validated against fairness and risk policy thresholds."
    },
    {
      step: "Audit Record Logged",
      description: "Decision stored in governance audit ledger."
    }
  ];

  return (
    <div className="journey-card">

      <h3>Governance Decision Journey</h3>

      <div className="journey-timeline">

        {steps.map((step, index) => (
          <div key={index} className="journey-step">

            <div className="journey-icon"></div>

            <div>
              <strong>{step.step}</strong>
              <p>{step.description}</p>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function ConductRiskMonitoring() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="CONDUCT RISK & ETHICS GOVERNANCE"

      title="Conduct Risk Monitoring"

      subtitle="Governance-driven monitoring of employee conduct, ethical behaviour, policy compliance and organisational culture."

      story={{
        title: "Conduct Risk Governance Story",
        text:
          "INVISOR analysed enterprise conduct risk indicators. Three conduct breaches and five escalations were identified while overall compliance remained at 96%. The recommended executive decision is Monitor."
      }}

      metrics={[
        {
          label: "Conduct Breaches",
          value: "3",
          status: "bad"
        },
        {
          label: "Escalations",
          value: "5",
          status: "warning"
        },
        {
          label: "Compliance Rate",
          value: "96%",
          status: "good"
        },
        {
          label: "Governance Score",
          value: "89%",
          status: "good"
        }
      ]}

      governance={{
        score: "89%",
        maturity: "Optimised",
        risk: "Low",
        decision: "Monitor",
        recommendation:
          "Continue ethics awareness programmes and strengthen conduct monitoring.",
        confidence: "97%"
      }}

      recommendation={{
        summary:
          "Maintain strong ethical culture through continuous awareness and governance oversight.",

        factors: [
          "High compliance rate achieved",
          "Few conduct breaches identified",
          "Escalations remain manageable",
          "Ethics programme performing effectively"
        ],

        outcome:
          "Maintain organisational integrity while minimising conduct-related risks.",

        confidence: "97%"
      }}

      cards={[
        {
          title: "Behaviour Review",
          text:
            "Employee conduct continues to align with enterprise governance and ethical standards."
        },
        {
          title: "Operational Impact",
          text:
            "Minimal governance concerns identified across operational activities."
        },
        {
          title: "Governance Action",
          text:
            "Continue ethics training, awareness campaigns and conduct monitoring."
        }
      ]}
    />
  );
}
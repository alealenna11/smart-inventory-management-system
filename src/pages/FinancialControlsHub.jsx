import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function FinancialControlsHub() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="FINANCIAL CONTROL & ASSURANCE GOVERNANCE"

      title="Financial Controls Hub"

      subtitle="Governance-driven monitoring of financial control effectiveness, reconciliation quality, financial integrity and enterprise control assurance."

      story={{
        title: "Financial Control Governance Story",
        text:
          "INVISOR analysed enterprise financial control activities across core financial operations. Control effectiveness remained at 98% with reconciliation accuracy reaching 96%. Four control breaches were identified and immediately escalated for review. The recommended executive decision is Monitor."
      }}

      metrics={[
        {
          label: "Control Effectiveness",
          value: "98%",
          status: "good"
        },
        {
          label: "Control Breaches",
          value: "4",
          status: "bad"
        },
        {
          label: "Reconciliation Accuracy",
          value: "96%",
          status: "good"
        },
        {
          label: "Governance Score",
          value: "91%",
          status: "good"
        }
      ]}

      governance={{
        score: "91%",
        maturity: "Optimised",
        risk: "Low",
        decision: "Monitor",
        recommendation:
          "Maintain the current financial control framework while continuing periodic validation and reconciliation reviews.",
        confidence: "98%"
      }}

      recommendation={{
        summary:
          "Financial controls remain highly effective with only isolated control exceptions.",

        factors: [
          "98% control effectiveness achieved",
          "96% reconciliation accuracy",
          "Only four control breaches identified",
          "Financial reporting remains reliable"
        ],

        outcome:
          "Maintain financial integrity, minimise operational risk and ensure continued regulatory compliance.",

        confidence: "98%"
      }}

      cards={[
        {
          title: "Control Assessment",
          text:
            "Financial controls continue operating effectively across enterprise processes with minimal exceptions."
        },
        {
          title: "Operational Impact",
          text:
            "No significant impact on financial reporting accuracy or operational continuity."
        },
        {
          title: "Governance Action",
          text:
            "Continue quarterly control testing, reconciliation reviews and control effectiveness validation."
        }
      ]}
    />
  );
}
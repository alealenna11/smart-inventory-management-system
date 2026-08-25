import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function CustomerExperienceGovernance() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="CUSTOMER EXPERIENCE & SERVICE EXCELLENCE"

      title="Customer Experience Governance"

      subtitle="Governance-driven monitoring of customer satisfaction, service quality, engagement performance and enterprise experience excellence."

      story={{
        title: "Customer Experience Governance Story",
        text:
          "INVISOR analysed enterprise customer experience metrics. Customer satisfaction reached 92%, service quality achieved 95% and response timeliness remained above governance targets. The recommended executive decision is Monitor."
      }}

      metrics={[
        {
          label: "Customer Satisfaction",
          value: "92%",
          status: "good"
        },
        {
          label: "Service Quality",
          value: "95%",
          status: "good"
        },
        {
          label: "Response Timeliness",
          value: "91%",
          status: "good"
        },
        {
          label: "Governance Score",
          value: "90%",
          status: "good"
        }
      ]}

      governance={{
        score: "90%",
        maturity: "Optimised",
        risk: "Low",
        decision: "Monitor",
        recommendation:
          "Maintain customer service excellence while continuously enhancing the customer journey.",
        confidence: "98%"
      }}

      recommendation={{
        summary:
          "Current customer experience performance remains excellent with opportunities for continuous improvement.",

        factors: [
          "92% customer satisfaction achieved",
          "95% service quality maintained",
          "Strong response performance",
          "Positive customer engagement trends"
        ],

        outcome:
          "Increase long-term customer loyalty while sustaining enterprise service excellence.",

        confidence: "98%"
      }}

      cards={[
        {
          title: "Customer Insights",
          text:
            "Customer sentiment remains highly positive with consistently strong engagement levels."
        },
        {
          title: "Operational Impact",
          text:
            "High service quality continues to strengthen customer confidence and operational performance."
        },
        {
          title: "Governance Action",
          text:
            "Continue customer journey reviews, feedback analytics and service quality optimisation."
        }
      ]}
    />
  );
}
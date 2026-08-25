import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function ClientExperienceIntelligence() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="CLIENT EXPERIENCE & SATISFACTION GOVERNANCE"

      title="Client Experience Intelligence"

      subtitle="Governance-driven monitoring of client satisfaction, engagement quality, relationship health and service excellence."

      story={{
        title: "Client Experience Governance Story",
        text:
          "INVISOR analysed enterprise client engagement metrics. Client satisfaction reached 94% with low retention risk across the portfolio. Six customer escalations were recorded and the recommended executive decision is Monitor."
      }}

      metrics={[
        {
          label: "Client Satisfaction",
          value: "94%",
          status: "good"
        },
        {
          label: "Retention Risk",
          value: "Low",
          status: "good"
        },
        {
          label: "Escalations",
          value: "6",
          status: "warning"
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
          "Continue relationship engagement strategy while monitoring customer escalations.",
        confidence: "98%"
      }}

      recommendation={{
        summary:
          "Maintain high client satisfaction through proactive engagement and continuous service improvement.",

        factors:[
          "94% client satisfaction achieved",
          "Low client attrition risk",
          "Limited service escalations",
          "Relationship health remains strong"
        ],

        outcome:
          "Increase long-term client loyalty and sustain excellent service performance.",

        confidence:"98%"
      }}

      cards={[
        {
          title:"Client Sentiment",
          text:"Customer satisfaction remains consistently high across all client segments."
        },
        {
          title:"Relationship Health",
          text:"Client retention risk remains low with stable relationship performance."
        },
        {
          title:"Governance Action",
          text:"Continue monitoring client feedback and strengthen engagement initiatives."
        }
      ]}
    />
  );
}
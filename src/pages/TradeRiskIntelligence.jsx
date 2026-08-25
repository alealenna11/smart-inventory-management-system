import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function TradeRiskIntelligence() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="TRADE RISK INTELLIGENCE & EXPOSURE GOVERNANCE"

      title="Trade Risk Intelligence"

      subtitle="Governance-driven monitoring of country risk, counterparty exposure, geopolitical events and enterprise trade risk concentration."

      story={{
        title: "Trade Risk Governance Story",
        text:
          "INVISOR analysed enterprise trade exposure. Fourteen high-risk trades were identified across selected jurisdictions while counterparty exposure remained within approved governance thresholds. The recommended executive decision is Monitor."
      }}

      metrics={[
        {
          label: "High Risk Trades",
          value: "14",
          status: "bad"
        },
        {
          label: "Country Risk",
          value: "Medium",
          status: "warning"
        },
        {
          label: "Counterparty Risk",
          value: "Low",
          status: "good"
        },
        {
          label: "Governance Score",
          value: "86%",
          status: "good"
        }
      ]}

      governance={{
        score: "86%",
        maturity: "Managed",
        risk: "Medium",
        decision: "Monitor",
        recommendation:
          "Continue enhanced monitoring of high-risk jurisdictions and counterparties.",
        confidence: "97%"
      }}

      recommendation={{
        summary:
          "Maintain enhanced monitoring for high-risk trade corridors while diversifying exposure.",

        factors: [
          "14 high-risk trade transactions",
          "Country risk remains moderate",
          "Counterparty exposure acceptable",
          "Governance thresholds maintained"
        ],

        outcome:
          "Maintain enterprise trade resilience while limiting concentration risk.",

        confidence: "97%"
      }}

      cards={[
        {
          title: "Risk Concentration",
          text:
            "Trade exposure remains concentrated across selected international markets."
        },
        {
          title: "Operational Impact",
          text:
            "Current exposure remains within approved enterprise governance limits."
        },
        {
          title: "Governance Action",
          text:
            "Continue quarterly trade risk assessments and counterparty reviews."
        }
      ]}
    />
  );
}
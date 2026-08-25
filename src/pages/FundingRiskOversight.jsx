import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function FundingRiskOversight() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="TREASURY FUNDING RISK & CAPITAL GOVERNANCE"

      title="Funding Risk Oversight"

      subtitle="Governance-driven monitoring of funding sustainability, concentration exposure, liquidity resilience and capital adequacy."

      story={{
        title: "Funding Risk Governance Story",
        text:
          "INVISOR analysed funding concentration and treasury resilience indicators. Concentration risk reached 74% while liquidity buffer remained healthy at 91%. Based on governance policies, the recommended executive decision is Mitigate."
      }}

      metrics={[
        {
          label: "Funding Sources",
          value: "4",
          status: "good"
        },
        {
          label: "Concentration Risk",
          value: "74%",
          status: "bad"
        },
        {
          label: "Liquidity Buffer",
          value: "91%",
          status: "good"
        },
        {
          label: "Stress Test Score",
          value: "82%",
          status: "warning"
        }
      ]}

      governance={{
        score: "76%",
        maturity: "Managed",
        risk: "High",
        decision: "Mitigate",
        recommendation:
          "Diversify funding sources to reduce concentration exposure.",
        confidence: "95%"
      }}

      recommendation={{
        summary:
          "Funding concentration should be reduced through diversified funding strategies.",

        factors: [
          "Funding concentration exceeds governance threshold",
          "Liquidity remains healthy",
          "Stress testing indicates acceptable resilience",
          "Funding diversification recommended"
        ],

        outcome:
          "Improve treasury resilience while reducing concentration risk exposure.",

        confidence: "95%"
      }}

      cards={[
        {
          title: "Funding Concentration",
          text:
            "Current funding structure relies heavily on a limited funding pool."
        },
        {
          title: "Resilience Assessment",
          text:
            "Liquidity reserves remain above governance thresholds supporting operational resilience."
        },
        {
          title: "Governance Action",
          text:
            "Increase funding diversification and perform enhanced treasury monitoring."
        }
      ]}
    />
  );
}
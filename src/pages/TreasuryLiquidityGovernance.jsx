import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function TreasuryLiquidityGovernance() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="TREASURY LIQUIDITY & RESILIENCE GOVERNANCE"

      title="Treasury Liquidity Governance"

      subtitle="Governance-driven monitoring of liquidity coverage, funding resilience, stress testing and treasury operational sustainability."

      story={{
        title: "Treasury Liquidity Governance Story",
        text:
          "INVISOR analysed treasury liquidity indicators across funding operations. Liquidity Coverage Ratio remains healthy at 82%, while funding concentration risk increased to 68%. Based on enterprise governance thresholds, the recommended executive decision is Monitor."
      }}

      metrics={[
        {
          label: "Liquidity Coverage Ratio",
          value: "82%",
          status: "good"
        },
        {
          label: "Funding Gap",
          value: "12%",
          status: "warning"
        },
        {
          label: "Concentration Risk",
          value: "68%",
          status: "warning"
        },
        {
          label: "Stress Test Score",
          value: "87%",
          status: "good"
        }
      ]}

      governance={{
        score: "91%",
        maturity: "Optimised",
        risk: "Medium",
        decision: "Monitor",
        recommendation:
          "Maintain current treasury liquidity position and continue monitoring funding exposure.",
        confidence: "97%"
      }}

      recommendation={{
        summary:
          "Current treasury liquidity remains stable with moderate concentration risk.",

        factors: [
          "Liquidity ratio exceeds governance threshold",
          "Funding gap remains controlled",
          "Stress test passed",
          "Moderate concentration exposure"
        ],

        outcome:
          "Treasury resilience maintained while ensuring sufficient funding capacity.",

        confidence: "97%"
      }}

      cards={[
        {
          title: "Liquidity Assessment",
          text:
            "Liquidity reserves remain above governance thresholds supporting operational continuity."
        },
        {
          title: "Operational Impact",
          text:
            "Funding obligations remain supportable across business operations."
        },
        {
          title: "Governance Action",
          text:
            "Continue monitoring concentration risk through monthly treasury reviews."
        }
      ]}
    />
  );
}
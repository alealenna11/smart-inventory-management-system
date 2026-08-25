import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function LoanPortfolioGovernance() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="LOAN PORTFOLIO & CREDIT GOVERNANCE"

      title="Loan Portfolio Governance"

      subtitle="Governance-driven monitoring of loan portfolio quality, exposure, portfolio performance and lending risk."

      story={{
        title: "Loan Portfolio Governance Story",
        text:
          "INVISOR analysed enterprise lending activities across the loan portfolio. Twenty-four high-risk loans and a default exposure of 3.2% were identified. Portfolio quality remains within approved governance thresholds and the recommended executive decision is Monitor."
      }}

      metrics={[
        {
          label: "Active Loans",
          value: "3,520",
          status: "good"
        },
        {
          label: "Default Exposure",
          value: "3.2%",
          status: "warning"
        },
        {
          label: "High Risk Loans",
          value: "24",
          status: "bad"
        },
        {
          label: "Governance Score",
          value: "81%",
          status: "good"
        }
      ]}

      governance={{
        score: "81%",
        maturity: "Managed",
        risk: "Medium",
        decision: "Monitor",
        recommendation:
          "Increase oversight of high-risk lending segments and portfolio performance.",
        confidence: "95%"
      }}

      recommendation={{
        summary:
          "Continue portfolio monitoring while strengthening oversight of high-risk lending.",

        factors:[
          "24 high-risk loans detected",
          "Default exposure remains controlled",
          "Portfolio quality within limits",
          "Enhanced monitoring recommended"
        ],

        outcome:
          "Reduce portfolio risk and improve long-term lending stability.",

        confidence:"95%"
      }}

      cards={[
        {
          title:"Portfolio Review",
          text:"Loan portfolio remains within approved enterprise risk appetite."
        },
        {
          title:"Risk Exposure",
          text:"High-risk lending segments require enhanced governance monitoring."
        },
        {
          title:"Governance Action",
          text:"Conduct targeted portfolio reviews and strengthen lending oversight."
        }
      ]}
    />
  );
}
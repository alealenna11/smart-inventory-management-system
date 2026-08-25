import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function BudgetPerformanceAnalytics() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="BUDGET PERFORMANCE & FINANCIAL GOVERNANCE"

      title="Budget Performance Analytics"

      subtitle="Governance-driven monitoring of budget utilisation, expenditure performance, forecasting accuracy and financial planning effectiveness."

      story={{
        title: "Budget Performance Governance Story",
        text:
          "INVISOR analysed departmental budget performance across enterprise financial operations. Budget utilisation reached 78% with forecast accuracy maintained at 93%. Budget variance remained within acceptable governance thresholds. The recommended executive decision is Monitor."
      }}

      metrics={[
        {
          label: "Budget Utilisation",
          value: "78%",
          status: "good"
        },
        {
          label: "Forecast Accuracy",
          value: "93%",
          status: "good"
        },
        {
          label: "Budget Variance",
          value: "6%",
          status: "warning"
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
          "Maintain expenditure discipline while continuing monthly budget reviews and forecasting improvements.",
        confidence: "97%"
      }}

      recommendation={{
        summary:
          "Current financial planning remains effective with stable expenditure governance.",

        factors: [
          "Budget utilisation remains healthy",
          "93% forecasting accuracy achieved",
          "Budget variance within tolerance",
          "Financial controls operating effectively"
        ],

        outcome:
          "Maintain financial sustainability while improving budget forecasting and expenditure governance.",

        confidence: "97%"
      }}

      cards={[
        {
          title: "Budget Analysis",
          text:
            "Departmental expenditure remains within approved governance thresholds and financial plans."
        },
        {
          title: "Operational Impact",
          text:
            "No material budget constraints affecting operational delivery or strategic initiatives."
        },
        {
          title: "Governance Action",
          text:
            "Continue monthly budget reviews, variance analysis and financial performance monitoring."
        }
      ]}
    />
  );
}
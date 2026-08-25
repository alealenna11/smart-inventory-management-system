import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function TradeComplianceMonitoring() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="TRADE COMPLIANCE & REGULATORY GOVERNANCE"

      title="Trade Compliance Monitoring"

      subtitle="Governance-driven monitoring of international trade compliance, regulatory obligations, document validation and operational integrity."

      story={{
        title: "Trade Compliance Governance Story",
        text:
          "INVISOR analysed enterprise trade operations. Six compliance breaches and several documentation exceptions were identified while document accuracy remained at 94%. Based on enterprise governance rules, the recommended executive decision is Review."
      }}

      metrics={[
        {
          label: "Trade Transactions",
          value: "8,420",
          status: "good"
        },
        {
          label: "Compliance Breaches",
          value: "6",
          status: "bad"
        },
        {
          label: "Document Accuracy",
          value: "94%",
          status: "good"
        },
        {
          label: "Governance Score",
          value: "88%",
          status: "good"
        }
      ]}

      governance={{
        score: "88%",
        maturity: "Managed",
        risk: "Medium",
        decision: "Review",
        recommendation:
          "Investigate trade documentation exceptions and strengthen compliance validation.",
        confidence: "96%"
      }}

      recommendation={{
        summary:
          "Strengthen automated compliance verification before trade approval.",

        factors: [
          "6 compliance breaches detected",
          "Document validation exceptions identified",
          "Trade processing delays increasing",
          "Compliance controls require enhancement"
        ],

        outcome:
          "Improve trade governance, regulatory compliance and operational efficiency.",

        confidence: "96%"
      }}

      cards={[
        {
          title: "Exception Analysis",
          text:
            "Several trade transactions contained incomplete supporting documentation."
        },
        {
          title: "Operational Impact",
          text:
            "Manual document verification increased overall processing time."
        },
        {
          title: "Governance Action",
          text:
            "Implement automated compliance validation before trade approval."
        }
      ]}
    />
  );
}
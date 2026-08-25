import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function LetterOfCreditGovernance() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="LETTER OF CREDIT GOVERNANCE & DOCUMENT CONTROL"

      title="Letter of Credit Governance"

      subtitle="Governance-driven monitoring of Letter of Credit validation, expiry management, documentary compliance and operational oversight."

      story={{
        title: "Letter of Credit Governance Story",
        text:
          "INVISOR analysed Letter of Credit operations. Twelve expired LC instruments and eighteen validation exceptions were detected. The recommended governance decision is Review."
      }}

      metrics={[
        {
          label: "Active LC Cases",
          value: "1,240",
          status: "good"
        },
        {
          label: "Expired LC",
          value: "12",
          status: "bad"
        },
        {
          label: "Validation Exceptions",
          value: "18",
          status: "warning"
        },
        {
          label: "Governance Score",
          value: "84%",
          status: "good"
        }
      ]}

      governance={{
        score: "84%",
        maturity: "Managed",
        risk: "Medium",
        decision: "Review",
        recommendation:
          "Improve expiry monitoring and strengthen LC validation controls.",
        confidence: "95%"
      }}

      recommendation={{
        summary:
          "Reduce expired LC instruments through automated monitoring and alerts.",

        factors: [
          "12 expired LC instruments",
          "18 validation exceptions",
          "Manual expiry monitoring",
          "Operational exposure increasing"
        ],

        outcome:
          "Improve documentary compliance and minimise operational risk.",

        confidence: "95%"
      }}

      cards={[
        {
          title: "LC Monitoring",
          text:
            "Most Letter of Credit transactions remain compliant with governance policies."
        },
        {
          title: "Risk Assessment",
          text:
            "Expired LC instruments increase operational and regulatory exposure."
        },
        {
          title: "Governance Action",
          text:
            "Implement automated expiry notification and validation controls."
        }
      ]}
    />
  );
}
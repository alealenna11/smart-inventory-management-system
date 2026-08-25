import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function RegulatoryReportingCentre() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="REGULATORY REPORTING & COMPLIANCE GOVERNANCE"

      title="Regulatory Reporting Centre"

      subtitle="Governance-driven monitoring of regulatory submissions, reporting quality, compliance obligations and enterprise reporting assurance."

      story={{
        title: "Regulatory Reporting Governance Story",
        text:
          "INVISOR analysed regulatory reporting activities across the reporting cycle. A total of 152 regulatory submissions were completed with 97% reporting accuracy. Three delayed submissions were identified and reviewed. The recommended executive decision is Review."
      }}

      metrics={[
        {
          label: "Reports Submitted",
          value: "152",
          status: "good"
        },
        {
          label: "Late Submissions",
          value: "3",
          status: "warning"
        },
        {
          label: "Data Accuracy",
          value: "97%",
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
          "Reduce reporting delays through enhanced workflow monitoring and automated validation controls.",
        confidence: "96%"
      }}

      recommendation={{
        summary:
          "Improve reporting timeliness while maintaining excellent reporting accuracy.",

        factors: [
          "Three delayed submissions identified",
          "97% reporting accuracy maintained",
          "Minor workflow bottlenecks detected",
          "Automated validation recommended"
        ],

        outcome:
          "Strengthen regulatory compliance while reducing reporting delays.",

        confidence: "96%"
      }}

      cards={[
        {
          title: "Compliance Findings",
          text:
            "Minor reporting delays were identified but overall regulatory compliance remained strong."
        },
        {
          title: "Operational Impact",
          text:
            "Limited regulatory exposure due to consistently high reporting accuracy."
        },
        {
          title: "Governance Action",
          text:
            "Strengthen reporting workflow monitoring, automated validation and escalation procedures."
        }
      ]}
    />
  );
}
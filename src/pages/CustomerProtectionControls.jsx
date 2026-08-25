import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function CustomerProtectionControls() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="CUSTOMER PROTECTION & CONSUMER GOVERNANCE"

      title="Customer Protection Controls"

      subtitle="Governance-driven monitoring of customer protection controls, complaint management, consumer safeguards and enterprise service assurance."

      story={{
        title: "Customer Protection Governance Story",
        text:
          "INVISOR analysed enterprise customer protection activities. Fourteen customer complaints and two protection incidents were recorded while resolution SLA remained at 94%. Based on governance intelligence, the recommended executive decision is Review."
      }}

      metrics={[
        {
          label: "Customer Complaints",
          value: "14",
          status: "warning"
        },
        {
          label: "Protection Incidents",
          value: "2",
          status: "bad"
        },
        {
          label: "Resolution SLA",
          value: "94%",
          status: "good"
        },
        {
          label: "Governance Score",
          value: "87%",
          status: "good"
        }
      ]}

      governance={{
        score: "87%",
        maturity: "Managed",
        risk: "Medium",
        decision: "Review",
        recommendation:
          "Investigate recurring complaint categories and strengthen customer protection controls.",
        confidence: "96%"
      }}

      recommendation={{
        summary:
          "Improve complaint resolution through enhanced customer protection governance.",

        factors: [
          "14 customer complaints identified",
          "2 protection incidents recorded",
          "Resolution SLA remains high",
          "Root cause analysis recommended"
        ],

        outcome:
          "Strengthen customer trust while reducing complaint recurrence and operational risk.",

        confidence: "96%"
      }}

      cards={[
        {
          title: "Customer Assessment",
          text:
            "Customer protection controls remain effective across enterprise operations."
        },
        {
          title: "Risk Exposure",
          text:
            "Only a limited number of customer protection incidents were identified."
        },
        {
          title: "Governance Action",
          text:
            "Implement enhanced complaint analytics and preventive customer protection measures."
        }
      ]}
    />
  );
}
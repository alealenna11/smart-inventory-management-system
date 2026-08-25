import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function OperationsCommandCentre() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="ENTERPRISE OPERATIONS & SERVICE GOVERNANCE"

      title="Operations Command Centre"

      subtitle="Governance-driven monitoring of operational resilience, service availability, incident management and enterprise operational performance."

      story={{
        title: "Operations Governance Story",
        text:
          "INVISOR analysed enterprise operational activities. Nine operational incidents were detected while overall service availability remained at 99.2%. Based on operational governance indicators, the recommended decision is Monitor."
      }}

      metrics={[
        {
          label: "Operational Incidents",
          value: "9",
          status: "warning"
        },
        {
          label: "Service Availability",
          value: "99.2%",
          status: "good"
        },
        {
          label: "Process Efficiency",
          value: "87%",
          status: "good"
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
        decision: "Monitor",
        recommendation:
          "Improve incident response and operational recovery processes.",
        confidence: "95%"
      }}

      recommendation={{
        summary:
          "Continue monitoring operational performance while reducing recurring incidents.",

        factors:[
          "Service availability exceeds target",
          "Minor operational incidents detected",
          "Business continuity unaffected",
          "Governance controls remain effective"
        ],

        outcome:
          "Improve operational resilience and reduce incident recurrence.",

        confidence:"95%"
      }}

      cards={[
        {
          title:"Operational Assessment",
          text:"Operations remain stable despite several minor incidents."
        },
        {
          title:"Impact Analysis",
          text:"No significant disruption to business services was detected."
        },
        {
          title:"Governance Action",
          text:"Review recurring operational incidents and strengthen recovery procedures."
        }
      ]}
    />
  );
}
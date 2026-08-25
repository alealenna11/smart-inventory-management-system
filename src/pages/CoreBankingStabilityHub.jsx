import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function CoreBankingStabilityHub() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="CORE BANKING STABILITY & RESILIENCE GOVERNANCE"

      title="Core Banking Stability Hub"

      subtitle="Governance-driven monitoring of core banking platform availability, transaction integrity, operational resilience and enterprise service continuity."

      story={{
        title: "Core Banking Governance Story",
        text:
          "INVISOR analysed enterprise core banking operations. System availability remained at 99.8% with transaction success reaching 98.9%. Two critical operational incidents were detected but resolved within governance recovery thresholds. The recommended executive decision is Monitor."
      }}

      metrics={[
        {
          label: "System Availability",
          value: "99.8%",
          status: "good"
        },
        {
          label: "Transaction Success",
          value: "98.9%",
          status: "good"
        },
        {
          label: "Critical Incidents",
          value: "2",
          status: "warning"
        },
        {
          label: "Governance Score",
          value: "94%",
          status: "good"
        }
      ]}

      governance={{
        score: "94%",
        maturity: "Optimised",
        risk: "Low",
        decision: "Monitor",
        recommendation:
          "Maintain current platform resilience while continuing proactive system monitoring.",
        confidence: "99%"
      }}

      recommendation={{
        summary:
          "Core banking services remain highly resilient with excellent operational performance.",

        factors:[
          "99.8% platform availability",
          "98.9% transaction success",
          "Only two critical incidents",
          "Recovery objectives achieved"
        ],

        outcome:
          "Maintain uninterrupted banking operations and enterprise service resilience.",

        confidence:"99%"
      }}

      cards={[
        {
          title:"System Health",
          text:"Core banking infrastructure remains stable with excellent platform availability."
        },
        {
          title:"Operational Impact",
          text:"No material disruption to banking services or customer operations was identified."
        },
        {
          title:"Governance Action",
          text:"Continue resilience testing, infrastructure monitoring and disaster recovery validation."
        }
      ]}
    />
  );
}
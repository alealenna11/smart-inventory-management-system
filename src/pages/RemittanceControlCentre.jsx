import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function RemittanceControlCentre() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="REMITTANCE OPERATIONS & CONTROL GOVERNANCE"

      title="Remittance Control Centre"

      subtitle="Governance-driven monitoring of remittance operations, SLA compliance, transaction integrity and operational resilience."

      story={{
        title: "Remittance Governance Story",
        text:
          "INVISOR analysed today's remittance processing activities. The platform detected 18 failed transactions, 7 operational control exceptions and SLA compliance of 89%. Based on governance rules, the recommended executive decision is Escalate."
      }}

      metrics={[
        {
          label: "Daily Transactions",
          value: "12,530",
          status: "good"
        },
        {
          label: "Failed Transactions",
          value: "18",
          status: "bad"
        },
        {
          label: "SLA Compliance",
          value: "89%",
          status: "warning"
        },
        {
          label: "Control Exceptions",
          value: "7",
          status: "bad"
        }
      ]}

      governance={{
        score: "68%",
        maturity: "Defined",
        risk: "High",
        decision: "Escalate",
        recommendation:
          "Investigate payment failures and SLA breaches immediately.",
        confidence: "96%"
      }}

      recommendation={{
        summary:
          "Immediate operational review is recommended due to elevated exception levels.",

        factors: [
          "18 failed payment transactions",
          "SLA below governance target",
          "7 control exceptions detected",
          "Operational risk increasing"
        ],

        outcome:
          "Improve SLA performance, reduce payment failures and restore governance compliance.",

        confidence: "96%"
      }}

      cards={[
        {
          title: "Exception Analysis",
          text:
            "Payment routing failures contributed to most operational exceptions."
        },
        {
          title: "Operational Impact",
          text:
            "Transaction backlog has negatively affected SLA performance."
        },
        {
          title: "Governance Action",
          text:
            "Escalate operational review to the Governance Committee and initiate corrective actions."
        }
      ]}
    />
  );
}
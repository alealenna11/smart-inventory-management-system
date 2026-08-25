import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function SLAGovernanceMonitoring() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="SERVICE LEVEL AGREEMENT GOVERNANCE"

      title="SLA Governance Monitoring"

      subtitle="Governance-driven monitoring of SLA compliance, service quality and enterprise service delivery performance."

      story={{
        title:"SLA Governance Story",
        text:
          "INVISOR analysed enterprise SLA performance across operational services. Seven SLA breaches were detected while overall compliance remained at 91%. The recommended executive decision is Review."
      }}

      metrics={[
        {
          label:"SLA Compliance",
          value:"91%",
          status:"good"
        },
        {
          label:"Missed SLA",
          value:"7",
          status:"bad"
        },
        {
          label:"Service Requests",
          value:"2,150",
          status:"good"
        },
        {
          label:"Governance Score",
          value:"80%",
          status:"warning"
        }
      ]}

      governance={{
        score:"80%",
        maturity:"Defined",
        risk:"Medium",
        decision:"Review",
        recommendation:
          "Reduce missed SLAs through proactive escalation and monitoring.",
        confidence:"94%"
      }}

      recommendation={{
        summary:
          "Strengthen SLA monitoring through predictive alerts and governance reviews.",

        factors:[
          "Seven SLA breaches identified",
          "Compliance remains above governance threshold",
          "Increasing service demand",
          "Early escalation recommended"
        ],

        outcome:
          "Improve service quality and minimise SLA violations.",

        confidence:"94%"
      }}

      cards={[
        {
          title:"Service Quality",
          text:"Overall SLA compliance remains above enterprise governance target."
        },
        {
          title:"Risk Assessment",
          text:"Missed SLAs are increasing across selected operational processes."
        },
        {
          title:"Governance Action",
          text:"Implement predictive SLA alerts and automated escalation workflows."
        }
      ]}
    />
  );
}
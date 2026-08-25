import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function WorkflowGovernanceHub() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="WORKFLOW AUTOMATION & PROCESS GOVERNANCE"

      title="Workflow Governance Hub"

      subtitle="Governance-driven monitoring of workflow efficiency, approval cycles, automation performance and operational bottlenecks."

      story={{
        title:"Workflow Governance Story",
        text:
          "INVISOR analysed enterprise workflow activities. Eight workflow bottlenecks and twelve approval delays were identified. Based on governance intelligence, the recommended executive decision is Review."
      }}

      metrics={[
        {
          label:"Workflow Bottlenecks",
          value:"8",
          status:"warning"
        },
        {
          label:"Approval Delays",
          value:"12",
          status:"bad"
        },
        {
          label:"Automation Rate",
          value:"76%",
          status:"good"
        },
        {
          label:"Governance Score",
          value:"78%",
          status:"warning"
        }
      ]}

      governance={{
        score:"78%",
        maturity:"Defined",
        risk:"Medium",
        decision:"Review",
        recommendation:
          "Automate approval workflows to reduce operational delays.",
        confidence:"93%"
      }}

      recommendation={{
        summary:
          "Increase workflow automation and optimise approval routing.",

        factors:[
          "Approval delays detected",
          "Multiple workflow bottlenecks",
          "Automation opportunities identified",
          "Operational efficiency below target"
        ],

        outcome:
          "Reduce approval turnaround time and improve enterprise productivity.",

        confidence:"93%"
      }}

      cards={[
        {
          title:"Workflow Analysis",
          text:"Approval bottlenecks were detected across multiple enterprise workflows."
        },
        {
          title:"Business Impact",
          text:"Delayed approvals are reducing operational efficiency and increasing processing time."
        },
        {
          title:"Governance Action",
          text:"Implement automated routing, workflow optimisation and escalation policies."
        }
      ]}
    />
  );
}
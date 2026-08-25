import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function BatchProcessingGovernance() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="BATCH PROCESSING & JOB CONTROL GOVERNANCE"

      title="Batch Processing Governance"

      subtitle="Governance-driven monitoring of overnight batch processing, job execution, processing efficiency and operational control effectiveness."

      story={{
        title:"Batch Processing Governance Story",
        text:
          "INVISOR analysed overnight enterprise batch processing activities. Four failed jobs, seven processing delays and two control exceptions were identified. The recommended executive decision is Review."
      }}

      metrics={[
        {
          label:"Failed Jobs",
          value:"4",
          status:"warning"
        },
        {
          label:"Processing Delays",
          value:"7",
          status:"warning"
        },
        {
          label:"Control Exceptions",
          value:"2",
          status:"bad"
        },
        {
          label:"Governance Score",
          value:"88%",
          status:"good"
        }
      ]}

      governance={{
        score:"88%",
        maturity:"Managed",
        risk:"Medium",
        decision:"Review",
        recommendation:
          "Strengthen batch monitoring and automate exception management.",
        confidence:"96%"
      }}

      recommendation={{
        summary:
          "Enhance overnight batch monitoring and improve automated recovery processes.",

        factors:[
          "Four failed processing jobs",
          "Seven delayed batch executions",
          "Control exceptions detected",
          "Automation improvements recommended"
        ],

        outcome:
          "Improve overnight processing reliability while reducing operational delays.",

        confidence:"96%"
      }}

      cards={[
        {
          title:"Batch Performance",
          text:"Most overnight processing jobs completed successfully with only isolated failures."
        },
        {
          title:"Operational Impact",
          text:"Processing delays had minimal downstream impact on business operations."
        },
        {
          title:"Governance Action",
          text:"Implement predictive batch monitoring, automated restart capabilities and exception escalation."
        }
      ]}
    />
  );
}
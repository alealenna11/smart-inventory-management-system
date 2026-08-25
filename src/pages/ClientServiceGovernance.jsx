import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function ClientServiceGovernance() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="CLIENT SERVICE & OPERATIONAL GOVERNANCE"

      title="Client Service Governance"

      subtitle="Governance-driven monitoring of client service delivery, request management, SLA performance, operational excellence and service quality."

      story={{
        title: "Client Service Governance Story",
        text:
          "INVISOR analysed enterprise client servicing activities. A total of 1,250 client requests were processed with 93% SLA compliance. Twenty-eight active cases remain under investigation. Based on governance indicators, the recommended executive decision is Monitor."
      }}

      metrics={[
        {
          label: "Client Requests",
          value: "1,250",
          status: "good"
        },
        {
          label: "Response SLA",
          value: "93%",
          status: "good"
        },
        {
          label: "Open Cases",
          value: "28",
          status: "warning"
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
        risk: "Low",
        decision: "Monitor",
        recommendation:
          "Reduce outstanding client cases through proactive case management.",
        confidence: "97%"
      }}

      recommendation={{
        summary:
          "Continue proactive client engagement while improving case closure efficiency.",

        factors:[
          "High SLA compliance achieved",
          "Open cases remain manageable",
          "Service quality remains strong",
          "Operational monitoring should continue"
        ],

        outcome:
          "Improve customer responsiveness while maintaining excellent service quality.",

        confidence:"97%"
      }}

      cards={[
        {
          title:"Service Review",
          text:"Client servicing continues to meet enterprise governance and operational standards."
        },
        {
          title:"Operational Impact",
          text:"Minor case backlog identified with limited business impact."
        },
        {
          title:"Governance Action",
          text:"Strengthen client follow-up and automate outstanding case monitoring."
        }
      ]}
    />
  );
}
import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function ServiceHealthMonitoring() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="SERVICE AVAILABILITY & OPERATIONAL RESILIENCE"

      title="Service Health Monitoring"

      subtitle="Governance-driven monitoring of enterprise service availability, infrastructure health, recovery readiness and operational resilience."

      story={{
        title:"Service Health Governance Story",
        text:
          "INVISOR analysed enterprise service health indicators. Service availability remained within governance thresholds while recovery readiness reached 96%. Two infrastructure alerts were detected with minimal operational impact. The recommended executive decision is Monitor."
      }}

      metrics={[
        {
          label:"Critical Alerts",
          value:"2",
          status:"warning"
        },
        {
          label:"Downtime",
          value:"12 min",
          status:"good"
        },
        {
          label:"Recovery Readiness",
          value:"96%",
          status:"good"
        },
        {
          label:"Governance Score",
          value:"91%",
          status:"good"
        }
      ]}

      governance={{
        score:"91%",
        maturity:"Optimised",
        risk:"Low",
        decision:"Monitor",
        recommendation:
          "Continue proactive infrastructure monitoring and resilience testing.",
        confidence:"98%"
      }}

      recommendation={{
        summary:
          "Enterprise services remain healthy with strong operational resilience.",

        factors:[
          "Recovery readiness exceeds target",
          "Downtime remains minimal",
          "Infrastructure alerts resolved",
          "Operational resilience maintained"
        ],

        outcome:
          "Maintain high service availability while improving infrastructure reliability.",

        confidence:"98%"
      }}

      cards={[
        {
          title:"Service Resilience",
          text:"Recovery capability remains well above enterprise governance thresholds."
        },
        {
          title:"Risk Assessment",
          text:"Infrastructure disruption risk remains low with effective monitoring controls."
        },
        {
          title:"Governance Action",
          text:"Continue quarterly disaster recovery exercises and resilience validation."
        }
      ]}
    />
  );
}
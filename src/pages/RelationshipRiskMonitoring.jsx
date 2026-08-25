import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function RelationshipRiskMonitoring() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="CLIENT RELATIONSHIP RISK & GOVERNANCE"

      title="Relationship Risk Monitoring"

      subtitle="Governance-driven monitoring of strategic client relationships, service risk, engagement quality and enterprise relationship resilience."

      story={{
        title: "Relationship Risk Governance Story",
        text:
          "INVISOR analysed enterprise client relationship risks. Twelve high-risk client relationships and four service exceptions were identified. Overall relationship health remained at 89%. Based on governance intelligence, the recommended executive decision is Review."
      }}

      metrics={[
        {
          label: "High Risk Clients",
          value: "12",
          status: "warning"
        },
        {
          label: "Service Exceptions",
          value: "4",
          status: "bad"
        },
        {
          label: "Relationship Health",
          value: "89%",
          status: "good"
        },
        {
          label: "Governance Score",
          value: "86%",
          status: "good"
        }
      ]}

      governance={{
        score: "86%",
        maturity: "Managed",
        risk: "Medium",
        decision: "Review",
        recommendation:
          "Strengthen oversight of strategic client relationships and monitor service exceptions.",
        confidence: "96%"
      }}

      recommendation={{
        summary:
          "Perform enhanced reviews for high-risk client relationships and strengthen governance oversight.",

        factors:[
          "12 high-risk relationships identified",
          "4 operational service exceptions",
          "Relationship health remains stable",
          "Targeted engagement recommended"
        ],

        outcome:
          "Reduce relationship risk while strengthening strategic client retention.",

        confidence:"96%"
      }}

      cards={[
        {
          title:"Relationship Assessment",
          text:"Most strategic client relationships remain healthy with stable engagement levels."
        },
        {
          title:"Risk Exposure",
          text:"Selected high-value clients require enhanced monitoring and proactive engagement."
        },
        {
          title:"Governance Action",
          text:"Conduct quarterly relationship governance reviews and executive account assessments."
        }
      ]}
    />
  );
}
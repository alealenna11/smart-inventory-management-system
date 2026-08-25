import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function CreditRiskMonitoring() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="CREDIT RISK & BORROWER GOVERNANCE"

      title="Credit Risk Monitoring"

      subtitle="Governance-driven monitoring of borrower quality, credit exposure, approval effectiveness and enterprise lending risk."

      story={{
        title:"Credit Risk Governance Story",
        text:
          "INVISOR analysed borrower quality and credit approval activities. Fifteen lending exceptions were identified while overall approval quality remained at 92%. The recommended governance decision is Monitor."
      }}

      metrics={[
        {
          label:"Credit Score Quality",
          value:"89%",
          status:"good"
        },
        {
          label:"Risk Exceptions",
          value:"15",
          status:"warning"
        },
        {
          label:"Approval Quality",
          value:"92%",
          status:"good"
        },
        {
          label:"Governance Score",
          value:"83%",
          status:"good"
        }
      ]}

      governance={{
        score:"83%",
        maturity:"Managed",
        risk:"Medium",
        decision:"Monitor",
        recommendation:
          "Review lending exceptions before final credit approval.",
        confidence:"96%"
      }}

      recommendation={{
        summary:
          "Strengthen borrower assessment and credit review procedures.",

        factors:[
          "15 lending exceptions detected",
          "Borrower quality remains healthy",
          "Approval quality above governance target",
          "Enhanced credit review recommended"
        ],

        outcome:
          "Improve lending quality while reducing future credit losses.",

        confidence:"96%"
      }}

      cards={[
        {
          title:"Credit Assessment",
          text:"Borrower quality remains stable across the lending portfolio."
        },
        {
          title:"Risk Review",
          text:"Selected borrowers exceed enterprise credit risk thresholds."
        },
        {
          title:"Governance Action",
          text:"Increase credit review frequency for high-risk lending segments."
        }
      ]}
    />
  );
}
import DepartmentGovernanceTemplate from "../components/DepartmentGovernanceTemplate";

export default function LoanComplianceCentre() {
  return (
    <DepartmentGovernanceTemplate
      eyebrow="LENDING COMPLIANCE & REGULATORY GOVERNANCE"

      title="Loan Compliance Centre"

      subtitle="Governance-driven monitoring of lending policy adherence, regulatory compliance, documentation quality and operational assurance."

      story={{
        title:"Loan Compliance Governance Story",
        text:
          "INVISOR analysed lending compliance across enterprise loan operations. Documentation quality remained strong with 95% policy compliance while four compliance findings were detected. The recommended governance decision is Monitor."
      }}

      metrics={[
        {
          label:"Policy Compliance",
          value:"95%",
          status:"good"
        },
        {
          label:"Documentation Gaps",
          value:"8",
          status:"warning"
        },
        {
          label:"Review Findings",
          value:"4",
          status:"bad"
        },
        {
          label:"Governance Score",
          value:"90%",
          status:"good"
        }
      ]}

      governance={{
        score:"90%",
        maturity:"Optimised",
        risk:"Low",
        decision:"Monitor",
        recommendation:
          "Maintain the current lending compliance framework and continue monitoring.",
        confidence:"98%"
      }}

      recommendation={{
        summary:
          "Current lending governance remains effective with only minor compliance observations.",

        factors:[
          "95% policy compliance achieved",
          "Only four compliance findings",
          "Low operational risk",
          "Documentation quality remains strong"
        ],

        outcome:
          "Maintain strong regulatory compliance and minimise operational risk.",

        confidence:"98%"
      }}

      cards={[
        {
          title:"Compliance Assessment",
          text:"Most lending activities comply with enterprise governance policies."
        },
        {
          title:"Operational Impact",
          text:"Compliance findings have minimal operational impact."
        },
        {
          title:"Governance Action",
          text:"Continue periodic compliance validation and regulatory assurance reviews."
        }
      ]}
    />
  );
}
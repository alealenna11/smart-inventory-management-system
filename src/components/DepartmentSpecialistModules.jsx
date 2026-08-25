export default function DepartmentSpecialistModules({ departmentName }) {
  const isRDT = departmentName?.includes("RDT");

  if (!isRDT) return null;

  const rdtModules = [
    {
      title: "Technology Refresh Readiness",
      score: "86%",
      status: "Review",
      data: [
        ["Applications in Scope", "18"],
        ["Ready for Go-Live", "14"],
        ["Blocked Items", "2"],
        ["Validation Gaps", "3"],
      ],
      purpose:
        "Monitors technology refresh readiness across applications, validation gaps and implementation blockers.",
    },
    {
      title: "Defect & Retest Governance",
      score: "79%",
      status: "Action Required",
      data: [
        ["Open Defects", "7"],
        ["Pending User Retest", "5"],
        ["Failed Retests", "2"],
        ["Closure Rate", "82%"],
      ],
      purpose:
        "Tracks defect closure, user retesting and unresolved issues before production readiness.",
    },
    {
      title: "Access & Cutover Governance",
      score: "91%",
      status: "Healthy",
      data: [
        ["Users Onboarded", "42"],
        ["Pending Access", "3"],
        ["Approvals Missing", "1"],
        ["Cutover Readiness", "91%"],
      ],
      purpose:
        "Validates access readiness, approval completion and cutover governance before go-live.",
    },
  ];

  return (
    <div className="admin-card executive">
      <h3>{departmentName} Specialist Governance Modules</h3>
      <p>
        These modules show department-specific governance capabilities beyond
        the common enterprise dashboard.
      </p>

      <div className="benefit-grid">
        {rdtModules.map((mod) => (
          <div className="benefit-box" key={mod.title}>
            <h2>{mod.score}</h2>
            <p>{mod.title}</p>
            <strong>{mod.status}</strong>
          </div>
        ))}
      </div>

      {rdtModules.map((mod) => (
        <div className="admin-insight" key={mod.title}>
          <b>{mod.title}</b>
          <p>{mod.purpose}</p>

          <table className="summary-table">
            <tbody>
              {mod.data.map(([label, value]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>
                    <b>{value}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
import { useMemo, useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import "../styles/admin.css";


function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

function isPrivilegedRole(role = "") {
  const value = role.toLowerCase();
  return (
    value.includes("admin") ||
    value.includes("executive") ||
    value.includes("governance")
  );
}

function getUserRisk(user) {
  if (user.approvalStatus === "Rejected") return "High";
  if (user.approvalStatus === "Pending" && isPrivilegedRole(user.role)) return "High";
  if (user.approvalStatus === "Pending") return "Medium";
  if (user.status !== "Active") return "Medium";
  return "Low";
}

function getAccessDecision(user) {
  const risk = getUserRisk(user);

  if (user.approvalStatus === "Rejected") {
    return {
      decision: "Rejected",
      recommendation: "Access request should remain rejected unless business justification is resubmitted.",
      reason: "The request has already failed governance review.",
    };
  }

  if (risk === "High") {
    return {
      decision: "Escalate",
      recommendation: "Escalate to Identity & Access Governance owner before approval.",
      reason: "Privileged or high-risk access requires stronger governance review.",
    };
  }

  if (user.approvalStatus === "Pending") {
    return {
      decision: "Review",
      recommendation: "Validate department, role, business need and approval evidence.",
      reason: "Request is pending and requires access governance validation.",
    };
  }

  return {
    decision: "Approved / Monitor",
    recommendation: "Maintain access and continue periodic access review.",
    reason: "User access is approved and within acceptable governance threshold.",
  };
}

function getGovernanceScore(user) {
  const risk = getUserRisk(user);

  const statusPenalty =
    user.approvalStatus === "Rejected"
      ? 35
      : user.approvalStatus === "Pending"
      ? 18
      : 0;

  const rolePenalty = isPrivilegedRole(user.role) ? 10 : 3;
  const activityPenalty = user.status !== "Active" ? 12 : 0;
  const riskPenalty = risk === "High" ? 20 : risk === "Medium" ? 10 : 0;

  return clamp(100 - statusPenalty - rolePenalty - activityPenalty - riskPenalty, 40, 100);
}

function getMaturity(score) {
  if (score >= 90) return "Optimised";
  if (score >= 80) return "Managed";
  if (score >= 70) return "Defined";
  if (score >= 60) return "Developing";
  return "Initial";
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [auditTrail, setAuditTrail] = useState([]);
  const [events, setEvents] = useState([]);
  const [lastExecuted, setLastExecuted] = useState("Not executed");
  const [analysisMode, setAnalysisMode] = useState("Idle");

  const enrichedUsers = useMemo(() => {
    return users.map((user) => ({
      ...user,
      risk: getUserRisk(user),
      governanceScore: getGovernanceScore(user),
      explanation: getAccessDecision(user),
    }));
  }, [users]);

  const totalUsers = enrichedUsers.length;
  const pendingCount = enrichedUsers.filter((u) => u.approvalStatus === "Pending").length;
  const approvedCount = enrichedUsers.filter((u) => u.approvalStatus === "Approved").length;
  const rejectedCount = enrichedUsers.filter((u) => u.approvalStatus === "Rejected").length;
  const activeUsers = enrichedUsers.filter((u) => u.status === "Active").length;
  const privilegedUsers = enrichedUsers.filter((u) => isPrivilegedRole(u.role)).length;
  const highRiskUsers = enrichedUsers.filter((u) => u.risk === "High").length;

  const accessCompliance = clamp((approvedCount / Math.max(totalUsers, 1)) * 100);

  const accessGovernanceScore = clamp(
    enrichedUsers.reduce((sum, user) => sum + user.governanceScore, 0) /
      Math.max(totalUsers, 1)
  );

  const maturityLevel = getMaturity(accessGovernanceScore);

  const accessDecision =
    highRiskUsers > 0
      ? "Escalate"
      : pendingCount > 0
      ? "Review"
      : "Monitor";

  const forecastScore = clamp(
    accessGovernanceScore +
      (pendingCount === 0 ? 3 : -2) +
      (highRiskUsers === 0 ? 2 : -3)
  );

  const executiveRecommendation =
    accessDecision === "Escalate"
      ? "Escalate high-risk and privileged access requests before approval."
      : accessDecision === "Review"
      ? "Review pending requests and validate role-based access evidence."
      : "Maintain current access governance posture and continue periodic review.";

  const watchlist = enrichedUsers
    .filter(
      (user) =>
        user.risk === "High" ||
        user.approvalStatus === "Pending" ||
        isPrivilegedRole(user.role)
    )
    .slice(0, 6);

  const loadUsers = async () => {
  try {

    const data = await apiRequest(
      "/user-management",
      "GET"
    );

    console.log(
      "USERS:",
      data
    );

    setUsers(data);

  } catch (err) {

    console.error(
      "LOAD USERS ERROR:",
      err
    );

  }
};

useEffect(() => {
  loadUsers();
}, []);

const handleApprove = async (id) => {
  try {

    await apiRequest(
      `/user-management/${id}/approve`,
      "PUT"
    );

    await loadUsers();

    setMessage(
      "User access approved successfully."
    );

  } catch (err) {

    console.error(
      "APPROVE ERROR:",
      err
    );

  }
};
const handleReject = async (id) => {
  try {

    await apiRequest(
      `/user-management/${id}/reject`,
      "PUT"
    );

    await loadUsers();

    setMessage(
      "User access rejected successfully."
    );

  } catch (err) {

    console.error(
      "REJECT ERROR:",
      err
    );

  }
};



  function addAuditTrail(user, action) {
    const record = {
      id: `IAM-AUD-${String(auditTrail.length + 1).padStart(3, "0")}`,
      user: user.name,
      department: user.department,
      role: user.role,
      action,
      time: new Date().toLocaleString(),
    };

    setAuditTrail([record, ...auditTrail]);
  }

  
  function addSystemAudit(action, details = "System action executed") {
  const record = {
    id: `IAM-AUD-${String(auditTrail.length + 1).padStart(3, "0")}`,
    user: "System",
    department: "Enterprise IAM",
    role: "Governance Engine",
    action: `${action} — ${details}`,
    time: new Date().toLocaleString(),
  };

  setAuditTrail((prev) => [record, ...prev]);
}

 function pushEvent(type, title, detail) {
  const event = {
    id: `EVT-${Date.now()}`,
    type,
    title,
    detail,
    time: new Date().toLocaleTimeString(),
  };

  setEvents((prev) => [event, ...prev].slice(0, 6));
  setLastExecuted(event.time);
}
 
  function approveLowRiskPending() {
    const targets = users.filter(
      (user) =>
        user.approvalStatus === "Pending" &&
        !isPrivilegedRole(user.role)
    );

    setUsers((prev) =>
      prev.map((user) =>
        user.approvalStatus === "Pending" && !isPrivilegedRole(user.role)
          ? {
              ...user,
              approvalStatus: "Approved",
              status: "Active",
              lastAction: "Low-risk access approved",
            }
          : user
      )
    );

    targets.forEach((user) => addAuditTrail(user, "Bulk approved low-risk access"));
    setMessage(`${targets.length} low-risk pending request(s) approved.`);
  }

  function rejectHighRiskPending() {
    const targets = users.filter(
      (user) =>
        user.approvalStatus === "Pending" &&
        isPrivilegedRole(user.role)
    );

    setUsers((prev) =>
      prev.map((user) =>
        user.approvalStatus === "Pending" && isPrivilegedRole(user.role)
          ? {
              ...user,
              approvalStatus: "Rejected",
              status: "Inactive",
              lastAction: "Privileged request rejected pending justification",
            }
          : user
      )
    );

    targets.forEach((user) => addAuditTrail(user, "Bulk rejected high-risk access"));
    setMessage(`${targets.length} high-risk privileged request(s) rejected.`);
  }

  function resetUsers() {
  loadUsers();

  setSelected(null);

  setAuditTrail([
    {
      id: "IAM-AUD-001",
      user: "System",
      department: "Enterprise IAM",
      role: "Governance Engine",
      action: "Restore Demo Dataset — Seeded users reloaded from backend",
      time: new Date().toLocaleString(),
    },
  ]);

  setAnalysisMode("Demo Dataset Restored");

pushEvent(
  "info",
  "Demo Dataset Restored",
  "Seeded enterprise identity records reloaded from backend."
);

  setMessage("Demo user dataset restored and audit trail refreshed.");
}

  return (
    <div className="admin-page">
      <p className="eyebrow">
        ENTERPRISE IDENTITY & ACCESS GOVERNANCE CENTRE
      </p>

      <h1>User Access Management</h1>

      <p className="admin-sub">
        Govern onboarding, approval workflows, role-based access control,
        privileged access risk, audit traceability and enterprise identity
        lifecycle management across INVISOR.
      </p>

      
      <div className="iam-command-hero">
  <div>
    <p className="hero-eyebrow">IDENTITY GOVERNANCE INTELLIGENCE</p>
    <h2>Access Risk & Approval Command Centre</h2>
    <p>
      INVISOR is monitoring <b>{totalUsers}</b> enterprise identities, including{" "}
      <b>{privilegedUsers}</b> privileged users and <b>{pendingCount}</b> pending
      access requests. Current recommended action is <b>{accessDecision}</b>.
    </p>
  </div>

  <div className={`iam-decision-orb ${accessDecision.toLowerCase()}`}>
    <span>{accessDecision}</span>
    <small>{accessGovernanceScore}% Score</small>
  </div>
</div>

<div className="iam-metric-grid">
  {[
    ["Access Governance", `${accessGovernanceScore}%`, maturityLevel],
    ["Pending Requests", pendingCount, "Awaiting review"],
    ["Privileged Users", privilegedUsers, "Sensitive access"],
    ["High-Risk Access", highRiskUsers, "Requires attention"],
    ["Approved Users", approvedCount, "Approved posture"],
    ["Rejected Users", rejectedCount, "Rejected access"],
    ["Access Compliance", `${accessCompliance}%`, "Approved access"],
    ["30-Day Forecast", `${forecastScore}%`, "Projected posture"],
  ].map(([label, value, note]) => (
    <div className="iam-metric-card" key={label}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </div>
  ))}
</div>

<div className="iam-intelligence-grid">
  <div className="admin-card iam-ai-panel">
    <div className="ai-panel-header">
      <div>
        <p className="hero-eyebrow">AI ACCESS RECOMMENDATION</p>
        <h3>Identity Governance Intelligence</h3>
      </div>

      <span className={`ai-priority ${accessDecision.toLowerCase()}`}>
        {accessDecision}
      </span>
    </div>

    <div className="ai-recommendation-box">
      <div className="ai-orb">🛡️</div>
      <div>
        <h2>{accessDecision} Access Action</h2>
        <p>{executiveRecommendation}</p>
      </div>
    </div>
  </div>

  <div className="admin-card">
    <h3>Access Risk Distribution</h3>

    <div className="iam-risk-bars">
      <div>
        <span>High Risk</span>
        <strong>{highRiskUsers}</strong>
        <i style={{ width: `${clamp((highRiskUsers / Math.max(totalUsers, 1)) * 100)}%` }} />
      </div>

      <div>
        <span>Pending Review</span>
        <strong>{pendingCount}</strong>
        <i style={{ width: `${clamp((pendingCount / Math.max(totalUsers, 1)) * 100)}%` }} />
      </div>

      <div>
        <span>Privileged Access</span>
        <strong>{privilegedUsers}</strong>
        <i style={{ width: `${clamp((privilegedUsers / Math.max(totalUsers, 1)) * 100)}%` }} />
      </div>
    </div>
  </div>
</div>

{highRiskUsers > 0 && (
  <div className="admin-success">
    {highRiskUsers} high-risk access item(s) require governance review.
  </div>
)}

{message && <div className="admin-success">{message}</div>}
<div className="admin-card governance-event-centre">
  <div className="card-header">
    <h3>Live Governance Event Centre</h3>
    <span>Last Execution: {lastExecuted}</span>
  </div>

  <div className="event-status-row">
    <div>
      <span>Engine Status</span>
      <strong>{analysisMode}</strong>
    </div>

    <div>
      <span>Access Score</span>
      <strong>{accessGovernanceScore}%</strong>
    </div>

    <div>
      <span>Decision</span>
      <strong>{accessDecision}</strong>
    </div>
  </div>

  <div className="event-list">
    {events.length === 0 ? (
      <p>No governance events executed yet.</p>
    ) : (
      events.map((event) => (
        <div className={`event-item ${event.type}`} key={event.id}>
          <strong>{event.time}</strong>
          <div>
            <h4>{event.title}</h4>
            <p>{event.detail}</p>
          </div>
        </div>
      ))
    )}
  </div>
</div>
<div className="enterprise-action-grid">
  <div
    className="enterprise-action-card"
        onClick={() => {
      setUsers((prev) =>
        prev.map((user) => ({
          ...user,
          status: "Analysed",
          lastAction: "Governance analysis completed",
        }))
      );

      addSystemAudit(
        "Run Governance Analysis",
        `${totalUsers} identities analysed and marked as Analysed`
      );

      setAnalysisMode("Governance Analysis Completed");

      pushEvent(
        "success",
        "Governance Analysis Completed",
        `${totalUsers} identities analysed and marked as Analysed.`
      );

      setMessage(
        `Governance analysis completed. ${totalUsers} user records are now marked as Analysed.`
      );
    }}
  >
    <div className="enterprise-action-icon">🔍</div>
    <h3>Run Governance Analysis</h3>
    <p>Analyse enterprise identities, approval posture, privileged accounts and governance maturity.</p>
    <span>Execute →</span>
  </div>

  <div
    className="enterprise-action-card"
    onClick={() => {
      setUsers((prev) =>
        prev.map((user) =>
          isPrivilegedRole(user.role) || getUserRisk(user) === "High"
            ? {
                ...user,
                lastAction: "Privileged risk detected",
                status: "Under Review",
              }
            : user
        )
      );

      addSystemAudit(
  "Detect Privileged Risks",
  `${privilegedUsers} privileged identities reviewed; ${highRiskUsers} high-risk records flagged`
);

      setAnalysisMode("Privileged Risk Detection Completed");

      pushEvent(
        "warning",
        "Privileged Risk Detection Completed",
        `${privilegedUsers} privileged identities reviewed. ${highRiskUsers} high-risk identities flagged for governance review.`
      );

      setMessage(
        `${privilegedUsers} privileged identities reviewed. High-risk users are now marked Under Review.`
      );
    }}
  >
    <div className="enterprise-action-icon">🛡</div>
    <h3>Detect Privileged Risks</h3>
    <p>Identify excessive permissions, segregation-of-duties conflicts and privileged access risks.</p>
    <span>Execute →</span>
  </div>

  <div
    className="enterprise-action-card"
    onClick={() => {
      setUsers((prev) =>
        prev.map((user) =>
          user.approvalStatus === "Approved"
            ? {
                ...user,
                approvalStatus: "Pending",
                lastAction: "Quarterly access review initiated",
              }
            : user
        )
      );

      addSystemAudit(
        "Launch Access Review",
        "Approved users moved into quarterly review queue"
      );

      setAnalysisMode("Quarterly Access Review Launched");

      pushEvent(
        "info",
        "Quarterly Access Review Launched",
        `${approvedCount} approved users moved into the quarterly access certification campaign.`
      );

      setMessage(
        "Quarterly access review launched. Approved users moved to Pending review."
      );
    }}
  >
    <div className="enterprise-action-icon">📋</div>
    <h3>Launch Access Review</h3>
    <p>Initiate enterprise certification campaign across all departments.</p>
    <span>Execute →</span>
  </div>

  <div
    className="enterprise-action-card"
    onClick={() => {
        setUsers((prev) =>
          prev.map((user) => ({
            ...user,
            lastAction: `Governance score recalculated at ${getGovernanceScore(user)}%`,
          }))
        );

      addSystemAudit(
        "Recalculate Governance",
        `All user governance scores recalculated. Current average score: ${accessGovernanceScore}%`
      );

      setAnalysisMode("Governance Score Recalculated");

      pushEvent(
        "success",
        "Governance Score Recalculated",
        `Average governance score recalculated to ${accessGovernanceScore}% across ${totalUsers} identities.`
      );

      setMessage(
        "Governance recalculation completed. All governance scores have been refreshed."
      );
      }}
        >
    <div className="enterprise-action-icon">📊</div>
    <h3>Recalculate Governance</h3>
    <p>Recompute governance maturity, compliance posture and identity health.</p>
    <span>Execute →</span>
  </div>

  <div
    className="enterprise-action-card warning"
    onClick={() => {
      const breachUser = {
        _id: `SIM-${Date.now()}`,
        name: "Simulated Privileged Breach",
        email: "simulated.breach@invisor.local",
        department: "Enterprise IAM",
        role: "Privileged Administrator",
        status: "Inactive",
        approvalStatus: "Pending",
        lastAction: "Policy breach simulation created",
      };

      setUsers((prev) => [breachUser, ...prev]);

      addSystemAudit(
        "Simulate Policy Breach",
        "New privileged pending access record created"
      );

      setAnalysisMode("Policy Breach Simulated");

      pushEvent(
        "critical",
        "Policy Breach Simulation Executed",
        "A simulated privileged administrator account has been created for governance validation."
      );

      setMessage(
        "Policy breach simulated successfully. High-risk privileged account added for investigation."
      );
    }}
  >
    <div className="enterprise-action-icon">⚠</div>
    <h3>Simulate Policy Breach</h3>
    <p>Execute governance simulation to validate enterprise resilience.</p>
    <span>Execute →</span>
  </div>

  <div
  className="enterprise-action-card"
  onClick={resetUsers}
>
  <div className="enterprise-action-icon">♻</div>
  <h3>Restore Demo Dataset</h3>
  <p>Reload seeded enterprise users and reset governance metrics.</p>
  <span>Execute →</span>
</div>

</div>

{selected && (
      
        <div className="admin-card executive">
          <h3>{selected.name} Access Decision Explanation</h3>

          <p>
            <b>Email:</b> {selected.email}
            <br />
            <b>Department:</b> {selected.department}
            <br />
            <b>Role:</b> {selected.role}
            <br />
            <b>Status:</b> {selected.approvalStatus}
            <br />
            <b>Risk:</b> {selected.risk}
            <br />
            <b>Governance Score:</b> {selected.governanceScore}%
            <br />
            <b>Decision:</b> {selected.explanation.decision}
            <br />
            <b>Recommendation:</b> {selected.explanation.recommendation}
            <br />
            <b>Reason:</b> {selected.explanation.reason}
          </p>
        </div>
      )}

      <div className="admin-card large">
        <div className="card-header">
          <h3>User Access Governance Register</h3>
          <span>{enrichedUsers.length} records</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Approval</th>
              <th>Risk</th>
              <th>Score</th>
              <th>Decision</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {enrichedUsers.map((user) => (
              <tr
                    key={user._id}
                    onClick={() => setSelected(user)}
                    className={
                      user.approvalStatus === "Pending"
                        ? "pending-row"
                        : selected?._id === user._id
                        ? "selected-row"
                        : ""
                    }
                  >
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.department}</td>
               <td>
                      {user.role}

                      {user.approvalStatus === "Pending" && (
                        <span
                          style={{
                            marginLeft: "8px",
                            color: "#f59e0b",
                            fontWeight: 700
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </td>

                <td>
                  <span
                    className={`risk ${
                      user.approvalStatus === "Approved"
                        ? "low"
                        : user.approvalStatus === "Rejected"
                        ? "high"
                        : "medium"
                    }`}
                  >
                    {user.approvalStatus}
                  </span>
                </td>

                <td className={`risk ${user.risk.toLowerCase()}`}>
                  {user.risk}
                </td>

                <td>{user.governanceScore}%</td>
                <td>{user.explanation.decision}</td>

                <td>
                  {user.approvalStatus === "Pending" ? (
                    <>
                      <button
                        className="secondary-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleApprove(user._id);
                        }}
                      >
                        Approve
                      </button>

                      <button
                        className="danger-btn"
                        style={{ marginLeft: "10px" }}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleReject(user._id);
                        }}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    user.lastAction || "No action required"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Executive Access Watchlist</h3>

        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Department</th>
              <th>Concern</th>
              <th>Recommended Action</th>
            </tr>
          </thead>

          <tbody>
            {watchlist.map((user) => (
              <tr key={user._id} onClick={() => setSelected(user)}>
                <td>{user.name}</td>
                <td>{user.department}</td>
                <td>
                  {user.risk === "High"
                    ? "High-risk or privileged access"
                    : user.approvalStatus === "Pending"
                    ? "Pending access approval"
                    : "Privileged access monitoring"}
                </td>
                <td>{user.explanation.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Access Governance Audit Trail</h3>

        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>User</th>
              <th>Department</th>
              <th>Role</th>
              <th>Action</th>
              <th>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {auditTrail.length === 0 ? (
              <tr>
                <td colSpan="6">No access governance actions recorded yet.</td>
              </tr>
            ) : (
              auditTrail.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.user}</td>
                  <td>{log.department}</td>
                  <td>{log.role}</td>
                  <td>{log.action}</td>
                  <td>{log.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { departmentConfig, normalizeDepartment } from "../config/departmentConfig";
import { allocationData } from "../data/allocationData";
import DepartmentGovernanceLifecycle from "../components/DepartmentGovernanceLifecycle";
import "../styles/allocation.css";

export default function Allocation() {
  const { user } = useAuth();
  const departmentKey = normalizeDepartment(user?.department);
  const config = departmentConfig[departmentKey];
  const departmentName = config?.shortName || departmentKey || "Enterprise";

  const initialData =
    user?.role === "department_user"
      ? allocationData[user.department] || []
      : Object.values(allocationData).flat();

  const [validationData, setValidationData] = useState(initialData);
  const [selected, setSelected] = useState(null);
  const [actionMsg, setActionMsg] = useState("");

  const totalAssets = validationData.length;

  const highRisk = validationData.filter((item) => item.risk === "High").length;
  const mediumRisk = validationData.filter((item) => item.risk === "Medium").length;
  const lowRisk = validationData.filter((item) => item.risk === "Low").length;

  const pendingValidation = validationData.filter(
    (item) => item.validation !== "Passed"
  ).length;

  const escalatedItems = validationData.filter(
    (item) => item.status === "Escalated"
  ).length;

  const reallocatedItems = validationData.filter(
    (item) => item.status === "Reallocated"
  ).length;

  const complianceScore = Math.max(
    65,
    100 - highRisk * 4 - pendingValidation * 2
  );

  const avgManualTime = useMemo(() => {
    if (!validationData.length) return 0;

    const total = validationData.reduce(
      (sum, item) => sum + Number(item.manualTime || 0),
      0
    );

    return Math.round(total / validationData.length);
  }, [validationData]);

  const avgSystemTime = useMemo(() => {
    if (!validationData.length) return 0;

    const total = validationData.reduce(
      (sum, item) => sum + Number(item.systemTime || 0),
      0
    );

    return Math.round(total / validationData.length);
  }, [validationData]);

  const timeSaved = Math.max(0, avgManualTime - avgSystemTime);

  const operationalEfficiency =
    avgManualTime > 0
      ? Math.min(100, Math.round((timeSaved / avgManualTime) * 100))
      : 0;

  const riskManagementScore = Math.max(60, 100 - highRisk * 8 - mediumRisk * 4);

  const validationReadiness = totalAssets
    ? Math.round(((totalAssets - pendingValidation) / totalAssets) * 100)
    : 0;

  const governanceHealth = Math.round(
    (complianceScore +
      operationalEfficiency +
      riskManagementScore +
      validationReadiness) /
      4
  );

  const maturityLevel =
    governanceHealth >= 90
      ? "Optimised"
      : governanceHealth >= 80
      ? "Managed"
      : governanceHealth >= 70
      ? "Defined"
      : "Developing";

  const priorityRecommendation =
    highRisk > 0
      ? "Rebalance and validate high-risk assets"
      : pendingValidation > 0
      ? "Complete pending validation activities"
      : "Maintain current allocation strategy";

  const governanceFactors = [
    {
      name: "Resource Allocation",
      value: operationalEfficiency,
      impact: "+ Operational Efficiency",
      level: operationalEfficiency >= 70 ? "high" : "medium",
    },
    {
      name: "Governance Compliance",
      value: complianceScore,
      impact: "+ Control Validation",
      level: complianceScore >= 75 ? "high" : "medium",
    },
    {
      name: "Risk Exposure",
      value: riskManagementScore,
      impact: highRisk > 0 ? "- Risk Exposure" : "+ Stable Risk Posture",
      level: highRisk > 0 ? "medium" : "low",
    },
    {
      name: "Validation Readiness",
      value: validationReadiness,
      impact: "+ Audit Readiness",
      level: validationReadiness >= 80 ? "high" : "medium",
    },
  ];

  function getDecision(item) {
    if (item.risk === "High" || item.validation === "Failed") {
      return {
        decision: "Escalate",
        recommendation: "Escalate to Governance Review Board",
        reason:
          "High risk exposure or failed validation requires governance review before allocation can proceed.",
      };
    }

    if (item.validation === "Pending" || item.status === "Reallocated") {
      return {
        decision: "Review",
        recommendation: "Route for validation review",
        reason:
          "Pending validation or reallocation requires additional control checks before closure.",
      };
    }

    return {
      decision: "Approve",
      recommendation: "Maintain current allocation",
      reason:
        "Validation has passed and risk level is within acceptable governance thresholds.",
    };
  }

  const selectedDecision = selected ? getDecision(selected) : null;

  function runRebalance() {
    const updated = validationData.map((item) => {
      if (item.risk === "High" || item.status === "Over-allocated") {
        return {
          ...item,
          status: "Reallocated",
          validation: "Pending",
          risk: "Medium",
          allocatedTo: `${config?.shortName || "Enterprise"} Optimised Pool`,
          lastAction: "Governance Rebalanced",
        };
      }

      return item;
    });

    setValidationData(updated);
    setActionMsg("High-risk assets reallocated to optimised governance pool.");
  }

  function validateAssets() {
    const updated = validationData.map((item) => {
      if (item.validation === "Pending") {
        return {
          ...item,
          validation: "Passed",
          status: "Validated",
          risk: "Low",
          lastAction: "Validation Completed",
        };
      }

      return item;
    });

    setValidationData(updated);
    setActionMsg("Pending assets validated and risk reduced.");
  }

  function escalateRisk() {
    const updated = validationData.map((item) => {
      if (item.risk === "High" || item.validation === "Failed") {
        return {
          ...item,
          status: "Escalated",
          allocatedTo: "Governance Review Board",
          lastAction: "Escalated to Governance",
        };
      }

      return item;
    });

    setValidationData(updated);
    setActionMsg("High-risk assets escalated to governance review.");
  }

  function simulateRisk() {
    if (!validationData.length) {
      setActionMsg("No records available for risk simulation.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * validationData.length);

    const updated = validationData.map((item, index) => {
      if (index === randomIndex) {
        return {
          ...item,
          status: "Risk Detected",
          validation: "Failed",
          risk: "High",
          allocatedTo: "Exception Queue",
          lastAction: "Risk Simulation Triggered",
        };
      }

      return item;
    });

    setValidationData(updated);
    setActionMsg("New risk event simulated and added to exception queue.");
  }

  function resetData() {
    setValidationData(initialData);
    setSelected(null);
    setActionMsg("Dataset reset successfully.");
  }

  return (
    <div className="alloc-page">
      <p className="eyebrow">
        ENTERPRISE RESILIENCE & RESOURCE GOVERNANCE CENTRE
      </p>

      <h2>
        {user?.role === "department_user"
          ? `${config?.shortName} Operational Resource Governance`
          : "Enterprise Operational Resource Governance Repository"}
      </h2>

      <p className="sub">
        Governance-driven allocation dashboard using operational validation
        data, risk monitoring, audit traceability and dynamic asset allocation
        workflows.
      </p>

      <div className="alloc-kpi">
        <div className="kpi-card">
          <span>Total Records</span>
          <h3>{totalAssets}</h3>
        </div>

        <div className="kpi-card">
          <span>Compliance</span>
          <h3>{complianceScore}%</h3>
        </div>

        <div className="kpi-card">
          <span>High Risk</span>
          <h3>{highRisk}</h3>
        </div>

        <div className="kpi-card">
          <span>Time Saved</span>
          <h3>{timeSaved}m</h3>
        </div>

        <div className="kpi-card">
          <span>Governance Health</span>
          <h3>{governanceHealth}%</h3>
        </div>
      </div>

      {actionMsg && <div className="success-msg">{actionMsg}</div>}

      <div className="alloc-card highlight">
        <h3>Operational Governance Intelligence</h3>
        <p>
          <b>Governance Health:</b> {governanceHealth}% <br />
          <b>Maturity Level:</b> {maturityLevel} <br />
          <b>Priority Recommendation:</b> {priorityRecommendation}
        </p>
      </div>

      <div className="alloc-card highlight">
        <h3>Resource Allocation Decision Logic</h3>
        <p>
          Allocation records are assessed using validation status, risk level,
          operational efficiency and compliance readiness. INVISOR recommends
          whether an asset should be approved, reviewed, rebalanced or escalated.
        </p>
      </div>

      <div className="action-row">
        <button onClick={runRebalance}>Rebalance Assets</button>
        <button onClick={validateAssets}>Validate Assets</button>
        <button onClick={escalateRisk}>Escalate Risk</button>
        <button onClick={simulateRisk}>Simulate Risk</button>
        <button onClick={resetData}>Reset Dataset</button>
      </div>

      <div className="alloc-card detail">
        <h3>
          {user?.role === "department_user"
            ? `${config?.shortName} Operational Resource Governance Repository`
            : "Enterprise Operational Resource Governance Repository"}
        </h3>

        <table className="test-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Workflow</th>
              <th>Department</th>
              <th>Status</th>
              <th>Validation</th>
              <th>Risk</th>
              <th>Allocated To</th>
              <th>Last Action</th>
              <th>Decision</th>
            </tr>
          </thead>

          <tbody>
            {validationData.map((item) => {
              const decision = getDecision(item);

              return (
                <tr key={item.id} onClick={() => setSelected(item)}>
                  <td>{item.id}</td>
                  <td>{item.asset}</td>
                  <td>{item.dept || item.department}</td>
                  <td>{item.status}</td>
                  <td>{item.validation}</td>
                  <td className={`risk ${item.risk?.toLowerCase() || ""}`}>
                    {item.risk}
                  </td>
                  <td>{item.allocatedTo}</td>
                  <td>{item.lastAction}</td>
                  <td>{decision.decision}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="alloc-card detail">
        <h3>Resource Governance Assessment</h3>

        <table className="test-table">
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Score</th>
              <th>Governance Interpretation</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Compliance</td>
              <td>{complianceScore}%</td>
              <td>Measures validation and control adherence</td>
            </tr>

            <tr>
              <td>Operational Efficiency</td>
              <td>{operationalEfficiency}%</td>
              <td>Measures improvement from manual to system processing</td>
            </tr>

            <tr>
              <td>Risk Management</td>
              <td>{riskManagementScore}%</td>
              <td>Assesses risk exposure across allocation records</td>
            </tr>

            <tr>
              <td>Validation Readiness</td>
              <td>{validationReadiness}%</td>
              <td>Measures readiness for governance closure</td>
            </tr>

            <tr>
              <td>Governance Health</td>
              <td>{governanceHealth}%</td>
              <td>Overall operational governance posture</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="alloc-card detail">
        <h3>Governance Factor Contribution</h3>

        {governanceFactors.map((factor) => (
          <div className="summary-item" key={factor.name}>
            <span>
              {factor.name} — {factor.impact}
            </span>
            <b>{factor.value}%</b>
          </div>
        ))}
      </div>

      <div className="alloc-card detail">
        <h3>Risk Distribution</h3>

        <div className="summary-item">
          <span>High Risk</span>
          <b>{highRisk}</b>
        </div>

        <div className="summary-item">
          <span>Medium Risk</span>
          <b>{mediumRisk}</b>
        </div>

        <div className="summary-item">
          <span>Low Risk</span>
          <b>{lowRisk}</b>
        </div>

        <div className="summary-item">
          <span>Escalated Items</span>
          <b>{escalatedItems}</b>
        </div>

        <div className="summary-item">
          <span>Reallocated Items</span>
          <b>{reallocatedItems}</b>
        </div>
      </div>

      {selected && selectedDecision && (
        <div className="alloc-card detail">
          <h3>{selected.asset} Decision Explainability</h3>

          <ul>
            <li>Status: {selected.status}</li>
            <li>Risk: {selected.risk}</li>
            <li>Validation: {selected.validation}</li>
            <li>Allocated To: {selected.allocatedTo}</li>
            <li>Last Action: {selected.lastAction}</li>
            <li>Decision: {selectedDecision.decision}</li>
            <li>Recommendation: {selectedDecision.recommendation}</li>
            <li>Reason: {selectedDecision.reason}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
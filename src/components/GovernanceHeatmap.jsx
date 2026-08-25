import { useMemo, useState } from "react";
import ExecutiveHeader from "../components/ExecutiveHeader";
import GovernanceCard from "../components/GovernanceCard";
import { calculateRiskScore, classifyRisk } from "../services/governanceEngine";
import { getPolicy } from "../services/GovernancePolicy";
import { logAuditEvent } from "../services/auditService";

const DEPARTMENT_RISK_MAP = {
  Risk: 0.95,
  Finance: 0.8,
  HR: 0.45,
  Technology: 0.7,
};

const PRIORITY_MAP = {
  Low: 0.3,
  Medium: 0.6,
  High: 0.9,
  Critical: 1.0,
};

export default function Allocation() {

  const [form, setForm] = useState({
    department: "Risk",
    priority: "High",
    scarcityIndex: 0.75,
    slaUrgency: 0.85,
  });

  const [result, setResult] = useState(null);

  const policy = getPolicy();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function runAllocation() {

    const inputs = {
      departmentRisk: DEPARTMENT_RISK_MAP[form.department],
      priorityLevel: PRIORITY_MAP[form.priority],
      scarcityIndex: Number(form.scarcityIndex),
      slaUrgency: Number(form.slaUrgency),
    };

    const score = calculateRiskScore(inputs);
    const level = classifyRisk(score);

    const conflictDetected = inputs.scarcityIndex > 0.85;

    const decision = {
      score,
      level,
      conflictDetected,
      slaBreach: inputs.slaUrgency > 0.8,
      approvalRoute:
        level === "High"
          ? "Senior Governance Escalation"
          : level === "Medium"
          ? "Manager Review Required"
          : "Standard Approval Workflow",
      explanation: generateExplanation(inputs, score, level)
    };

    setResult(decision);

    logAuditEvent("ALLOCATION_PROCESSED", {
      ...decision,
      inputs
    });

  }

  function generateExplanation(inputs, score, level) {

    return `
This allocation request was evaluated using INVISOR's weighted governance model.

Department Risk Contribution: ${inputs.departmentRisk}
Priority Contribution: ${inputs.priorityLevel}
Scarcity Pressure: ${inputs.scarcityIndex}
SLA Urgency: ${inputs.slaUrgency}

Combined Risk Score: ${score}

Based on governance thresholds (High ≥ ${policy.riskHigh}, Medium ≥ ${policy.riskMedium}),
the request is classified as ${level} risk.

Approval routing follows enterprise governance policy to ensure risk-aligned decision control.
`;
  }

  return (

    <div className="space-y-10">

      <ExecutiveHeader
        title="Allocation Intelligence Engine"
        subtitle="Risk-weighted allocation modelling with governance policy enforcement, conflict detection, and SLA escalation logic."
      />

      <div className="grid xl:grid-cols-2 gap-8">

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">

          <h2 className="text-xl font-semibold text-blue-400 mb-4">
            Allocation Inputs
          </h2>

          <div className="space-y-4">

            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full bg-white/10 p-3 rounded-xl"
            >
              <option>Risk</option>
              <option>Finance</option>
              <option>Human Resource</option>
              <option>Technology</option>
            </select>

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full bg-white/10 p-3 rounded-xl"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>

            <input
              type="number"
              name="scarcityIndex"
              step="0.01"
              value={form.scarcityIndex}
              onChange={handleChange}
              className="w-full bg-white/10 p-3 rounded-xl"
            />

            <input
              type="number"
              name="slaUrgency"
              step="0.01"
              value={form.slaUrgency}
              onChange={handleChange}
              className="w-full bg-white/10 p-3 rounded-xl"
            />

            <button
              onClick={runAllocation}
              className="btn-primary w-full"
            >
              Execute Allocation Governance
            </button>

          </div>

        </div>

        {result && (

          <div className="space-y-6">

            <div className="grid grid-cols-2 gap-4">

              <GovernanceCard label="Risk Score" value={result.score} status={result.level} />

              <GovernanceCard label="Risk Tier" value={result.level} status={result.level} />

              <GovernanceCard
                label="SLA Breach"
                value={result.slaBreach ? "Yes" : "No"}
                status={result.slaBreach ? "High" : "Low"}
              />

              <GovernanceCard
                label="Conflict Detection"
                value={result.conflictDetected ? "Detected" : "Clear"}
                status={result.conflictDetected ? "High" : "Low"}
              />

            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">

              <h2 className="text-lg font-semibold text-blue-400 mb-3">
                Governance Decision Explanation
              </h2>

              <p className="text-sm text-gray-300 whitespace-pre-line">
                {result.explanation}
              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}
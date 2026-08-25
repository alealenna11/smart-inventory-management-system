export function getRiskValue(risk) {
  if (risk === "High") return 90;
  if (risk === "Medium") return 60;
  if (risk === "Low") return 30;
  return 50;
}

export function calculateGovernanceScore({
  risk = "Medium",
  complianceScore = 75,
  auditReadiness = 75,
  operationalHealth = 75,
}) {
  const riskControl = 100 - getRiskValue(risk);

  return Math.round(
    riskControl * 0.4 +
      complianceScore * 0.3 +
      auditReadiness * 0.2 +
      operationalHealth * 0.1
  );
}

export function classifyMaturity(score) {
  if (score >= 90) return "Optimised";
  if (score >= 80) return "Managed";
  if (score >= 70) return "Defined";
  if (score >= 60) return "Developing";
  return "Initial";
}

export function generateRecommendation(item = {}) {
  const riskValue = getRiskValue(item.risk);
  const hasMissingEvidence =
    item.evidence === "Missing" || item.validation === "Failed";
  const isEscalated = item.status === "Escalated";

  if (riskValue >= 80 || hasMissingEvidence || isEscalated) {
    return {
      decision: "Escalate",
      priority: "High",
      recommendation: "Escalate to Governance Review Board",
      reason:
        "High risk exposure, missing evidence, failed validation or existing escalation requires management review.",
    };
  }

  if (riskValue >= 50 || item.status === "Pending" || item.status === "Review") {
    return {
      decision: "Review",
      priority: "Medium",
      recommendation: "Route for governance review",
      reason:
        "Moderate risk or pending status requires additional validation before approval.",
    };
  }

  return {
    decision: "Approve",
    priority: "Low",
    recommendation: "Approve and retain audit trail",
    reason:
      "Low risk and sufficient validation evidence indicate acceptable governance posture.",
  };
}

export function explainDecision(item = {}) {
  const factors = [];

  if (item.risk) factors.push(`Risk level assessed as ${item.risk}`);
  if (item.status) factors.push(`Current status is ${item.status}`);
  if (item.evidence) factors.push(`Evidence status is ${item.evidence}`);
  if (item.validation) factors.push(`Validation status is ${item.validation}`);
  if (item.priority) factors.push(`Priority is ${item.priority}`);

  const recommendation = generateRecommendation(item);

  return {
    ...recommendation,
    factors,
    explanation: `Decision is ${recommendation.decision} because ${recommendation.reason}`,
  };
}

export function rankDepartments(records = []) {
  const grouped = {};

  records.forEach((item) => {
    const dept = item.department || item.dept || "Enterprise";

    if (!grouped[dept]) {
      grouped[dept] = {
        department: dept,
        total: 0,
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 0,
        scoreTotal: 0,
      };
    }

    grouped[dept].total += 1;
    if (item.risk === "High") grouped[dept].highRisk += 1;
    if (item.risk === "Medium") grouped[dept].mediumRisk += 1;
    if (item.risk === "Low") grouped[dept].lowRisk += 1;

    grouped[dept].scoreTotal += calculateGovernanceScore({
      risk: item.risk,
      complianceScore: item.score || 80,
      auditReadiness: item.evidence === "Missing" ? 60 : 85,
      operationalHealth: item.validation === "Failed" ? 60 : 85,
    });
  });

  return Object.values(grouped)
    .map((dept) => {
      const score = Math.round(dept.scoreTotal / dept.total);
      return {
        ...dept,
        governanceScore: score,
        maturity: classifyMaturity(score),
      };
    })
    .sort((a, b) => b.governanceScore - a.governanceScore);
}
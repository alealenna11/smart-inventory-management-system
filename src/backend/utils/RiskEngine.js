export function calculateRiskScore(data) {
  const weights = {
    department: 0.3,
    priority: 0.25,
    scarcity: 0.25,
    sla: 0.2
  };

  const score =
    data.departmentRisk * weights.department +
    data.priorityLevel * weights.priority +
    data.scarcityIndex * weights.scarcity +
    data.slaExposure * weights.sla;

  return Number(score.toFixed(3));
}

export function classifyRisk(score) {
  if (score >= 0.75) return "High";
  if (score >= 0.5) return "Medium";
  return "Low";
}
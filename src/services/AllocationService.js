const WEIGHTS = {
  departmentRisk: 0.3,
  priorityLevel: 0.25,
  scarcityIndex: 0.25,
  slaUrgency: 0.2,
};

export function calculateRiskScore({
  departmentRisk,
  priorityLevel,
  scarcityIndex,
  slaUrgency,
}) {
  const score =
    departmentRisk * WEIGHTS.departmentRisk +
    priorityLevel * WEIGHTS.priorityLevel +
    scarcityIndex * WEIGHTS.scarcityIndex +
    slaUrgency * WEIGHTS.slaUrgency;

  return Number(score.toFixed(3));
}

export function classifyRisk(score) {
  if (score >= 0.75) return "High";
  if (score >= 0.45) return "Medium";
  return "Low";
}

export function getRiskWeights() {
  return WEIGHTS;
}
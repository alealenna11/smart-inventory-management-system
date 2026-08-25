export function generateDecisionExplanation({
  risk,
  compliance,
  budget,
  utilisation
}) {

  const reasons = [];

  if (risk < 30)
    reasons.push("Risk exposure remains within governance threshold.");

  if (compliance > 90)
    reasons.push("Department satisfies enterprise compliance requirements.");

  if (budget > 0)
    reasons.push("Budget capacity remains available.");

  if (utilisation < 80)
    reasons.push("Resource utilisation remains sustainable.");

  const score =
    Math.round(
      ((100 - risk) * 0.35) +
      (compliance * 0.30) +
      (budget * 0.15) +
      ((100 - utilisation) * 0.20)
    );

  const decision =
    score >= 80
      ? "Approved"
      : score >= 60
      ? "Review Required"
      : "Rejected";

  return {
    score,
    decision,
    reasons
  };
}
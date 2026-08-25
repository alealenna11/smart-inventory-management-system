import { useMemo } from "react";

export default function ExecutiveInsight({ riskScore, fairnessScore, slaUrgency, scarcityIndex }) {

  const insight = useMemo(() => {

    if (riskScore > 0.85 && slaUrgency > 0.8) {
      return {
        level: "critical",
        message: "Critical governance anomaly detected. SLA pressure and scarcity are driving risk concentration.",
        action: "Immediate escalation recommended"
      };
    }

    if (riskScore > 0.7) {
      return {
        level: "medium",
        message: "Moderate governance exposure. Allocation imbalance may impact fairness.",
        action: "Monitor and rebalance"
      };
    }

    return {
      level: "low",
      message: "System operating within governance thresholds.",
      action: "No action required"
    };

  }, [riskScore, fairnessScore, slaUrgency, scarcityIndex]);

  return (
    <div className={`insight-card ${insight.level}`}>
      <h3>🧠 Executive Insight</h3>
      <p>{insight.message}</p>
      <strong>{insight.action}</strong>
    </div>
  );
}
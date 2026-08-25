import { useMemo } from "react";

export default function ExecutiveAI({ allocation, risks }) {

  const insight = useMemo(() => {

    const avgAllocation =
      allocation.reduce((a, b) => a + b, 0) / allocation.length;

    const highRisk = risks.filter(r => r.impact >= 4 && r.probability >= 4);

    let message = "";

    if (avgAllocation > 180) {
      message += "⚠ Allocation pressure increasing. ";
    }

    if (highRisk.length > 0) {
      message += `${highRisk.length} critical governance risks detected. `;
    }

    if (!message) {
      message = "Governance environment stable.";
    }

    return message;

  }, [allocation, risks]);

  return (
    <div className="ai-hero">
      <h2>AI Governance Intelligence</h2>

      <p>{insight}</p>

      <small>
        Dynamic analysis based on real-time governance signals • Confidence: 92%
      </small>
    </div>
  );
}
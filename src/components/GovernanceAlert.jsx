import { AlertTriangle, ShieldAlert } from "lucide-react";

export default function GovernanceAlert({
  title = "Governance Risk Detected",
  message,
  severity = "high",
  timestamp = new Date().toLocaleString(),
}) {
  const severityConfig = {
    critical: {
      label: "Critical",
      className: "critical",
    },
    high: {
      label: "High Risk",
      className: "high",
    },
    medium: {
      label: "Medium Risk",
      className: "medium",
    },
  };

  const config = severityConfig[severity] || severityConfig.high;

  return (
    <div className={`governance-alert ${config.className}`}>
      <div className="alert-header">
        <div className="alert-title">
          <ShieldAlert size={18} />
          <strong>{title}</strong>
        </div>

        <div className={`severity-badge ${config.className}`}>
          <AlertTriangle size={14} />
          {config.label}
        </div>
      </div>

      <div className="alert-body">
        <p>{message}</p>
      </div>

      <div className="alert-footer">
        <span>Governance Monitoring Engine</span>
        <span>{timestamp}</span>
      </div>
    </div>
  );
}
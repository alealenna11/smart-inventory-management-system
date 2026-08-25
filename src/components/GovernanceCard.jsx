export default function GovernanceCard({ label, value, status, helper }) {
  const getColor = () => {
    if (status === "High") return "#ef4444";
    if (status === "Medium") return "#f59e0b";
    if (status === "Low") return "#22c55e";
    return "#3b82f6";
  };

  return (
    <div
      className="glass-card kpi-card"
      style={{
        borderLeft: `4px solid ${getColor()}`,
        background: "rgba(255,255,255,0.05)",
        borderRadius: "16px",
        padding: "18px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        minHeight: "118px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          color: "rgba(255,255,255,0.60)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>

      <h3
        style={{
          fontSize: "28px",
          marginTop: "12px",
          marginBottom: helper ? "8px" : 0,
          color: "#fff",
          fontWeight: 700,
        }}
      >
        {value}
      </h3>

      {helper && (
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {helper}
        </p>
      )}
    </div>
  );
}
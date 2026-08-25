export default function ExecutiveHeader({ title, subtitle }) {
  return (
    <div className="page-header" style={{ marginBottom: "28px" }}>
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#60a5fa",
          fontWeight: 600,
        }}
      >
        INVISOR Governance Platform
      </p>

      <h1
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          fontSize: "38px",
          fontWeight: 800,
          color: "#ffffff",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          margin: 0,
          maxWidth: "920px",
          fontSize: "15px",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.70)",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}
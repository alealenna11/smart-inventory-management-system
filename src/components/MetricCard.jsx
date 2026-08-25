export default function MetricCard({ title, value }) {
  return (
    <div className="metric-card">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
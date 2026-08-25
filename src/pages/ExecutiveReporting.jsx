
import { useMemo, useState } from "react";
import "../styles/executiveReporting.css";
import { executiveReportingData } from "../data/executiveReportingData";
import { executiveBoardPacksData } from "../data/executiveBoardPacksData";

const clamp = (v, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number(v) || 0)));

const asArray = (data) => (Array.isArray(data) ? data : Object.values(data || {}).flat());

const num = (v) => {
  const n = parseFloat(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

function KPI({ label, value, note, primary }) {
  return (
    <div className={`admin-kpi ${primary ? "primary" : ""}`}>
      <span>{label}</span>
      <h2>{value}</h2>
      <p>{note}</p>
    </div>
  );
}

function getScore(item) {
  return clamp(
    item.score ??
      item.value ??
      item.result ??
      item.current ??
      item.achieved ??
      item.governance ??
      item.compliance ??
      item.auditReadiness ??
      0
  );
}

function statusOf(item) {
  return String(item.status || item.assessment || "PASS").toUpperCase();
}

function decisionOf(health, risk, findings) {
  if (risk >= 55 || findings >= 6) return "Escalate";
  if (health >= 92 && risk <= 35) return "Approve";
  return "Review";
}

function MiniBoardTrend({ reports }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const avg = clamp(reports.reduce((s, r) => s + getScore(r), 0) / Math.max(reports.length, 1));

  return (
    <div className="mini-trend-grid">
      {months.map((m, i) => (
        <div className="mini-trend-item" key={m}>
          <strong>{m}</strong>
          <span>Gov {clamp(avg - 8 + i)}%</span>
          <span>Risk {clamp(48 - i * 2)}%</span>
        </div>
      ))}
    </div>
  );
}

export default function ExecutiveReporting() {
  const [reports, setReports] = useState(asArray(executiveReportingData));
  const [packs, setPacks] = useState(asArray(executiveBoardPacksData));
  const [scenario, setScenario] = useState("Baseline Board Pack");
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");

  const analytics = useMemo(() => {
    const all = [...reports, ...packs];
    const total = all.length || 1;

    const avgScore = clamp(all.reduce((s, r) => s + getScore(r), 0) / total);
    const passRate = clamp((all.filter((r) => statusOf(r).includes("PASS")).length / total) * 100);

    const riskItems = all.filter((r) =>
      JSON.stringify(r).toLowerCase().includes("risk")
    );

    const auditItems = all.filter((r) =>
      JSON.stringify(r).toLowerCase().includes("audit")
    );

    const complianceItems = all.filter((r) =>
      JSON.stringify(r).toLowerCase().includes("compliance")
    );

    const governanceItems = all.filter((r) =>
      JSON.stringify(r).toLowerCase().includes("governance")
    );

    const risk = clamp(
      riskItems.length
        ? riskItems.reduce((s, r) => s + (100 - getScore(r)), 0) / riskItems.length
        : 100 - avgScore
    );

    const audit = clamp(
      auditItems.length
        ? auditItems.reduce((s, r) => s + getScore(r), 0) / auditItems.length
        : avgScore
    );

    const compliance = clamp(
      complianceItems.length
        ? complianceItems.reduce((s, r) => s + getScore(r), 0) / complianceItems.length
        : avgScore
    );

    const governance = clamp(
      governanceItems.length
        ? governanceItems.reduce((s, r) => s + getScore(r), 0) / governanceItems.length
        : avgScore
    );

    const findings = all.filter((r) =>
      ["FAIL", "WARNING", "PENDING", "OPEN"].some((x) => statusOf(r).includes(x))
    ).length;

    const enterpriseHealth = clamp((governance + compliance + audit + (100 - risk)) / 4);
    const businessValue = Number((3.2 + avgScore / 100 + passRate / 100).toFixed(1));
    const roi = clamp(220 + enterpriseHealth + passRate - risk);
    const confidence = clamp((avgScore + passRate + audit) / 3);

    return {
      total,
      avgScore,
      passRate,
      governance,
      compliance,
      audit,
      risk,
      findings,
      enterpriseHealth,
      businessValue,
      roi,
      confidence,
      decision: decisionOf(enterpriseHealth, risk, findings),
    };
  }, [reports, packs]);

  function addEvent(title, detail, type = "success") {
    setEvents((prev) =>
      [
        {
          id: `${Date.now()}-${Math.random()}`,
          time: new Date().toLocaleTimeString(),
          title,
          detail,
          type,
        },
        ...prev,
      ].slice(0, 6)
    );
  }

  function improveData(boost = 2) {
    setReports((prev) =>
      prev.map((r) => ({
        ...r,
        score: clamp(getScore(r) + boost),
        status: statusOf(r).includes("FAIL") ? "WARNING" : "PASS",
        updated: true,
      }))
    );
    setPacks((prev) =>
      prev.map((r) => ({
        ...r,
        score: clamp(getScore(r) + boost),
        updated: true,
      }))
    );
  }

  function generateBoardPack() {
    improveData(2);
    setScenario("Board Pack Generated");
    setMessage("Board pack generated from live executive reporting and board pack datasets.");
    addEvent("Board Pack Generated", "Governance, audit, risk and business value indicators recalculated.");
  }

  function simulateQuarterEnd() {
    improveData(4);
    setScenario("Quarter-End Simulation");
    setMessage("Quarter-end scenario applied. Enterprise health and ROI improved.");
    addEvent("Quarter-End Simulation", "Quarter-end board reporting scenario applied.", "info");
  }

  function simulateAuditFindings() {
    setReports((prev) =>
      prev.map((r, i) =>
        i % 5 === 0
          ? { ...r, score: clamp(getScore(r) - 12), status: "WARNING", updated: true }
          : r
      )
    );
    setScenario("Audit Finding Scenario");
    setMessage("Audit finding scenario simulated. Risk and findings increased.");
    addEvent("Audit Findings Simulated", "Audit exceptions added into executive reporting evidence.", "warning");
  }

  function recalculateBusinessValue() {
    improveData(5);
    setScenario("Business Value Recalculated");
    setMessage("Business value, ROI and executive confidence recalculated from dataset.");
    addEvent("Business Value Recalculated", "Financial impact recalculated.", "success");
  }

  function resetReporting() {
    setReports(asArray(executiveReportingData));
    setPacks(asArray(executiveBoardPacksData));
    setScenario("Baseline Board Pack");
    setEvents([]);
    setMessage("");
  }

  const boardQueue = [
    ["Enterprise Governance Decision", "Executive Committee", analytics.decision],
    ["Audit Readiness Review", "Audit Committee", `${analytics.findings} finding(s)`],
    ["Risk Exposure Monitoring", "Risk Office", `${analytics.risk}% risk`],
    ["Business Value Validation", "Finance Office", `$${analytics.businessValue}M value`],
  ];

  const financialImpact = [
    ["Manual Effort Saved", `${2200 + analytics.avgScore * 2} hrs`],
    ["Estimated Cost Reduction", `$${analytics.businessValue}M`],
    ["Audit Cost Avoidance", `$${500 + analytics.audit}K`],
    ["Productivity Gain", `+${clamp(analytics.passRate / 2)}%`],
    ["Projected ROI", `${analytics.roi}%`],
    ["Executive Confidence", `${analytics.confidence}%`],
  ];

  return (
    <div className="admin-page">
      <p className="eyebrow">EXECUTIVE BOARD REPORTING CENTRE</p>
      <h1>Executive Reporting & Board Intelligence</h1>

      <p className="admin-sub">
        Data-driven executive board reporting using reporting records and board pack evidence.
      </p>

      <div className="iam-command-hero">
        <div>
          <p className="hero-eyebrow">BOARD NARRATIVE</p>
          <h2>Enterprise Health & Production Readiness</h2>
          <p>
            INVISOR analysed <b>{analytics.total}</b> reporting evidence records.
            Enterprise health is <b>{analytics.enterpriseHealth}%</b>, risk exposure is{" "}
            <b>{analytics.risk}%</b>, projected value is <b>${analytics.businessValue}M</b>,
            and the recommended board decision is <b>{analytics.decision}</b>.
          </p>
        </div>

        <div className="iam-decision-orb monitor">
          <span>{analytics.decision}</span>
          <small>{analytics.confidence}% Confidence</small>
        </div>
      </div>

      <div className="admin-kpi-grid">
        <KPI label="Evidence Records" value={analytics.total} note="Reporting + board pack data" primary />
        <KPI label="Enterprise Health" value={`${analytics.enterpriseHealth}%`} note="Board readiness score" />
        <KPI label="Pass Rate" value={`${analytics.passRate}%`} note="Validated reporting evidence" />
        <KPI label="Governance" value={`${analytics.governance}%`} note="Governance maturity" />
        <KPI label="Compliance" value={`${analytics.compliance}%`} note="Policy adherence" />
        <KPI label="Audit Readiness" value={`${analytics.audit}%`} note={`${analytics.findings} finding(s)`} />
        <KPI label="Risk Exposure" value={`${analytics.risk}%`} note="Enterprise risk posture" />
        <KPI label="Projected ROI" value={`${analytics.roi}%`} note="Transformation return" />
      </div>

      {message && <div className="admin-success">{message}</div>}

      <div className="enterprise-action-grid">
        <div className="enterprise-action-card" onClick={generateBoardPack}>
          <div className="enterprise-action-icon">📊</div>
          <h3>Generate Board Pack</h3>
          <p>Recalculate board metrics from executive reporting data.</p>
          <span>Execute →</span>
        </div>

        <div className="enterprise-action-card" onClick={simulateQuarterEnd}>
          <div className="enterprise-action-icon">📈</div>
          <h3>Simulate Quarter End</h3>
          <p>Improve quarter-end health, ROI and confidence.</p>
          <span>Execute →</span>
        </div>

        <div className="enterprise-action-card warning" onClick={simulateAuditFindings}>
          <div className="enterprise-action-icon">⚠️</div>
          <h3>Simulate Audit Findings</h3>
          <p>Add warning records to test board escalation logic.</p>
          <span>Execute →</span>
        </div>

        <div className="enterprise-action-card" onClick={recalculateBusinessValue}>
          <div className="enterprise-action-icon">💰</div>
          <h3>Recalculate Business Value</h3>
          <p>Update savings, ROI and executive confidence.</p>
          <span>Execute →</span>
        </div>

        <div className="enterprise-action-card" onClick={resetReporting}>
          <div className="enterprise-action-icon">♻</div>
          <h3>Reset Reporting</h3>
          <p>Restore original reporting datasets.</p>
          <span>Execute →</span>
        </div>
      </div>

      <div className="admin-card governance-event-centre">
        <div className="card-header">
          <h3>Live Board Reporting Event Centre</h3>
          <span>{scenario}</span>
        </div>

        {events.length === 0 ? (
          <p>No board reporting events executed yet.</p>
        ) : (
          events.map((event) => (
            <div className={`event-item ${event.type}`} key={event.id}>
              <strong>{event.time}</strong>
              <div>
                <h4>{event.title}</h4>
                <p>{event.detail}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="admin-card executive">
        <h3>Executive Board Pack</h3>
        <div className="benefit-grid">
          <div className="benefit-box"><h2>{analytics.decision}</h2><p>Recommended Decision</p></div>
          <div className="benefit-box"><h2>{analytics.enterpriseHealth}%</h2><p>Enterprise Health</p></div>
          <div className="benefit-box"><h2>${analytics.businessValue}M</h2><p>Business Value</p></div>
          <div className="benefit-box"><h2>{analytics.findings}</h2><p>Open Findings</p></div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Financial & Business Value Impact</h3>
        <table>
          <thead>
            <tr>
              <th>Benefit Area</th>
              <th>Measured Value</th>
            </tr>
          </thead>
          <tbody>
            {financialImpact.map(([label, value]) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Executive Governance Trend</h3>
        <MiniBoardTrend reports={reports} />
      </div>

      <div className="admin-card">
        <h3>Board Decision Queue</h3>
        <table>
          <thead>
            <tr>
              <th>Decision Item</th>
              <th>Owner</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {boardQueue.map(([item, owner, status]) => (
              <tr key={item}>
                <td>{item}</td>
                <td>{owner}</td>
                <td>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Executive Reporting Evidence Repository</h3>
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Area</th>
              <th>Metric</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[...reports, ...packs].map((item, index) => (
              <tr key={`${item.id || item.area || item.metric}-${index}`} className={item.updated ? "updated-row" : ""}>
                <td>{reports.includes(item) ? "Reporting" : "Board Pack"}</td>
                <td>{item.area || item.category || item.section || "Executive"}</td>
                <td>{item.metric || item.title || item.name || "Board Evidence"}</td>
                <td>{getScore(item)}%</td>
                <td>{statusOf(item)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card executive">
        <h3>AI Executive Recommendation</h3>
        <p>
          INVISOR recommends <b>{analytics.decision}</b> because enterprise health is{" "}
          <b>{analytics.enterpriseHealth}%</b>, audit readiness is <b>{analytics.audit}%</b>,
          risk exposure is <b>{analytics.risk}%</b>, and projected ROI is{" "}
          <b>{analytics.roi}%</b>.
        </p>
      </div>
    </div>
  );
}
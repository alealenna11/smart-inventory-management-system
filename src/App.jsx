import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Sidebar from "./components/Sidebar";
import SessionWatcher from "./components/SessionWatcher";

/* CORE PAGES */
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Allocation from "./pages/Allocation";
import Audit from "./pages/Audit";
import Admin from "./pages/Admin";

/* GOVERNANCE PAGES */
import BudgetGovernance from "./pages/BudgetGovernance";
import OperationalMonitoring from "./pages/OperationalMonitoring";
import ControlExceptions from "./pages/ControlExceptions";
import ExecutiveReporting from "./pages/ExecutiveReporting";
import PerformanceEvaluation from "./pages/PerformanceEvaluation";
import DepartmentComparison from "./pages/DepartmentComparison";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import UserManagement from "./pages/UserManagement";
import GovernanceRules from "./pages/GovernanceRules";


/* RDT */
import TreasuryLiquidityGovernance from "./pages/TreasuryLiquidityGovernance";
import RemittanceControlCentre from "./pages/RemittanceControlCentre";
import FundingRiskOversight from "./pages/FundingRiskOversight";

/* TRS */
import TradeComplianceMonitoring from "./pages/TradeComplianceMonitoring";
import LetterCreditGovernance from "./pages/LetterOfCreditGovernance";
import TradeRiskIntelligence from "./pages/TradeRiskIntelligence";

/* FCD */
import FinancialControlsHub from "./pages/FinancialControlsHub";
import RegulatoryReportingCentre from "./pages/RegulatoryReportingCentre";
import BudgetPerformanceAnalytics from "./pages/BudgetPerformanceAnalytics";

/* OPC */
import OperationsCommandCentre from "./pages/OperationsCommandCentre";
import SLAGovernanceMonitoring from "./pages/SLAGovernanceMonitoring";
import WorkflowGovernanceHub from "./pages/WorkflowGovernance";

/* LOA */
import LoanPortfolioGovernance from "./pages/LoanPortfolioGovernance";
import CreditRiskMonitoring from "./pages/CreditRiskMonitoring";
import LoanComplianceCentre from "./pages/LoanComplianceCentre";

/* CBS */
import CoreBankingStabilityHub from "./pages/CoreBankingStabilityHub";
import ServiceHealthMonitoring from "./pages/ServiceHealthMonitoring";
import BatchProcessingGovernance from "./pages/BatchProcessingGovernance";

/* CPC */
import CustomerProtectionControls from "./pages/CustomerProtectionControls";
import ConductRiskMonitoring from "./pages/ConductRiskMonitoring";
import CustomerExperienceGovernance from "./pages/CustomerExperienceGovernance";

/* GTBD */
import ClientServiceGovernance from "./pages/ClientServiceGovernance";
import ClientExperienceIntelligence from "./pages/ClientExperienceIntelligence";
import RelationshipRiskMonitoring from "./pages/RelationshipRiskMonitoring";

/* AUTH PAGES */
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./styles/global.css";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
  <h2>INVISOR</h2>
  <p>Loading Enterprise Governance Intelligence Platform...</p>
</div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

 const getDefaultRoute = () => {
  if (user?.role === "executive")
    return "/executive-dashboard";

  if (user?.role === "admin")
    return "/admin";

  return "/dashboard";
};

  return (
    <div className="app-layout">
      <SessionWatcher />
      <Sidebar />

      <div className="content main-content">
        <Routes>
          <Route path="/" element={<Navigate to={getDefaultRoute()} />} />

          {/* EXECUTIVE ONLY */}
          {user.role === "executive" && (
            <>
              <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
              <Route path="/department-comparison" element={<DepartmentComparison />} />
              <Route path="/executive-reporting" element={<ExecutiveReporting />} />
              <Route path="/performance-evaluation" element={<PerformanceEvaluation />} />
              <Route path="/budget-governance" element={<BudgetGovernance />} />
              <Route path="/audit" element={<Audit />} />
            </>
          )}

          {/* ADMIN ONLY */}
          {user.role === "admin" && (
            <>
              <Route path="/admin" element={<Admin />} />

              <Route
                path="/user-management"
                element={<UserManagement />}
              />

              <Route
                path="/governance-rules"
                element={<GovernanceRules />}
              />

              <Route
                path="/budget-governance"
                element={<BudgetGovernance />}
              />

              <Route
                path="/inventory"
                element={<Inventory />}
              />

              <Route
                path="/allocation"
                element={<Allocation />}
              />

              <Route
                path="/audit"
                element={<Audit />}
              />

              <Route
                path="/operational-monitoring"
                element={<OperationalMonitoring />}
              />

              <Route
                path="/control-exceptions"
                element={<ControlExceptions />}
              />

              <Route
                path="/performance-evaluation"
                element={<PerformanceEvaluation />}
              />


              {/* RDT */}

              <Route
                path="/treasury-liquidity"
                element={<TreasuryLiquidityGovernance />}
              />

              <Route
                path="/remittance-control"
                element={<RemittanceControlCentre />}
              />

              <Route
                path="/funding-risk"
                element={<FundingRiskOversight />}
              />

              {/* TRS */}
<Route path="/trade-compliance" element={<TradeComplianceMonitoring />} />
<Route path="/letter-credit-governance" element={<LetterCreditGovernance />} />
<Route path="/trade-risk-intelligence" element={<TradeRiskIntelligence />} />

{/* FCD */}
<Route path="/financial-controls" element={<FinancialControlsHub />} />
<Route path="/regulatory-reporting" element={<RegulatoryReportingCentre />} />
<Route path="/budget-performance" element={<BudgetPerformanceAnalytics />} />

{/* OPC */}
<Route path="/operations-command" element={<OperationsCommandCentre />} />
<Route path="/sla-governance" element={<SLAGovernanceMonitoring />} />
<Route path="/workflow-governance" element={<WorkflowGovernanceHub />} />

{/* LOA */}
<Route path="/loan-portfolio" element={<LoanPortfolioGovernance />} />
<Route path="/credit-risk" element={<CreditRiskMonitoring />} />
<Route path="/loan-compliance" element={<LoanComplianceCentre />} />

{/* CBS */}
<Route path="/core-banking-stability" element={<CoreBankingStabilityHub />} />
<Route path="/service-health" element={<ServiceHealthMonitoring />} />
<Route path="/batch-processing" element={<BatchProcessingGovernance />} />

{/* CPC */}
<Route path="/customer-protection" element={<CustomerProtectionControls />} />
<Route path="/conduct-risk" element={<ConductRiskMonitoring />} />
<Route path="/customer-experience" element={<CustomerExperienceGovernance />} />

{/* GTBD */}
<Route path="/client-service" element={<ClientServiceGovernance />} />
<Route path="/client-experience" element={<ClientExperienceIntelligence />} />
<Route path="/relationship-risk" element={<RelationshipRiskMonitoring />} />

            </>
          )}

          {/* DEPARTMENT USERS */}
          {user.role === "department_user" && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/budget-governance" element={<BudgetGovernance />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/allocation" element={<Allocation />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/operational-monitoring" element={<OperationalMonitoring />} />
              <Route path="/control-exceptions" element={<ControlExceptions />} />

{/* ========================= */}
{/* RDT */}
{/* ========================= */}


              <Route path="/treasury-liquidity" element={<TreasuryLiquidityGovernance />} />
              <Route path="/remittance-control" element={<RemittanceControlCentre />} />
              <Route path="/funding-risk" element={<FundingRiskOversight />}/>


{/* ========================= */}
{/* TRS */}
{/* ========================= */}

<Route path="/trade-compliance" element={<TradeComplianceMonitoring />} />
<Route path="/letter-credit-governance" element={<LetterCreditGovernance />} />
<Route path="/trade-risk-intelligence" element={<TradeRiskIntelligence />} />

{/* ========================= */}
{/* FCD */}
{/* ========================= */}

<Route path="/financial-controls" element={<FinancialControlsHub />} />
<Route path="/regulatory-reporting" element={<RegulatoryReportingCentre />} />
<Route path="/budget-performance" element={<BudgetPerformanceAnalytics />} />

{/* ========================= */}
{/* OPC */}
{/* ========================= */}

<Route path="/operations-command" element={<OperationsCommandCentre />} />
<Route path="/sla-governance" element={<SLAGovernanceMonitoring />} />
<Route path="/workflow-governance" element={<WorkflowGovernanceHub />} />

{/* ========================= */}
{/* LOA */}
{/* ========================= */}

<Route path="/loan-portfolio" element={<LoanPortfolioGovernance />} />
<Route path="/credit-risk" element={<CreditRiskMonitoring />} />
<Route path="/loan-compliance" element={<LoanComplianceCentre />} />

{/* ========================= */}
{/* CBS */}
{/* ========================= */}

<Route path="/core-banking-stability" element={<CoreBankingStabilityHub />} />
<Route path="/service-health" element={<ServiceHealthMonitoring />} />
<Route path="/batch-processing" element={<BatchProcessingGovernance />} />

{/* ========================= */}
{/* CPC */}
{/* ========================= */}

<Route path="/customer-protection" element={<CustomerProtectionControls />} />
<Route path="/conduct-risk" element={<ConductRiskMonitoring />} />
<Route path="/customer-experience" element={<CustomerExperienceGovernance />} />

{/* ========================= */}
{/* GTBD */}
{/* ========================= */}

<Route path="/client-service" element={<ClientServiceGovernance />} />
<Route path="/client-experience" element={<ClientExperienceIntelligence />} />
<Route path="/relationship-risk" element={<RelationshipRiskMonitoring />} />


              </>

              
          
          )}

         <Route
  path="*"
  element={
    <Navigate
      to={getDefaultRoute()}
      replace
    />
  }
/>
        </Routes>
      </div>
    </div>
  );
}
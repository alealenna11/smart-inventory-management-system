import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
departmentConfig,
normalizeDepartment
} from "../config/departmentConfig";

import {
FiHome,
FiBox,
FiShuffle,
FiFileText,
FiSettings,
FiLogOut,
FiActivity,
FiAlertTriangle,
FiBarChart2,
FiDollarSign,
FiUsers,
FiSliders
} from "react-icons/fi";

export default function Sidebar() {

const navigate = useNavigate();
const location = useLocation();

const {
user,
logout
} = useAuth();

const department =
normalizeDepartment(
user?.department
);

const specialModules =
departmentConfig[department]
?.additionalModules || [];

/* ========================= */
/* EXECUTIVE MENU */
/* ========================= */

const executiveMenu = [
{
label: "Executive Dashboard",
path: "/executive-dashboard",
icon: <FiHome />
},
{
label: "Budget Governance",
path: "/budget-governance",
icon: <FiDollarSign />
},
{
label: "Department Comparison",
path: "/department-comparison",
icon: <FiBarChart2 />
},
{
label: "Audit Intelligence",
path: "/audit",
icon: <FiFileText />
},
{
label: "Performance Evaluation",
path: "/performance-evaluation",
icon: <FiActivity />
},
{
label: "Executive Reporting",
path: "/executive-reporting",
icon: <FiBarChart2 />
}
];

/* ========================= */
/* ADMIN MENU */
/* ========================= */

const adminMenu = [
{
label: "Admin Command Center",
path: "/admin",
icon: <FiSettings />
},
{
label: "User Management",
path: "/user-management",
icon: <FiUsers />
},
{
label: "Governance Rules",
path: "/governance-rules",
icon: <FiSliders />
},
{
label: "Budget Governance",
path: "/budget-governance",
icon: <FiDollarSign />
},
{
label: "Audit Logs",
path: "/audit",
icon: <FiFileText />
},
{
label: "Performance Evaluation",
path: "/performance-evaluation",
icon: <FiActivity />
}
];

/* ========================= */
/* DEPARTMENT MENU */
/* ========================= */

const departmentMenu = [


{
  label: "Enterprise Decision Intelligence Hub",
  path: "/dashboard",
  icon: <FiHome />
},

{
  label: "Financial Governance & Budget Oversight",
  path: "/budget-governance",
  icon: <FiDollarSign />
},

{
  label: "Enterprise Asset Governance Repository",
  path: "/inventory",
  icon: <FiBox />
},

{
  label: "Operational Resource Governance",
  path: "/allocation",
  icon: <FiShuffle />
},

{
  label: "Audit & Regulatory Assurance",
  path: "/audit",
  icon: <FiFileText />
},

{
  label: "Operational Resilience Monitoring",
  path: "/operational-monitoring",
  icon: <FiActivity />
},

{
  label: "Control Breach & Exception Register",
  path: "/control-exceptions",
  icon: <FiAlertTriangle />
},

...specialModules.map(
  module => ({
    label: module.name,
    path: module.route,
    icon: module.icon
  })
)


];

const getMenu = () => {


if (user?.role === "executive") {
  return executiveMenu;
}

if (user?.role === "admin") {
  return adminMenu;
}

return departmentMenu;


};

const getSectionTitle = () => {


if (user?.role === "executive") {
  return "Executive Governance";
}

if (user?.role === "admin") {
  return "System Administration";
}

return departmentConfig[department]?.title ||
  "Department Workspace";


};

return (


<div className="sidebar-container">

  <div>

    <div className="sidebar-header">

      <h2>INVISOR</h2>

      <p className="role">
        {user?.name || "User"}
      </p>

      <p className="role">
        {department}
      </p>

    </div>

    <div className="sidebar-section">
      {getSectionTitle()}
    </div>

    {getMenu().map((item) => (

      <div
        key={item.path}
        className={`sidebar-item ${
          location.pathname === item.path
            ? "active"
            : ""
        }`}
        onClick={() =>
          navigate(item.path)
        }
      >

        <span className="sidebar-icon">
          {item.icon}
        </span>

        <span>
          {item.label}
        </span>

      </div>

    ))}

  </div>

  <button
    className="sidebar-logout"
    onClick={logout}
  >
    <FiLogOut />
    Logout
  </button>

</div>


);
}
